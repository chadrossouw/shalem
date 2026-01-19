import { css, html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { BaseForm } from "../../Form/base-form.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";
import { dateToString } from "../../../common/date.js";
import notificationOpen from "../../../icons/notifications-symbol-open.svg";
import notificationClosed from "../../../icons/notifications-symbol-closed.svg";

export class ShalemStaffMessages extends PaginationListener(BaseForm(BaseDashboardConsumer(BaseClass(LitElement)))){
    static properties = {
        ...super.properties,
        _messages: { type: Array, state: true },
        _messagesPagination: { type: Object, state: true },
        _success: { type: Boolean, state: true },
    }

    constructor(){
        super();
        this.paginationID = `messages-${this.identifier}`;
    }

    async connectedCallback(){
        super.connectedCallback();
        await this._fetchMessages();
    }

    get _messagesContainer(){
        return this.shadowRoot.querySelector('.messages_list');
    }

    render(){
        let body = '';
        if(this._success){
            body =html`
                <div class="success_message">
                    <h3 class="success">Message sent successfully!</h3>
                    <div class="flex">
                        <button class="bg_green" @click=${() => {this._success = false;}}>Send another message</button>
                        <button class="bg_blue" @click=${() => {this._handleAction({dashboard: 'pupils', panel: null, view: null});}}>Back to pupils</button>
                    </div>
                </div>
            `;
        }
        else{
            body = html`
                <form @submit=${this._handleSubmit} action="${this.restUrl}student/${this.panel}/message">
                    <div class="form-response"></div>
                    <div class="input_group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" aria-required="true" />
                    </div>
                    <div class="input_group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" aria-required="true"></textarea>
                    </div>
                    <div class="input_group">
                        <shalem-avatar-selector select></shalem-avatar-selector>
                    </div>
                    <button type="submit" class="primary">Send Message</button>

                </form>
            `;
        }
        let footer = '';
        let page = this._messagesPagination?.current_page ?? 1;
        if(this._messages && this._messages[page] && this._messages[page].length > 0){
            footer = html`
            <div class="messages_wrapper">
                <h3 class="blue">Previous messages</h3>
                <ul class="messages_list grid">
                ${this._messages[this._messagesPagination.current_page]?.map(message => html`
                    <li class="message_card card radius bg_white shadow grid">
                        ${message.read_at?html`${unsafeSVG(notificationOpen)}`:html`${unsafeSVG(notificationClosed)}`}
                        <div class="message_header">
                            <div class="message_info">
                                <h4 class="blue">${message.subject}</h4>
                                <p class="purple">Sent on ${dateToString(message.created_at)}</p>
                            </div>
                        </div>
                        <div class="message_body">
                            <p>${message.message}</p>
                             ${message.avatar_id ? html`
                                <div class="avatar_svg avatar-svg" aria-hidden="true">
                                    <shalem-avatar avatarid=${message.avatar_id}></shalem-avatar>
                                </div>
                            ` : ''}
                        </div>
                    </li>
                `)}
                <shalem-paginator 
                    currentPage=${this._messagesPagination.current_page}
                    paginationID=${this.paginationID}
                    lastPage=${this._messagesPagination.last_page}
                ></shalem-paginator>
            </div>
            `;
        }
        return html`${body}${footer}`;
    }


    async _fetchMessages(page=1,refresh = false){
        if(!this._messages){
            this._messages = this.pupil.messages;
            this._messagesPagination = this.pupil.messagesPagination;
        }
        if(this._messages && this._messages[page] && !refresh){
            let pagination = this._messagesPagination;
            pagination.current_page = page;
            this._messagesPagination = pagination;
            this.pupil.messagesPagination = this._messagesPagination;
            this._updateContext({pupil: this.pupil});
            this.requestUpdate();
            return;
        }
        let fetchUrl =`${this.restUrl}student/${this.panel}/messages?page=${page}`;
        
        const response = await safeFetch(fetchUrl);
        const data = await response.json();
        if(!this._messages){
            this._messages = {};
        }
        this._messages[page] = data.messages.data;
        delete data.messages.data;
        this._messagesPagination = data.messages;
        this.pupil.messages = this._messages;
        this.pupil.messagesPagination = this._messagesPagination;
        this._updateContext({pupil: this.pupil});
    }

    _beforeHandleSuccess(response){
        this._fetchMessages(1,true);
        this._form.reset();
        this._clearResponse();
        this._success = true;
    }

    async _handlePaginationChange(e){
        this._messagesContainer?.classList.add('loading');
        await this._fetchMessages(e.detail.page);
        this._messagesContainer?.classList.remove('loading');
    }

    static styles = [
        super.styles,
        css`
            .avatar-svg svg{
                width: 40px;
                height: 40px;
            }
            .avatar-options{
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .avatar-option:has(input[type="radio"]:checked){
                .avatar-svg{
                    animation: jump var(--transition) ease-in-out 3;
                }
            }

            @keyframes jump {
                0%, 100% {
                    transform: translateY(0);   
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            details{
            
                padding:1rem;
                border:2px solid var(--purple-shade-1);
                border-radius:var(--border-radius);
                summary{
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    gap:1rem;
                    position:relative;
                    &::before{
                        content:'';
                        display:inline-block;
                        width:1px;
                        height:1px;
                        border: 1rem solid transparent;
                        border-top:1.5rem solid var(--purple-shade-1);
                        transition:transform 0.3s ease;
                        transform:rotate(-90deg) translate(0,25%);
                    }
                }
                &[open] summary::before{
                    transform:rotate(0deg) translate(0,25%);
                }
            }

            .messages_wrapper{
                margin-top:2rem;
                padding:1rem;
                border:2px solid var(--purple-shade-1);
                border-radius:var(--border-radius);
            }

            .messages_list{
                list-style:none;
                margin:0;
                padding:0;
                grid-template-columns:1fr;
                margin:0 auto;
                justify-content:center;
            }

            .card{
                padding:1rem;
                grid-template-columns: 1.5rem 1fr;
                grid-template-rows: auto 1fr;
                gap:1rem;
                width:100%;
                max-width: 600px;
                justify-self: center;
                svg{
                    grid-row:1/3;
                    margin-top:0.3rem;
                }
                h4,p{
                    margin:0;
                }
            }

            shalem-paginator{
                margin-top:1rem;
            }
        `
    ];
}