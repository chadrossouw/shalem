import { BaseNotificationsConsumer } from "./base-notification-consumer";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer";
import { BaseClass } from "../BaseClass";
import { html, LitElement,css } from "lit";


export class ShalemNavNotifications extends BaseNotificationsConsumer(BaseDashboardConsumer(BaseClass(LitElement))) {
    constructor(){
        super();
    }

    render(){
        let notifications = this.notifications.slice(0,3);
        let moreButton = '';
        if(notifications.length > 2){
            moreButton = html`<button class="more-button" @click=${(e) => {e.preventDefault(); this._goToNotifications()}}>See all notifications</button>`;
        }
        return html`
        <div class="notifications">
            ${notifications.map(notification => {
                let avatar ='';
                let action = ''
                if(notification.avatar_id){
                    avatar = html`<shalem-avatar avatarid="${notification.avatar_id}"></shalem-avatar>`; 
                }
                if(notification.actions){
                    let actions = JSON.parse(notification.actions);
                    action = actions.map(action => html`<button @click=${() => this._handleAction(action.action)}>${action.title}</button>`);
                }
                return html`
                <div class="notification">
                    <p>${notification.message}</p>
                    ${avatar}
                    <div class="button-group">
                        ${action}
                        <button @click=${(e) => this._markAsRead(notification.id,e.target)}>Mark as read</button>
                    </div>
                </div>
                `;
            })}
            ${moreButton}
        </div>
        `;
    }

    _goToNotifications(){
        this._updateContext({dashboard: 'notifications', panel: 'list', view: 'unread'});
    }

    static styles = [
        ...super.styles,
        css`
        .notification{
            svg{
                height:3rem;
            }
        }
        `
    ]
}