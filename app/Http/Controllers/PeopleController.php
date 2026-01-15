<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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
    }
}
