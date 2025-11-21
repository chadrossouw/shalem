<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Events\DocumentUploaded;
class DocumentController extends Controller
{
    public function upload(Request $request){
        $user = $request->user();
        $document =$request->validate([
            'document_file' => 'required|file|max:10240',
            'document_title' => 'required|string',
            'document_pillar' => 'required|string',
            'document_description' => 'required|string',
        ]);
        $file = $request->file('document_file');
        $title = $request->input('document_title');
        $pillar = $request->input('document_pillar');
        $description = $request->input('document_description');
        $path = $file->store('documents/'.$user->id);
        $document = new Document();
        $document->user_id = $user->id;
        $document->title = $title;
        $document->pillar_id = $pillar;
        $document->description = $description;
        $document->file_path = $path;
        $document->type = '';
        $document->save();
        $document->document_status->create([
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
        $documents = Document::where('user_id',$user->id)->orderBy('created_at','desc')->paginate(2);
        $documents->load('document_status');
        $documents->map(function($document) {
            $document->document_status->load('user');
            return $document;
        });
        return response()->json(['documents' => $documents], 200);
    }

    public function search(Request $request){
        $user = $request->user();
        $query = $request->input('query','');
        $documents = Document::search($query)
            ->where('user_id', $user->id)
            ->paginate(2);
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
}
