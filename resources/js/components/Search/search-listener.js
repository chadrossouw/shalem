export const SearchListener = (superClass) => class extends superClass{
    connectedCallback(){
        super.connectedCallback();
        this._eventManager.listen(`shalem-search-${this.searchID}`, this._handleSearch.bind(this));
    }

    _handleSearch(e){
        // To be implemented by the consuming class
    }
}