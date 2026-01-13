<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationAction extends Model
{
    protected $fillable = [
        'notification_id',
        'title',
        'action',
        'dashboard',
        'panel',
        'view',
        'status',
    ];
}
