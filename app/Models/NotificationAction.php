<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationAction extends Model
{
    protected $fillable = [
        'notification_id',
        'title',
        'type',
        'type_id',
        'action',
        'dashboard',
        'panel',
        'view',
        'status',
    ];
}
