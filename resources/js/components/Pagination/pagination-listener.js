export const PaginationListener = (superClass) => class extends superClass{
    connectedCallback(){
        super.connectedCallback();
        this._eventManager.listen(`shalem-pagination-change-${this.paginationID}`, this._handlePaginationChange.bind(this));
    }

    _handlePaginationChange(e){
        // To be implemented by the consuming class
    }
}