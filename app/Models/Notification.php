<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    //
    protected $attributes = [
        
    ];

    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'type',
        'read_at',
        'sender_id',
        'avatar_id',
    ];

    public function actions(): HasMany
    {
        return $this->hasMany(NotificationAction::class, 'notification_id', 'id');
    }
}
