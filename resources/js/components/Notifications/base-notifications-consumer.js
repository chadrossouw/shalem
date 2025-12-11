import { safeFetch } from "../../common/xsrf";
import { css } from "lit";

export const BaseNotificationsConsumer = (superClass) => class extends superClass{

    static properties = {
        ...super.properties,
        _activeNotifications: { type: Object , state:true},
        _activeNotificationsPagination: { type: Object , state:true},
    }

    connectedCallback(){
        super.connectedCallback();
        if(!this.panel){
            if(this.unreadNotifications && this.unreadNotifications[1].length > 0){
                this.panel = 'unread';
            }
            else{
                this.panel = 'all';
            }

        }
        this.setActiveNotifications();
    }

    updated(changedProperties){
        super.updated(changedProperties);
        if(changedProperties.has('panel') || changedProperties.has('notifications') || changedProperties.has('unreadNotifications') || changedProperties.has('archivedNotifications')){
            this.setActiveNotifications();
        }
        console.log('Active Notifications:', this._activeNotifications);
    }

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
        let data = await response.json();
        this._processResponseToContext(data);
        
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
        let data = await response.json();
       this._processResponseToContext(data);
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
        let data = await response.json();
        this._processResponseToContext(data);
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

        let data = await response.json();
        this._processResponseToContext(data);
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    async _archiveAll(target=null) {
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
        let data = await response.json();
        this._processResponseToContext(data);
        if(target){
            target.classList.remove('loading');
            target.disabled=false;
        }
    }

    setActiveNotifications(){
        if(this.panel == 'unread'){
            this._activeNotifications = this.unreadNotifications;
        }
        else if(this.panel == 'archived'){
            this._activeNotifications = this.archivedNotifications;
        }
        else{
            this._activeNotifications = this.notifications ;
        }
        if(!this._activeNotifications){
           this._fetchNotifications();
        }
        this.requestUpdate();
    }

    async _fetchNotifications(page=1,query=false,refresh=false){
        this.notificationsContainer?.classList.add('loading');      
        if(this._activeNotifications && this._activeNotifications[page] && !refresh && !query){
            this._activeNotificationsPagination.current_page = page;
            switch (this.panel) {
                case 'unread':
                    this._updateContext({unreadNotificationsPagination: this._activeNotificationsPagination});
                    break;
                case 'archived':
                    this._updateContext({archivedNotificationsPagination: this._activeNotificationsPagination});
                    break;
                default:
                    this._updateContext({notificationsPagination: this._activeNotificationsPagination});
                    break;
            }
            return;
        }
        let fetchUrl =`${this.restUrl}notifications?page=${page}&type=${this.panel}`;
        if(query){
            fetchUrl += `&query=${encodeURIComponent(query)}`;
        }
        const response = await safeFetch(fetchUrl);
        const data = await response.json();
        switch (this.panel) {
            case 'unread':
                this.unreadNotifications[page] = data.notifications.data;
                delete data.notifications.data;
                this.unreadNotificationsPagination = data.notifications;
                this._activeNotifications = this.unreadNotifications;
                this._activeNotificationsPagination = this.unreadNotificationsPagination;
                this._updateContext({unreadNotifications: this.unreadNotifications, unreadNotificationsPagination: this.unreadNotificationsPagination});
            break;
            case 'archived':
                this.archivedNotifications[page] = data.notifications.data;
                delete data.notifications.data;
                this.archivedNotificationsPagination = data.notifications;
                this._activeNotifications = this.archivedNotifications;
                this._activeNotificationsPagination = this.archivedNotificationsPagination;
                this._updateContext({archivedNotifications: this.archivedNotifications, archivedNotificationsPagination: this.archivedNotificationsPagination});
            break;
            default:
                this.notifications[page] = data.notifications.data;
                delete data.notifications.data;
                this.notificationsPagination = data.notifications;
                this._activeNotifications = this.notifications;
                this._activeNotificationsPagination = this.notificationsPagination;
                this._updateContext({notifications: this.notifications, notificationsPagination: this.notificationsPagination});
            break;
        }
        this.notificationsContainer?.classList.remove('loading');
    }

    _processResponseToContext(data){
        this.notifications = {};
        this.notifications[1] = data.notifications.data;
        this.unreadNotifications = {};
        this.unreadNotifications[1] = data.unread_notifications.data;
        this.archivedNotifications = {};
        this.archivedNotifications[1] = data.archived_notifications.data;
        this._updateContext({ notifications: this.notifications, unreadNotifications: this.unreadNotifications, archivedNotifications: this.archivedNotifications });
    }
    
    _getUnreadCount(){
        return Object.entries(this.notifications).reduce((a,notifications) => a + notifications[1].filter(notification => notification.read_at==null).length, 0 );
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