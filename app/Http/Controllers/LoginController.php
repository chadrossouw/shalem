<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
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

    public function authenticate(Request $request)
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
            return response()->json(['message' => 'Success!','redirect' => '/dashboard'], 200);
        }

        return response()->json(['error' => 'The provided credentials do not match our records.'], 401);
    }

}
