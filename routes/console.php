<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Http\Controllers\EdAdminFetch;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\PillarController;
use App\Http\Controllers\NotificationMailController;
use App\Models\Notification;

Schedule::call(EdAdminFetch::class)->twiceDaily(6, 15); // Schedule to run at 6 AM and 3 PM daily

Schedule::call(AvatarController::class)->dailyAt('2:00'); // Clear cache daily at 2 AM

Schedule::command('auth:clear-resets')->everyFifteenMinutes();

Schedule::call(PillarController::class)->dailyAt('0:00'); // Update pillars daily at midnight

Schedule::call(NotificationMailController::class)->dailyAt('7:30'); // Send notification summary emails daily at 8 AM