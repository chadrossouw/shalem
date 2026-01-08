<?php 
namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage; 

class PdfService{
    private string $uid;
    private string $html;
    private int $document_id;
    private Dompdf $dompdf;

    public function __construct($html,$uid,$document_id){
        $this->uid = $uid;
        $this->html = $html;
        $this->document_id = $document_id;
        $options = new Options();
        $options->set('isRemoteEnabled', 'true');
        $this->dompdf = new Dompdf($options);
    }

    public function create_pdf(){
        $this->dompdf->loadHtml($this->html);
        $this->dompdf->setPaper('A4','portrait');
        $this->dompdf->render();
        $output = $this->dompdf->output();
        Storage::put('pdfs/'.$this->uid.'/'.$this->document_id.'.pdf', $output);    
    }
}