<?php

namespace App\Listeners;

use App\Events\DocumentProcessed;
use App\Events\GoalTrigger;
use App\Events\BadgeTrigger;
use App\Models\Points;
use App\Models\UserPoints;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\NotificationService;

class ProcessDocumentPoints
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
    public function handle(DocumentProcessed $event): void
    {
        //
        $document = $event->document;
        $status = $document->document_status->status;
        if($status=='approved'){
            $pillar = $document->pillar_id;
            $type = $document->type;
            $points = Points::where('pillar_id', $pillar)
                ->where('type', $type)
                ->first();
            UserPoints::create([
                'user_id' => $document->user_id,
                'document_id' => $document->id,
                'point_id' => $points ? $points->id : null,
                'value' => $points ? $points->value : 0,
            ]);
            $user = $document->user;

            $this->notificationService->createNotification(
                user: $document->user,
                message: "Your document '{$document->title}' has been approved.",
                subject: 'Document Approved',
                type: 'notification',
                messageActions: [
                    [
                        'title' => 'View Document',
                        'action' => 'view',
                        'dashboard' => 'documents',
                        'panel' => 'my-documents',
                        'view' => $document->id,
                        'status' => 'approved',
                    ]
                ],
                senderId: null,
                avatarId: 24
            );
            // Trigger GoalTrigger event for the user
            GoalTrigger::dispatch(
                $user,
                $document
            );

            BadgeTrigger::dispatch(
                $user,
                $document
            );
        }
    }
}
