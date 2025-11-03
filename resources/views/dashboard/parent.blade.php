<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        <main id="primary" class="margins">
            <x-navigation.navbar :user="$user" />
            <x-navigation.breadcrumbs />
            <h1>Parent Dashboard</h1>
            <p>This is the parent dashboard.</p>
        </main>
<x-general.footer />