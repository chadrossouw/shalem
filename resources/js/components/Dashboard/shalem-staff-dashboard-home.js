import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import uploadIcon from "../../icons/upload-icon.svg";
import goalsIcon from "../../icons/goals-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { cards } from '../../utilities/baseStyles.js';

export class ShalemStaffDashboardHome extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        
        ({fields: this.fields, user: this.user} = this._dashboard);
        console.log(this.user);
    } 

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }

    firstUpdated(){
        this._setDocumentTitle('My dashboard');
    }

    render(){
        return html`
        <slot></slot>
        <div class="header margins">
            <shalem-editable-field name="staff_dashboard_welcome_message" location="staff-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.staff_dashboard_welcome_message ?? 'Hey there'},<br> ${this.user.first_name}</h1>
            </shalem-editable-field>
            <shalem-editable-field name="staff_dashboard_instructions" location="staff-dashboard" ?admin=${this.isAdmin}>
                <p>${this.fields?.staff_dashboard_instructions ?? 'Welcome to your dashboard! Here you can verify documents and manage your pupils.'}</p>
            </shalem-editable-field>
        </div>
        <div class="grid margins">
            <div class="card bg_purple documents radius-big inner_padding">
                <h2 class="white">
                    <shalem-editable-field name="staff_dashboard_view_documents" location="staff-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.staff_dashboard_view_documents ?? 'Verify documents'}
                    </shalem-editable-field>
                </h2>
                <button class="card_target bg_white purple" @click=${() => this._handleAction({dashboard: 'documents', panel:null,view: null})}>
                    Let's go
                </button>
            </div>
            <div class="card blob bg_aqua pupils radius-big inner_padding">
                <h2 class="white">
                    <shalem-editable-field name="staff_dashboard_pupils" location="staff-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.staff_dashboard_pupils ?? 'See my pupils'}
                    </shalem-editable-field>
                </h2>
                <button class="card_target bg_white aqua" @click=${() => this._handleAction({dashboard: 'pupils', panel: null, view: null})}>
                    Let's go
                </button>
            </div>
        </div> 
        `;
    }

    static styles = [
        ...super.styles,
        cards,
    ];
}