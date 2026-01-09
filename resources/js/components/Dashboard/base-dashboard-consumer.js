import { BaseClass } from "../BaseClass.js";
import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export const BaseDashboardConsumer = (superClass) => class extends superClass{
    
    static properties = {
        ...super.properties,
        identifier: { type: String },
        _dashboard: { type: Object, state: true },
        user: { type: Object , state:true},
        notifications: { type: Array, state:true},
        unreadNotifications: { type: Array , state:true},
        archivedNotifications: { type: Array , state:true},
        notificationsPagination: { type: Object , state:true},
        unreadNotificationsPagination: { type: Object , state:true},
        notificationsArchivedPagination: { type: Object , state:true},
        documents: { type: Object , state:true},
        document: { type: Object, state: true },
        documentsPagination: { type: Object , state:true},
        cvs: { type: Object , state:true},
        cv: { type: Object, state: true },
        cvsPagination: { type: Object , state:true},
        cvDocuments: { type: Object , state:true},
        cvDocumentsPagination: { type: Object , state:true},
        updates: { type: Array , state:true},
        fields: { type: Array, state:true },
        dashboard: { type: String , state:true},
        panel: {type: String, state:true},
        pillars: { type: Array, state:true },
        view: {type: String, state:true},
        action: {type: String, state:true},
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

    _setDocumentTitle(title){
        document.title = `${title} | ${import.meta.env.VITE_APP_NAME}`;
    }

    _handleContextUpdate(value){
        this._dashboard = value;
        this._populateStateFromContext();
        if(!this.isAdmin){
            this.isAdmin = this._dashboard.user?.roles?.includes('admin') || false;
        }
    }

    _populateStateFromContext(){
        ({
            user: this.user, 
            notifications: this.notifications, 
            unreadNotifications: this.unreadNotifications, 
            archivedNotifications: this.archivedNotifications, 
            notificationsPagination: this.notificationsPagination, 
            unreadNotificationsPagination: this.unreadNotificationsPagination,
            notificationsArchivedPagination: this.notificationsArchivedPagination,
            updates: this.updates, 
            documents: this.documents, 
            document: this.document, 
            documentsPagination: this.documentsPagination, 
            cvs: this.cvs, 
            cv: this.cv, 
            cvsPagination: this.cvsPagination,
            cvDocuments: this.cvDocuments, 
            cvDocumentsPagination: this.cvDocumentsPagination,
            pillars:this.pillars, 
            fields: this.fields, 
            dashboard: this.dashboard, 
            history: this.history, 
            panel: this.panel, 
            view: this.view, 
            action: this.action, 
            documentApprovalTime: this.documentApprovalTime
        } = this._dashboard);
        this.requestUpdate();
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