import { html, css, LitElement } from 'lit';
import { BaseClass } from '../BaseClass';
import { safeFetch } from '../../common/xsrf';
import { eyeSvg } from '../../icons/icons';
import { validateForm,gRecaptcha,hideRevealPassword,validationHandler,validationHandlerClear,validatePassword } from '../../utilities/formUtilities';
export class ShalemResetPasswordForm extends BaseClass(LitElement) {
    static properties = {
        email: { type: String },
        token: { type: String },
        firstset: { type: Boolean },

        loading: { type: Boolean, state: true },
    };

    constructor() { 
        super();
        if(!this.showlogin){
            this.showlogin = false;
        }
    }

    get form() {
        return this.shadowRoot.querySelector('form');
    }

    get formResponse() {
        return this.shadowRoot.querySelector('.message');
    }

    get submitButton() {
        return this.shadowRoot.querySelector('[type="submit"]');
    }

    updated(){
        super.updated();
    }

    render(){
        let slots = '';
        if(this.firstset){
            slots = html`<slot name="first-set"></slot>`;
        }
        else{
            slots = html`<slot name="reset"></slot>`;
        }
        return html`
            <div class="login-form">
                <h1 class="white">${this.firstset ? 'Set Your Password' : 'Reset Your Password'}</h1>
                ${slots}
                <form @submit=${this._handleReset}>
                    <div class="message" role="alert" aria-live="polite"></div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <p class="small">Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
                        <div class="pword_wrapper">
                            <input type="password" name="password" id="password" aria-required>
                            <button data-switch="password" aria-label="Show password" aria-pressed="false" type="button" class="show-password" @blur=${this._validatePassword} @click=${hideRevealPassword}>
                            <span class="screen-reader-text">Show password</span>${eyeSvg}</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password_confirmation">Password Confirmation</label>
                        <div class="pword_wrapper">
                            <input type="password" name="password_confirmation" id="password_confirmation" aria-required @blur=${this._validatePasswordMatch}>
                            <button data-switch="password_confirmation" aria-label="Show password" aria-pressed="false" type="button" class="show-password" @click=${hideRevealPassword}>
                            <span class="screen-reader-text">Show password</span>${eyeSvg}</button>
                        </div>
                    </div>
                    <input type="hidden" id="email" name="email" value="${this.email}" />
                    <input type="hidden" id="token" name="token" value="${this.token}" />
                    <button type="submit">${this.firstset ? 'Set Password' : 'Reset Password'}</button>
                </form>
            </div>
        `;
    }

    async _handleReset(event){
        event.preventDefault();
        let passwordMatch = this._validatePasswordMatch();
        let passwordValid = this._validatePassword();
        this.loading = true;
        let valid = validateForm(this.form,this.formResponse);
        if(!valid || !passwordMatch || !passwordValid) return;
        this._setLoadingState(true);
        let gTokenValid  = await gRecaptcha(this.formResponse,`${this.restUrl}grecaptcha`);
        if(!gTokenValid){
            this._setLoadingState(false);
            return;
        }
        const formData = new FormData(this.form);
        const email = formData.get('email');
        const password = formData.get('password');
        const password_confirmation = formData.get('password_confirmation');
        const token = formData.get('token');
        const body = {
            email:email,
            password:password,
            password_confirmation:password_confirmation,
            token:token
        }
        let response = await safeFetch(`${this.restUrl}update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        response = await response.json();
        if(response.success){
            window.location.href = response.redirectUrl || '/dashboard';
        } else {
            alert(response.message || 'Reset failed');
        }
        this.loading = false;
    }

    _validatePassword(){
        const password = this.form.querySelector('#password');
        const valid = validatePassword(password, messageContainer);
        if(!valid){
            validationHandler(false, password, 'Password does not meet the requirements.');
        } else {
            validationHandlerClear(password);
        }
        return valid;
    }

    _validatePasswordMatch(){
        const password = this.form.querySelector('#password');
        const password_confirmation = this.form.querySelector('#password_confirmation');
        if(password.value !== password_confirmation.value){
            validationHandler(false, password_confirmation, 'Passwords do not match');
            return false;
        } else {
            validationHandlerClear(password_confirmation);
            return true;
        }
    }
    static styles = [
        super.styles,
    ]
}