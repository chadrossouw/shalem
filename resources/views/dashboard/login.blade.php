<x-general.header title="Welcome to {{ config('app.name') }}!" />
    <shalem-login-redirector user="{{ $user->toJson() }}" />
<x-general.footer />
