<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use Illuminate\Http\Request;
use App\Models\Goal;
use App\Models\UserGoal;

class GoalsController extends Controller
{
    //
    public function listGoalsByPillar(Request $request)
    {
        $pillar_id = $request->input('pillar_id');
        $goals = Goal::with('criteria')->where('pillar_id', $pillar_id)->get();
        return response()->json([
            'goals' => $goals,
        ]);
    }

    public function setGoal(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'goal' => 'required|integer|exists:goals,id',
            'goal_name' => 'nullable|string'
        ]);
        $goal_name = $request->input('goal_name');
        if(!$goal_name){
            $goalModel = Goal::find(intval($request->input('goal')));
            if($goalModel){
                $goal_name = $goalModel->name;
            }
            else{
                $goal_name = '';
            }
        }
        $goal = new UserGoal();
        $goal->user_id = $user->id;
        $goal->goal_id = intval($request->input('goal'));
        $goal->name = strip_tags($goal_name);
        $goal->status = 'set';
        $goal->save();
        $_goal = Goal::with('criteria')->find(intval($request->input('goal')));
        if($_goal){
            $criteria = $_goal->criteria;
            foreach($criteria as $criterion){
                $userGoalProgressEntry = new \App\Models\UserGoalsProgress();
                $userGoalProgressEntry->user_goal_id = $goal->id;
                $userGoalProgressEntry->criteria_id = $criterion->id;
                $userGoalProgressEntry->progress_value = 0;
                if($criterion->document_points){
                    $userGoalProgressEntry->target_value = $criterion->document_points;
                } 
                elseif($criterion->attendance){
                    $userGoalProgressEntry->target_value = $criterion->attendance;
                }
                elseif($criterion->merits){
                    $userGoalProgressEntry->target_value = $criterion->merits;
                }
                $userGoalProgressEntry->save();
            }
        }
        $goal->load([
            'goals'=>function($query){
                    $query->with('criteria');
                },
            'progress'
            ]
        );
        return response()->json([
            'user_goal' => $goal->toArray(),
            'action' => ['panel'=>null],
            'message' => 'Goal set successfully',
        ], 200);
    }
}
