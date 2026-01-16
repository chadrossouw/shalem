import { css, html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { BaseForm } from "../../Form/base-form.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { safeFetch } from "../../../common/xsrf.js";
import { dateToString } from "../../../common/date.js";

export class ShalemStaffMessages extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))){
    static properties = {
        ...super.properties,
        _messages: { type: Array, state: true },
        _messagesPagination: { type: Object, state: true },
        _currentPage: { type: Number, state: true }
    }

    constructor(){
        super();
        this.paginationID = `messages-${this.identifier}`;
    }

    connectedCallback(){
        super.connectedCallback();
        this._fetchMessages();
    }

    render(){
        
        let body = html`
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
        let footer = html`
            
        `;
        return html`${body}${footer}`;
    }


    async _fetchMessages(){
        let page = this._messagesPagination ? this._messagesPagination.current_page : 1;
        if(!this._messages){
            this._messages = this.pupil.messages;
        }
        if(this._messages && this._messages[page] && !refresh && !query){
            this._messagesPagination.current_page = page;
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
        this._updateContext({pupil: this.pupil});
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
        `
    ];
}