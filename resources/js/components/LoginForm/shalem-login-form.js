import { LitElement, html, css } from 'lit';
export class ShalemLoginForm extends LitElement {
    constructor() {
        super();
    }

    render(){
        return html`
            <form>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <br />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <br />
                <button type="submit">Login</button>
            </form>
        `;
    }
}