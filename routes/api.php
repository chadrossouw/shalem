<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
Route::get('/test', function (Request $request) {
    return response()->json(['message' => 'API is working']);
});
Route::post('/login', [LoginController::class, 'authenticate'])->name('api.login');
