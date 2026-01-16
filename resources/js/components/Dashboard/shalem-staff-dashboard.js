import {  html,css, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer";
import { BaseClass } from "../BaseClass";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemStaffDashboard extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        loading: { type: Boolean, state: true },
    }

    async connectedCallback(){
        super.connectedCallback();
        this.isAdmin = this.user?.roles?.includes('admin') || false;
        this.loading = false;
        console.log(this.mentees,this.documents);
        if(!this.mentees&&!this.documents.length){
            this.loading = true;
            await this._fetchData();
        }
    }

    render(){
        if(!this._dashboard||this.loading){
            return html`<div class="margins"><shalem-loader>Finding parking...</shalem-loader></div>`;
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

    async _fetchData(){
        try{
            const request =await safeFetch(`/api/staff/dashboard-data`,{method: 'GET'});
            const data = await request.json();
            this.mentees = data.mentees;
            this.documents = data.documents;
            this._updateContext({mentees: this.mentees, documents: this.documents});
        }
        catch(error){
            console.error('Error fetching staff dashboard data:', error);
        }
        finally{
            this.loading = false;
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