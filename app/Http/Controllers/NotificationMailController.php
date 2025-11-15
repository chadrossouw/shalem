<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationMail;

class NotificationMailController extends Controller
{
    private $notifications;
    public function __invoke()
    {
        $this->getUnreadNotificationsFromLast24Hours();
        $this->aggregateAndSendEmails();
    }

    private function getUnreadNotificationsFromLast24Hours()
    {
        $twentyFourHoursAgo = now()->subHours(24);

        $this->notifications = Notification::where('is_read', false)
            ->where('created_at', '>=', $twentyFourHoursAgo)
            ->get();
    }   

    private function aggregateAndSendEmails()
    {
        $notificationsByUser = $this->notifications->groupBy('user_id');

        foreach ($notificationsByUser as $userId => $notifications) {
            $user = \App\Models\User::find($userId);
            if ($user && $user->email) {
    
                // Send email
                Mail::to($user->email)->send(new NotificationMail($notifications));
            }
        }
    }
}
