import { LitElement, html } from 'lit';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import { BaseForm } from '../Form/base-form.js';
import { DocumentHelper } from '../Helpers/document-helper.js';
import helpAvatar from '../../icons/help-avatar.svg';
import helpMessageAvatar from '../../icons/help-message-avatar.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { cards } from '../../utilities/baseStyles.js';
import { cardLinks } from "../../common/accessibility.js";
export class ShalemDashboardHelp extends DocumentHelper(BaseForm(BaseDashboardConsumer(BaseClass(LitElement)))){
    
    async connectedCallback(){
        super.connectedCallback();
        ({fields:this.fields} = this._dashboard);
        if(this.panel == 'document' && this.view){
            //load document help
            if(!this.documents){
                await this._fetchDocuments();
            }
            this._setDocumentFromView();
        }
    }
    
    firstUpdated(){
        this._setDocumentTitle('Get help');
    }

    updated(){
        cardLinks(this.shadowRoot);
    }

    render(){
        let panel = '';
        let header = '';
        if(this.panel){
            if(this.panel == 'document'){
                
                if(this.document){
                header = html`
                    <h1 class="full">Help with ${this.document?.title?this.document.title:'my document'}</h1>
                `;    
                let placeholder = `I need help with ${this.document?.title?this.document.title:'this document'}. It hasn't been approved yet`;
                if(this.document.document_status.status == 'rejected'){
                    placeholder = `I have a question about ${this.document?.title?this.document.title:'this document. I think it was rejected in error'}`;
                }
                panel = html`
                    <div class="bg_yellow bg_shade_2 radius-big inner_padding">
                        <form @submit=${this._handleSubmit} action="${this.restUrl}help/document/escalate">
                            
                            <input type="hidden" name="document_id" .value=${this.document.id} />
                            <div class="input_group">
                                <label for="help_message">Please describe the issue you are having with ${this.document?.title?this.document.title:'this document'}</label>
                                <textarea id="help_message" name="help_message" rows="6" required>${placeholder}</textarea>
                            </div>
                            <div class="form-response"></div>
                            <button type="submit">Let's get you sorted</button>
                        </form>
                    </div>
                `;    
                    
                }
                else{
                    panel = html`<shalem-loader>Holding me back. Gravity is holding me back...</shalem-loader>`;
                }
            }
            else if(this.panel == 'message'){
                header = html`<shalem-editable-field name="help_message_title" location="help" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.help_message_title ?? 'Message Support'}</h1>
                </shalem-editable-field>`;
                panel = html`
                    <div class="bg_yellow bg_shade_2 radius-big inner_padding">
                        <form @submit=${this._handleSubmit} action="${this.restUrl}help/message">
                            <div class="input_group">
                                <label for="help_message">Please describe the issue you are having</label>
                                <textarea id="help_message" name="help_message" rows="6" required></textarea>
                            </div>
                            <div class="form-response"></div>
                            <button type="submit">Let's get you sorted</button>
                        </form>
                    </div>  
                `;
            }
            else if(this.panel == 'faqs'){
                panel = html`
                <p>Here are some frequently asked questions.</p>
                `;
            }
        }
        else{
            header = html`<shalem-editable-field name="help_dashboard_title" location="help" ?admin=${this.isAdmin}>
                <h1>${this.fields?.help_dashboard_title ?? 'How can we help'}</h1>
            </shalem-editable-field>`;
            panel = html`
            <div class="grid">
                <div class="card blob bg_light_blue radius-big inner_padding">
                    <h2 class="white">
                        <shalem-editable-field name="help_faqs" location="help" ?admin=${this.isAdmin}>
                            ${this.fields?.help_faqs ?? 'I need some guidance on how to use this app'}
                        </shalem-editable-field>
                    </h2>
                    ${helpAvatar ? html`<div class="icon" aria-hidden="true">${unsafeSVG(helpAvatar)}</div>` : ''}
                    <button class="card_target bg_white light_blue" @click=${() => this._handleAction({dashboard: 'help', panel: 'faqs', view: null})}>
                        Get help
                    </button>
                </div>
                <div class="card blob bg_green radius-big inner_padding">
                    <h2 class="white">
                        <shalem-editable-field name="help_message" location="help" ?admin=${this.isAdmin}>
                            ${this.fields?.help_message ?? 'I want to talk to a human being'}
                        </shalem-editable-field>
                    </h2>
                    ${helpMessageAvatar ? html`<div class="icon" aria-hidden="true">${unsafeSVG(helpMessageAvatar)}</div>` : ''}
                    <button class="card_target bg_white green" @click=${() => this._handleAction({dashboard: 'help', panel: 'message', view: null})}>
                        Get help
                    </button>
                </div>
            </div>
            `;
        }

        return html`
        <slot></slot>
        <div class="header_with_icon margins">
            <div class="icon" aria-hidden="true">${unsafeSVG(helpAvatar)}</div>
            ${header}
        </div>
        <div class="margins">
            ${panel}
        </div>
        `;
    }


    static styles = [
        super.styles,
        cards,
    ];
}