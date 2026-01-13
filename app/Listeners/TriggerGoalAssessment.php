<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\GoalTrigger;
use App\Services\NotificationService;

class TriggerGoalAssessment{
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
    public function handle(GoalTrigger $event): void
    {
        //
        $user = $event->user;
        $triggeringEntity = $event->triggeringEntity;
        $userGoals = $user->userGoals;


        foreach($userGoals as $userGoal){
            if($userGoal->achieved_at){
                continue;
            }
            if($triggeringEntity instanceof \App\Models\Document){
                // Process document-related criteria
                $documentPoints = $triggeringEntity->points;
                foreach($userGoal->progress as $progressEntry){
                    $criterion = $progressEntry->criteria;
                    $criteriaPillar = intval($criterion->pillar);
                    $criteriaType = $criterion->document_type;
                    $documentType = $triggeringEntity->type;
                    $documentPillar = intval($triggeringEntity->pillar_id);
                    if($criteriaPillar == $documentPillar && $criteriaType == $documentType){
                        if($criterion->document_points){
                            $progressEntry->progress_value += $documentPoints->value;
                            if($progressEntry->progress_value >= $progressEntry->target_value){
                                $progressEntry->progress_value = $progressEntry->target_value;
                            }
                            $progressEntry->save();
                        }
                    }
                }
                
            }
            elseif($triggeringEntity instanceof \App\Models\Merit){
                // Process merit-related criteria
            }
            elseif($triggeringEntity instanceof \App\Models\Attendance){
                // Process attendance-related criteria
            }
            $achieved_count = 0;
            foreach($userGoal->progress as $progressEntry){
                if($progressEntry->progress_value >= $progressEntry->target_value){
                    $achieved_count += 1;
                }
            }
            if($achieved_count == count($userGoal->progress)){
                $userGoal->achieved_at = now();
                $userGoal->save();
                $this->notificationService->createNotification(
                    $user,
                    "Congratulations! You have achieved your goal: {$userGoal->goal_name}.",
                    'Goal Achieved',
                    'update',
                    messageActions: [
                        [
                            'title' => 'Set some more',
                            'dashboard' => 'goals',
                            'panel' => null,
                            'view' => null,
                        ]
                    ],
                    senderId:null,
                    avatarId: 58
                );

            }
        }
    }

}