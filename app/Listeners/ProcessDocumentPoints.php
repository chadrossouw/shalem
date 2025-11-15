<?php

namespace App\Listeners;

use App\Events\DocumentProcessed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessDocumentPoints
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DocumentProcessed $event): void
    {
        //
        $document = $event->document;
    }
}
