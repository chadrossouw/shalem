import { css,html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import verifyIcon from "../../icons/verify-icon.svg"
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { dateToString } from "../../common/date.js";
import { documentStatusMap } from "../../common/document-status-map.js";
import view from '../../icons/view.svg';

export class ShalemStaffDashboardDocuments extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user} = this._dashboard);
        if(this.view && this.view != 'success'){
            //find document by id
            this._setDocumentFromView();
        }
    }

    disconnectedCallback(){
        super.disconnectedCallback();
    }

    updated(changedProperties){
        if(changedProperties.has('view')){
            if(this.view && this.view != 'success'){
            //find document by id
            this._setDocumentFromView();
            }
        }
        cardLinks(this.shadowRoot);
    }


    render(){
        if(this.view){
            this._setDocumentFromView();
            return html`
            <shalem-document identifier="${this.identifier}">
            </shalem-document>
            `;
        }
        let list = [];
        for(let mentee in this.documents){
            let docs = this.documents[mentee];
            let menteeName = this.mentees.find(_mentee=>_mentee.id==mentee)

            let markup = html`
                <details open>
                    <summary><h3>${menteeName.first_name} ${menteeName.last_name}</h3><div class="count">${docs.length}</div></summary>
                    <div class="content">
                         <ul class="documents_list cards">
                            ${docs.map(document => {
                                let date = dateToString(document.created_at);
                               
                                return html`
                                <li class="${document.document_status.status} grid grid_50 shadow radius">
                                    <div class='header'>
                                        <h4>${document.title}</h4>
                                        <p class="description">${document.description}</p>
                                        <p class="uploaded_on">${date}</p>
                                    </div>
                                    <div class="status">
                                        <p><strong>${documentStatusMap[document.document_status.status]}</strong></p>
                                        ${document.document_status.status == 'approved' && document.document_status.status_message ? html`<p class="status_message">${document.document_status.status_message}</p>` : ''}
                                    </div>
                                    <button class="bg_purple white" @click=${() => this._handleAction({dashboard: 'documents', panel:'document',view: document.id,action: 'review'})} >
                                         ${unsafeSVG(view)}View
                                    </button>
                                </li>`
                            })}
                        </ul>
                    </div>
                </details>
            `;
            list.push(markup);
        }
        return html`
        <slot></slot>
         <div class="header_with_icon margins">
            ${unsafeSVG(verifyIcon)}
            <shalem-editable-field name="staff_dashboard_documents_header" location="staff-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.staff_dashboard_documents_header ?? 'Verify documents'}</h1>
            </shalem-editable-field>
        </div>
        <div class="margins">
            ${
               list 
            }
        </div>
        `;
    }

     async _setDocumentFromView(){
        let foundDocument = null;
        let user = null;
        for(let page in this.documents){
            foundDocument = this.documents[page].find(doc => doc.id == this.view);
            user = page;
            if(foundDocument) break;
        }
        if(!foundDocument){
            //fetch document from server
            const response = await safeFetch(`${this.restUrl}document/${this.view}`);
            foundDocument = await response.json();
        }
        this.document = foundDocument;
        let menteeName = this.mentees.find(_mentee=>_mentee.id==user)
        this.document.userName = `${menteeName.first_name} ${menteeName.last_name}`;
        this._updateContext({document: this.document});
    }

    static styles = [
        super.styles,
        css`
        .documents_list.cards{
            display:grid;
            gap:2rem;
            margin-bottom:2rem;
            li{
                padding:1rem;
                h4{
                    margin-top:0;
                }
                .header{
                    margin:0;
                }
                shalem-dialog{
                    grid-column: span 2;
                }
                &>button{
                    height:fit-content;
                }
            }
        }
        @media (min-width:1000px){
            .documents_list{
                grid-template-columns:1fr 1fr;
            }
        }
        .pending .status{
            color:var(--blue);
        }
        .approved .status{
            color:var(--green);
        }
        .rejected .status{
            color:var(--purple);
        }
        .changes_requested .status{
            color:var(--yellow);
        }
        `
    ];
}