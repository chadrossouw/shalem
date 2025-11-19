<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class LoginController extends Controller
{
    //

    public function default(){
        return view('login.login');
    }

    public function parent(){
        return view('login.parent');
    }

    public function authenticate(Request $request)
    {
        // Authentication logic here
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials['type'] = 'parent';
        $remember = $request->has('remember');
        
        if (Auth::attempt($credentials,true)) {
            $request->session()->regenerate();
            return response()->json(['success' => true, 'message' => 'Success!','redirect' => '/dashboard'], 200);
        }

        return response()->json(['error' => 'The provided credentials do not match our records.'], 401);
    }

    public function authenticateRedirect(Request $request)
    {
        // Authentication logic here
        $credentials = $request->validate([
            'id' => ['required'],
        ]);
        $user = User::where('id',$credentials['id'])->first();
        $authedUser = Auth::user();
        
        // Check if user is already authenticated and matches the requested user
        if($user && $authedUser && $authedUser->id == $user->id){
            // User is already authenticated, no need to re-login or regenerate session
            return response()->json(['success' => true, 'message' => 'Success!','redirect' => env('APP_URL').'/dashboard/'], 200);
        }
        
        if($user){
            Auth::login($user, true);
            $request->session()->regenerate();
            return response()->json(['success' => true, 'message' => 'Success!','redirect' => env('APP_URL').'/dashboard/'], 200);
        }
        return response()->json(['error' => 'The provided credentials do not match our records.'], 401);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if($user){
            $user->tokens()->delete();
        }
        
        Auth::logout();
    
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return redirect('/?logged_out=true');
    }
}
