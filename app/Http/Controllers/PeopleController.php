<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification;

class PeopleController extends Controller
{
    public function listStaff(Request $request){
        $filters = $request->input('filter', []);
        if($filters){
            $filters = json_decode($filters, true);
            $staff = User::where('type', 'staff')->whereHas('staffRole', function($query) use ($filters) {
                foreach($filters as $i => $value){
                    if($i===0){
                        $query->where('role', $value);
                    }else{
                        $query->orWhere('role', $value);
                    }
                }
                return $query;
            })->get();
        }
        else{
            $staff = User::where('type', 'staff')->get();
        }
        $mappedByRole = [];
        $staff->each(function($user)use(&$mappedByRole){
            $user->load('staffRole');
            if(!isset($mappedByRole[$user->staffRole->role])){
                $mappedByRole[$user->staffRole->role] = [];
            }
            $mappedByRole[$user->staffRole->role][] = $user;
        });
        return response()->json([
            'staff' => $mappedByRole
        ]);
    }

    public function listStudents(Request $request, $mentee){
    }
    public function listParents(Request $request, $id){
    }
    public function getStudent(Request $request, $id){
        $pupil = User::where('id', $id)->where('type', 'student')->first();
        if(!$pupil){
            return response()->json(['error' => 'Pupil not found'], 404);
        }
        $pupil->load('student')->load('student.avatarModel');
        $pupil->load('mentor')->load('mentor.mentorUser');
        $pupil->load('userPoints')->load('userPoints.points');
        $pupil->load('userGoals')->load([
            'userGoals.goals'=>function($query){
                $query->with('criteria');
            },
            'userGoals.progress']);
        return response()->json(['pupil' => $pupil], 200);
    }

    public function getStudentMessages(Request $request, $id){
        $user = $request->user();
        $notifications = Notification::where('sender_id', $user->id)
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return response()->json(['messages' => $notifications], 200);
    }
}
