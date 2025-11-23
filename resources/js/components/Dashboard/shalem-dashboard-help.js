import { LitElement, html } from 'lit';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import helpAvatar from '../../icons/help-avatar.svg';
import helpMessageAvatar from '../../icons/help-message-avatar.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { cards } from '../../utilities/baseStyles.js';
import { cardLinks } from "../../common/accessibility.js";
export class ShalemDashboardHelp extends BaseDashboardConsumer(BaseClass(LitElement)){
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
                panel = html`
                <p>Here is some help regarding your document.</p>
                `;
            }
            else if(this.panel == 'message'){
                panel = html`
                <p>Here is how to message support.</p>
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
            <div class="grid margins">
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
        ${panel}
        `;
    }

    static styles = [
        super.styles,
        cards,
    ];
}