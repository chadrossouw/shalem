import { css,html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import verifyIcon from "../../icons/verify-icon.svg"
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { safeFetch } from "../../common/xsrf.js";
import view from '../../icons/view.svg';
import pupilsIcon from '../../icons/pupils-icon.svg';

export class ShalemStaffDashboardPupils extends BaseDashboardConsumer(BaseClass(LitElement)){

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

    firstUpdated(){
        this._setDocumentTitle('My Documents');
    }

    render(){
        let panel = '';
        if(this.panel == 'list'||!this.panel){
                let header = html`
                <div class="header_with_icon margins">
                    ${unsafeSVG(pupilsIcon)}
                    <shalem-editable-field name="staff_dashboard_my_pupils_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.staff_dashboard_my_pupils_header ?? 'My pupils'}</h1>
                    </shalem-editable-field>
                </div>
                `;
                panel = html`
                    ${header}
                    <div class="margins">
                        <ul class="pupils_list cards grid grid_50">
                        ${this.mentees.length == 0 ? html`
                            <p>No pupils assigned to you yet.</p>
                        ` : html`
                            ${this.mentees.map(mentee => html`
                                <div class="card grid grid_50 shadow radius bg_white">
                                    <div class="card_content">
                                        <h2 class="h3">${mentee.first_name} ${mentee.last_name}</h2>
                                    </div>
                                    <shalem-avatar avatarid="${mentee.student.avatar??8}"></shalem-avatar>
                                    <button class="card_target purple bg_white" @click=${() => this._handleAction({dashboard: 'pupils', panel: 'view-pupil', view: null, pupilId: mentee.id})}>
                                        View pupil
                                    </button>
                                </div>
                            `)}
                        `}
                    </div>
                `
            
        }
        else if (this.panel == 'my-documents'||!this.panel){
            if(this.view == 'success'){
                this.jsConfetti.addConfetti(
                    this.confettiOptions
                );
            }
            panel = html`
                <shalem-student-panel-my-documents
                    identifier="${this.identifier}"
                >
                </shalem-student-panel-my-documents>
            `
        }
        return html`
        <slot></slot>
        ${panel}
        `;
    }


    static styles = [
        super.styles,
    ];
}