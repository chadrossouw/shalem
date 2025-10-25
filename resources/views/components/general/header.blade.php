<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ $title }}</title>
        @foreach ($meta as $metaTag)
            {!! $metaTag !!}
        @endforeach

        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <style>
            </style>
        @endif
        <script src='https://www.google.com/recaptcha/api.js?render={{ env('RECAPTCHA_SITE_KEY') }}'></script>
        {{ $slot }}
    </head>
    <body class="{{ implode(' ', $classes) }}">