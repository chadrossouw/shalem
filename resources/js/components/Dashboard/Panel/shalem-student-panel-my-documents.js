import { css, html, LitElement } from "lit";
import { SearchListener } from "../../Search/search-listener.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import archiveIcon from "../../../icons/archive-icon.svg";
import archiveHappyIcon from "../../../icons/archive-happy-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";

export class ShalemStudentPanelMyDocuments extends SearchListener(PaginationListener(BaseDashboardConsumer(BaseClass(LitElement)))){
    static properties = {
        ...super.properties,
        
    }

    connectedCallback(){
        super.connectedCallback();
        this.paginationID = `my-documents-${this.identifier}`;
        this.searchID = `my-documents-${this.identifier}`;
        this.query = '';
        this.document = null;
        console.log(this.view,this.action);
        if(this.view && this.view != 'success'){
            //find document by id
            this._setDocumentFromView();
             if (this.view && !this.action){
                this.action = 'view';
                this._updateContext({action: this.action} );
            }
        }
       
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

    updated(changedProperties){
        if(changedProperties.has('view')){
            if(this.view && this.view != 'success'){
                //find document by id
                this._setDocumentFromView();
            }
        }
    }

    render(){
        if(this.view == 'success'){
            let header = html`
                <div class="header_with_icon margins">
                    ${unsafeSVG(archiveHappyIcon)}
                    <shalem-editable-field name="student_dashboard_documents_my_documents_archive_success_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_documents_my_documents_archive_success_header ?? 'Document Archived!'}</h1>
                    </shalem-editable-field>
                </div>
            `;
            return header;
        }
        else if(this.view){
            if(!this.document){
                return html`
                    <div class="margins">
                        <shalem-loader>Fetching the spades and pick axes...</shalem-loader>
                    </div>
                `;
            }
            return html`
            <shalem-document identifier="${this.identifier}"></shalem-document>
            `;
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
                    <shalem-search-bar
                        searchID="${this.searchID}"
                        query="${this.query}"
                    ></shalem-search-bar>
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
        <div class="header_with_icon margins">
            ${unsafeSVG(archiveIcon)}
            <shalem-editable-field name="student_dashboard_documents_my_documents_header" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.student_dashboard_documents_my_documents_header ?? 'My Documents'}</h1>
            </shalem-editable-field>
        </div>
        <div class="margins">
            ${render}
        </div>
        `;
    }

    async _handleSearch(e){
        const query = e.detail?.query;
        this.query = query;
        this.documentContainer?.classList.add('loading');
        await this._fetchDocuments(1,query,true);
        this.documentContainer?.classList.remove('loading');
    }

    async _fetchDocuments(page=1,query=false,refresh=false){
        if(this.documents[page] && !refresh && !query){
            this.documentsPagination.current_page = page;
            
            this._updateContext({documentsPagination: this.documentsPagination});
            return;
        }
        let fetchUrl =`${this.restUrl}documents?page=${page}`;
        if(query){
            fetchUrl += `&query=${encodeURIComponent(query)}`;
        }
        const response = await safeFetch(fetchUrl);
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

    async _setDocumentFromView(){
        let foundDocument = null;
        for(let page in this.documents){
            foundDocument = this.documents[page].find(doc => doc.id == this.view);
            if(foundDocument) break;
        }
        if(!foundDocument){
            //fetch document from server
            const response = await safeFetch(`${this.restUrl}document/${this.view}`);
            foundDocument = await response.json();
        }
        this.document = foundDocument;
        this._updateContext({document: this.document});
    }
}
