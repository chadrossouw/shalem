<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    //
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
        return response()->json(['message' => 'Notification status updated successfully.'], 200);
    }
}
