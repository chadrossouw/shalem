<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\DocumentStatus;
use App\Events\DocumentUploaded;
class DocumentController extends Controller
{
    public function upload(Request $request){
        $user = $request->user();
        $document =$request->validate([
            'document_file' => 'required_without:document_id|file|max:10240|mimes:pdf,jpg,png',
            'document_title' => 'required|string',
            'document_pillar' => 'required|string',
            'document_description' => 'required|string',
        ]);
        if($request->has('document_id')){
            $document = Document::where('id', intval($request->input('document_id')))->where('user_id', $user->id)->first();
            if(!$document){
                return response()->json(['error' => 'Document not found'], 404);
            }
            if($request->hasFile('document_file')){
                $file = $request->file('document_file');
                $path = $file->store('documents/'.$user->id);
                $document->file_path = $path;
            }
            $document->title = strip_tags($request->input('document_title'));
            $document->pillar_id = strip_tags($request->input('document_pillar'));
            $document->description = strip_tags($request->input('document_description'));
            $document->save();
            DocumentStatus::create([
                'document_id' => $document->id,
                'status' => 'pending',
                'status_message' => 'Your document has been updated and is waiting for approval.',
                'user_id' => '',
            ]);
            DocumentUploaded::dispatch($document);
            return response()->json(['view' => 'success'], 200);
        }
        $file = $request->file('document_file');
        $title = strip_tags($request->input('document_title'));
        $pillar = strip_tags($request->input('document_pillar'));
        $description = strip_tags($request->input('document_description'));
        $path = $file->store('documents/'.$user->id);
        $document = new Document();
        $document->user_id = $user->id;
        $document->title = $title;
        $document->pillar_id = $pillar;
        $document->description = $description;
        $document->file_path = $path;
        $document->type = '';
        $document->save();
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'pending',
            'status_message' => 'Your document has been uploaded and is waiting for approval.',
            'user_id' => '',
        ]);
        DocumentUploaded::dispatch($document);
        return response()->json(['view' => 'success'], 200);
    }

    public function list(Request $request){
        $user = $request->user();
        if($request->has('query')){
            return $this->search($request);
        }
        $documents = Document::where('user_id',$user->id)->orderBy('created_at','desc')->paginate(6);
        $documents->load('document_status');
        $documents->map(function($document) {
            $document->document_status->load('user');
            return $document;
        });
        return response()->json(['documents' => $documents], 200);
    }
    
    public function listApproved(Request $request){
        $user = $request->user();
        if($request->has('query')){
            return $this->search($request);
        }
        $documents = Document::where('user_id',$user->id)->whereHas('document_statuses', function($query){
            $query->where('status', 'approved');
        })->orderBy('created_at','desc')->paginate(6);
        return response()->json(['documents' => $documents], 200);
    }

    public function search(Request $request){
        $user = $request->user();
        $query = $request->input('query','');
        $documents = Document::search($query)
            ->where('user_id', $user->id)
            ->paginate(6);
        $documents->load('document_status');
        $documents->map(function($document) {
            $document->document_status->load('user');
            return $document;
        });
        return response()->json(['documents' => $documents], 200);
    }

    public function get(Request $request, $id){
        $user = $request->user();
        $document = Document::where('id', $id)->where('user_id', $user->id)->first();
        if(!$document){
            return response()->json(['error' => 'Document not found'], 404);
        }
        $document->document_status->load('user');
        return response()->json($document, 200);
    }

    public function approve(Request $request){
        $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'type' => 'required|string',
            'status_message' => 'nullable|string',
        ]);
        $user = $request->user();
        $document = Document::where('id', intval($request->input('document_id')))->first();
        if(!$document){
            return response()->json(['error' => 'Document not found'], 404);
        }
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'approved',
            'status_message' => strip_tags($request->input('status_message','Your document has been approved.')),
            'user_id' => $user->id,
        ]);
        return response()->json(['message' => 'Document approved successfully'], 200);
    }
}
