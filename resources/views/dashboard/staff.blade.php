<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        <main id="primary" class="margins">
            <shalem-base-provider 
                identifier="staff" 
                user="{{ $user->toJson() }}" 
                fields="{{ $fields->toJson() }}" 
                notifications="{{ json_encode($notifications) }}"
                unreadnotifications="{{ json_encode($unreadNotifications) }}"
                notificationspagination="{{ json_encode($notificationsPagination) }}"
                unreadnotificationspagination="{{ json_encode($unreadNotificationsPagination) }}"
                archivednotifications="{}"
                archivednotificationspagination="{}"
                updates="{{ $updates->toJson() }}"
                dashboard="{{ $dashboard }}" 
                panel="{{ $panel }}"
                view="{{ $view }}"
                action="{{ $action }}"
                pillars="{{ $pillars->toJson() }}"
                documents="{{ json_encode($documents) }}"
                mentees="{{ json_encode($mentees) }}"
                @if(isset($token))
                    token="{{ $token }}"
                @endif
            >

                <shalem-staff-dashboard 
                identifier="staff" />
            </shalem-base-provider>
        </main>
<x-general.footer />