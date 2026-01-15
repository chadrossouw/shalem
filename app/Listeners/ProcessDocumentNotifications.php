<?php

namespace App\Listeners;

use App\Events\DocumentNotify;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\NotificationService;


class ProcessDocumentNotifications
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected NotificationService $notificationService
    )
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DocumentNotify $event): void
    {
        // Access the uploaded document using $event->document
        $document = $event->document;

        // Process notifications related to the uploaded document
        // For example, notify relevant users about the new document
        $user = $document->user;
        $mentor = $user->mentor;
        $forwarded = $document->document_status->status === 'forwarded';
        if($forwarded){
            $forwardedDoc = $document->forwardedDocument;
            if($forwardedDoc){
                $this->notificationService->createNotification(
                    user: $forwardedDoc->user,
                    message: "A document '{$document->title}' has been forwarded to you by {$forwardedDoc->forwardedBy->first_name} {$forwardedDoc->forwardedBy->last_name}.",
                    subject: 'Document Needs Review',
                    type: 'notification',
                    messageActions: [
                        [
                            'title' => 'Review Document',
                            'action' => 'review',
                            'dashboard' => 'documents',
                            'panel' => 'documents',
                            'view' => $document->id,
                            'status' => 'forwarded',
                        ]
                    ],
                    senderId: $forwardedDoc->forwardedBy->id
                );
            }
        }
        else{
            if ($mentor) {
                $this->notificationService->createNotification(
                    user: $mentor->user,
                    message: "A new document '{$document->title}' has been uploaded by {$user->first_name} {$user->last_name}.",
                    subject: 'New Document Uploaded',
                    type: 'notification',
                    messageActions: [
                        [
                            'title' => 'Approve Document',
                            'action' => 'approve',
                            'dashboard' => 'documents',
                            'panel' => 'documents',
                            'view' => $document->id,
                            'status' => 'pending',
                        ]
                    ],
                    senderId: $user->id
                );
            }
        }
    }
}
