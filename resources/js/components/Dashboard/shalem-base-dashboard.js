import { LitElement, html} from 'lit';
import { BaseClass } from '../BaseClass';
import {ContextProvider} from '@lit/context';
import { dashboardContext } from '../../utilities/context.js';
import { EventManager } from '../../utilities/events.js';

export class ShalemBaseDashboard  extends BaseClass {
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
    }

    constructor() {
        super();
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
    }

    connectedCallback(){
        super.connectedCallback();
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