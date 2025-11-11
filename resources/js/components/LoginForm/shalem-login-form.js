import {LitElement, html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { safeFetch } from '../../common/xsrf';
import { eyeSvg } from '../../icons/icons';
import { validateForm,gRecaptcha,hideRevealPassword} from '../../utilities/formUtilities';
export class ShalemLoginForm extends BaseClass(LitElement ) {
    static properties = {
        studentroute: { type: String },
        staffroute: { type: String },
        showlogin: { type: Boolean, state: true },
        showreset: { type: Boolean, state: true },
    };

    constructor() { 
        super();
        if(!this.showlogin){
            this.showlogin = false;
        }
        if(!this.showreset){
            this.showreset = false;
        }
        this.firstLogin = false;
    }

    async connectedCallback(){
        super.connectedCallback();
       // let response = await safeFetch(`${this.baseUrl}sanctum/csrf-cookie`, { credentials: 'include' }, true);
    }

    updated(){
        super.updated();
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

    render(){
        if(this.showlogin){
            return html`
                <div class="login-form">
                    <slot name="parents"></slot>
                    <form @submit=${this._handleLogin}>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <shalem-tooltip><slot name="email-tip"></slot></shalem-tooltip>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="pword_wrapper">
                                <input type="password" name="password" id="password" aria-required>
                                <button data-switch="password" aria-label="Show password" aria-pressed="false" type="button" class="show-password" @click=${hideRevealPassword}>
                                <span class="screen-reader-text">Show password</span>${eyeSvg}</button>
                            </div>
                        </div>
                        <button type="submit">Login</button>
                        <div class="message"></div>
                    </form>
                    <button @click=${this._showResetForm} class="forgot-password-link">Forgot Password?</button>
                    <button @click=${this._showResetForm} data-first-login="true" class="forgot-password-link">First time login?</button>
                    <button @click=${this._showHideForm} class="button bg_White blue">Back</button>
                </div>
                `;

        }
        if(this.showreset){
            return html`
                <div class="login-form">
                    ${this.firstLogin ? html`<h2>First time login?</h2>` : html`<h2>Reset Password</h2>`}
                    <form @submit=${this._handleReset} data-first-login=${this.firstLogin}>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <button type="submit">${this.firstLogin ? 'Set Password' : 'Reset Password'}</button>
                        <div class="message"></div>
                    </form>
                    <button @click=${this._showForm} class="button bg_White blue">Back</button>
                </div>
                `;
        }
        return html`
            <div class="login-form">
                <slot name="general"></slot>
                <div class="login-buttons">
                    <a href="${this.studentroute}" @click=${this._clearCookiesBeforeFollow} class="button bg_pink white">Pupil login</a>
                    <button @click=${this._showHideForm} class="button bg_White blue">Parent login</button>
                    <a href="${this.staffroute}" @click=${this._clearCookiesBeforeFollow} class="button bg_white blue">Staff login</a>
                </div>
            </div>
        `;
    }
    
    _showResetForm(e){
        e.preventDefault();
        if(e.currentTarget.dataset.firstLogin){
            this.firstLogin = true;
        }
        else{
            this.firstLogin = false;
        }
        this.showlogin = false;
        this.showreset = true;
    }

    _showForm(){
        this.showreset = false;
        this.firstLogin = false;
        this.showlogin = true;
    }

    _showHideForm(){
        this.showreset = false;
        this.firstLogin = false;
        this.showlogin = !this.showlogin;
    }

    async _handleLogin(event){
        event.preventDefault();
        let valid = validateForm(this.form,this.formResponse);
        if(!valid) return;
        this._setLoadingState(true);
        let gTokenValid  = await gRecaptcha(this.formResponse,`${this.restUrl}grecaptcha`);
        if(!gTokenValid){
            this._setLoadingState(false);
            return;
        }
        const formData = new FormData(this.form);
        const email = formData.get('email');
        const password = formData.get('password');
        const body = {
            email:email,
            password:password
        }
        let response = await safeFetch(`${this.restUrl}login`, {
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
           this.formResponse.innerHTML = response.message;
        }
        this._setLoadingState(false);
    }

    async _handleReset(event){
        event.preventDefault();
        let valid = validateForm(this.form,this.formResponse);
        if(!valid) return;
        this._setLoadingState(true);
        let gTokenValid  = await gRecaptcha(this.formResponse,`${this.restUrl}grecaptcha`);
        if(!gTokenValid){
            this._setLoadingState(false);
            return;
        }
        const formData = new FormData(this.form);
        const email = formData.get('email');
        const body = {
            email:email,
            firstlogin: this.firstLogin
        }
        let response = await safeFetch(`${this.restUrl}reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        response = await response.json();
        if(response.message){
            this.formResponse.innerHTML = response.message || 'Reset link sent to your email.';
        } else {
            this.formResponse.innerHTML = response.error || 'Reset failed';
        }
        this._setLoadingState(false);
    }

    _clearCookiesBeforeFollow(e){
        e.preventDefault();
        document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/; domain=' + window.location.hostname;
        document.cookie = 'laravel_session=; Max-Age=0; path=/; domain=' + window.location.hostname;
        window.location.href = e.currentTarget.href;
    }

    _setLoadingState(isLoading){
        if(isLoading){
            this.form.classList.add('loading');
            this.form.setAttribute('aria-busy', 'true');
            this.submitButton.disabled = true;
        } else {
            this.form.classList.remove('loading');
            this.form.setAttribute('aria-busy', 'false');
            this.submitButton.disabled = false;
        }
    }

    static styles = [
        super.styles,
    ]
}