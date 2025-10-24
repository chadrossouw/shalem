<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Password;

Route::get('/test', function (Request $request) {
    return response()->json(['message' => 'API is working']);
});
Route::post('/login', [LoginController::class, 'authenticate'])->name('api.login');

Route::post('/reset-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user || $user->type !== 'parent') {
        return response()->json(['error' => 'We can\'t find a user with that email address.'], 404);
    }
    $status = Password::sendResetLink(
        $request->only('email')
    );
    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => __($status)], 200);
    }
    else {
        return response()->json(['error' => __($status)], 500);
    }
})->name('password.email');

Route::post('/update-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => $password
            ])->save();
            $user->setRememberToken(\Illuminate\Support\Str::random(60));
        }
    );
    if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => __($status)], 200);
    } else {
        return response()->json(['error' => __($status)], 500);
    }
})->name('password.update');