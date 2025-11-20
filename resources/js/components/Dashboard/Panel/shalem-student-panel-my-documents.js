import { html, LitElement } from "lit";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import archiveIcon from "../../../icons/archive-icon.svg";
import archiveHappyIcon from "../../../icons/archive-happy-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";

export class ShalemStudentPanelMyDocuments extends PaginationListener(BaseDashboardConsumer(BaseClass(LitElement))){
    connectedCallback(){
        this.paginationID = `my-documents-${this.identifier}`;
        super.connectedCallback();
        if(!this.documents||!this.documents.data){
            this._fetchDocuments();
        }
    }

    get documentContainer(){
        return this.shadowRoot.querySelector('.documents_container');
    }

    firstUpdated(){
        this._setDocumentTitle('My Documents');
    }

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
        let render = '';
        if(!this.documentsPagination || !this.documents || !this.documents.hasOwnProperty(this.documentsPagination.current_page) || !this.documents[this.documentsPagination.current_page]){
            render = html`
                <shalem-loader>Opening the file cabinet...</shalem-loader>
            `;
        }
        else{
            render = html`
                <div class="documents_container">
                    <shalem-student-panel-my-documents-list identifier="${this.identifier}">
                    </shalem-student-panel-my-documents-list>
                    <shalem-paginator 
                        currentPage=${this.documentsPagination.current_page}
                        paginationID=${this.paginationID}
                        lastPage=${this.documentsPagination.last_page}
                    ></shalem-paginator>
                </div> 
            `;
        }
        return html`
        <div class="header_with_icon">
            ${unsafeSVG(archiveIcon)}
            <shalem-editable-field name="student_dashboard_documents_my_documents_header" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.student_dashboard_documents_my_documents_header ?? 'My Documents'}</h1>
            </shalem-editable-field>
        </div>
        ${render}
        `;
    }

    async _fetchDocuments(page=1,refresh=false){
        if(this.documents[page] && !refresh){
            this.documentsPagination.current_page = page;
            
            this._updateContext({documentsPagination: this.documentsPagination});
            return;
        }
        const response = await safeFetch(`${this.restUrl}documents?page=${page}`);
        const data = await response.json();
        this.documents[page] = data.documents.data;
        delete data.documents.data;
        this.documentsPagination = data.documents;
        this._updateContext({documents: this.documents, documentsPagination: this.documentsPagination});
    }

    async _handlePaginationChange(e){
        this.documentContainer?.classList.add('loading');
        await this._fetchDocuments(e.detail.page);
        this.documentContainer?.classList.remove('loading');
    }
}
