import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export const ShalemBaseNavConsumer = (superClass) => class extends superClass{
    
    static properties = {
        ...super.properties,
        identifier: { type: String },
        _dashboard: { type: Object, state: true },
    }
    
    connectedCallback(){
        super.connectedCallback();
        this._eventManager = new EventManager(this);
        this._consumer = new ContextConsumer(this, {context:dashboardContext,callback:this._handleContextUpdate.bind(this),subscribe:true});
        this.isAdmin = this._dashboard.user?.roles?.includes('admin') || false;
    }

    _handleContextUpdate(value){
        this._dashboard = value;
    }

    _updateContext(newValues){
        const updatedContext = {
            ...this._dashboard,
            ...newValues
        };
        this._eventManager.emit(`shalem-dashboard-${this.identifier}-update`, updatedContext);
    }

    _handleAction(action){
        this._updateContext({...action});
    }
}