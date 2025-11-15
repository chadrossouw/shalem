<?php

namespace App\Listeners;

use App\Events\DocumentUploaded;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Notification;
use App\Models\User;

class ProcessDocumentNotifications
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
    public function handle(DocumentUploaded $event): void
    {
        // Access the uploaded document using $event->document
        $document = $event->document;

        // Process notifications related to the uploaded document
        // For example, notify relevant users about the new document
        $user = $document->user;
        $mentor = $user->mentor;

        if ($mentor) {
            $notification = new Notification();
            $notification->user_id = $mentor->user_id;
            $notification->type = 'document_uploaded';
            $notification->sender_id = $user->id;
            $notification->subject = 'New Document Uploaded';
            $notification->message = "A new document '{$document->title}' has been uploaded by {$user->first_name} {$user->last_name}.";
            $notification->action = [
                ["title"=>"Approve Document",
                    "action"=>[
                        "view"=> null,
                        "panel"=> $document->id,
                        "dashboard"=> "documents",
                    ]
                ]
            ];
            $notification->save();
        }
    }
}
