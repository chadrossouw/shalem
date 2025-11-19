<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Http\Request;


class GoogleAuthController extends Controller
{
     /**
     * Redirect the user to Google’s OAuth page.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $request->session()->invalidate();
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            // Get the user information from Google
            $user = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            return redirect('/')->with('error', 'Google authentication failed.');
        }
        // Check if the user already exists in the database
        $existingUser = User::where('email', $user->email)->first();
        if ($existingUser && in_array($existingUser->type, ['student', 'staff'])) {
            // Log the user in if they already exist
            Auth::login($existingUser, true); // true for remember me
            
            $request->session()->regenerate();
            $token_permission = ['user:'.$existingUser->type];
            if( $existingUser->staffRole ){
                $token_permission[] = ['staff:'.$existingUser->staffRole->role];
            }
            $token = $existingUser->createToken('auth_token',$token_permission); 
            session_start();
            $_SESSION['auth_token'] = $token->plainTextToken;
            return redirect(env('APP_URL').'/dashboard')->with('auth_token', $token->plainTextToken);
        } else {
            return redirect('/')->with('error', 'No Herzlia account associated with this Google email.');
        }
    }

    /**
     * Handle OAuth success and ensure CSRF tokens are ready
     */
    public function oauthSuccess(Request $request)
    {
        $user = Auth::user();
        // Force CSRF cookie to be set
        $request->session()->regenerateToken();
        
        // Simple redirect page that ensures CSRF is ready before going to dashboard
        return view('auth.oauth-success');
    }
}
