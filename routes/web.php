<?php


//Facades
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

//Controllers
use App\Http\Controllers\EdAdminFetch;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Dashboard;
use App\Models\Field;
use App\Models\Avatar;

Route::get('/', function () {
    $user = Auth::user();
    $viewAs = session()->get('viewAs');
    if($user && $viewAs!=='anonymous' ){
        return redirect('/dashboard');
    }
    return view('home',['user'=>$user, 'fields'=>Field::where('location','home')->get(), 'avatars'=>Avatar::all()]);
}); 

Route::get('/fetch-edadmin', [EdAdminFetch::class, '__invoke']);
Route::get('/populate-avatars', AvatarController::class);

Route::get('/login',[LoginController::class,'default'])->name('login');
Route::get('/login/student', [GoogleAuthController::class,'redirect'])->name('login.student');
Route::get('/login/staff', [GoogleAuthController::class,'redirect'])->name('login.staff');
Route::get('/auth/google', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
Route::get('/login/parent', [LoginController::class,'parent'])->name('login.parent');
Route::get('/reset-password/{token}', function (string $token) {
    $email = request()->query('email');
    return view('login.reset-password', ['token' => $token, 'email' => $email]);
})->middleware('guest')->name('password.reset');

Route::get('/dashboard/{dashboard}/{panel}/{view?}',[Dashboard::class,'show'])->middleware('auth');
Route::get('/dashboard/{dashboard}/{panel?}',[Dashboard::class,'show'])->middleware('auth');
Route::get('/dashboard/{dashboard?}',[Dashboard::class,'show'])->middleware('auth')->name('dashboard');

Route::get('/edit/{location}/{name}', function ($location, $name) {
    $id = Field::where('location', $location)->where('name', $name)->value('id');
    return redirect(env('CMS_URL') . "/post.php?post=$id&action=edit#$name");
})->name('editable_field');

Route::get('/admin/view-as/{type}', function ($type) {
    $user = Auth::user();
    if (!$user || $user->staffRole->role !== 'admin') {
        return redirect('/dashboard');
    }
    $validTypes = ['student', 'staff', 'parent', 'anonymous'];
    if (in_array($type, $validTypes)) {
        session()->put('viewAs', $type);
    }
    return redirect('/dashboard');
})->middleware('auth')->name('admin.view-as');

