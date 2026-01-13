<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\BadgeTrigger;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\Document;
use App\Models\User;
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
        $userBadges = UserBadge::where('user_id', $user->id)->whereYear('created_at', date('Y'))->get();
        $allBadges = Badge::all();


        foreach($allBadges as $badge){
            if($userBadges->filter(function ($ubadge) use ($badge){
                return $ubadge->badge_id == $badge->id;
            })->count() > 0){
                continue;
            }
            $criteria = $badge->criteria;
            $criteriaMet = [];
            foreach($criteria as $criterion){
                if($criterion->merits){
                    //Handle merits criteria
                }
                elseif($criterion->attendance){
                    //Handle attendance criteria
                }
                elseif($criterion->document_points){
                    //Handle documents criteria
                    $pillar = $criterion->pillar;
                    $document_type = $criterion->document_type;
                    $points = $criterion->document_points;
                    if(!$pillar || !$document_type){
                        $docs = Document::where('user_id', $user->id)
                            ->whereHas('document_status', function($query){
                                $query->where('status', 'approved');
                            })
                            ->whereHas('points', function($query) use ($points){
                                $query->where('value', '>', 0);
                            })
                            ->get();
                    }
                    elseif(!$pillar){
                        $docs = Document::where('user_id', $user->id)
                            ->where('type', $document_type)
                            ->whereHas('document_status', function($query){
                                $query->where('status', 'approved');
                            })
                            ->whereHas('points', function($query) use ($points){
                                $query->where('value', '>', 0);
                            })
                            ->get();
                    }
                    elseif(!$document_type){
                        $docs = Document::where('user_id', $user->id)
                            ->where('pillar_id', $pillar)
                            ->whereHas('document_status', function($query){
                                $query->where('status', 'approved');
                            })
                            ->whereHas('points', function($query) use ($points){
                                $query->where('value', '>', 0);
                            })
                            ->get();
                    }
                    else{
                        $docs = Document::where('user_id', $user->id)
                            ->where('pillar_id', $pillar)
                            ->where('type', $document_type)
                            ->whereHas('document_status', function($query){
                                $query->where('status', 'approved');
                            })
                            ->whereHas('points', function($query) use ($points){
                                $query->where('value', '>', 0);
                            })
                            ->get();
                    }
                    $totalPoints = 0;
                    foreach($docs as $doc){
                        $totalPoints += $doc->points->value;
                    }
                    if($totalPoints >= $points){
                        $criteriaMet[] = true;
                    }
                    else{
                        $criteriaMet[] = false;
                    }
                }
                
                if(!$criteriaMet){
                    break;
                }
            }

            
        
            if($criteriaMet && !in_array(false, $criteriaMet)){
                $userBadge = new UserBadge();
                $userBadge->user_id = $user->id;
                $userBadge->badge_id = $badge->id;
                $userBadge->save();
                $this->notificationService->createNotification(
                    user: $user,
                    message: "You got a new badge!",
                    subject: 'Badge Achieved',
                    type: 'update',
                    messageActions: [
                        [
                            'title' => 'Admire your new badge',
                            'dashboard' => 'points',
                            'panel' => null,
                            'view' => null,
                        ]
                    ],
                    senderId:null,
                    avatarId: 23
                );

            }
        }
    }

}