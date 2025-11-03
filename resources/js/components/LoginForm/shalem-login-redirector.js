import {LitElement, html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { safeFetch } from '../../common/xsrf';
import { eyeSvg } from '../../icons/icons';
import { validateForm,gRecaptcha,hideRevealPassword} from '../../utilities/formUtilities';
export class ShalemLoginRedirector extends BaseClass(LitElement ) {
    static properties = {
        user: { type: Object },
    };

    constructor() { 
        super();
    }

    async connectedCallback(){
        super.connectedCallback();
        if(this.user && this.user.id){
            let response = await safeFetch(`${this.restUrl}login-redirect`,{
                method: 'POST',
                body: JSON.stringify({
                    id: this.user.id,
                }),
            });
            if(response.ok){
                response = await response.json();
                if(response.redirect){
                    window.location.href=response.redirect;
                }
                else{
                    window.location.href=this.baseUrl;
                }
            }
            else{
                window.location.href=this.baseUrl;
            }
        }
    }

    render(){
        return html`
            <shalem-loader>Redirecting to your dashboard...</shalem-loader>
        `;
    }

}