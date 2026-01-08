<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PdfService;
use App\Models\CVSupport;
use App\Models\User;
use Illuminate\Container\Attributes\Storage;

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
            ->paginate(2);
        return response()->json(['documents' => $documents], 200);
    }

    public function create(Request $request)
    {
        
        $cvSupport = CVSupport::create($request->all());
        return response()->json($cvSupport, 201);
    }

    public function delete(Request $request, $id)
    {
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
        $cvSupport->makeVisible('public_file_path');

        return response()->json($cvSupport, 200);
    }
    //
    private function generateCVPdf(CVSupport $cvSupport,User $user)
    {
        $html = view('cv_support.pdf', ['cvSupport' => $cvSupport])->render();
        $pdfService = new PdfService($html, $user->uid, $cvSupport->id);
        $pdfService->create_pdf();

        return response()->json([
            'message' => 'PDF generated successfully',
        ]);
    }


}
