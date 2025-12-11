<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        <main id="primary" class="margins">
            <shalem-base-provider 
                identifier="student" 
                user="{{ $user->toJson() }}" 
                fields="{{ $fields->toJson() }}" 
                notifications="{{ json_encode($notifications) }}"
                unreadnotifications="{{ $unreadNotifications->toJson() }}"
                notificationspagination="{{ json_encode($notificationsPagination) }}"
                updates="{{ $updates->toJson() }}"
                dashboard="{{ $dashboard }}" 
                panel="{{ $panel }}"
                view="{{ $view }}"
                action="{{ $action }}"
                pillars="{{ $pillars->toJson() }}"
                @if(isset($token))
                    token="{{ $token }}"
                @endif
            >

                <shalem-student-dashboard 
                identifier="student" />
            </shalem-base-provider>
        </main>
<x-general.footer />