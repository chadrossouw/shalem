import {  html,css, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer";
import { BaseClass } from "../BaseClass";

export class ShalemStaffDashboard extends BaseDashboardConsumer(BaseClass(LitElement)) {
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
        
        let nav = html`
        <shalem-navbar identifier="${this.identifier}" ></shalem-navbar>
        <shalem-breadcrumbs identifier="${this.identifier}" ></shalem-breadcrumbs>
        `;
        switch(this.dashboard){
            case 'home':
                return html`
                <shalem-staff-dashboard-home
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-student-dashboard-home>`;
            case 'documents':
                return html`
                <shalem-staff-dashboard-documents
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-staff-dashboard-documents>`;
            case 'pupils':
                return html`
                <shalem-staff-dashboard-pupils
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-staff-dashboard-pupils>`;
            case 'notifications':
                return html`
                <shalem-dashboard-notifications
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-dashboard-notifications>`;
            case 'help':
                return html`
                <shalem-dashboard-help
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-dashboard-help>`;
            default:``
                return html`
                <shalem-staff-dashboard-home
                    identifier="${this.identifier}"
                >
                    ${nav}
                </shalem-staff-dashboard-home>`;
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