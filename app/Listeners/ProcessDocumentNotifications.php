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
        $status = $document->document_status;
        if($status->status == 'pending'||!$status){        $forwarded = $document->document_status->status === 'forwarded';
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
                $previousStatuses = $document->document_statuses;
                if($previousStatuses->filter(function($ds){
                    return $ds->status == 'changes_requested' ;
                })->count() > 0){     
                    //Document was previously approved, so this is a re-submission
                    $this->notificationService->createNotification(
                        user: $mentor->user,
                        message: "The document '{$document->title}' has been re-submitted by {$user->first_name} {$user->last_name}.",
                        subject: 'Document Re-Submitted',
                        type: 'notification',
                        messageActions: [
                            [
                                'title' => 'Review Document',
                                'action' => 'review',
                                'dashboard' => 'documents',
                                'panel' => 'documents',
                                'view' => $document->id,
                                'status' => 'pending',
                            ]
                        ],
                        senderId: $user->id
                    );
                    return;
                }
                    $this->notificationService->createNotification(
                        user: $mentor->user,
                        message: "A new document '{$document->title}' has been uploaded by {$user->first_name} {$user->last_name}.",
                        subject: 'New Document Uploaded',
                        type: 'notification',
                        messageActions: [
                            [
                                'title' => 'Approve Document',
                                'action' => 'review',
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
        elseif($status->status == 'changes_requested'){
            $this->notificationService->createNotification(
                user: $user,
                message: $status->status_message,
                subject: "Changes Requested on {$document->title}",
                type: 'notification',
                messageActions: [
                    [
                        'title' => 'View Document',
                        'action' => 'view',
                        'dashboard' => 'documents',
                        'panel' => 'my-document',
                        'view' => $document->id,
                    ]
                ],
                senderId: $mentor?->user->id ?? null
                );
            }
        }
    }
}
