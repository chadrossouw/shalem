<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function getNotifications(Request $request){
        $user = $request->user();
        $type = $request->query('type', 'notification');
        if($type === 'archivedNotification'){
            return $this->getArchivedNotifications($request);
        }
        if($type === 'unreadNotification'){
            return $this->getUnreadNotifications($request);
        }
        $notifications = Notification::where('user_id', $user->id)->where('archived', false)->paginate(12);
        $notifications->load('actions');
        return response()->json(['notifications' => $notifications], 200);
    }

    public function getArchivedNotifications(Request $request){
        $user = $request->user();
        $notifications = Notification::where('user_id', $user->id)->where('archived', true)->paginate(12);
        return response()->json(['notifications' => $notifications], 200);
    }

    public function getUnreadNotifications(Request $request){
        $user = $request->user();
        $notifications = Notification::where('user_id', $user->id)->whereNull('read_at')->where('archived', false)->paginate(12);
        return response()->json(['notifications' => $notifications], 200);
    }
    
    public function handleStatusUpdate(Request $request, $id, $status){
        $user = $request->user();
        $notification = Notification::where('id', $id)->where('user_id', $user->id)->first();
        if(!$notification){
            return response()->json(['error' => 'Notification not found.'], 404);
        }
        if($status === 'read'){
            $notification->read_at = now();
        }
        elseif($status === 'unread'){
            $notification->read_at = null;
        }
        elseif($status === 'archive'){
            $notification->archived = true;
        }
        elseif($status === 'unarchive'){
            $notification->archived = false;
        }
        else{
            return response()->json(['error' => 'Invalid status.'], 400);
        }
        $notification->save();
        //$notifications = Notification::where('user_id', $user->id)->whereNull('read_at')->where('archived', false)->get();
        return response()->json(['message' => 'Notification status updated successfully.'], 200);
    }
}
