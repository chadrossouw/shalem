<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\DocumentStatus;
use App\Events\DocumentNotify;
use App\Events\DocumentProcessed;
use App\Models\User;
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
            $is_review_edit = $request->input('review_edit', false);
            if($is_review_edit){
                $user->tokenCan('staff') || abort(403, 'Unauthorized action.');
                $request->validate([
                    'approval_message' => 'nullable|string',
                    'type' => 'required|string',
                ]);
                $document = Document::where('id', intval($request->input('document_id')))->first();
            }
            else{
                $document = Document::where('id', intval($request->input('document_id')))->where('user_id', $user->id)->first();
            }
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
            if($is_review_edit){
                $document_type = strip_tags($request->input('type'));
                $document->type = $document_type;
                $document->save();
                $status_message = $request->input('approval_message', 'Your document has been approved.');
                DocumentStatus::create([
                    'document_id' => $document->id,
                    'status' => 'approved',
                    'status_message' => strip_tags($status_message),
                    'user_id' => $user->id,
                ]);
                DocumentProcessed::dispatch($document);
                return response()->json(['view' => 'success'], 200);
            }
            else{
                DocumentStatus::create([
                    'document_id' => $document->id,
                    'status' => 'pending',
                    'status_message' => 'Your document has been updated and is waiting for approval.',
                    'user_id' => '',
                ]);
                DocumentNotify::dispatch($document);
                return response()->json(['view' => 'success'], 200);
            }
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
        DocumentNotify::dispatch($document);
        return response()->json(['view' => 'success'], 200);
    }

    public function list(Request $request){
        $user = $request->user();
        if($request->has('student_id')){
            $user->tokenCan('staff') || abort(403, 'Unauthorized action.');
            $user = User::where('id', $request->input('student_id'))->where('type', 'student')->first();
        }
        if($request->has('query')){
            return $this->search($request);
        }
        $documents = Document::where('user_id',$user->id)->orderBy('created_at','desc')->paginate(4);
        $documents->load('document_status');
        $documents->map(function($document) {
            $document->document_status->load('user');
            return $document;
        });
        return response()->json(['documents' => $documents], 200);
    }

    public function staffList(Request $request){
        $user = $request->user();
        $mentees = User::whereHas('mentor', function($query) use ($user){
            $query->where('user_id', $user->id);
        })->get();
        $documents = [];
        foreach($mentees as $mentee){
            $doc =  Document::where('user_id',$mentee->id)->whereHas('document_status', function($query){
                $query->where('status', 'pending');
            })->orderBy('created_at','asc')->get();
            $doc->load('document_status');
            if($doc->count()>0){
                $documents[$mentee->id] = $doc;
            }
        }
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
        if($user->type=='staff'){
            $document =  Document::where('id', $id)->first();
        }
        else{
            $document = Document::where('id', $id)->where('user_id', $user->id)->first();
        }
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
        $document->type = strip_tags($request->input('type'));
        $document->save();
        $status_message = strip_tags($request->input('status_message'));
        if(!$status_message){
            $status_message = 'Your document has been approved.';
        }
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'approved',
            'status_message' => $status_message,
            'user_id' => $user->id,
        ]);
        DocumentProcessed::dispatch($document);
        return response()->json(['message' => 'Document approved successfully','action'=>['dashboard'=>'documents','panel'=>'document','view'=>'success']], 200);
    }

    public function requestCorrections(Request $request){
        $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'changes_message' => 'required|string',
        ]);
        $user = $request->user();
        $document = Document::where('id', intval($request->input('document_id')))->first();
        if(!$document){
            return response()->json(['error' => 'Document not found'], 404);
        }
        $status_message = strip_tags($request->input('changes_message'));
        if(!$status_message){
            $status_message = 'Please make the requested changes to your document.';
        }
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'changes_requested',
            'status_message' => $status_message,
            'user_id' => $user->id,
        ]);
        DocumentNotify::dispatch($document);
        return response()->json(['message' => 'Corrections requested successfully','action'=>['dashboard'=>'documents','panel'=>'documents','view'=>'changes_requested_success']], 200);
    }

    public function reject(Request $request){
        $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'status_message' => 'nullable|string',
        ]);
        $user = $request->user();
        $document = Document::where('id', intval($request->input('document_id')))->first();
        if(!$document){
            return response()->json(['error' => 'Document not found'], 404);
        }
        $status_message = strip_tags($request->input('status_message'));
        if(!$status_message){
            $status_message = 'Your document has been rejected.';
        }
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'rejected',
            'status_message' => $status_message,
            'user_id' => $user->id,
        ]);
        DocumentProcessed::dispatch($document);
        return response()->json(['message' => 'Document rejected successfully','action'=>['dashboard'=>'documents','panel'=>'documents','view'=>'success']], 200);
    }

    public function forward(Request $request){
        $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'recipient' => 'required|uuid|exists:users,id',
            'reason' => 'required|string',
        ]);
        $user = $request->user();
        $document = Document::where('id', intval($request->input('document_id')))->first();
        if(!$document){
            return response()->json(['error' => 'Document not found'], 404);
        }
        DocumentStatus::create([
            'document_id' => $document->id,
            'status' => 'forwarded',
            'status_message' => strip_tags($request->input('reason')),
            'user_id' => $user->id,
        ]);
        $forwardTo = User::where('id', $request->input('recipient'))->first();
        if(!$forwardTo){
            return response()->json(['error' => 'User to forward to not found'], 404);
        }
        $forwardedDocument = new \App\Models\ForwardedDocument();
        $forwardedDocument->user_id = $forwardTo->id;
        $forwardedDocument->document_id = $document->id;
        $forwardedDocument->forwarded_by = $user->id;
        $forwardedDocument->save();
        DocumentNotify::dispatch($document);
        return response()->json(['message' => 'Document forwarded successfully','action'=>['dashboard'=>'documents','panel'=>'document','view'=>'success-forwarded']], 200);
    }
}
