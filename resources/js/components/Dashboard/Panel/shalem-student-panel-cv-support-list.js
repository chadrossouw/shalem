import { html, LitElement, css } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { dateToString } from "../../../common/date.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import cvSupportIcon from "../../../icons/cv-support-icon.svg";
import closeIcon from "../../../icons/close-icon.svg";
import view from '../../../icons/view.svg';
import download from '../../../icons/download.svg';
import { safeFetch } from "../../../common/xsrf.js";

export class ShalemStudentPanelCVSupportList extends BaseDashboardConsumer(BaseClass(LitElement)){
    static properties = {
        ...super.properties,
        _removeCV: { type: Object, state:true },
    }
    connectedCallback(){
        super.connectedCallback();
    }

    render(){
        let page = this.cvsPagination?.current_page ?? 1;
        if(this.cvs[page] && this.cvs[page].length > 0){
            return html`
                <ul class="cvs_list cards">
                    ${this.cvs[page].map(cv => {
                        let date = dateToString(cv.created_at);
                        return html`
                        <li class="grid grid_50 shadow radius">
                            <div class='header'>
                                <h4>${cv.name}</h4>
                                <p class="description">${cv.description}</p>
                                <p class="uploaded_on">${date}</p>
                            </div>
                            <div class="delete_cv">
                                <button class="close bg_aqua" @click=${() => this._handleDeleteCV(cv)}><span aria-hidden="true">${unsafeSVG(closeIcon)}</span><span class="screen-reader-text">Close</span></button>
                            </div>
                            <button class="bg_aqua" @click=${() => this._goToViewCV(cv.id)}>${unsafeSVG(view)}View</button>
                            <a class="button bg_aqua" href="${cv.file_path}" download>${unsafeSVG(download)}Download</button>
                        </li>`
                    })}
                </ul>
                 ${this._removeCV? html`<shalem-dialog open identifier="cv-remove">
                    <span slot="title" class="flex white modal_title">${unsafeSVG(cvSupportIcon)}<h2>Remove ${this._removeCV.name}</h2></span>
                    <div slot="body" class="modal_body">
                        <p class="white">Are you SURE you want to remove this CV Support? No take backsy</p>
                        <button class="bg_blue" @click=${(e)=>this._handleDeleteCVConfirm(e)}>Yes. I don't need it any more</button>
                        <button class="bg_light_blue" @click=${()=>this._handleDeleteCVCancel()}>No. Wait. I want to keep going</button>
                    </div>
                </shalem-dialog>` : ''}
            `;
        }
        return html`<p>You don't have any CV Supports yet. <a href="/upload" @click=${this._goToCreate}>Add one?</a></p>`;
    }

    _handleDeleteCV(cv){
        this._removeCV = cv;
    }

    _handleDeleteCVCancel(){
        this._removeCV = null;
    }

    _handleDeleteCVConfirm(e){
        e.preventDefault();
        e.stopPropagation();
        safeFetch('/api/cvs/delete',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cv_id: this._removeCV.id})
        })
        .then( response => {
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then( data => {
            // Refresh goals
            let page = this.cvsPagination?.current_page ?? 1;
            this.cvs[page] = this.cvs[page].filter( cv => cv.id != this._removeCV.id );
            this._updateContext({cvs: this.cvs});
            this._removeCV = null;
        })
        .catch( error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    _goToViewCV(cvId){
        this._handleAction({dashboard:'cv-support',panel: 'cv-support', view: cvId});
    }

    _goToCreate(e){
        e.preventDefault();
        this._handleAction({dashboard:'cv-support',panel: 'create'});
    }

    static styles = [
        super.styles,
        css`
        .cvs_list.cards{
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
        .delete_cv{
            display:flex;
            justify-content:flex-end;
            .close{
                height:fit-content;
                border-radius:50%;
                padding:0.5rem;
                line-height:0;
            }
        }
        a.button{
            text-decoration:none;
        }

        .modal_title{
            align-items:center;
            margin-bottom:1rem;
            gap:1rem;
            h2{
                margin:0;
            }
        }
        .modal_body{
            button{
                margin-bottom:1rem;
                width:100%;
            }
        }
    `
    ];
    
}