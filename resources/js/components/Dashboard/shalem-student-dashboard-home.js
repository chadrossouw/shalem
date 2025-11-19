import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import uploadIcon from "../../icons/upload-icon.svg";
import goalsIcon from "../../icons/goals-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";

export class ShalemStudentDashboardHome extends BaseDashboardConsumer(BaseClass(LitElement)){

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

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }

    firstUpdated(){
        this._setDocumentTitle('My dashboard');
    }

    render(){
        return html`
        <slot></slot>
        <shalem-editable-field name="student_dashboard_welcome_message" location="student-dashboard" ?admin=${this.isAdmin}>
            <h1>${this.fields?.student_dashboard_welcome_message ?? 'Hey there'},<br> ${this.user.first_name}</h1>
        </shalem-editable-field>
        <shalem-editable-field name="student_dashboard_instructions" location="student-dashboard" ?admin=${this.isAdmin}>
            <p>${this.fields?.student_dashboard_instructions ?? 'Welcome to your dashboard! Here you can track your progress, view assignments, and manage your profile.'}</p>
        </shalem-editable-field>
        <div class="grid">
            <div class="card bg_light_blue points">
                <h2>
                    <shalem-editable-field name="student_dashboard_view_points" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_view_points ?? 'See my points'}
                    </shalem-editable-field>
                </h2>
                <shalem-points-icon></shalem-points-icon>
                <button class="card_target" @click=${() => this._handleAction({panel: 'points', view: null})}>
                    Let's go
                </button>
            </div>
            <div class="card bg_purple upload">
                <h2>
                    <shalem-editable-field name="student_dashboard_upload" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_upload ?? 'Upload something'}
                    </shalem-editable-field>
                </h2>
                ${uploadIcon ? html`<div class="icon" aria-hidden="true">${unsafeSVG(uploadIcon)}</div>` : ''}
                <button class="card_target" @click=${() => this._handleAction({dashboard: 'documents', panel: 'upload', view: null})}>
                    Let's go
                </button>
            </div>
            <div class="card bg_aqua goals">
                <h2>
                    <shalem-editable-field name="student_dashboard_set_goals" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_set_goals ?? 'Set my goals'}
                    </shalem-editable-field>
                </h2>
                ${goalsIcon ? html`<div class="icon" aria-hidden="true">${unsafeSVG(goalsIcon)}</div>` : ''}
                <button class="card_target" @click=${() => this._handleAction({panel: 'goals', view: null})}>
                    Let's go
                </button>
            </div>
        </div> 
        `;
    }
}