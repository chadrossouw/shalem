<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    //

    public function default(){
        return view('login.login');
    }

    public function parent(){
        return view('login.parent');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        // Authentication logic here
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials['type'] = 'parent';
        $remember = $request->has('remember');
        if (Auth::attempt($credentials,$remember)) {
            $request->session()->regenerate();
 
            return redirect()->intended('dashboard');
        }
 
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

}
