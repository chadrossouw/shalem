<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\NotificationAction;
use App\Models\User;
use App\Models\Document;
use App\Models\ForwardedDocument;
use App\Models\DocumentStatus;
use App\Models\StaffRole;

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
            'subject' => 'required|string',
            'message' => 'required|string',
            'avatar' => 'nullable|string',
        ]);
        $avatarId = null;
        if($request->has('avatar')){
            $avatarId = intval($request->input('avatar'));
        }
        Notification::create(
            [
                'user_id' => $id,
                'subject' => $request->input('subject'),
                'message' => $request->input('message'),
                'type' => 'notification',
                'sender_id' => $user->id,
                'avatar_id' => $avatarId,
            ]
        );
        return response()->json(['message' => 'Message sent successfully.'], 200);
    }

    public function sendHelpMessage(Request $request){
        $user = $request->user();
        $request->validate([
            'help_message' => 'required|string',
        ]);
        // Send message to admin users
        $admins = User::whereHas('staffRole', function($query){
            $query->where('role', 'admin');
        })->get();
        foreach($admins as $admin){
            $notification = Notification::create(
                [
                    'user_id' => $admin->id,
                    'subject' => "Help & Support request from {$user->first_name} {$user->last_name}",
                    'message' => $request->input('help_message'),
                    'type' => 'notification',
                    'sender_id' => $user->id,
                ]
            );
            NotificationAction::create([
                'notification_id' => $notification->id,
                'title' => 'Send a reply',
                'dashboard' => 'pupils',
                'panel' => $user->id,
                'view' => 'message',
            ]);

        }
        return response()->json(['message' => 'Help & Support message sent successfully.'], 200);
    }

    public function sendDocumentHelpRequest(Request $request){
        $user = $request->user();
        $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'help_message' => 'required|string',
        ]);
        $documentId = $request->input('document_id');
        $grade = $user->student->grade;
        $grade_head = null;
        if($grade){
             $grade_head = User::where('type','staff')->whereHas('staffRole', function($query){
                $query->where('role', 'grade_head');
            }) 
            ->whereHas('grade', function($query) use ($grade){
                $query->where('grade', $grade);
            })
            ->first();
        }
        if(!$grade_head){
            $grade_head = User::whereHas('staffRole', function($query){
                $query->where('role', 'admin');
            })->first();
        }
        /*)*/
        if(!$grade_head){
            return response()->json(['error' => 'Grade head not found'], 404);
        }
        DocumentStatus::create([
            'document_id' => $documentId,
            'status' => 'forwarded',
            'status_message' => 'Help request: '.strip_tags($request->input('help_message')),
            'user_id' => $user->id,
        ]);
        $forwardedDocument = new ForwardedDocument();
        $forwardedDocument->user_id = $grade_head->id;
        $forwardedDocument->document_id = $documentId;
        $forwardedDocument->forwarded_by = $user->id;
        $forwardedDocument->save();
        $document = Document::find($documentId);
        $notification = Notification::create(
            [
                'user_id' => $grade_head->id,
                'subject' => "Document Help & Support request from {$user->first_name} {$user->last_name}",
                'message' => "Document: {$document->title}\n\n".$request->input('help_message'),
                'type' => 'notification',
                'sender_id' => $user->id,
            ]
        );
        NotificationAction::create([
            'notification_id' => $notification->id,
            'title' => 'View Document',
            'action' => 'review',
            'dashboard' => 'documents',
            'panel' => 'documents',
            'view' => $documentId,
            'status' => 'forwarded',
        ]);
        return response()->json(['message' => 'Document Help & Support request sent successfully.'], 200);
    }
}
