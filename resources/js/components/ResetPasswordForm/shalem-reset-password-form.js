import { html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { safeFetch } from '../../common/xsrf';
export class ShalemResetPasswordForm extends BaseClass {
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
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required value="${this.email}"/>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required />

                    </div>
                    <div class="form-group">
                        <label for="password_confirmation">Password Confirmation</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" required />
                    </div>
                    <input type="hidden" id="token" name="token" value="${this.token}" />
                    <button type="submit">${this.firstset ? 'Set Password' : 'Reset Password'}</button>
                </form>
            </div>
        `;
    }

    async _handleReset(event){
        event.preventDefault();
        this.loading = true;
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password_confirmation');
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

    static styles = [
        super.styles,
    ]
}