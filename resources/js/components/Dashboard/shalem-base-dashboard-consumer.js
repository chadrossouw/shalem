import { BaseClass } from "../BaseClass.js";
import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export const ShalemBaseDashboardConsumer = (superClass) => class extends superClass{
    
    static properties = {
        ...super.properties,
        identifier: { type: String },
        _dashboard: { type: Object, state: true },
        user: { type: Object , state:true},
        notifications: { type: Array , state:true},
        updates: { type: Array , state:true},
        fields: { type: Array, state:true },
        dashboard: { type: String , state:true},
        panel: {type: String, state:true},
        view: {type: String, state:true},
    }
    
    connectedCallback(){
        super.connectedCallback();
        this._eventManager = new EventManager(this);
        this._consumer = new ContextConsumer(this, {context:dashboardContext,callback:this._handleContextUpdate.bind(this),subscribe:true});
        this._dashboard = this._consumer.value;
        if( this._dashboard ){
            this._populateStateFromContext();
            this.isAdmin = this._dashboard.user?.roles?.includes('admin') || false;
        }
    }

    _handleContextUpdate(value){
        console.log('Dashboard context updated:', value);
        this._dashboard = value;
        this._populateStateFromContext();
        if(!this.isAdmin){
            this.isAdmin = this._dashboard.user?.roles?.includes('admin') || false;
        }
    }

    _populateStateFromContext(){
        ({user: this.user, notifications: this.notifications, updates: this.updates, fields: this.fields, dashboard: this.dashboard, history: this.history, panel: this.panel, view: this.view} = this._dashboard);
    }

    _updateContext(newValues){
        const updatedContext = {
            ...this._dashboard,
            ...newValues
        };
        this._eventManager.emit(`shalem-dashboard-${this.identifier}-update`, updatedContext);
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

    _handleAction(action){
        this._updateContext({...action});
    }
}