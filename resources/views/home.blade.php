<x-general.header title="Welcome to {{ config('app.name') }}!" />
        <x-navigation.masthead :user="$user" />
        @if(isset($_GET['error'])&& $_GET['error'] == 'unauthenticated')
            <div class="notification is-error">
                You must be logged in to access that page.
            </div>
        @endif
        <main id="primary" class="margins">
            <div class="block bg_blue inner-padding radius " id="welcome">
                {{ count($avatars)?file_get_contents($avatars[rand(0, count($avatars) - 1)]->path):'' }}
                <shalem-login-form studentroute="{{ route('login.student') }}" staffroute="{{ route('login.staff') }}" loginroute="{{ route('api.login') }}">
                    <div slot="general">
                        <h1 class="white">
                            <shalem-editable-field name="home_welcome_heading" location="home" admin="true">
                            {{ $field['home_welcome_heading']??'Welcome' }}
                            </shalem-editable-field>
                        </h1>
                        <p class="white">
                            <shalem-editable-field name="home_welcome_subheading" location="home" admin="true">
                                {{ $field['home_welcome_subheading']??'Please log in to continue.' }}
                            </shalem-editable-field>
                        </p>
                    </div>
                    <div slot="parent">
                        <shalem-editable-field name="home_parent_login_text" location="home" admin="true">
                            {{ $field['home_parent_login_text']??'Parents can log in here to view their child\'s progress and communicate with staff.' }}
                        </shalem-editable-field>
                    </div>
                    <span slot="email-tip">
                        <shalem-editable-field name="home_login_email_tip" location="home" admin="true">
                            {{ $field['home_login_email_tip']??'Use the email address that you have registered with the school.' }}
                        </shalem-editable-field>
                    </span>
                </shalem-login-form>
            </div>
        </main>
<x-general.footer />    
