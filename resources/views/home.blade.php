<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        @if(isset($_GET['error'])&& $_GET['error'] == 'unauthenticated')
            <div class="notification is-error">
                You must be logged in to access that page.
            </div>
        @endif
        <main id="primary" class="">
            <div class="">
                <h1 class="">
                    <shalem-editable-field name="home_welcome_heading" location="home" admin="true">
                       {{ $field['home_welcome_heading']??'Welcome' }}
                    </shalem-editable-field>
                </h1>
                <a href="{{ route('login.student') }}">Student Login</a> |
                <a href="{{ route('login.staff') }}">Staff Login</a>
                <shalem-login-form></shalem-login-form>
            </div>
        </main>
<x-general.footer />    
