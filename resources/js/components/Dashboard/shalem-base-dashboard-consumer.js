import { BaseClass } from "../base-class.js";
import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export class ShalemBaseDashboardConsumer extends BaseClass {
    
    static properties = {
        identifier: { type: String },
    }

    constructor() {
        super();
    }
    
    connectedCallback(){
        super.connectedCallback();
        this._eventManager = new EventManager(this);
        this._dashboard = new ContextConsumer(this, {context:dashboardContext,callback:this._handleContextUpdate.bind(this),subscribe:true});
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