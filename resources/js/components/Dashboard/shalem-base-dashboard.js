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
        fields: { type: Array },
        dashboard: { type: String },
        panel: {type: String},
        view: {type: String},
    };

    connectedCallback(){
        super.connectedCallback();
        this.dashboardContext = {
            user: this.user,
            fields: this.fields,
            dashboard: this.dashboard,
            panel: this.panel,
            view: this.view,
            breadcrumb: this._setBreadcrumb(),
            title: this._setTitle(),
            nav: this._setNav(),
        };
        this.eventManager = new EventManager(this);
        this.eventManager.listen(`shalem-dashboard-${this.identifier}-update`,this._handleUpdate);
        console.log('Dashboard context initialized:', this.dashboardContext);
        this.dashboardProvider = new ContextProvider(this, {context:dashboardContext, initialValue: this.dashboardContext});
        this.eventManager.initHistory({dashboard: this.dashboard, panel: this.panel, view: this.view});
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventManager.disconnect();
    }

    _handleUpdate = (e) => {
        const detail = e.detail;
        this.dashboardContext = {
            ...this.dashboardContext,
            ...detail
        };
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

}