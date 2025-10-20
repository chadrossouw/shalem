<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Field;

class Dashboard extends Controller
{
    //
    public function show(Request $request){
        $user  = Auth::user();
        $fields = Field::where('location','dashboard')->get();
        $type = $user->type;
        $viewAs = session()->get('viewAs', $type);
        if($viewAs && $viewAs !== $type){
            $type = $viewAs;
        }
        switch($type){
            case 'student':
                return view('dashboard.student', ['user' => $user, 'fields' => $fields]);
            case 'staff':
                $role = $user->staffRole()->role ?? 'staff';
                if($role=='admin'){
                    return view('dashboard.admin', ['user' => $user, 'fields' => $fields]);
                }
                elseif($role=='grade_head'){
                    return view('dashboard.grade_head', ['user' => $user, 'fields' => $fields]);
                }
                return view('dashboard.staff', ['user' => $user, 'fields' => $fields]);
            case 'parent':
                return view('dashboard.parent', ['user' => $user, 'fields' => $fields]);
            default:
                return view('dashboard', ['user' => $user, 'fields' => $fields]);
        }
    }
}
