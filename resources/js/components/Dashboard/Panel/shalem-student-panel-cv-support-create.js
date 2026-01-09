import { css, html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseForm } from "../../Form/base-form.js";
import { BaseClass } from "../../BaseClass.js";
import cvSupportIcon from "../../../icons/cv-support-icon.svg";
import { SearchListener } from "../../Search/search-listener.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import fredParty from "../../../icons/fred-party.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import closeIcon from "../../../icons/close-icon.svg";
import { dateToString } from "../../../common/date.js";



export class ShalemStudentPanelCVSupportCreate extends SearchListener(PaginationListener(BaseForm(BaseDashboardConsumer(BaseClass(LitElement))))){
    static properties = {
        ...super.properties,
        _step: { type: String, state: true },
        _docs: { type: Array, state: true },
        _cvSupport: { type: Object, state: true },
    }

    connectedCallback(){
        super.connectedCallback();
        if(!this._step){
            this._step = 0;
        }
        if(!this._docs){
            this._docs = [];
        }
        this._eventManager.listen(`shalem-dashboard-${this.identifier}-cv-support-document-selected`, this._handleDocsUpdate);
    }

    get cvContainer(){
        return this.shadowRoot.querySelector('.cvs_container');
    }

    firstUpdated(){
        this._setDocumentTitle('Create a CV Support');
    }

    updated(changedProperties){
        
    }

    render(){
        let titles = [
            'Give your CV Support a name',
            'Add documents to your CV Support',
            'Confirm you\'re happy',
            'Boom! Success!',
        ]
        let form = '';
        if(this._step == 3){
            form = html`<div class="success_message flex column align_center">
                ${unsafeSVG(fredParty)}
                <h3>${this._cvSupport.name} has been created!</h3>
                <a href="${this._cvSupport.public_file_path}" class="bg_aqua white" download target="_blank" rel="noopener">Download your CV Support</a>
                <button class="bg_aqua white" @click=${()=>this._handleAction({dashboard:'cv-support', panel:'cv-support'})}>Go to my CV Supports</button>
            </div>`;
        }

        form = html`
            <form id="cv-support-create-form" class="cv-support-create-form" @submit=${this._handleSubmit} action="${this.restUrl}cvs/create">

                <div class="form_group" style="display: ${this._step == 0 ? 'block' : 'none'};">
                    <div class="input_group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" aria-required="true" @blur=${(e)=>{this._name = e.target.value}}/>
                    </div>
                    <div class="input_group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" @blur=${(e)=>{this._description = e.target.value}}></textarea>
                    </div>
                    <button class="bg_aqua white" @click=${(e)=>this._handleNextStep(e)}>Let's build it</button>
                </div>
                <div class="form_group" style="display: ${this._step == 1 ? 'block' : 'none'};">
                    <input type="hidden" name="document_ids" .value="${this._docs ? this._docs.map(doc => doc.id).join(',') : ''}" aria-required="true" data-error_message="You must select at least one document."/>
                    ${this._docs && this._docs.length > 0 ? html`
                        <div class="selected_documents inner_padding radius bg_yellow bg_shade_2">
                            <h3>Selected Documents:</h3>
                            <ul class="documents_list cards">
                                ${this._docs.map(doc => {
                                    let date = dateToString(doc.created_at);
                                    let pillar = this.pillars.find(pillar => {
                                        return pillar.id === doc.pillar_id;
                                    });
                                    return html`
                                        <li class="grid grid_50 shadow radius bg_white">
                                            <div class='header'>
                                                <h4>${doc.title}</h4>
                                                <h5 class="${pillar.colour}">${pillar?.name ?? 'General'}</h5>
                                                <p class="description">${doc.description}</p>
                                                <p class="uploaded_on">${date}</p>
                                            </div>
                                            <div class="action">
                                                <button @click=${(e)=>this._handleDocumentRemove(e, doc.id)}>${unsafeSVG(closeIcon)}<span class="screen-reader-text">Remove</span></button>
                                            </div>
                                        </li>
                                    `
                                })}
                            </ul>
                        </div>
                    ` : ''}
                    <shalem-student-panel-cv-support-document-selector identifier="${this.identifier}" documents="${JSON.stringify(this._docs)}" selector></shalem-student-panel-cv-support-document-selector>
                    <button class="bg_aqua white" @click=${(e)=>this._handleNextStep(e)}>Ok. Let's go.</button>
                </div>
                <div class="form_group" style="display: ${this._step == 2 ? 'block' : 'none'};">
                    <p>Please confirm that the information you've provided is correct.</p>
                    <h3>${this._name}</h3>
                    <p><em>${this._description}</em></p>
                    <h4>Documents:</h4>
                    <ul class="documents_list cards">
                        ${this._docs.map(doc => {
                            let date = dateToString(doc.created_at);
                            let pillar = this.pillars.find(pillar => {
                                return pillar.id === doc.pillar_id;
                            });
                            return html`
                                <li class="grid grid_50 shadow radius">
                                    <div class='header'>
                                        <h4>${doc.title}</h4>
                                        <h5 class="${pillar.colour}">${pillar?.name ?? 'General'}</h5>
                                        <p class="description">${doc.description}</p>
                                        <p class="uploaded_on">${date}</p>
                                    </div>
                                </li>
                            `
                        })}
                    </ul>
                    <button class="bg_aqua white" type="submit">Confirm and Create CV Support</button>
                </div>
                <div class="form-response"></div>
                <button @click=${(e)=>this._handlePreviousStep(e)} style="display: ${this._step > 0 ? 'block' : 'none'};">< Wait! Go back a step</button>
            </form>
        `
        return html`
            <div class="header_with_icon margins">
                ${unsafeSVG(cvSupportIcon)}
                <h2>${titles[this._step]}</h2>
            </div>
            <div class="cv-support-create-container margins">
                ${form}
            </div>
        `;
    }

    _handleNextStep(e){
        e.preventDefault();
        let group = e.currentTarget.closest('.form_group');
        console.log(group);
        let validate = this._validateForm(group);
        if(!validate){
            return;
        }
        this._step = this._step + 1;
    }

    _handlePreviousStep(e){
        e.preventDefault();
        if(this._step > 0){
            this._step = this._step - 1;
        }
    }

    _handleDocsUpdate(e){
        if(e.detail && e.detail.documents){
            this._docs = e.detail.documents;
        }
    }

    _handleDocumentRemove(e, docId){
        e.preventDefault();
        this._docs = this._docs.filter(doc => doc.id !== docId);
    }

    _beforeHandleSuccess(response){
        this._step = 3;
        this._cvSupport = response.data; 
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
                .action button{
                    height:fit-content;
                    border-radius:50%;
                    padding:0.5rem;
                    line-height:0;
                    margin-left:auto;
                    svg{
                        width:1.5rem;
                    }
                }
            }
        }
        @media (min-width:1000px){
            .documents_list{
                grid-template-columns:1fr 1fr;
            }
        }  
        .form_group>button{
            margin-top:2rem;
            margin-bottom:2rem;
        }

        .selected_documents{
            margin-bottom:1rem;
        }
         `
    ];
}
