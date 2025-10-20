<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Gate::define('admin', function ($user) {
            return $user->staffRole()->role === 'admin';
        });

        Gate::define('grade_head', function ($user) {
            return $user->staffRole()->role === 'grade_head';
        });

        Gate::define('staff', function ($user) {
            return $user->type === 'staff';
        });

        Gate::define('parent', function ($user) {
            return $user->type === 'parent';
        });

        Gate::define('student', function ($user) {
            return $user->type === 'student';
        });
    }
}
