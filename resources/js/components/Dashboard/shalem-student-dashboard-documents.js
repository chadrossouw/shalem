import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import uploadIcon from "../../icons/upload-icon.svg";
import uploadHappyIcon from "../../icons/upload-happy-icon.svg";
import fredParty from "../../icons/fred-party.svg";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import JSConfetti from 'js-confetti'

export class ShalemStudentDashboardDocuments extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
        mode: { type: String },
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        this.jsConfetti = new JSConfetti();
        this.confettiOptions = {
            confettiColors: [
                '#04898D', '#00316A', '#FFA700', '#0083D7', '#901065', '#8AB61E',
            ],
            confettiRadius: 9,
            confettiNumber: 1500,
        };
        ({fields: this.fields, user: this.user} = this._dashboard);
        if(this.mode === 'staff'){
            this.user = this.pupil;
            this.panel = 'my-documents';
        }
    }

    disconnectedCallback(){
        super.disconnectedCallback();
        if(this.jsConfetti&&this.jsConfetti.removeCanvas){
            this.jsConfetti?.removeCanvas();
        }
    }

    updated(changedProperties){
        if(this.mode === 'staff'){
            this.user = this.pupil;
            this.panel ='my-documents';
        }
        cardLinks(this.shadowRoot);
    }


    render(){
        if(this.mode === 'staff'){
            this.user = this.pupil;
            this.panel = 'my-documents';
        }
        let panel = '';
        if(this.panel == 'upload'){
            let header = '';
            if(this.view == 'success'){
                this._setDocumentTitle('Upload Success');
                this.jsConfetti.addConfetti(
                    this.confettiOptions
                );
                header = html`
                <div class="header_with_icon margins">
                    ${unsafeSVG(uploadHappyIcon)}
                    <shalem-editable-field name="student_dashboard_documents_upload_success_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_documents_upload_success_header ?? 'Success!'}</h1>
                    </shalem-editable-field>
                    ${unsafeSVG(fredParty)}
                </div>`;
                panel = html`
                ${header}
                <div class="upload_success_message margins">
                    ${this.user.mentor.mentor_user.honorific} ${this.user.mentor.mentor_user.last_name} will approve within ${this.documentApprovalTime} days. You will be notified when your points are awarded.
                </div>
                <div class="button_group">
                    <button @click=${() => this._handleAction({dashboard:'documents',panel: 'upload', view: null})}>Do it again</button>
                    <button @click=${() => this._handleAction({dashboard:'documents',panel: 'my-documents', view: null})}>See my documents</button>
                    <button @click=${() => this._handleAction({dashboard:'goals',panel: null, view: null})}>Set a goal</button>
                </div>
                `;
            }
            else{
                this._setDocumentTitle('Upload a document');
                header = html`
                <div class="header_with_icon margins">
                    ${unsafeSVG(uploadIcon)}
                    <shalem-editable-field name="student_dashboard_documents_upload_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_documents_upload_header ?? 'Upload a document'}</h1>
                    </shalem-editable-field>
                    <shalem-editable-field name="student_dashboard_documents_upload_instructions" location="student-dashboard" ?admin=${this.isAdmin}>
                        <p>${this.fields?.student_dashboard_documents_upload_instructions ?? 'Upload your documents here. These will award you points!'}</p>
                    </shalem-editable-field>
                </div>
                `;
                panel = html`
                    ${header}
                    <div class="margins">
                        <shalem-student-panel-document-upload
                            identifier="${this.identifier}"
                        ></shalem-student-panel-document-upload>
                        <div class="button-group">  
                            <button class="back" @click=${() => this._handleAction({dashboard:'documents',panel: 'my-documents', view: null})}>
                                <span>${unsafeSVG(backArrow)}</span> Back to my documents
                            </button>
                        </div>
                    </div>
                `
            }
            
        }
        else if (this.panel == 'my-documents'||!this.panel){
            if(this.view == 'success'){
                this.jsConfetti.addConfetti(
                    this.confettiOptions
                );
            }
            panel = html`
                <shalem-student-panel-my-documents
                    identifier="${this.identifier}"
                    mode=${this.mode}
                >
                </shalem-student-panel-my-documents>
            `
        }
        return html`
        <slot></slot>
        ${panel}
        `;
    }
}