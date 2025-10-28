import {  html } from "lit";
import { ShalemBaseDashboard } from "./shalem-base-dashboard";

export class ShalemStudentDashboard extends ShalemBaseDashboard{
    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
    }

    render(){
        if(!this.user.student.avatar){
            return html`
            <h1>
                <shalem-editable-field name="student_dashboard_new_avatar" location="student-dashboard" admin="true">
                    ${this.fields?.student_dashboard_new_avatar ?? 'Hey there' }, ${this.user.first_name}!
                </shalem-editable-field>
            </h1>
            <h2>
                <shalem-editable-field name="student_dashboard_select_avatar_instruction" location="student-dashboard" admin="true">
                    ${this.fields?.student_dashboard_select_avatar_instruction ?? '' }
                </shalem-editable-field>
            </h2>
            <shalem-avatar-selector
                identifier="${this.identifier}"
            ></shalem-avatar-selector>`;
        }
        else{
            return html`
            <shalem-student-dashboard-${this.dashboard}
                identifier="${this.identifier}"
            ></shalem-studentdashboard-${this.dashboard}>`;
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