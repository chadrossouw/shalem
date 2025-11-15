import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import { BaseForm } from "../Form/base-form.js";
import archiveIcon from "../../icons/archive-icon.svg";
import archiveHappyIcon from "../../icons/archive-happy-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";

export class ShalemStudentPanelMyDocuments extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))){

    render(){
        if(this.view == 'success'){
            let header = html`
                <div class="header_with_icon">
                    ${unsafeSVG(archiveHappyIcon)}
                    <shalem-editable-field name="student_dashboard_documents_my_documents_archive_success_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_documents_my_documents_archive_success_header ?? 'Document Archived!'}</h1>
                    </shalem-editable-field>
                </div>
            `;
            return header;
        }
        else if(this.view){
            let header = html`
            <div class="header_with_document_status">
                <div class="left">
                    ${unsafeSVG(archiveIcon)}
                    <p class="${this.document.status}>${this.document.status}</p>
                </div>
                <div class="right">
                    <h1>${this.document.title}</h1>
                    <p class="description">${this.document.description}</p>
                    <dl>
                        <dt>Pillar:</dt>
                        <dd>${this.document.pillar_name}</dd>
                        <dt>Type:</dt>
                        <dd>${this.document.type??`Type not assigned yet`}</dd>
                        <dt>Uploaded on:</dt>
                        <dd>${new Date(this.document.uploaded_at).toLocaleDateString()}</dd>
                    </dl>
                </div>
            </div>
            `;
            return html`${header}`;
        }
        return html`
        <div class="header_with_icon">
            ${unsafeSVG(archiveIcon)}
            <shalem-editable-field name="student_dashboard_documents_my_documents_header" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.student_dashboard_documents_my_documents_header ?? 'My Documents'}</h1>
            </shalem-editable-field>
        </div>
        <shalem-student-panel-my-documents-list identifier="${this.identifier}"></shalem-student-panel-document-list>
        `;
    }
}
