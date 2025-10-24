<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Http\Controllers\EdAdminFetch;
use App\Http\Controllers\AvatarController;

Schedule::call(EdAdminFetch::class)->twiceDaily(6, 15); // Schedule to run at 6 AM and 3 PM daily

Schedule::call(AvatarController::class)->dailyAt('2:00'); // Clear cache daily at 2 AM

Schedule::command('auth:clear-resets')->everyFifteenMinutes();