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
    public function createNotification(User $user, string $message, string $subject, string $type, array $messageActions, ?int $senderId = null, ?int $avatarId = null): void
    {
        // Logic to send update notification to the user
        $notification = Notification::create([
            'user_id' => $user->id,
            'subject' => $subject,
            'message' => $message,
            'type' => $type,
            'sender_id' => $senderId,
            'read_at' => null,
            'avatar_id' => $avatarId,
        ]);
        foreach ($messageActions as $action) {
            NotificationAction::create([
                'notification_id' => $notification->id,
                'title' => $action['title'] ?? 'Go',
                'action' => $action['action'] ?? null,
                'dashboard' => $action['dashboard'] ?? null,
                'panel' => $action['panel'] ?? null,
                'view' => $action['view'] ?? null,
                'status' => $action['status'] ?? 'pending',
            ]);
        }
    }
}