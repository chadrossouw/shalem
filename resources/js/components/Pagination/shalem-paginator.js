import {html,css, LitElement} from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";

export class ShalemPaginator extends BaseDashboardConsumer(BaseClass(LitElement)) {

    static properties = {
        ...super.properties,
        paginationID: { type: String },
        lastPage: { type: Number},
        currentPage: { type: Number},
    }

    render() {
        let prevButton = this.currentPage > 1 ? html`<button class="prev-page" @click=${()=>this._goToPage(this.currentPage - 1)}>&laquo; Previous</button>` : '';
        let nextButton = this.currentPage < this.lastPage ? html`<button class="next-page" @click=${()=>this._goToPage(this.currentPage + 1)}>Next &raquo;</button>` : '';
        return html`
        <div class="pagination">
            ${prevButton}
            ${nextButton}
        </div> 
        `;
    }

    _goToPage(pageNumber){
        this._eventManager.emit(`shalem-pagination-change-${this.paginationID}`, {page: pageNumber});
    }
}