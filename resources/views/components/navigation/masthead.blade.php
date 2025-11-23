<header id="masthead" class="masthead">
    <div class="grid">
        <a href="/{{ $user&&$user->type?'dashboard':'' }}" class="logo">
            <div class="screen-reader-text">{{ config('app.name') }}</div>
            @if($user->student&&$user->student->avatarModel)
                <span class="icon has_avatar" aria-hidden="true">
                    {!! file_get_contents(storage_path('app/'.$user->student->avatarModel->path)) !!}
                    {!! file_get_contents('icons/logo_no_avatar.svg') !!}
                </span>
            @else
                <span class="icon" aria-hidden="true">
                    {!! file_get_contents('icons/logo.svg') !!}
                </span>
            @endif
        </a>
        <x-navigation.navigation :user="$user" />
    </div>
</header>