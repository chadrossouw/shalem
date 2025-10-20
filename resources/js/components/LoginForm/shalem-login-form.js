import { html, css } from 'lit';
import { BaseClass } from '../BaseClass';
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
        const username = formData.get('username');
        const password = formData.get('password');

        // Implement your login logic here
        console.log('Logging in with', username, password);
    }

    static styles = [
        super.styles,
    ]
}