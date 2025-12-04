import {html,css, LitElement} from 'lit';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import notificationIconOpen from '../../icons/notification-icon-open.svg';
import notificationIconClosed from '../../icons/notification-icon-closed.svg';
import notificationIconArchive from '../../icons/notification-icon-archive.svg';
import { cardLinks } from '../../common/accessibility.js';
import { cards, toggle } from '../../utilities/baseStyles.js';
export class ShalemDashboardNotifications extends BaseDashboardConsumer(BaseClass(LitElement)){
    static properties = {
        ...super.properties,
        _archive: {type: Boolean, state: true},
    }

    constructor(){
        super();
        this._archive = false;
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

    render(){
        console.log(this.notificationsPagination);
        console.log(this.notifications);
        let body = html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${this._getNotificationIcon()}</div>
                ${!this._archive ? html`
                    <shalem-editable-field name="notifications_dashboard_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.notifications_dashboard_header ?? 'My notifications'}</h1>
                    </shalem-editable-field>
                ` : html`
                <shalem-editable-field name="notifications_dashboard_header_archived" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.notifications_dashboard_header_archived ?? 'My archived notifications'}</h1>
                </shalem-editable-field>
                `}
            </div>
            <div class="margins">
                <shalem-panel-notification-list identifier="${this.identifier}">
                </shalem-panel-notification-list>
                <shalem-paginator 
                    currentPage=${this.notificationsPagination?.current_page}
                    paginationID=${this.paginationID}
                    lastPage=${this.notificationsPagination?.last_page}
                ></shalem-paginator>
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

    _getNotificationIcon(){
        if(this._archive){
            return unsafeSVG(notificationIconArchive);
        }
        else{
            let count = this._getUnreadCount();
            if(count > 0){
                console.log(count);
                count = count<10 ? count : '9+';
                let notificationsNavOpenNumbered = notificationIconOpen.replace('<tspan x="0" y="0">1</tspan>', `<tspan x="0" y="0">${count}</tspan>`);
                return unsafeSVG(notificationsNavOpenNumbered);
            }
            else{
                return unsafeSVG(notificationIconClosed);
            }
        }
    }

    _getUnreadCount(){
        return Object.entries(this.notifications).reduce((a,notifications) => a + notifications[1].filter(notification => notification.read_at==null).length, 0 );
    }

    async _fetchNotifications(page=1,query=false,refresh=false){
        if(this.notifications[page] && !refresh && !query){
            this.notificationsPagination.current_page = page;
            
            this._updateContext({notificationsPagination: this.notificationsPagination});
            return;
        }
        let fetchUrl =`${this.restUrl}notification?page=${page}`;
        if(query){
            fetchUrl += `&query=${encodeURIComponent(query)}`;
        }
        const response = await safeFetch(fetchUrl);
        const data = await response.json();
        this.notifications[page] = data.notifications.data;
        delete data.notifications.data;
        this.notificationsPagination = data.notifications;
        this._updateContext({notifications: this.notifications, notificationsPagination: this.notificationsPagination});
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