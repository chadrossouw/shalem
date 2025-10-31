<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Field;

class Dashboard extends Controller
{
    //
    public function show(Request $request, $dashboard = 'home', $panel = '', $view = ''){
        $user  = Auth::user();
        
        $type = $user->type;
        $viewAs = session()->get('viewAs', $type);
        if($viewAs && $viewAs !== $type){
            $type = $viewAs;
        }
        switch($type){
            case 'student':
                $fields = Field::where('location','student_dashboard')->get();
                $user->load('student')->load('student.avatar');
                return view('dashboard.student', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
            case 'staff':
                $role = $user->staffRole->role ?? 'staff';
                $fields = Field::where('location','staff_dashboard')->get();
                if($role=='admin'||$role=='superadmin'){
                    return view('dashboard.admin', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
                }
                elseif($role=='grade_head'){
                    $fields = Field::where('location','staff_dashboard')->get();
                    return view('dashboard.grade_head', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
                }
                return view('dashboard.staff', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
            case 'parent':
                $fields = Field::where('location','parent_dashboard')->get();
                return view('dashboard.parent', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
            default:
                $fields = Field::where('location','dashboard')->get();
                return view('dashboard', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view]);
        }
    }
}
