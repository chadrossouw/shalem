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
    public function redirect()
    {
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

        if ($existingUser) {
            // Log the user in if they already exist
            Auth::login($existingUser, true); // true for remember me
            
            // Regenerate session for security
            $request->session()->regenerate();
            
            // Redirect the user to the dashboard or any other secure page
            return redirect()->intended('/dashboard');
        } else {
            // Otherwise, create a new user and log them in
            return redirect('/')->with('error', 'No Herzlia account associated with this Google email.');
        }
    }
}
