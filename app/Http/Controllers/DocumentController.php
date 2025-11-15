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
        $path = $file->store('documents');
        $document = new Document();
        $document->user_id = $user->id;
        $document->title = $title;
        $document->pillar = $pillar;
        $document->description = $description;
        $document->file_path = $path;
        $document->type = '';
        $document->status = 'pending';
        $document->save();
        DocumentUploaded::dispatch($document);
        return response()->json(['view' => 'success'], 200);
    }
}
