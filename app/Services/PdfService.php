<?php 
namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfService{
    private $uid;
    private Dompdf $dompdf;
    private $file_path;


    public function __construct($html,$uid,$name,$events){
        $uid = preg_replace("([:~,;\/\\\.])", '', $uid);
        $uid = str_replace(' ','_',$uid);
        $this->uid = $uid;
        $options = new Options();
        $options->set('isRemoteEnabled', 'true');
        $this->dompdf = new DOMPDF($options);
        $this->create_pdf();
    }
    public function create_pdf(){
        if(file_exists(get_template_directory().'hdk_events/templates/pdf_template.php')){
            $this->html = include get_template_directory().'hdk_events/templates/pdf_template.php';
        }else{
            $this->html = include HDK_EVENTS_DIR . 'templates/ticket_template.php';
        }
        $this->dompdf->loadHtml($this->html);
        $this->dompdf->setPaper('A4','portrait');
        $this->dompdf->render();
        $output = $this->dompdf->output();
        file_put_contents($this->get_file_path(), $output); 
    }
    public function get_file_path(){
        return $this->file_path.$this->ticket_uid.'.pdf';
    }
    public function get_url(){
        return content_url().'/uploads/tickets/pdfs/'.$this->ticket_uid.'.pdf';
    }
}