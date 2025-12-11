import { LitElement,html, css } from "lit";
import { BaseClass } from "../BaseClass.js";
import FredExhausted from "../../icons/fred-exhausted.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
export class ShalemLoader extends BaseClass(LitElement) {
    static properties = {
        spinner: { type: Boolean },
    };
    static styles = [
        super.styles,
        css`
        .loader_container{
            display:grid;
            grid-template-columns: 40px 1fr 80px;
            margin:2rem 0;
        }
        .spinner{
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 4px solid var(--blue);
                border-top-color: var(--yellow);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 11;
            }
    `
    ];
    render(){
        if(this.spinner){
            return html`
            <div class="spinner_container" role="status" aria-live="polite">
                <div class="spinner" aria-hidden="true"></div>
            </div>
            `;
        }
        return html`
        <div class="loader_container bg_green radius-big inner_padding" role="status" aria-live="polite">
            <div class="spinner" aria-hidden="true"></div>
            <div class="loader_text">
                <p class="big"><slot></slot></p>
            </div>
            ${unsafeSVG(FredExhausted)}
        </div>
        `;
    }
}