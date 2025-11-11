import { html, LitElement } from "lit";
import { ShalemBaseDashboardConsumer } from "./shalem-base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import uploadIcon from "../../icons/upload-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";

export class ShalemStudentDashboardDocuments extends ShalemBaseDashboardConsumer(BaseClass(LitElement)){

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


    render(){
        let panel = '';
        if(this.panel == 'upload'){
            panel = html`
                <div class="header_with_icon">
                    ${unsafeSVG(uploadIcon)}
                    <shalem-editable-field name="student_dashboard_documents_upload_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_documents_upload_header ?? 'Upload a document'}</h1>
                    </shalem-editable-field>
                    <shalem-editable-field name="student_dashboard_documents_upload_instructions" location="student-dashboard" ?admin=${this.isAdmin}>
                        <p>${this.fields?.student_dashboard_documents_upload_instructions ?? 'Upload your documents here. These will award you points!'}</p>
                    </shalem-editable-field>
                </div>
                <shalem-student-panel-document-upload
                    identifier="${this.identifier}"
                ></shalem-student-panel-document-upload>
            `
        }
        return html`
        <slot></slot>
        ${panel}
        `;
    }
}