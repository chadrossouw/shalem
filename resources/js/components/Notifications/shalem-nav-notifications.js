import { BaseNotificationsConsumer } from "./base-notifications-consumer";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer";
import { BaseClass } from "../BaseClass";
import { html, LitElement,css } from "lit";


export class ShalemNavNotifications extends BaseNotificationsConsumer(BaseDashboardConsumer(BaseClass(LitElement))) {
    constructor(){
        super();
    }

    render(){
        let notifications = this.unreadNotifications[1].slice(0,2);
        let moreButton = '';
        if(this.unreadNotifications[1].length > 2){
            moreButton = html`<button class="more-button" @click=${(e) => {e.preventDefault(); this._goToNotifications()}}>You have ${this.unreadNotifications[1].length} more unread notifications.</button>`;
        }
        return html`
        <div class="notifications grid">
            ${notifications.map(notification => {
                let avatar ='';
                let action = ''
                if(notification.avatar_id){
                    avatar = html`<shalem-avatar avatarid="${notification.avatar_id}"></shalem-avatar>`; 
                }
                if(notification.actions){
                    let actions = notification.actions;
                    action = actions.map(action => html`<button @click=${() => this._handleAction({dashboard: action.dashboard, panel: action.panel, view: action.view})} ?disabled=${action.status!='pending'}>${action.title}</button>`);
                }
                return html`
                <div class="notification bg_white radius">
                    ${avatar}
                    <div class="message"><h3>${notification.subject}</h3><p>${notification.message}</p></div>
                    <div class="button-group">
                        ${action}
                        <button class="bg_blue" @click=${(e) => this._markAsRead(notification.id,e.target)}>Mark as read</button>
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
        super.styles,
        css`
        .notifications{
            max-height:100dvh;
            overflow-y:auto;
        }

        .notification{
            padding:1rem;
            display:grid;
            grid-template-rows: auto auto;
            gap:1rem;
            svg{
                height:3rem;
            }
        }
        .notification:has(shalem-avatar){
            grid-template-columns: auto 1fr;
            svg{
                grid-row:1/2;
                grid-column:1/2;
            }
            .message{
                grid-row:1/2;
                grid-column:2/3;
            }
            .button-group{
                grid-row:2/3;
                grid-column:1/-1;
                display: flex;
                gap: 1rem;
            }
        }
        h3{
            margin-top:0;
            font-size:1.2rem;
        }
        p{
            margin:0 0 0.5rem;
        }
        button{
            font-size:1rem;
        }
        `
    ]
}