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
        this._countDocs();
    } 

    updated(changedProperties){
        if(changedProperties.has('documents')){
            this._countDocs();
        }
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
                ${this.documentCount > 0 ? html`
                    <div class="document_count bg_white purple">
                        ${this.documentCount} 
                    </div>
                    <button class="card_target bg_white purple" @click=${() => this._handleAction({dashboard: 'documents', panel:null,view: null})}>
                        Let's go
                    </button>
                ` : html`<div class="no_documents">You're all caught up!</div>`}
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

    _countDocs(){
        let count = 0;
        for (const docs in this.documents){
            count += this.documents[docs].length;
        }
        this.documentCount = count;
    }

    static styles = [
        ...super.styles,
        cards,
    ];
}