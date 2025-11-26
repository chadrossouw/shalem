import {html,css, LitElement} from 'lit';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import notificationsIconOpen from '../../icons/notifications-icon-open.svg';
import notificationsIconClosed from '../../icons/notifications-icon-closed.svg';
import { cardLinks } from '../../common/accessibility.js';
export class ShalemDashboardNotifications extends BaseDashboardConsumer(BaseClass(LitElement)){
    static properties = {
        ...super.properties,
        _archive: {type: Boolean, state: true},
    }

    constructor(){
        super();
        this._archive = false;
    }

    render(){
        body = html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${unsafeSVG(pointsIcon)}</div>
                ${this._archive ? html`
                    <shalem-editable-field name="notifications_dashboard_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.notifications_dashboard_header ?? 'My notifications'}</h1>
                    </shalem-editable-field>
                ` : html`
                <shalem-editable-field name="notifications_dashboard_header_archived" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.notifications_dashboard_header_archived ?? 'My archived notifications'}</h1>
                </shalem-editable-field>
                `}
            </div>
            `;
        return html`
            <slot></slot>
            <div class="margins">
                <div class="toggle">
                    <input type="checkbox" id="archive_toggle" name="archive_toggle" @change=${this._handleArchiveToggle} ?checked=${this._archive}>
                    <label for="archive_toggle" class="screen_reader_only">Toggle between viewing current and archived notifications</label>
                    <div class="toggle_text unchecked"><span>Current</span></div>
                    <div class="toggle_text checked"><span>Archived</span></div>
                </div>
            </div>
            
            ${body}
        `;
    }

    _handleArchiveToggle(e){
        this._archive = e.target.checked;
    }
}