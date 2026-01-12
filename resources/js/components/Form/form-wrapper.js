import { BaseForm } from "./base-form";
import { BaseClass } from "../BaseClass.js";
import { LitElement, html } from "lit";

export class ShalemFormWrapper extends BaseForm(BaseClass(LitElement)) {

    static properties = {
        ...super.properties,
    }   

    render(){
        return html`
        <div class="form_wrapper">
            <slot></slot>
        </div>
        `;
    }
}