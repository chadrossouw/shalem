import {html,css, LitElement} from 'lit';
import { BaseNotificationsConsumer } from '../Notifications/base-notifications-consumer.js';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import notificationIconOpen from '../../icons/notification-icon-open.svg';
import notificationIconClosed from '../../icons/notification-icon-closed.svg';
import notificationIconArchive from '../../icons/notification-icon-archive.svg';
import { safeFetch } from '../../common/xsrf.js';
import { cards, toggle } from '../../utilities/baseStyles.js';
export class ShalemDashboardNotifications extends BaseNotificationsConsumer(BaseDashboardConsumer(BaseClass(LitElement))){
    static properties = {
        ...super.properties,
        _isArchive: {type: Boolean, state: true},
        _isUnread: {type: Boolean, state: true},
        _notifications: { type: Object, state: true },
        _notificationsPagination: { type: Object, state: true },
    }

    constructor(){
        super();
        
    }

    connectedCallback(){
        super.connectedCallback();
        this.paginationID = `notifications-${this.identifier}`;
    }

    async updated(changedProperties){
        super.updated(changedProperties);
    }

    connectedCallback(){
        super.connectedCallback();
        this.paginationID = `my-notifications-${this.identifier}`;
        if(!this.notifications){
            this._fetchNotifications();
        }
    }
    
    firstUpdated(){
        this._setDocumentTitle('My Notifications');
    }

    get notificationsContainer(){
        return this.shadowRoot.querySelector('.notifications_container');
    }

    render(){
        let archiveButton = html`<button @click=${this._handleArchiveToggle} aria-pressed="false">View archived notifications</button>`;
        let header = html`
            <shalem-editable-field name="notifications_dashboard_header" location="student-dashboard" ?admin=${this.isAdmin}>
                <h1>${this.fields?.notifications_dashboard_header ?? 'My notifications'}</h1>
            </shalem-editable-field>
        `;
        if(this.panel==='archived'){
            header = html`
                <shalem-editable-field name="notifications_dashboard_header_archived" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.notifications_dashboard_header_archived ?? 'My archived notifications'}</h1>
                </shalem-editable-field>
            `;
            archiveButton = html`<button @click=${this._handleArchiveToggle} aria-pressed="true">View current notifications</button>`;
        }
        if(this.panel==='unread'){
            header = html`
                <shalem-editable-field name="notifications_dashboard_header_unread" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.notifications_dashboard_header_unread ?? 'My unread notifications'}</h1>
                </shalem-editable-field>
            `;
        }
        let body = html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${this._getNotificationIcon()}</div>
                ${header}
            </div>
            <div class="margins notifications_container">
                <shalem-panel-notifications-list identifier="${this.identifier}">
                </shalem-panel-notifications-list>
                <shalem-paginator 
                    currentPage=${this._activeNotificationsPagination?.current_page}
                    paginationID=${this.paginationID}
                    lastPage=${this._activeNotificationsPagination?.last_page}
                ></shalem-paginator>
            </div>
        `;
        let toggleUnread = html``;
        if(this.panel !== 'archived'){
            toggleUnread = html`
            <div class="margins">
                <div class="toggle">
                    <input type="checkbox" id="unread_toggle" name="unread_toggle" @change=${this._handleUnreadToggle} ?checked=${this.panel==='unread'}>
                    <label for="unread_toggle" class="screen_reader_only">Toggle between viewing unread and all notifications</label>
                    <div class="toggle_text unchecked"><span>All</span></div>
                    <div class="toggle_text checked"><span>Unread</span></div>
                </div>
            </div>
            `;
        }
        return html`
            <slot></slot>
            ${toggleUnread}
            ${body}
            <div class="margins toggle_archive">
                ${archiveButton}
            </div>
        `;
    }

    _handleArchiveToggle(e){
        this._updateContext({panel: this.panel==='archived' ? 'all' : 'archived'});
    }

    _handleUnreadToggle(e){
        this._updateContext({panel: e.target.checked ? 'unread' : 'all'});
    }

    _getNotificationIcon(){
        if(this.panel === 'archived'){
            return unsafeSVG(notificationIconArchive);
        }
        else if(this.panel !== 'unread'){
            return unsafeSVG(notificationIconClosed);
        }
        else{
            let count = this._getUnreadCount();
            if(count > 0){
                count = count<10 ? count : '9+';
                let notificationsNavOpenNumbered = notificationIconOpen.replace('<tspan x="0" y="0">1</tspan>', `<tspan x="0" y="0">${count}</tspan>`);
                return unsafeSVG(notificationsNavOpenNumbered);
            }
            else{
                return unsafeSVG(notificationIconClosed);
            }
        }
    }

    

    async _handlePaginationChange(e){
        this.notificationsContainer?.classList.add('loading');
        await this._fetchNotifications(e.detail.page);
        this.notificationsContainer?.classList.remove('loading');
    }
    
    
    async _handlePaginationChange(e){
        this.documentContainer?.classList.add('loading');
        await this._fetchNotifications(e.detail.page);
        this.documentContainer?.classList.remove('loading');
    }
    
    static styles = [
        super.styles,
        cards,
        toggle,
    ];
}