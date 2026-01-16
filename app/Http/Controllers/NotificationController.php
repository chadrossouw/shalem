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
        $notifications = Notification::where('user_id', $user->id)->where('archived', false)->paginate(12);
        $unread_notifications = Notification::where('user_id', $user->id)->whereNull('read_at')->where('archived', false)->paginate(12);
        $archived_notifications = Notification::where('user_id', $user->id)->where('archived', true)->paginate(12);
        return response()->json(['message' => 'Notification status updated successfully.', 'notifications' => $notifications, 'unread_notifications' => $unread_notifications, 'archived_notifications' => $archived_notifications], 200);
    }

    public function sendMessage(Request $request, $id){
        $user = $request->user();
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'avatar' => 'nullable|int|max:255',
        ]);
        Notification::create(
            [
                'user_id' => $id,
                'subject' => $request->input('subject'),
                'message' => $request->input('message'),
                'type' => 'notification',
                'sender_id' => $user->id,
                'avatar_id' => $request->input('avatar', null),
            ]
        );
        return response()->json(['message' => 'Message sent successfully.'], 200);
    }
}
