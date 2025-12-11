<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    //
    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'is_read',
    ];

    public function actions(): HasMany
    {
        return $this->hasMany(NotificationAction::class, 'notification_id', 'id');
    }
}
