import { css, html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import cvSupportIcon from "../../../icons/cv-support-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";
import { dateToString } from "../../../common/date.js";

export class ShalemCvSupport extends BaseDashboardConsumer(BaseClass(LitElement)){
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
        let header = html`
        <div class="header_with_icon header_with_document_status margins">
            <div class="left">
                ${unsafeSVG(cvSupportIcon)}
            </div>
            <div class="right">
                <h1 class="h3">${this.cv.name}</h1>
                <p class="description">${this.cv.description}</p>
                <dl>
                    <dt>Created at:</dt>
                    <dd>${dateToString(this.cv.created_at)}</dd>
                </dl>
            </div>
        </div>
        `; 
        let body = html`
            <div class="document_viewer margins">
                <shalem-pdf-viewer file="${this.fileUrl}"></shalem-pdf-viewer>
            </div>
        `;
        let footer = html`
            <div class="document_footer margins flex">
                <a class="button bg_aqua" href="${this.fileUrl}" download="${this.cv.name}">Download CV Support</a>
                <button class="button bg_light_blue" @click=${(e)=>this._handleAction({dashboard:'cv-support', panel:'cv-support', view:null})}>Back to my CV Supports</button>
            </div>
        `;
        return html`${header}${body}${footer}`;
    }

    _processFileUrl(){
        this.fileUrl = this.cv.file_path;
        //split the file path to get the file type and queries
        let url = URL.parse(this.fileUrl);
        this.fileType = url.pathname.split('.').pop().toLowerCase();
        this.expiry = url.searchParams.get('expires');
    }

    async _refetchFileUrl(){
        try{
            const response = await safeFetch(`${this.restUrl}cv/${this.view}`);
            let refreshedCV = await response.json();
            this.cv = refreshedCV;
            let page, index;
            this.cvs.forEach((docPage, pIndex) => {
                let i = docPage.findIndex(d => d.id == this.cv.id);
                if(i != -1){
                    page = pIndex;
                    index = i;
                }
            });
            this.cvs[page][index].file_path = this.cv.file_path;
            this._updateContext({cv: this.cv, cvs: this.cvs});
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
        }
        `
    ];
}