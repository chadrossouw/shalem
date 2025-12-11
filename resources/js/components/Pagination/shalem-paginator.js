import {html,css, unsafeCSS,LitElement} from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";

export class ShalemPaginator extends BaseDashboardConsumer(BaseClass(LitElement)) {

    static properties = {
        ...super.properties,
        paginationID: { type: String },
        lastPage: { type: Number},
        currentPage: { type: Number},
        next: {type: String},
        previous: {type: String},
        buttonColor: {type: String},
    }

    render() {
        let prevButton = this.currentPage > 1 ? html`<button class="prev-page bg_${this.buttonColor??`purple`}" @click=${()=>this._goToPage(this.currentPage - 1)}>&laquo; ${this.previous || 'Previous'}</button>` : html`<div></div>`;
        let nextButton = this.currentPage < this.lastPage ? html`<button class="next-page bg_${this.buttonColor??`purple`}" @click=${()=>this._goToPage(this.currentPage + 1)}>${this.next || 'Next'} &raquo;</button>` : html`<div></div>`;
        return html`
        <div class="pagination flex">
            ${prevButton}
            ${nextButton}
        </div> 
        `;
    }

    _goToPage(pageNumber){
        this._eventManager.emit(`shalem-pagination-change-${this.paginationID}`, {page: pageNumber});
    }
}