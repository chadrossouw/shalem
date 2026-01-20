<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PdfService;
use App\Models\CVSupport;
use App\Models\User;
use \Illuminate\Support\Facades\Storage;

class CVSupportController extends Controller
{
    public function list(Request $request)
    {
        $user = $request->user();
        $user = $request->user();
        if($request->has('query')){
            return $this->search($request);
        }
        $cvSupports = CVSupport::where('user_id', $user->id)->orderBy('created_at','desc')->paginate(6);
        return response()->json([
            'cv_supports' => $cvSupports,
        ]);
    }
    
    public function search(Request $request){
        $user = $request->user();
        $query = $request->input('query','');
        $documents = CVSupport::search($query)
            ->where('user_id', $user->id)
            ->paginate(6);
        return response()->json(['documents' => $documents], 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_ids' => 'nullable|string',
        ]);
        $user = $request->user();
        $cvSupport = CVSupport::create([
            'name' => strip_tags($request->input('name')),
            'description' => strip_tags($request->input('description','')),
            'user_id' => $user->id,
        ]);
        if ($request->has('document_ids')) {
            $doc_ids = explode(',', $request->input('document_ids'));
            $cvSupport->documents()->sync($doc_ids);
        }
        $cvSupport->load('documents')->orderBy('created_at','desc');
        $this->generateCVPdf($cvSupport,$user);
        $currentYear = date('Y');
        $cvSupport->file_path = 'pdfs/'.$currentYear.'/'.$cvSupport->id.'.pdf';
        $cvSupport->save();
        return response()->json($cvSupport, 201);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'cv_id' => 'required|integer|exists:cv_supports,id',
        ]);
        $id = $request->input('cv_id');
        $user = $request->user();
        $cvSupport = CVSupport::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        Storage::delete($cvSupport->file_path);
        $cvSupport->delete();
        return response()->json(null, 204);
    }

    public function get(Request $request)
    {
        $id = $request->input('id');
        $user = $request->user();
        $cvSupport = CVSupport::where('id', $id)->get();
        $cvSupport->load('filePath');

        return response()->json($cvSupport, 200);
    }
    //
    private function generateCVPdf(CVSupport $cvSupport,User $user)
    {
        $docs = $cvSupport->documents;
        $docsAggregated = [];
        foreach($docs as $doc){
            $year = $doc->created_at->format('Y');
            if(!isset($docsAggregated[$year])){
                $docsAggregated[$year] = [];
            }
            $docsAggregated[$year][] = $doc;
        }
        $html = view('cv_support.pdf', ['cvSupport' => $cvSupport, 'docsAggregated' => $docsAggregated])->render();
        $pdfService = new PdfService($html, $user->id, $cvSupport->id);
        $pdfService->create_pdf();

        return response()->json([
            'message' => 'PDF generated successfully',
        ]);
    }


}
