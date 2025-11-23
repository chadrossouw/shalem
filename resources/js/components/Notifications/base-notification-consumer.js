import { safeFetch } from "../../common/xsrf";
import { css } from "lit";

export const BaseNotificationsConsumer = (superClass) => class extends superClass{

    _goBack(e){
        e?.preventDefault();
        let history = this._dashboard.history;
        if(history.length > 1){
            history.pop();
            const previousDashboard = history[history.length - 1];
            this._updateContext({dashboard: previousDashboard.dashboard, panel: previousDashboard.panel, view: previousDashboard.view });
        }
    }

    _handleAction(action,target=null){
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        this._updateContext({...action});
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    async _markAsRead(id,target=null) {
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        const response = await safeFetch(`${this.restUrl}notifications/${id}/read`, {
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
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    async _markAllAsRead(target=null) {
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        const response = await safeFetch(`${this.restUrl}notifications/read-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error('Failed to mark all updates as read');
            return;
        }
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    async _archive(id,target=null) {
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        const response = await safeFetch(`${this.restUrl}notifications/${id}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ archived: true })
        });
        if (!response.ok) {
            console.error('Failed to archive notification');
            return;
        }
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    async _unarchive(id,target=null) {
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        const response = await safeFetch(`${this.restUrl}notifications/${id}/unarchive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ archived: false })
        });
        if (!response.ok) {
            console.error('Failed to unarchive notification');
            return;
        }
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    _archiveAll(target=null) {
        if(target){
            target.classList.add('loading');
            target.disabled=true;
        }
        const response = safeFetch(`${this.restUrl}notifications/archive-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error('Failed to archive all notifications');
            return;
        }
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    static styles = [
        super.styles,
        css`
        .loading {
            position: relative;
            pointer-events: none;
            
        }
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            right:1rem;
            width: 1rem;
            height: 1rem;
            border: 2px solid var(--primary-color);
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: var(--spinner-animation);
            transform: translateY(-50%);
        }
    `]
}