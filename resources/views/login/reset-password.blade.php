<x-general.header title="Reset your {{ config('app.name') }} password" />
    <x-navigation.masthead />
    <main id="primary" class="margins">
        <div class="block bg_blue inner-padding radius " id="welcome">
            {!! count($avatars)?file_get_contents(storage_path('app/'.$avatars[rand(0, count($avatars) - 1)]->path)):'' !!}
            <shalem-reset-password-form resetroute="{{ route('api.password.update') }}" token="{{ $token }}" email="{{ $email }}">
                <div slot="reset">
                    <shalem-editable-field name="home_parent_login_text" location="home" admin="true">
                        {{ $field['home_parent_login_text']??'Parents can log in here to view their child\'s progress and communicate with staff.' }}
                    </shalem-editable-field>
                </div>
                <div slot="first-set">
                    <h1 class="white">
                        <shalem-editable-field name="reset_password_heading" location="home" admin="true">
                        {{ $field['reset_password_heading']??'Reset Your Password' }}
                        </shalem-editable-field>
                    </h1>
                    <p class="white">
                        <shalem-editable-field name="reset_password_subheading" location="home" admin="true">
                            {{ $field['reset_password_subheading']??'Please enter your new password below.' }}
                        </shalem-editable-field>
                    </p>
                </div>
            </shalem-reset-password-form>
        </div>
    </main>
<x-general.footer />    
