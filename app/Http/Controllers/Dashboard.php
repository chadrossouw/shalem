<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Field;
use App\Models\Pillar;
use App\Models\Notification;

class Dashboard extends Controller
{
    //
    public function show(Request $request, $dashboard = 'home', $panel = '', $view = '', $action = ''){
        $user  = Auth::user();
        
        $type = $user->type;
        $viewAs = session()->get('viewAs', $type);
        if($viewAs && $viewAs !== $type){
            $type = $viewAs;
        }
        //Using php session here as flash is not persisting in laravel correctly after login redirection
        if(!isset($_SESSION)){
            session_start();
        }
        $token = isset($_SESSION['auth_token']) ? $_SESSION['auth_token'] : '';
        if(!$token){
            Auth::logout();
            return redirect('/?error=auth');
        }
        switch($type){
            case 'student':
                $fields = Field::where('location','student_dashboard')->get();
                $user->load('student')->load('student.avatarModel');
                $notifications = Notification::where('user_id', $user->id)->where('archived', false)->paginate(12);
                $unreadNotifications = Notification::where('user_id', $user->id)->whereNull('read_at')->where('archived', false)->limit(2)->get();
                $updates = Notification::where('user_id', $user->id)->where('type', 'update')->where('archived', false)->whereNull('read_at')->limit(1)->get();
                $user->load('mentor')->load('mentor.mentorUser');
                $user->load('userPoints')->load('userPoints.points');
                $user->load('userGoals')->load('userGoals.goals');
                $pillars = Pillar::all(['id','name','description','colour']);
                return view('dashboard.student', ['user' => $user, 'fields' => $fields, 'pillars' => $pillars, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token, 'notifications' => $notifications, 'unreadNotifications' => $unreadNotifications, 'updates' => $updates ]);
            case 'staff':
                $role = $user->staffRole->role ?? 'staff';
                $pillars = Pillar::all(['id','name','description','colour']);
                $fields = Field::where('location','staff_dashboard')->get();
                if($role=='admin'||$role=='superadmin'){
                    return view('dashboard.staff', ['user' => $user, 'fields' => $fields, 'pillars'=>$pillars,'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token]);
                }
                elseif($role=='grade_head'){
                    $fields = Field::where('location','staff_dashboard')->get();
                    return view('dashboard.grade_head', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token]);
                }
                return view('dashboard.staff', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token]);
            case 'parent':
                $fields = Field::where('location','parent_dashboard')->get();
                return view('dashboard.parent', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action ]);
            default:
                $fields = Field::where('location','dashboard')->get();
                return view('dashboard', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action ]);
        }
    }

    public function login(Request $request){
        $user  = Auth::user();
        return view('dashboard.login', ['user' => $user]);
    }
}
