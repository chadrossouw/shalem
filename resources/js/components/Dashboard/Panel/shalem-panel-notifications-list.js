import { html, LitElement, css } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseNotificationsConsumer } from "../../Notifications/base-notifications-consumer.js";
import { PaginationListener } from "../../Pagination/pagination-listener.js";
import { BaseClass } from "../../BaseClass.js";
import notificationNavOpen from "../../../icons/notifications-symbol-open.svg";
import notificationNavClosed from "../../../icons/notifications-symbol-closed.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";


export class ShalemPanelNotificationsList extends PaginationListener(BaseNotificationsConsumer(BaseDashboardConsumer(BaseClass(LitElement)))){
    static properties = {
        ...super.properties,
        identifier: { type: String },
    }

    connectedCallback(){
        super.connectedCallback();
    }

    get notificationNodes(){
        return this.shadowRoot.querySelectorAll('.notification');
    }

    updated(changedProperties){
        super.updated(changedProperties);
        this._getIntersectionObserver().disconnect();
        this.notificationNodes.forEach(notification => {
            this._getIntersectionObserver().observe(notification);
        });
    }

    render(){
        if(!this._activeNotifications){
            return html`<shalem-loader>Fetching the mail...</shalem-loader>`;
        }
        let page = this._activeNotificationsPagination?.current_page ?? 1;
        if(this._activeNotifications[page] && this._activeNotifications[page].length > 0){
            return html`
                <ul class="notifications_list cards">
                    ${this._activeNotifications[page].map(notification => {
                        let avatar ='';
                        let action = '';
                        
                        if(notification.avatar_id){
                            avatar = html`<shalem-avatar avatarid="${notification.avatar_id}"></shalem-avatar>`; 
                        }
                        if(notification.actions){
                            let actions = notification.actions;
                            action = actions.map(action => html`<button @click=${() => this._handleAction({dashboard: action.dashboard, panel: action.panel, view: action.view})} ?disable=${action.status!='pending'}>${action.title}</button>`);
                        }
                        let statusClass = 'bg_white shadow';
                        let notificationIcon  = unsafeSVG(notificationNavOpen);
                        let statusText = 'Unread';
                        let status= "unread";
                        let statusActions = html`<button class="bg_blue status_action" @click=${(e) => this._markAsRead(notification.id,e.target)}>Mark as read</button>`;
                        if(notification.read_at){
                            statusClass = 'bg_pale_grey';
                            notificationIcon  = unsafeSVG(notificationNavClosed);
                            statusText = 'Read';
                            status= "read";
                            statusActions = html`<button class="bg_blue status_action" @click=${(e) => this._archive(notification.id,e.target)}>Archive</button>`;
                        }
                        if(notification.archived){
                            statusClass = 'bg_pale_grey archived';
                            notificationIcon  = unsafeSVG(notificationNavClosed);
                            statusText = 'Archived';
                            status= "archived";
                            statusActions = html`<button class="bg_blue status_action" @click=${(e) => this._unarchive(notification.id,e.target)}>Unarchive</button>`;
                        }
                        return html`
                        <li class="notification ${statusClass} radius grid" data-id="${notification.id}" data-status="${status}">
                            <div class="message">${avatar}<h3>${notification.subject}</h3><p>${notification.message}</p></div>
                            <div class="status" title="${statusText}">${notificationIcon}</div>
                            <div class="button-group">
                                ${action}
                                ${statusActions}
                            </div>
                        </li>
                        `;
                    })}
                </ul>
            `;
        }
        if(this.panel==='unread'){
            return html`<p>You don't have any unread notifications. <button @click=${this._seeAll}>Go to all notifications?</button></p>`;
        }
        if(this.panel==='archived'){
            return html`<p>You don't have any archived notifications. <button @click=${this._seeAll}>Go to current notifications?</button></p>`;
        }
        return html`<p>You don't have any notifications. <a href="/upload" @click=${this._goHome}>Go home?</a></p>`;
    }

    _goHome(e){
        e.preventDefault();
        this._updateContext({dashboard: null, panel: null, view: null});
    }

    _seeAll(){
        this._updateContext({panel: 'all'});
    }

    _getIntersectionObserver(){
        if(!this._observer){
            this._observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting){
                        if(entry.target.dataset.status == 'unread'){
                            this._markAsRead(entry.target.dataset.id);
                            entry.target.dataset.status = 'read';
                            entry.target.classList.remove('bg_white');
                            entry.target.classList.add('bg_pale_grey');
                            entry.target.classList.remove('shadow');
                            let icon = entry.target.querySelector('.status');
                            icon.innerHTML = notificationNavClosed;
                            let statusActions = entry.target.querySelector('.status_action');
                            statusActions.textContent = 'Archive';
                            statusActions.onclick = (e) => this._archive(entry.target.dataset.id,e.target);
                        }
                    }
                });
            }, { rootMargin: '0px 0px -80%' });
        }
        return this._observer;
    }

    static styles = [
        super.styles,
        css`
        .notifications_list.cards{
            display:grid;
            gap:2rem;
            margin-bottom:2rem;
            li{
                padding:1rem;
                grid-template-columns: 1fr auto;
                h3{
                    margin-top:0;
                    margin-bottom:0;
                }
                shalem-avatar{
                    width:clamp(4rem, 10vw, 8rem);
                    grid-row:1/3;
                }
                .message:has(>shalem-avatar){
                    display:grid;
                    grid-template-columns: auto 1fr;
                    gap:1rem;
                }
                .button-group{
                    grid-column: 1/3;
                    display:flex;
                    justify-content:space-between;
                }
            }
        }
        `
    ];
    
}