<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class SessionTestController extends Controller
{
    public function test(Request $request)
    {
        $sessionId = $request->session()->getId();
        $csrfToken = $request->session()->token();
        
        Log::info('Session test', [
            'session_id' => $sessionId,
            'csrf_token' => $csrfToken,
            'user_id' => Auth::id(),
            'cookies' => $request->cookies->all(),
            'headers' => [
                'User-Agent' => $request->header('User-Agent'),
                'Cookie' => $request->header('Cookie'),
                'Origin' => $request->header('Origin'),
                'Referer' => $request->header('Referer'),
            ]
        ]);
        
        return response()->json([
            'session_id' => $sessionId,
            'csrf_token' => $csrfToken,
            'cookies_received' => array_keys($request->cookies->all()),
            'authenticated' => Auth::check(),
            'user_id' => Auth::id(),
        ]);
    }
}