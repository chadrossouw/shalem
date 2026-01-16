<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Http;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserAvatarsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\BadgesController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\GoalsController;
use App\Http\Controllers\PeopleController;
use App\Models\User;


//Recaptcha
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

// Authentication routes
Route::post('/login', [LoginController::class, 'authenticate'])->name('api.login');
Route::post('/login-redirect', [LoginController::class, 'authenticateRedirect'])->name('api.login.redirect');
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum')->name('api.logout');
Route::post('/cleanlogout', [LoginController::class, 'cleanLogout'])->name('api.cleanlogout');
Route::post('/reset-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $firstLogin = $request->firstlogin??false;
    $email = $request->email;
    $user = User::where('email', $email)->first();
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

// Avatar routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/avatars', [UserAvatarsController::class, 'getAvatars'])->name('api.avatars');
    Route::get('/avatar/{id}', [UserAvatarsController::class, 'getAvatar'])->name('api.avatar');
    Route::post('/set-avatars', [UserAvatarsController::class, 'setAvatar'])->name('api.avatars.store');
});

// Notifications routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'getNotifications'])->name('api.notifications');
    Route::get('/notifications/archived', [NotificationController::class, 'getArchivedNotifications'])->name('api.notifications.archived');
    Route::post('/notifications/{id}/{status}', [NotificationController::class, 'handleStatusUpdate'])->name('api.notifications.status');
});

//Document Routes
Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('/document/upload', [DocumentController::class, 'upload'])->name('api.document.upload');
    Route::get('/documents', [DocumentController::class, 'list'])->name('api.documents.list');
    Route::get('/documents/approved', [DocumentController::class, 'listApproved'])->name('api.documents.approved.list');
    Route::get('/document/{id}', [DocumentController::class, 'get'])->name('api.document.get');
});

//Staff Document Review Routes
Route::middleware(['auth:sanctum','ability:staff,grade_head,admin,super_admin'])->group(function(){
    Route::get('/staff/documents', [DocumentController::class, 'staffList'])->name('api.staff.documents.list');
    Route::get('/staff/dashboard-data', [Dashboard::class, 'staffDashboardData'])->name('api.staff.documents.dashboard.data');
    Route::post('/document/approve', [DocumentController::class, 'approve'])->name('api.document.approve');
    Route::post('/document/reject', [DocumentController::class, 'reject'])->name('api.document.reject');
    Route::post('/document/request-corrections', [DocumentController::class, 'requestCorrections'])->name('api.document.request-corrections');
    Route::post('/document/forward', [DocumentController::class, 'forward'])->name('api.document.forward');

});

//Users Routes
Route::middleware(['auth:sanctum','ability:staff,grade_head,admin,super_admin'])->group(function(){
    Route::get('/staff',[PeopleController::class,'listStaff'])->name('api.staff.list');
    Route::get('/students/{mentee}',[PeopleController::class,'listStudents'])->name('api.students.list');
    Route::get('/student/{id}',[PeopleController::class,'getStudent'])->name('api.parents.list');
});

//Badges Routes
Route::middleware(['auth:sanctum'])->group(function(){
    Route::get('/badges', [BadgesController::class, 'list'])->name('api.badges.list');
});

//Goals Routes
Route::middleware(['auth:sanctum'])->group(function(){
    Route::get('/goals/by-pillar', [GoalsController::class, 'listGoalsByPillar'])->name('api.goals.by-pillar');
    Route::post('/goals/set', [GoalsController::class, 'setGoal'])->name('api.goals.set');
    Route::post('/goals/remove', [GoalsController::class, 'removeGoal'])->name('api.goals.remove');
}); 

//CV Support Routes
Route::middleware(['auth:sanctum'])->group(function(){
    Route::get('/cvs', [\App\Http\Controllers\CVSupportController::class, 'list'])->name('api.cvs.list');
    Route::get('/cv/{id}', [\App\Http\Controllers\CVSupportController::class, 'get'])->name('api.cvs.search');
    Route::post('/cvs/create', [\App\Http\Controllers\CVSupportController::class, 'create'])->name('api.cvs.create');
    Route::post('/cvs/delete', [\App\Http\Controllers\CVSupportController::class, 'delete'])->name('api.cvs.delete');
});