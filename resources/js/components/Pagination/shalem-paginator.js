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
        pages: {type: Array},
    }

    render() {
        let firstPageBtn = this.lastPage?html`<button class="first-page" ?disabled=${this.currentPage == 1} @click=${()=>this._goToPage(1)}>&laquo; First</button>`:'';
        let lastPageBtn = this.lastPage?html`<button class="last-page" ?disabled=${this.currentPage == this.lastPage} @click=${()=>this._goToPage(this.lastPage)}>Last &raquo;</button>`:'';
        return html`
        <div class="pagination">
            ${firstPageBtn}
            ${this.pages?.map(page => { 
                let disabled = page.page == this.currentPage;
                if(page.page == null){
                    disabled = true;
                }
                let label = page.label;
                if (label.includes('&laquo;')) {
                    label = label.replace('&laquo;', '&lsaquo;');
                }
                if (label.includes('&raquo;')) {
                    label = label.replace('&raquo;', '&rsaquo;');
                }
                return html`<button class="page-number" ?disabled=${disabled} aria-current=${page.active} @click=${()=>this._goToPage(page.page)}>${unsafeHTML(label)}</button>`
            })}
            ${lastPageBtn}
        </div> 
        `;
    }

    _goToPage(pageNumber){
        this._eventManager.emit(`shalem-pagination-change-${this.paginationID}`, {page: pageNumber});
    }
}