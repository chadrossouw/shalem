import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";
import FredGeek from '../../../../public/avatars/fred-geek.svg';

export class ShalemUpdates extends BaseDashboardConsumer(BaseClass(LitElement)) {
    connectedCallback() {
        super.connectedCallback();
        document.body.classList.add('updates');
        ({updates:this.updates} = this._dashboard);
        this._update = this.updates[0];
        console.log(this._update);
        try{
            this._update.actions = this._update.actions?JSON.parse(this._update.actions):[];
        }
        catch(e){
            this._update.actions = [];
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.classList.remove('updates')
    }

    render() {
        let avatar = '';
        if (this._update.avatar_id) {
            avatar = html`<shalem-avatar avatarid="${this._update.avatar_id}"></shalem-avatar>`;
        }
        else{
            avatar = html`${unsafeSVG(FredGeek)}`;
        }
        return html`
        <div class="padding bg_green">
        ${avatar}
        <h1 class="white">${this._update.subject}</h1>
        <p class="white">${this._update.message}</p>
        <div class="grid">
            ${this._update.actions.map(action => html`<button class="bg_green bg_shade_1 black" @click=${(e) => {e.preventDefault(); this._handleActionClick(action.action)}}>${action.title}</button>`)}
            <button class="bg_light_blue" @click=${this._handleDismissClick}>Dismiss</button>
            </div>
        </div>
        `
    }

    _handleDismissClick(e) {
        e.preventDefault();
        this._markUpdateAsRead();
        //this._goBack();
    }

    _handleActionClick(action) {
        this._markUpdateAsRead();
        this._handleAction(action);
    }

    async _markUpdateAsRead() {
        let response = await safeFetch(`${this.restUrl}notifications/${this._update.id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        });
        if (!response.ok) {
            console.error('Failed to mark update as read');
            return;
        }
        response = await response.json();
        this.updates = [];
        this.notifications = response.notifications;
        this._updateContext({ updates: this.updates, notifications: this.notifications });
    }
    static styles = [
        super.styles,
        css`
        :host{
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100dvh;
            &>div{
                height:100dvh;
                display:grid;
                grid-template-rows: auto auto 1fr auto;
                padding-top:var(--header-height);
                padding-bottom:var(--header-height);
            }

        }
        shalem-avatar{
            svg{
                max-height:33dvh;
                margin-left:auto;
                display:block;
            }
        }
        p{
            font-size:1.4rem;
        }
    `];
}