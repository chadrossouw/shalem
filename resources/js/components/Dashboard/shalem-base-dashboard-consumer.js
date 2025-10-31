import { BaseClass } from "../BaseClass.js";
import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export const ShalemBaseDashboardConsumer = (superClass) => class extends superClass{
    
    static properties = {
        ...super.properties,
        identifier: { type: String },
    }
    
    connectedCallback(){
        super.connectedCallback();
        this._eventManager = new EventManager(this);
        this._consumer = new ContextConsumer(this, {context:dashboardContext,callback:this._handleContextUpdate.bind(this),subscribe:true});
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
}