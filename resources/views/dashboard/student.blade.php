<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        <main id="primary" class="margins">
            <shalem-base-provider 
                identifier="student" 
                user="{{ $user->toJson() }}" 
                fields="{{ $fields->toJson() }}" 
                dashboard="{{ $dashboard }}" 
                panel="{{ $panel }}"
                view="{{ $view }}"
                pillars="{{ $pillars->toJson() }}"
                @if(isset($token))
                    token="{{ $token }}"
                @endif
            >

                <shalem-student-dashboard 
                identifier="student" />
            </shalem-context-provider>
        </main>
<x-general.footer />