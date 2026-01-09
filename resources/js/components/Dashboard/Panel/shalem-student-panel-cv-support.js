import { css, html, LitElement } from "lit";
import { SearchListener } from "../../Search/search-listener.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import cvSupportIcon from "../../../icons/cv-support-icon.svg";
import archiveHappyIcon from "../../../icons/archive-happy-icon.svg";
import fredParty from "../../../icons/fred-party.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";

export class ShalemStudentPanelCVSupport extends SearchListener(PaginationListener(BaseDashboardConsumer(BaseClass(LitElement)))){
    static properties = {
        ...super.properties,
        
    }

    async connectedCallback(){
        super.connectedCallback();
        this.paginationID = `cv-support-${this.identifier}`;
        this.searchID = `cv-support-${this.identifier}`;
        this.query = '';
        this.cv = null;
        if(!this.cvs||!this.cvs.data){
            await this._fetchCvs();
        }
        if(this.view){
            //find document by id
            this._setCvFromView();
        }
    } 

    get cvContainer(){
        return this.shadowRoot.querySelector('.cvs_container');
    }

    firstUpdated(){
        this._setDocumentTitle('My CV Supports');
    }

    updated(changedProperties){
        if(changedProperties.has('view')){
            if(this.view && this.view != 'success'){
                //find document by id
                 this._setCvFromView();
            }
        }
    }

    render(){
        if(this.view){
            console.log(this.view);
            console.log(this.cv);
            if(!this.cv || !this.cv.id){
                return html`
                    <div class="margins">
                        <shalem-loader>Warming up the generator...</shalem-loader>
                    </div>
                `;
            }
            return html`
            <shalem-cv-support identifier="${this.identifier}"></shalem-cv-support>
            `;
        }
        let render = '';
        if(!this.cvsPagination || !this.cvs || !this.cvs.hasOwnProperty(this.cvsPagination.current_page) || !this.cvs[this.cvsPagination.current_page]){
            render = html`
                <shalem-loader>Looking for my glasses...</shalem-loader>
            `;
        }
        else{
            render = html`
                <div class="cvs_container">
                    <shalem-search-bar
                        searchID="${this.searchID}"
                        query="${this.query}"
                    ></shalem-search-bar>
                    <shalem-student-panel-cv-support-list identifier="${this.identifier}">
                    </shalem-student-panel-cv-support-list>
                    <shalem-paginator 
                        currentPage=${this.cvsPagination.current_page}
                        paginationID=${this.paginationID}
                        lastPage=${this.cvsPagination.last_page}
                    ></shalem-paginator>
                    <button class="bg_aqua white" @click=${this._goToCreate}>Add New CV Support</button>
                </div> 
            `;
        }
        return html`
        <div class="header_with_icon margins">
            ${unsafeSVG(cvSupportIcon)}
            <shalem-editable-field name="student_dashboard_documents_my_documents_header" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.student_dashboard_documents_my_documents_header ?? 'My CV Supports'}</h1>
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
        this.cvContainer?.classList.add('loading');
        await this._fetchCvs(1,query,true);
        this.cvContainer?.classList.remove('loading');
    }

    async _fetchCvs(page=1,query=false,refresh=false){
        if(this.cvs && this.cvs[page] && !refresh && !query){
            this.cvsPagination.current_page = page;
            
            this._updateContext({cvsPagination: this.cvsPagination});
            return;
        }
        let fetchUrl =`${this.restUrl}cvs?page=${page}`;
        if(query){
            fetchUrl += `&query=${encodeURIComponent(query)}`;
        }
        const response = await safeFetch(fetchUrl);
        const data = await response.json();
        if(!this.cvs){
            this.cvs = {};
        }
        this.cvs[page] = data.cv_supports.data;
        delete data.cv_supports.data;
        this.cvsPagination = data.cv_supports;
        this._updateContext({cvs: this.cvs, cvsPagination: this.cvsPagination});
    }

    async _handlePaginationChange(e){
        this.cvContainer?.classList.add('loading');
        await this._fetchCvs(e.detail.page);
        this.cvContainer?.classList.remove('loading');
    }

    async _setCvFromView(){
        let foundCv = null;
        for(let page in this.cvs){
            foundCv = this.cvs[page].find(cv => cv.id == this.view);
            if(foundCv) break;
        }
        if(!foundCv){
            //fetch document from server
            const response = await safeFetch(`${this.restUrl}cv/${this.view}`);
            foundCv = await response.json();
        }
        this.cv = foundCv;
        this._updateContext({cv: this.cv});
    }

    _goToCreate(e){
        e.preventDefault();
        this._handleAction({dashboard:'cv-support',panel: 'create'});
    }
}
