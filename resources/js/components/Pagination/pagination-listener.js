import { EventManager } from "../../utilities/events.js";
export const PaginationListener = (superClass) => class extends superClass{
    connectedCallback(){
        super.connectedCallback();
        if(!this._eventManager){
            this._eventManager = new EventManager(this);
        }
        this._eventManager.listen(`shalem-pagination-change-${this.paginationID}`, this._handlePaginationChange.bind(this));
    }

    _handlePaginationChange(e){
        // To be implemented by the consuming class
    }
}