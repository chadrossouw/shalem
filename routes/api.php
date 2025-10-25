<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Http;

Route::post('/grecaptcha', function (Request $request) {
    $request->validate(['token' => 'required|string']);
    $api_key= env('GOOGLE_API_KEY');
    $response = Http::asJson()->post("https://recaptchaenterprise.googleapis.com/v1/projects/shalem-475607/assessments?key={$api_key}", [
        'event' => [
            'token' => $request->token,
            'siteKey' => env('RECAPTCHA_SITE_KEY'),
        ]
    ]);
    $result = $response->json();
    if (isset($result['riskAnalysis']) && $result['riskAnalysis']['score'] >= 0.5) {
        return response()->json(['success' => true, 'score' => $result['riskAnalysis']['score']], 200);
    } else {
        return response()->json(['success' => false, 'error-codes' => $result['error-codes'] ?? []], 400);
    }
});
Route::post('/login', [LoginController::class, 'authenticate'])->name('api.login');

Route::post('/reset-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $firstLogin = $request->firstlogin??false;
    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user || $user->type !== 'parent') {
        return response()->json(['error' => 'We can\'t find a user with that email address.'], 404);
    }
    $status = Password::sendResetLink(
        $request->only('email')
    );
    if ($status === Password::RESET_LINK_SENT) {
        $message = $firstLogin ? 'A link to set your password has been sent to your email address.' : 'A link to reset your password has been sent to your email address.';
        return response()->json(['message' => $message], 200);
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