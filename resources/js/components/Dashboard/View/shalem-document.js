import { css, html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import archiveIcon from "../../../icons/archive-icon.svg";
import archiveHappyIcon from "../../../icons/archive-happy-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";
import { dateToString } from "../../../common/date.js";
import { DocumentHelper } from "../../Helpers/document-helper.js";
export class ShalemDocument extends DocumentHelper(BaseDashboardConsumer(BaseClass(LitElement))){
    static properties = {
        ...super.properties,
        fileUrl: { type: String, state: true },

    }
    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        this._processFileUrl();
        
        let unixNow = Math.floor(Date.now() / 1000);
        if(this.expiry<unixNow){
            //file has expired, refetch the url
            this.fileUrl = null;
            this._refetchFileUrl();
        }
    }

    render(){
        let pillar = this.document.pillar_id ? this.pillars.find(p => p.id == this.document.pillar_id) : null;
        let pillarHtml = pillar ? html`<dt>Pillar:</dt><dd>${pillar.name}</dd>` : '';
        let typeHtml = this.document.type ? html`<dt>Type:</dt><dd class="sc">${this.document.type}</dd>` : '';
        let statusMessage = this._getStatusMessage();
        
        let header = html`
        <div class="header_with_icon header_with_document_status margins">
            <div class="left">
                ${unsafeSVG(archiveIcon)}
                <p class="${this.document.document_status.status}">${statusMessage}</p>
            </div>
            <div class="right">
                <h1 class="h3">${this.document.title}</h1>
                ${this.action == 'review'||this.action == 'review-edit'?html`<h2 class="h3">${this.document.userName}</h2>`:''}
                <p class="description">${this.document.description}</p>
                <dl>
                    ${pillarHtml}
                    ${typeHtml}
                    <dt>Uploaded on:</dt>
                    <dd>${dateToString(this.document.created_at)}</dd>
                </dl>
            </div>
        </div>
        `; 
        let body = '';
        if(this.action == 'view'){
            if(!this.fileUrl){
                body = html`<shalem-loader>Cleaning the cupboards...</shalem-loader>`;
            }
            else{
                if(this.fileType == 'pdf'){
                    body = html`
                    <div class="document_viewer margins">
                        <shalem-pdf-viewe/r file="${this.fileUrl}"></shalem-pdf-viewer>
                    </div>
                    `;
                }
                else{
                    body = html`
                    <div class="document_viewer margins">
                        <div class="bg_green bg_shade_2 inner_padding radius">
                            <img src="${this.fileUrl}" alt="Document Image" />
                        </div>
                    </div>
                    `;
                }
            }
        }
        else if(this.action == 'review'){
            if(!this.fileUrl){
                body = html`<shalem-loader>Cleaning the cupboards...</shalem-loader>`;
            }
            else{
                if(this.fileType == 'pdf'){
                    body = html`
                    <div class="document_viewer margins">
                        <shalem-pdf-viewer file="${this.fileUrl}"></shalem-pdf-viewer>
                    </div>
                    `;
                }
                else{
                    body = html`
                    <div class="document_viewer margins">
                        <div class="bg_green bg_shade_2 inner_padding radius">
                            <img src="${this.fileUrl}" alt="Document Image" />
                        </div>
                    </div>
                    `;
                }
            }
        }
        else if(this.action == 'edit'||this.action == 'review-edit'){
            let preview = '';
            if(this.fileType == 'pdf'){
                preview = html`
                <div class="document_viewer margins">
                    <shalem-pdf-viewer file="${this.fileUrl}"></shalem-pdf-viewer>
                </div>
                `;
            }
            else{
                preview = html`
                <div class="document_viewer margins">
                    <div class="bg_green bg_shade_2 inner_padding radius">
                        <img src="${this.fileUrl}" alt="Document Image" />
                    </div>
                </div>
                `;
            }
            if(this.action == 'edit'){
                body = html`
                <div class="margins">
                    <shalem-student-panel-document-upload document="${JSON.stringify(this.document)}" identifier="${this.identifier}"></shalem-student-panel-document-upload>
                    
                </div>  
                ${preview}
                `;
            }
            else if(this.action == 'review-edit'){
                body = html`
                <div class="margins">
                    <shalem-staff-panel-document-review-edit document="${JSON.stringify(this.document)}" identifier="${this.identifier}"></shalem-staff-panel-document-review-edit>  
                </div>  
                ${preview}
                `;
            }
        }
        let actions = this._renderActions(this.document);
        let footer = html`
        <div class="document_footer margins">
            ${actions}
        </div>
        `;
        return html`${header}${body}${footer}`;
    }

    _processFileUrl(){
        this.fileUrl = this.document.file_path;
        //split the file path to get the file type and queries
        let url = URL.parse(this.fileUrl);
        this.fileType = url.pathname.split('.').pop().toLowerCase();
        this.expiry = url.searchParams.get('expires');
    }

    async _refetchFileUrl(){
        try{
            const response = await safeFetch(`${this.restUrl}document/${this.view}`);
            let refreshedDocument = await response.json();
            this.document = refreshedDocument;
            let page, index;
            this.documents.forEach((docPage, pIndex) => {
                let i = docPage.findIndex(d => d.id == this.document.id);
                if(i != -1){
                    page = pIndex;
                    index = i;
                }
            });
            this.documents[page][index].file_path = this.document.file_path;
            this._updateContext({document: this.document, documents: this.documents});
            this._processFileUrl();
        }
        catch(error){
            console.error('Error refetching file URL:', error);
        }
    }

    static styles = [
        super.styles,
        css`
        .pending{
            color:var(--blue);
        }
        .approved{
            color:var(--green);
        }
        .rejected{
            color:var(--purple);
        }
        .changes_requested{
            color:var(--yellow);
        }
        .document_footer{
            margin-top:2rem;
            display:flex;
            gap:1rem;
            flex-wrap:wrap;
            button,shalem-dialog{
                width:100%;
                justify-content:center;
            }
            button{
                position:relative;
                svg{
                    position:absolute;
                    left:0.75rem;
                    top:0.75rem;
                }
            }
        }
        @media screen and (min-width:700px){
            .document_footer{
               
                button{
                    width:55%;
                }
            }
        }
        .margins:has(>shalem-student-panel-document-upload){
            margin-bottom:2rem;
        }
        `
    ];
}