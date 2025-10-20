<header id="masthead" class="masthead">
    <div class="grid">
        <a href="/{{ $user&&$user->type?'dashboard':'' }}" class="logo grid">
            <div class="screen-reader-text">{{ config('app.name') }}</div>
            <span class="icon" aria-hidden="true">
                {!! file_get_contents('icons/logo.svg') !!}
            </span>
        </a>
        <x-navigation.navigation :user="$user" />
    </div>
</header>