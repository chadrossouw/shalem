<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Goal;

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
}
