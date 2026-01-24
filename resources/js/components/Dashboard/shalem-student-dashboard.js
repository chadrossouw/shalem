import {  html,css, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer";
import { BaseClass } from "../BaseClass";

export class ShalemStudentDashboard extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
    }

    connectedCallback(){
        super.connectedCallback();
        this.isAdmin = this.user?.roles?.includes('admin') || false;
    }

    render(){
        if(!this._dashboard){
            return html`<p>Loading dashboard...</p>`;
        }
        if(!this.user.student.avatar){
            return html`
            <h1>
                <shalem-editable-field name="student_dashboard_new_avatar" location="student-dashboard" ?admin=${this.isAdmin}>
                    ${this.fields?.student_dashboard_new_avatar ?? 'Hey there' }, ${this.user.first_name}!
                </shalem-editable-field>
            </h1>
            <h2>
                <shalem-editable-field name="student_dashboard_select_avatar_instruction" location="student-dashboard" ?admin=${this.isAdmin}>
                    ${this.fields?.student_dashboard_select_avatar_instruction ?? 'Before we get started, pick an avatar' }
                </shalem-editable-field>
            </h2>
            <div class="margins">
                <shalem-avatar-selector
                    identifier="${this.identifier}"
                ></shalem-avatar-selector>
            </div>`;
        }
        else if(this.updates && this.updates.length > 0){
            return html`
            <shalem-updates  
                identifier="${this.identifier}"
            ></shalem-updates>
            `;
        }
        else{
            let nav = html`
            <shalem-navbar identifier="${this.identifier}" ></shalem-navbar>
            <shalem-breadcrumbs identifier="${this.identifier}" ></shalem-breadcrumbs>
            `;
            switch(this.dashboard){
                case 'home':
                    return html`
                    <shalem-student-dashboard-home
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-home>`;
                case 'documents':
                    return html`
                    <shalem-student-dashboard-documents
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-documents>`;
                case 'points':
                    return html`
                    <shalem-student-dashboard-points
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-points>`;
                case 'goals':
                    return html`
                    <shalem-student-dashboard-goals
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-goals>`;
                case 'cv-support':
                    return html`
                    <shalem-student-dashboard-cv-support
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-cv-support>`;
                case 'notifications':
                    return html`
                    <shalem-dashboard-notifications
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-dashboard-notifications>`;
                case 'avatar':
                    this._setDocumentTitle('Change my avatar');
                    return html`
                    ${nav}
                    <h1 class="margins">
                        <shalem-editable-field name="student_dashboard_change_avatar" location="student-dashboard" ?admin=${this.isAdmin}>
                            ${this.fields?.student_dashboard_change_avatar ?? 'Change my avatar' }
                        </shalem-editable-field>
                    </h1>
                    
                    <div class="margins">
                        <shalem-avatar-selector
                            identifier="${this.identifier}"
                        ></shalem-avatar-selector>
                    </div>`;
                case 'help':
                    return html`
                    <shalem-dashboard-help
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-dashboard-help>`;
                default:``
                    return html`
                    <shalem-student-dashboard-home
                        identifier="${this.identifier}"
                    >
                        ${nav}
                    </shalem-student-dashboard-home>`;
            }
        }
    }
    
    static styles = [
        ...super.styles,
        css`
            :host {
                background-color: lightblue;
            }
        `
    ]
}