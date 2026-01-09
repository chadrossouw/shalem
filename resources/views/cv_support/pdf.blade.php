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
                   {{ $cvSupport->name }}
                </h1>
                <h3>CV Support Document for {{ $cvSupport->user->first_name }} {{ $cvSupport->user->last_name }}</h3>
                <h4>Created on: {{ $cvSupport->created_at->format('j F Y') }}</h4>
                <p>{{ $cvSupport->description }}</p>
                <hr />
            </div>
            <div class="">
                @if(count($docsAggregated) > 0)
                    <ul>
                        @foreach($docsAggregated as $year=>$documents)
                            <h3>{{ $year }}</h3>
                            <ul>
                                @foreach($documents as $document)
                                    <li>
                                        <strong>{{ $document->title }}</strong><br />
                                        <em>{{ $document->description }}</em><br />
                                    </li>
                                @endforeach
                            </ul>
                        @endforeach
                    </ul>
                @endif
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
