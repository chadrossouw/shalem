import { html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { safeFetch } from '../../common/xsrf';
export class ShalemLoginForm extends BaseClass {
    static properties = {
        studentroute: { type: String },
        staffroute: { type: String },
        showlogin: { type: Boolean, state: true },
        loading: { type: Boolean, state: true },
    };

    constructor() { 
        super();
        if(!this.showlogin){
            this.showlogin = false;
        }
    }

    updated(){
        super.updated();
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
                            <input type="password" id="password" name="password" required />
                        </div>
                        <a href="/password/reset" class="forgot-password-link">Forgot Password?</a>
                        <button type="submit">Login</button>
                    </form>
                    <button @click=${this._showHideForm} class="button bg_White blue">Back</button>
                </div>
                `;

        }
        return html`
            <div class="login-form">
                <slot name="general"></slot>
                <div class="login-buttons">
                    <a href="${this.studentroute}" class="button bg_pink white">Pupil login</a>

                    <button @click=${this._showHideForm} class="button bg_White blue">Parent login</button>
                    <a href="${this.staffroute}" class="button bg_white blue">Staff login</a>

                </div>
                
            </div>
        `;
    }

    _showHideForm(){
        this.showlogin = !this.showlogin;
    }

    async _handleLogin(event){
        event.preventDefault();
        this.loading = true;
        const formData = new FormData(event.target);
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
        console.log(response);
        if(response.success){
            window.location.href = response.redirectUrl || '/dashboard';
        } else {
            alert(response.message || 'Login failed');
        }
        this.loading = false;
    }

    static styles = [
        super.styles,
    ]
}