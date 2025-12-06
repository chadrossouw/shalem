import {ContextProvider} from '@lit/context';
import { dashboardContext } from '../../utilities/context.js';
import { LitElement, html } from 'lit';
import { EventManager } from '../../utilities/events.js';

export class ShalemBaseProvider extends LitElement {

    static properties = {
        identifier: { type: String },
        user: { type: Object },
        notifications: { type: Object },
        unreadNotifications: { type: Object },
        archivedNotifications: { type: Object },
        notificationsPagination: { type: Object },
        unreadNotificationsPagination: { type: Object },
        notificationsArchivedPagination: { type: Object },
        documents: { type: Object },
        document: { type: Object },
        documentsPagination: { type: Object },
        updates: { type: Array },
        fields: { type: Array },
        dashboard: { type: String },
        pillars: { type: Array },
        panel: {type: String},
        view: {type: String},
        action: {type: String},
        token: {type: String, reflect: true},
    };

    constructor(){
        super(); 
    }

    connectedCallback(){
        super.connectedCallback();
        if(this.token){
            this._setAuthToken();
        }
        else{
            window.sessionStorage.removeItem('auth_token');
            this.token = null;
            window.location.href='/?error=auth';
        }
        
        if(!this.documents){
            this.documents = [];
        }
        this.history=[{ dashboard: this.dashboard, panel: this.panel, view: this.view }];
        this.dashboardContext = {
            user: this.user,
            fields: this.fields,
            dashboard: this.dashboard,
            history: this.history,
            notifications: this.notifications,
            unreadNotifications: this.unreadNotifications,
            archivedNotifications: this.archivedNotifications,
            documents: this.documents,
            document: this.document,
            documentsPagination: this.documentsPagination,
            notificationsPagination: this.notificationsPagination,
            unreadNotificationsPagination: this.unreadNotificationsPagination,
            notificationsArchivedPagination: this.notificationsArchivedPagination,
            pillars: this.pillars,
            updates: this.updates,
            panel: this.panel,
            view: this.view,
            action: this.action,
            breadcrumb: this._setBreadcrumb(),
            title: this._setTitle(),
            nav: this._setNav(),
            documentApprovalTime: 3, //days
        };
        this.eventManager = new EventManager(this);
        this.eventManager.listen(`shalem-dashboard-${this.identifier}-update`,this._handleUpdate);
        this.dashboardProvider = new ContextProvider(this, {context:dashboardContext, initialValue: this.dashboardContext});
        this.eventManager.initHistory({dashboard: this.dashboard, panel: this.panel, view: this.view, action: this.action });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventManager.disconnect();
    }

    render(){
        return html`<slot></slot>`;
    }

    _handleUpdate = (e) => {
        const detail = e.detail;
        let newHistory = this.history;
        if(detail){
            if(this.dashboard !== detail.dashboard || this.panel !== detail.panel || this.view !== detail.view || this.action !== detail.action){
                let url = `/dashboard/`;
                if(detail.dashboard){
                    url += `${detail.dashboard}/`;
                    if(detail.panel){
                        url += `${detail.panel}/`;
                        if(detail.view){
                            url += `${detail.view}/`;
                            if(detail.action){
                                url += `${detail.action}/`;
                            }
                        }

                    }
                }
                this.eventManager.addHistory(`${url}`,{dashboard: detail.dashboard, panel: detail.panel, view: detail.view, action: detail.action});
                newHistory.push({ dashboard: detail.dashboard, panel: detail.panel, view: detail.view, action: detail.action });
            }
            this.dashboardContext = {
                ...this.dashboardContext,
                ...detail
            };
        }
        else{
            let state = Object.entries(e.state);
            if(state.length==0){
                return;
            }
            let newContext = {};
            state.forEach((item)=>{
                let _key = item[0];
                let _value = item[1];
                this[_key] = _value;
                newContext[_key] = _value;
            });
            this.eventManager.addHistory(`${window.location.href}`,{dashboard: this.dashboard, panel: this.panel, view: this.view, action: this.action});
            newHistory.push({ dashboard: this.dashboard, panel: this.panel, view: this.view, action: this.action });
            this.dashboardContext = {
                ...this.dashboardContext,
                ...newContext
            };
        }
        ({
            user: this.user, 
            notifications: this.notifications, 
            unreadNotifications: this.unreadNotifications, 
            archivedNotifications: this.archivedNotifications, 
            notificationsPagination: this.notificationsPagination,
            unreadNotificationsPagination: this.unreadNotificationsPagination,
            notificationsArchivedPagination: this.notificationsArchivedPagination,
            documents: this.documents,
            document: this.document,
            documentsPagination: this.documentsPagination, 
            updates: this.updates, 
            fields: this.fields, 
            dashboard: this.dashboard, 
            history: this.history, 
            panel: this.panel, 
            view: this.view, 
            action: this.action
        } = this.dashboardContext);
        this.history = [...this.history, ...newHistory];
        this.dashboardContext.history = this.history;
        this.dashboardProvider.setValue(this.dashboardContext);
        this.eventManager.emit(`shalem-dashboard-updated`,this.dashboardContext);
    }

    _setBreadcrumb(){
        return [];
    }

    _setTitle(){
        return '';
    }
    
    _setNav(){
        return {};
    }

    _setAuthToken(){
        window.sessionStorage.setItem('auth_token', this.token);
        this.token = null;
    }

    _getAuthToken(){
        return window.sessionStorage.getItem('auth_token');
    }
}
