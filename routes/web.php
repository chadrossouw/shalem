<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
}); 

Route::get('/fetch-edadmin', [App\Http\Controllers\EdAdminFetch::class, '__invoke']);
