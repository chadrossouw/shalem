import {  html,css, LitElement } from "lit";
import { ShalemBaseDashboard } from "./shalem-base-dashboard";
import { BaseClass } from "../BaseClass";

export class ShalemStudentDashboard extends ShalemBaseDashboard(BaseClass(LitElement)) {
    connectedCallback(){
        super.connectedCallback();
        console.log(this.properties);
        console.log(this.user);
        console.log(this.fields);
        console.log(this.dashboard);
        console.log(this.panel);
        console.log(this.view);
        this.isAdmin = this.user?.roles?.includes('admin') || false;
    }

    render(){
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
            <shalem-avatar-selector
                identifier="${this.identifier}"
            ></shalem-avatar-selector>`;
        }
        else if(this.updates && this.updates.length > 0){
            return html`
            <shalem-updates  
                identifier="${this.identifier}"
            ></shalem-updates>
            `;
        }
        else{
            console.log('Rendering dashboard view:', this.dashboard);
            switch(this.dashboard){
                case 'home':
                    return html`
                    <shalem-student-dashboard-home
                        identifier="${this.identifier}"
                    ></shalem-student-dashboard-home>`;
                default:
                    return html`
                    <shalem-student-dashboard-home
                        identifier="${this.identifier}"
                    ></shalem-student-dashboard-home>`;
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