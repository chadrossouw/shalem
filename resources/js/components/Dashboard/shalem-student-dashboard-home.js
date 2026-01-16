import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import uploadIcon from "../../icons/upload-icon.svg";
import goalsIcon from "../../icons/goals-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { cards } from '../../utilities/baseStyles.js';

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
        <div class="header margins">
            <shalem-editable-field name="student_dashboard_welcome_message" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.student_dashboard_welcome_message ?? 'Hey there'},<br> ${this.user.first_name}</h1>
            </shalem-editable-field>
            <shalem-editable-field name="student_dashboard_instructions" location="student-dashboard" ?admin=${this.isAdmin}>
                <p>${this.fields?.student_dashboard_instructions ?? 'Welcome to your dashboard! Here you can track your progress, view assignments, and manage your profile.'}</p>
            </shalem-editable-field>
        </div>
        <div class="grid margins">
            <div class="card blob bg_light_blue points radius-big inner_padding">
                <h2 class="white">
                    <shalem-editable-field name="student_dashboard_view_points" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_view_points ?? 'See my points'}
                    </shalem-editable-field>
                </h2>
                <div class="icon" aria-hidden="true"><shalem-points-icon></shalem-points-icon></div>
                <button class="card_target" @click=${() => this._handleAction({dashboard: 'points', panel:null,view: null})}>
                    Let's go
                </button>
            </div>
            <div class="card blob bg_purple upload radius-big inner_padding">
                <h2 class="white">
                    <shalem-editable-field name="student_dashboard_upload" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_upload ?? 'Upload something'}
                    </shalem-editable-field>
                </h2>
                ${uploadIcon ? html`<div class="icon" aria-hidden="true">${unsafeSVG(uploadIcon)}</div>` : ''}
                <button class="card_target bg_yellow" @click=${() => this._handleAction({dashboard: 'documents', panel: 'upload', view: null})}>
                    Let's go
                </button>
            </div>
            <div class="card blob bg_aqua goals radius-big inner_padding">
                <h2 class="white">
                    <shalem-editable-field name="student_dashboard_set_goals" location="student-dashboard" ?admin=${this.isAdmin}>
                        ${this.fields?.student_dashboard_set_goals ?? 'Set my goals'}
                    </shalem-editable-field>
                </h2>
                ${goalsIcon ? html`<div class="icon" aria-hidden="true">${unsafeSVG(goalsIcon)}</div>` : ''}
                <button class="card_target" @click=${() => this._handleAction({dashboard: 'goals', panel: null, view: null})}>
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