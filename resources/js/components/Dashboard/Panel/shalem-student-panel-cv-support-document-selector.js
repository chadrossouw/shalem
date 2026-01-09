import { css, html, LitElement } from "lit";
import { SearchListener } from "../../Search/search-listener.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import archiveIcon from "../../../icons/archive-icon.svg";
import archiveHappyIcon from "../../../icons/archive-happy-icon.svg";
import fredParty from "../../../icons/fred-party.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";
import { dateToString } from "../../../common/date.js";

export class ShalemStudentPanelCVSupportDocumentSelector extends SearchListener(PaginationListener(BaseDashboardConsumer(BaseClass(LitElement)))){
    static properties = {
        ...super.properties,
        documents: { type: Array },
        
    }

    connectedCallback(){
        super.connectedCallback();
        this.paginationID = `cv-documents-${this.identifier}`;
        this.searchID = `cv-documents-${this.identifier}`;
        this.query = '';
        this.document = null;
        if(!this.documents){
            this.documents = [];
        }
        this.ids = this.documents.map(doc => doc.id);

        super.connectedCallback();
        if(!this.cvDocuments||!this.cvDocuments.data){
            this._fetchCVDocuments();
        }
    }

    get documentContainer(){
        return this.shadowRoot.querySelector('.documents_container');
    }

    updated(changedProperties){
       if(changedProperties.has('documents')){
           this.ids = this.documents.map(doc => doc.id);
           console.log(this.ids);
           this.requestUpdate();
       }
    }

    render(){
       
        let render = '';
        
        if(!this.cvDocumentsPagination || !this.cvDocuments || !this.cvDocuments.hasOwnProperty(this.cvDocumentsPagination.current_page) || !this.cvDocuments[this.cvDocumentsPagination.current_page]){
            render = html`
                <shalem-loader>Opening the file cabinet...</shalem-loader>
            `;
        }
        else{
            let list = '';
            let page = this.cvDocumentsPagination?.current_page ?? 1;
                if(this.cvDocuments && this.cvDocuments[page] && this.cvDocuments[page].length > 0){
        
                    list = html`
                        <ul class="documents_list cards">
                            ${this.cvDocuments[page].map(document => {
                                let date = dateToString(document.created_at);
                                let pillar = this.pillars.find(pillar => {
                                    return pillar.id === document.pillar_id;
                                });
                                return html`
                                <li class="grid grid_50 shadow radius">
                                    <div class='header'>
                                        <h4>${document.title}</h4>
                                        <h5 class="${pillar.colour}">${pillar?.name ?? 'General'}</h5>
                                        <p class="description">${document.description}</p>
                                        <p class="uploaded_on">${date}</p>
                                    </div>
                                    <div class="action">
                                        <label>
                                            ${this.ids.includes(document.id) ? html`<input type="checkbox" id="" @change="${e => this._handleDocumentSelect(e)}" value="${document.id}" checked>` :
                                            html`<input type="checkbox" id="" @change="${e => this._handleDocumentSelect(e)}" value="${document.id}">`}
                                        <span class="screen-reader-text">Select</span></label>
                                    </div>
                                </li>`
                            })}
                        </ul>
                    `;
            }
            render = html`
                <div class="documents_container">
                    <shalem-search-bar
                        searchID="${this.searchID}"
                        query="${this.query}"
                    ></shalem-search-bar>
                    ${list}
                    <shalem-paginator 
                        currentPage=${this.cvDocumentsPagination.current_page}
                        paginationID=${this.paginationID}
                        lastPage=${this.cvDocumentsPagination.last_page}
                    ></shalem-paginator>
                </div> 
            `;
        }
        return render;
    }

    async _handleSearch(e){
        const query = e.detail?.query;
        this.query = query;
        this.documentContainer?.classList.add('loading');
        await this._fetchDocuments(1,query,true);
        this.documentContainer?.classList.remove('loading');
    }

    async _fetchCVDocuments(page=1,query=false,refresh=false){
        if(this.cvDocuments && this.cvDocuments[page] && !refresh && !query){
            this.cvDocumentsPagination.current_page = page;
            
            this._updateContext({cvDocumentsPagination: this.cvDocumentsPagination});
            return;
        }
        let fetchUrl =`${this.restUrl}documents/approved?page=${page}`;
        if(query){
            fetchUrl += `&query=${encodeURIComponent(query)}`;
        }
        const response = await safeFetch(fetchUrl);
        const data = await response.json();
        if(!this.cvDocuments){
            this.cvDocuments = {};
        }
        this.cvDocuments[page] = data.documents.data;
        delete data.documents.data;
        this.cvDocumentsPagination = data.documents;
        this._updateContext({cvDocuments: this.cvDocuments, cvDocumentsPagination: this.cvDocumentsPagination});
    }

    async _handlePaginationChange(e){
        this.documentContainer?.classList.add('loading');
        await this._fetchCVDocuments(e.detail.page);
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

    _handleDocumentSelect(e){
        const documentId = parseInt(e.target.value);
        if(this.ids.includes(documentId) && !e.target.checked){
            this.ids = this.ids.filter(id => id !== documentId);
        }
        else if(e.target.checked && !this.ids.includes(documentId)){
            this.ids = [...this.ids, documentId];
        }
        let flattenedDocs = [];
        for(let page in this.cvDocuments){
            flattenedDocs = [...flattenedDocs, ...this.cvDocuments[page]];
        }
        let docs = this.ids.map(id => flattenedDocs.find(doc => doc.id == id));
        this._eventManager.emit(`shalem-dashboard-${this.identifier}-cv-support-document-selected`, {documents: docs});
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
                label{
                    position:relative;
                    width:1.5rem;
                    height:1.5rem;
                    border:2px solid var(--aqua);
                    border-radius:0.25rem;
                    cursor:pointer;
                    display:block;
                    margin-left:auto;
                    input[type="checkbox"]{
                        opacity:0;
                        position:absolute;
                        left:0;
                        top:0;
                        width:100%;
                        height:100%;
                        margin:0;
                        cursor:pointer;
                    }
                    &::after{
                        content:'';
                        position:absolute;
                        top:0.1rem;
                        left:0.4rem;
                        width:0.5rem;
                        height:0.9rem;
                        border-right:3px solid var(--white);
                        border-bottom:3px solid var(--white);
                        transform:rotate(45deg);
                        opacity:0;
                    }
                }
                label:has(input[type="checkbox"]:checked){
                    background-color:var(--aqua);
                    &::after{
                        opacity:1;
                    }
                }
            }
        }
        @media (min-width:1000px){
            .documents_list{
                grid-template-columns:1fr 1fr;
            }
        }
        `
    ];
}
