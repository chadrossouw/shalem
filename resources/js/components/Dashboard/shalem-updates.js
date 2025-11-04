import { ShalemBaseDashboardConsumer } from "./shalem-base-dashboard-consumer";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";
import FredGeek from '../../../../public/avatars/fred-geek.svg';

export class ShalemUpdates extends ShalemBaseDashboardConsumer(BaseClass(LitElement)) {
    connectedCallback() {
        super.connectedCallback();
        console.log(document);
        document.body.classList.add('updates');
        ({updates:this.updates} = this._dashboard);
        console.log(this.updates);
        this._update = this.updates[0];
        this._update.actions = JSON.parse(this._update.actions);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.classList.remove('updates')
    }

    render() {
        return html`
        ${unsafeSVG(FredGeek)}
        <h1>${this._update.subject}</h1>
        <p>${this._update.message}</p>
        ${this._update.actions.map(action => html`<button @click=${(e) => {e.preventDefault(); this._handleActionClick(action.action)}}>${action.title}</button>`)}
        <button @click=${this._goBack}>Back to Dashboard</button>
        `
    }

    _handleActionClick(action) {
        this._markUpdateAsRead();
        this._handleAction(action);
    }

    async _markUpdateAsRead() {
        const response = await safeFetch(`${this.restUrl}notifications/${this._update.id}/mark-read`, {
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
        console.log('Update marked as read');
        this.updates = [];
        this.notifications = response.notifications;
        this._updateContext({ updates: this.updates, notifications: this.notifications });
    }
}