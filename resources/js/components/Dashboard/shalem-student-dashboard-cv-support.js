import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";

export class ShalemStudentDashboardCVSupport extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user} = this._dashboard);
    }

    disconnectedCallback(){
        super.disconnectedCallback();
    }

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }


    render(){
        let panel = '';
        if(this.panel == 'create'){
            panel = html`
                <shalem-student-panel-cv-support-create
                    identifier="${this.identifier}"
                >
                </shalem-student-panel-cv-support-create>
            `;
        }
        else if (this.panel == 'cv-support'||!this.panel){
            panel = html`
                <shalem-student-panel-cv-support
                    identifier="${this.identifier}"
                >
                </shalem-student-panel-cv-support>
            `
        }
        return html`
        <slot></slot>
        ${panel}
        `;
    }
}