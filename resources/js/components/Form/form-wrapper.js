import { BaseForm } from "./base-form";
import { BaseClass } from "../BaseClass.js";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { LitElement, html } from "lit";

export class ShalemFormWrapper extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))) {

    static properties = {
        ...super.properties,
    }   

    get form(){
        let slottedElements = this.shadowRoot.querySelector('slot')?.assignedNodes({flatten:true});
        if(slottedElements){
            console.log('slottedElements', slottedElements);
            return slottedElements.find(el => el.tagName === 'FORM');
        }
    }

    firstUpdated(){
        this.form?.addEventListener('submit', this._wrapperHandleSubmit.bind(this));
    }

    render(){
        return html`
        <div class="form_wrapper">
            
            <slot></slot>
        </div>
        `;
    }

    _wrapperHandleSubmit(e){
        e.preventDefault();
        this._handleSubmit(e);
    }
}