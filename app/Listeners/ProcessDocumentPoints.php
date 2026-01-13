<?php

namespace App\Listeners;

use App\Events\DocumentProcessed;
use App\Events\GoalTrigger;
use App\Events\BadgeTrigger;
use App\Models\Points;
use App\Models\UserPoints;
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
        $pillar = $document->pillar;
        $type = $document->type;
        $points = Points::where('pillar_id', $pillar->id)
            ->where('type', $type)
            ->first();
        UserPoints::create([
            'user_id' => $document->user_id,
            'document_id' => $document->id,
            'points_id' => $points ? $points->id : null,
            'value' => $points ? $points->points : 0,
        ]);
        $user = $document->user;
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
