<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\BadgeTrigger;
use App\Models\Badge;
use App\Services\NotificationService;

class TriggerBadgeAssessment{
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
    public function handle(BadgeTrigger $event): void
    {
        //
        $user = $event->user;
        $userBadges = $user->userBadges();
        $allBadges = Badge::all();


        foreach($allBadges as $badge){
            if($userBadges->search(function ($ubadge) use ($badge){
                return $ubadge->badge_id == $badge->id;
            }) !== false){
                continue;
            }
            $criteria = $badge->criteria;
            $criteriaMet = [];
            foreach($criteria as $criterion){

                $criteriaMet = $user->meetsBadgeCriterion($criterion);
                if(!$criteriaMet){
                    break;
                }
            }

            
        
            if($criteriaMet && !in_array(false, $criteriaMet)){
                $userBadge = new \App\Models\UserBadge();
                $userBadge->user_id = $user->id;
                $userBadge->badge_id = $badge->id;
                $userBadge->achieved_at = now();
                $userBadge->save();
                $this->notificationService->createNotification(
                    $user,
                    "You got a new badge!.",
                    'Goal Achieved',
                    'goal_achieved',
                    []
                );

            }
        }
    }

}