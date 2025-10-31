<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        <main id="primary" class="margins">
            <x-navigation.navbar :user="$user" />
            <x-navigation.breadcrumbs />
            <shalem-student-dashboard 
                identifier="student" 
                user="{{ $user->toJson() }}" 
                fields="{{ $fields->toJson() }}" 
                dashboard="{{ $dashboard }}" 
                panel="{{ $panel }}"
                view="{{ $view }}"
                />
        </main>
<x-general.footer />