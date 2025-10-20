<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Http\Controllers\EdAdminFetch;

Schedule::call(new EdAdminFetch())->twiceDaily(6, 15); // Schedule to run at 6 AM and 3 PM daily