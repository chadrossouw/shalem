import { ShalemBaseNavConsumer } from "./shalem-base-nav-consumer";
import { BaseClass } from "../BaseClass";
import { ShalemBaseDashboardConsumer } from "../Dashboard/shalem-base-dashboard-consumer";
import { html, LitElement, css } from "lit";

import dashboardNav from "../../icons/dashboard-nav.svg";
import pointsNav from "../../icons/points-nav.svg";
import uploadNav from "../../icons/upload-nav.svg";
import goalsNav from "../../icons/goals-nav.svg";
import notificationsNavClosed from "../../icons/notifications-nav-closed.svg";   
import notificationsNavOpen from "../../icons/notifications-nav-open.svg";
import close from "../../icons/close.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
export class ShalemNavbar extends ShalemBaseNavConsumer(ShalemBaseDashboardConsumer(BaseClass(LitElement))) {
    static properties = {
        ...super.properties,
        _dismissedNotifications: { type: Boolean, state: true },
        _openNotifications: { type: Boolean, state: true },
    }

    constructor(){
        super();
        this._dismissedNotifications = false;
        this._openNotifications = false;
    }

    render(){
        if(!this._dashboard){
            return html`<shalem-loader>Finding navigation, Captain</shalem-loader>`;
        }
        if(this.identifier == 'student'){
            let currentPage = this._dashboard.panel;
            let navIcon = this._getNotificationIcon();
            if(this.notifications && this.notifications.length > 0 && !this._dismissedNotifications){
                let count = this.notifications.length<10 ? this.notifications.length : '+';
                let button;
                if(!this._openNotifications){
                    button = html`
                        <button @click=${this._openCloseNotifications} aria-controls="updates" aria-expanded="${this._openNotifications}"><span class="button_text">You have new updates</span><span class="notification_count">${!this._openNotifications ? count : unsafeSVG(close)}</span></button>
                    `;
                }   
                else{
                    button = html`
                        <button @click=${this._dismissNotifications}><span class="button_text">Dismiss</span><span class="notification_count">${unsafeSVG(close)}</span></button>
                    `;
                }
                return html`
                <div class="navbar">   
                    <shalem-swipable @swiped=${this._dismissNotifications}>
                        ${button}
                    </shalem-swipable>
                    <div class="updates_panel ${this._openNotifications ? 'open' : ''}" id="updates">
                        <shalem-nav-notifications identifier="${this.identifier}"></shalem-notifications>
                    </div>
                </div>

                `;
            }
            return html`  
                <div class="navbar">      
                    <nav>
                        <ul>
                            <li><a href="/dashboard" @click=${(e) => this._handleNavigation(e, 'dashboard')} aria-current="${currentPage === '' ? 'page' : 'false'}"><span aria-hidden="true">${unsafeSVG(dashboardNav)}</span><span class="screen-reader-text">Dashboard</span></a></li>
                            <li><a href="/dashboard/points" @click=${(e) => this._handleNavigation(e, 'points')} aria-current="${currentPage === 'points' ? 'page' : 'false'}"><span aria-hidden="true">${unsafeSVG(pointsNav)}</span><span class="screen-reader-text">Points</span></a></li>
                            <li><a href="/dashboard/upload" @click=${(e) => this._handleNavigation(e, 'upload')} aria-current="${currentPage === 'upload' ? 'page' : 'false'}"><span aria-hidden="true">${unsafeSVG(uploadNav)}</span><span class="screen-reader-text">Upload</span></a></li>
                            <li><a href="/dashboard/goals" @click=${(e) => this._handleNavigation(e, 'goals')} aria-current="${currentPage === 'goals' ? 'page' : 'false'}"><span aria-hidden="true">${unsafeSVG(goalsNav)}</span><span class="screen-reader-text">Goals</span></a></li>
                            <li><a href="/dashboard/notifications" @click=${(e) => this._handleNavigation(e, 'notifications')} aria-current="${currentPage === 'notifications' ? 'page' : 'false'}"><span aria-hidden="true">${unsafeSVG(navIcon)}</span><span class="screen-reader-text">Notifications</span></a></li>
                        </ul>
                    </nav>
                </div>
            `;
        }
    }

    _openCloseNotifications(){
        if(this._openNotifications){
            this._openNotifications = false;
        }
        else{
            this._openNotifications = true;
        }
    }

    _dismissNotifications(){
        this._dismissedNotifications = true;
        this._openNotifications = false;
        this.notifications.forEach((notification,i) => {
            if(i<3){
                this._markAsRead(notification.id);
            }
        });
    }

    _handleNavigation(e, panel){
        e.preventDefault();
        this._handleAction({panel: panel, view: null});
    }

    _getNotificationIcon(){
        let notifications = this._dashboard.notifications || [];
        if(notifications.length > 0){
            let count = notifications.length<10 ? notifications.length : '+';
            let notificationsNavOpenNumbered = notificationsNavOpen.replace('<tspan x="0" y="0">1</tspan>', `<tspan x="0" y="0">${count}</tspan>`);
            return notificationsNavOpenNumbered;
        }
        else{
            return notificationsNavClosed;
        }
    }

    static styles = [
        ...super.styles,
        css`
        svg{
            width:2rem;
            height:2rem;
        }
        .updates_panel{
            max-height:0;
            overflow:hidden;
            transition:max-height var(--transition) ease;
            &.open{
                max-height:100dvh;
            }
        }
        `
    ];
}