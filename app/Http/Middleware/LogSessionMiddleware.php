<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogSessionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $sessionIdBefore = $request->session()->getId();
        $csrfTokenBefore = $request->session()->token();
        
        Log::info('Before request processing', [
            'url' => $request->url(),
            'method' => $request->method(),
            'session_id_before' => $sessionIdBefore,
            'csrf_token_before' => $csrfTokenBefore,
            'user_id' => Auth::id(),
        ]);

        $response = $next($request);

        $sessionIdAfter = $request->session()->getId();
        $csrfTokenAfter = $request->session()->token();
        
        Log::info('After request processing', [
            'url' => $request->url(),
            'method' => $request->method(),
            'session_id_after' => $sessionIdAfter,
            'csrf_token_after' => $csrfTokenAfter,
            'session_changed' => $sessionIdBefore !== $sessionIdAfter,
            'csrf_changed' => $csrfTokenBefore !== $csrfTokenAfter,
        ]);

        return $response;
    }
}