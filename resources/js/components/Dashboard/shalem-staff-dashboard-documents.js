import { css,html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import verifyIcon from "../../icons/verify-icon.svg"
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { dateToString } from "../../common/date.js";
import { documentStatusMap } from "../../common/document-status-map.js";
import { safeFetch } from "../../common/xsrf.js";
import JSConfetti from 'js-confetti';
import view from '../../icons/view.svg';

export class ShalemStaffDashboardDocuments extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
        this.fetchingDocument = false;
    }

    firstUpdated(){
        this._setDocumentTitle('Verify documents');
    }

    async connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user} = this._dashboard);
        if(this.view && (this.view != 'success'&& this.view != 'changes_requested_success')){
            //find document by id
           await this._setDocumentFromView();
        }
        else if (this.view == 'success'||this.view=='changes_requested_success'){
            this.document = null;
            this._fetchDocuments();
        }
        this.jsConfetti = new JSConfetti();
        this.confettiOptions = {
            confettiColors: [
                '#04898D', '#00316A', '#FFA700', '#0083D7', '#901065', '#8AB61E',
            ],
            confettiRadius: 9,
            confettiNumber: 1500,
        };
    }

    disconnectedCallback(){
        super.disconnectedCallback();
    }

    async updated(changedProperties){
        if(changedProperties.has('view')){
            if(this.view && this.view != 'success' && this.view != 'changes_requested_success'){
            //find document by id
                await this._setDocumentFromView();
            }
            else if (this.view == 'success' || this.view == 'changes_requested_success'){
                this.document = null;
                this._fetchDocuments();
            }
        }
        cardLinks(this.shadowRoot);
    }


    render(){
        if(this.view){
            if(this.view == 'success'){
                this.jsConfetti.addConfetti(
                    this.confettiOptions
                );
                return html`
                <slot></slot>
                <div class="header_with_icon margins">
                    ${unsafeSVG(verifyIcon)}
                    <shalem-editable-field name="staff_dashboard_documents_approval_success_message" location="staff-dashboard" ?admin=${this.isAdmin}>
                        <h2>${this.fields?.staff_dashboard_documents_approval_success_message ?? 'The document has been successfully processed.'}</h2>
                    </shalem-editable-field>
                </div>
                <div class="margins">
                    <button class="bg_blue white" @click=${()=>this._handleAction({dashboard: 'documents', panel:null, view:null, action:null})}>
                        ${unsafeSVG(backArrow)}Back to Documents
                    </button>
                </div>
                `;
            }
            else if(this.view == 'changes_requested_success'){
                return html`
                <slot></slot>
                <div class="header_with_icon margins">
                    ${unsafeSVG(verifyIcon)}
                    <shalem-editable-field name="staff_dashboard_documents_changes_requested_success_message" location="staff-dashboard" ?admin=${this.isAdmin}>
                        <h2>${this.fields?.staff_dashboard_documents_changes_requested_success_message ?? 'Changes requested.'}</h2>
                    </shalem-editable-field>
                </div>
                <div class="margins">
                    <p>Your request for changes has been sent to the pupil. The document will appear in your dashboard again when they have made the necessary updates.</p>
                    <button class="bg_blue white" @click=${()=>this._handleAction({dashboard: 'documents', panel:null, view:null, action:null})}>
                        ${unsafeSVG(backArrow)}Back to Documents
                    </button>
                </div>
                `;
            }
            this._setDocumentFromView();
            if(!this.document){
                return html`<div class="margins"><shalem-loader>Shuffling the pack...</shalem-loader></div>`;
            }
            return html`
            <shalem-document identifier="${this.identifier}">
            </shalem-document>
            `;
        }
        let list = [];
        let count = 0;
        for(let mentee in this.documents){
            let docs = this.documents[mentee];
            let menteeName = {};
            if(mentee=='forwarded'){
                menteeName.firstName = 'Forwarded'
                menteeName.lastName = 'Documents';
            }
            else{
                menteeName = this.mentees.find(_mentee=>_mentee.id==mentee);
            }
            if(!docs || docs.length == 0){
                continue;
            }
            let markup = html`
                <details ?open="${count==0}">
                    <summary><h3>${menteeName.first_name} ${menteeName.last_name}</h3><div class="count bg_aqua white">${docs.length}</div></summary>
                    <div class="content">
                         <ul class="documents_list cards">
                            ${docs.map(document => {
                                let date = dateToString(document.created_at);
                               
                                return html`
                                <li class="${document.document_status.status} grid grid_50 shadow radius bg_white">
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
            count++;
            list.push(markup);
        }
        if(!list.length){
            list = html`<p>No documents to verify at this time. You're all done here</p><button class="bg_blue white" @click=${()=>this._handleAction({dashboard: 'home', panel:null, view:null, action:null})}>Go to Dashboard</button>`;
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
        if(!foundDocument&&!this.fetchingDocument){
            //fetch document from server
            this.fetchingDocument = true;
            try{
                const response = await safeFetch(`${this.restUrl}document/${this.view}`);
                foundDocument = await response.json();
                user = foundDocument.user_id;
                this.fetchingDocument = false;
            }
            catch(error){
                console.error('Document not found', error);
                this.fetchingDocument = false;
                this._handleAction({dashboard: 'documents', panel:null, view:null, action:null});
                return;
            }
        }
        this.document = foundDocument;
        if(!this.fetchingDocument){
            let menteeName = this.mentees.find(_mentee=>_mentee.id==user)
            this.document.userName = `${menteeName.first_name} ${menteeName.last_name}`;
            this._updateContext({document: this.document});
        }
    }

    async _fetchDocuments(){
        const response = await safeFetch(`${this.restUrl}staff/documents`);
        const data = await response.json();
        this.documents = data.documents;
        this._updateContext({documents: this.documents, document: this.document});
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
        details{
            
            padding:1rem;
            background-color:var(--light-blue-shade-2);
            border-radius:var(--border-radius-big);
            margin-bottom:2rem;
            summary{
                cursor:pointer;
                display:flex;
                align-items:center;
                gap:1rem;
                position:relative;
                &::before{
                    content:'';
                    display:inline-block;
                    width:1px;
                    height:1px;
                    border: 1rem solid transparent;
                    border-top:1.5rem solid var(--aqua);
                    transition:transform 0.3s ease;
                    transform:rotate(-90deg) translate(0,25%);
                }
                h3{
                    margin:0;
                }
            }
            .content{
                margin-top:1rem;
            }
            .count{
                position:absolute;
                top:-1.5rem;
                right:-1.5rem;
                font-size:2.5rem;
                font-weight:bold;
                width:4rem;
                height:4rem;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
            }
            &[open] summary::before{
                transform:rotate(0deg) translate(0,25%);
            }
        }
        `
    ];
}