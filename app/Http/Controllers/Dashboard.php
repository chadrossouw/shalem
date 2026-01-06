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
        $_notifications = Notification::where('user_id', $user->id)->where('archived', false)->paginate(12);
        $_notifications->load('actions');
        $notifications = [$_notifications->currentPage()=>$_notifications->toArray()['data']];
        $notificationsPagination = [
            'current_page' => $_notifications->currentPage(),
            'last_page' => $_notifications->lastPage(),
            'per_page' => $_notifications->perPage(),
            'total' => $_notifications->total(),
        ];

        $_unreadNotifications = Notification::where('user_id', $user->id)->whereNull('read_at')->where('archived', false)->paginate(12);
        $_unreadNotifications->load('actions');
        $unreadNotifications = [$_unreadNotifications->currentPage()=>$_unreadNotifications->toArray()['data']];
        $unreadNotificationsPagination = [
            'current_page' => $_unreadNotifications->currentPage(),
            'last_page' => $_unreadNotifications->lastPage(),
            'per_page' => $_unreadNotifications->perPage(),
            'total' => $_unreadNotifications->total(),
        ];
        $updates = Notification::where('user_id', $user->id)->where('type', 'update')->where('archived', false)->whereNull('read_at')->limit(1)->get();
        $updates->load('actions');
        $pillars = Pillar::all(['id','name','description','colour']);
        $pillars = $pillars->map(function($pillar){
            return [
                'id' => $pillar->id,
                'name' => $pillar->name,
                'description' => $pillar->description,
                'colour' => $pillar->colour,
                'slug' => strtolower(str_replace(' ', '-', $pillar->name)),
            ];
        });
        switch($type){
            case 'student':
                $fields = Field::where('location','student_dashboard')->get();
                $user->load('student')->load('student.avatarModel');
                $user->load('mentor')->load('mentor.mentorUser');
                $user->load('userPoints')->load('userPoints.points');
                $user->load('userGoals')->load('userGoals.goals')->load('userGoals.goals.criteria');
                
                return view('dashboard.student', ['user' => $user, 'fields' => $fields, 'pillars' => $pillars, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token, 'notifications' => $notifications, 'notificationsPagination' => $notificationsPagination, 'unreadNotifications' => $unreadNotifications, 'unreadNotificationsPagination' => $unreadNotificationsPagination, 'updates' => $updates ]);
            case 'staff':
                $role = $user->staffRole->role ?? 'staff';
                $pillars = Pillar::all(['id','name','description','colour']);
                $fields = Field::where('location','staff_dashboard')->get();
                if($role=='admin'||$role=='superadmin'){
                    return view('dashboard.staff', ['user' => $user, 'fields' => $fields, 'pillars'=>$pillars,'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token, 'notifications' => $notifications, 'notificationsPagination' => $notificationsPagination, 'unreadNotifications' => $unreadNotifications, 'unreadNotificationsPagination' => $unreadNotificationsPagination, 'updates' => $updates ]);
                }
                elseif($role=='grade_head'){
                    $fields = Field::where('location','staff_dashboard')->get();
                    return view('dashboard.grade_head', ['user' => $user, 'fields' => $fields, 'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token]);
                }
                return view('dashboard.staff', ['user' => $user, 'fields' => $fields, 'pillars'=>$pillars,'dashboard' => $dashboard, 'panel' => $panel, 'view' => $view, 'action'=>$action, 'token' => $token,'notifications' => $notifications, 'notificationsPagination' => $notificationsPagination, 'unreadNotifications' => $unreadNotifications, 'unreadNotificationsPagination' => $unreadNotificationsPagination, 'updates' => $updates ]);
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
