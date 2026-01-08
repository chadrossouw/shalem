<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Shalem') }}</title>


        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/pdf.css'])
        @else
            <style>
            </style>
        @endif
    </head>
    <body class="">
        <header id="masthead">
        </header>
        <main id="primary" class="">
            <div class="">
                <h1 class="">
                    Dashboard
                </h1>
            </div>
        </main>
        <footer id="colophon" class="">
            <div class="container mx-auto px-4">
                <p class="text-center text-sm text-gray-500">
                    &copy; {{ date('Y') }} {{ config('app.name', 'Shalem') }}. All rights reserved.
                </p>
            </div>
        </footer>
    </body>
</html>
