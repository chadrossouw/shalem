<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationAction;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for a user
     * @param User $user
     * @param string $message
     * @param string $subject
     * @param string $type
     * @param array $messageActions
     * @param int|null $senderId
     * @return void
     */
    public function createNotification(User $user, string $message, string $subject, string $type, array $messageActions, ?int $senderId = null)
    {
        // Logic to send update notification to the user
        $notification = Notification::create([
            'user_id' => $user->id,
            'subject' => $subject,
            'message' => $message,
            'type' => $type,
            'sender_id' => $senderId,
            'is_read' => false,
        ]);
        foreach ($messageActions as $action) {
            NotificationAction::create([
                'notification_id' => $notification->id,
                'title' => $action['title'] ?? null,
                'type' => $action['type'] ?? null,
                'type_id' => $action['type_id'] ?? null,
                'action' => $action['action'] ?? null,
                'dashboard' => $action['dashboard'] ?? null,
                'panel' => $action['panel'] ?? null,
                'view' => $action['view'] ?? null,
                'status' => $action['status'] ?? 'pending',
            ]);
        }
    }
}