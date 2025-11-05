import { html, css, LitElement} from 'lit';
import { BaseClass } from '../BaseClass';
import {ContextProvider} from '@lit/context';
import { dashboardContext } from '../../utilities/context.js';
import { EventManager } from '../../utilities/events.js';

export const ShalemBaseDashboard = (superClass) => class extends superClass {
    static styles = [
        css`
            :host {
                display: block;
            }
        `
    ];

    static properties = {
        identifier: { type: String },
        user: { type: Object },
        notifications: { type: Array },
        updates: { type: Array },
        fields: { type: Array },
        dashboard: { type: String },
        panel: {type: String},
        view: {type: String},
        token: {type: String, reflect: true},
    };

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
        if(this.user.notifications){
            this.notifications = this.user.notifications??[];
            this.updates = this.notifications.filter(notification => notification.type === 'update');
        }
        this.history=[{ dashboard: this.dashboard, panel: this.panel, view: this.view }];
        this.dashboardContext = {
            user: this.user,
            fields: this.fields,
            dashboard: this.dashboard,
            history: this.history,
            notifications: this.notifications,
            updates: this.updates,
            panel: this.panel,
            view: this.view,
            breadcrumb: this._setBreadcrumb(),
            title: this._setTitle(),
            nav: this._setNav(),
        };
        this.eventManager = new EventManager(this);
        this.eventManager.listen(`shalem-dashboard-${this.identifier}-update`,this._handleUpdate);
        this.dashboardProvider = new ContextProvider(this, {context:dashboardContext, initialValue: this.dashboardContext});
        this.eventManager.initHistory({dashboard: this.dashboard, panel: this.panel, view: this.view});
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventManager.disconnect();
    }

    _handleUpdate = (e) => {
        const detail = e.detail;
        let newHistory = this.history;
        if(this.dashboard !== detail.dashboard || this.panel !== detail.panel || this.view !== detail.view){
            let url = `/dashboard/`;
            if(detail.dashboard){
                url += `${detail.dashboard}/`;
                if(detail.panel){
                    url += `${detail.panel}/`;
                    if(detail.view){
                        url += `${detail.view}/`;
                    }
                }
            }
            this.eventManager.addHistory(`${url}`,{dashboard: detail.dashboard, panel: detail.panel, view: detail.view});
            newHistory.push({ dashboard: detail.dashboard, panel: detail.panel, view: detail.view });
        }
        this.dashboardContext = {
            ...this.dashboardContext,
            ...detail
        };
        ({user: this.user, notifications: this.notifications, updates: this.updates, fields: this.fields, dashboard: this.dashboard, history: this.history, panel: this.panel, view: this.view} = this.dashboardContext);
        this.history = [...this.history, ...newHistory];
        this.dashboardContext.history = this.history;
        this.dashboardProvider.setValue(this.dashboardContext);
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