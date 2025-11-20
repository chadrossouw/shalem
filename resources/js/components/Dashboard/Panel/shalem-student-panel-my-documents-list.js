import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { dateToString } from "../../../common/date.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { documentStatusMap } from "../../../common/document-status-map.js";
import  edit from "../../../icons/edit.svg";
import  view from "../../../icons/view.svg";
import  help from "../../../icons/help.svg";
import  deleteicon from "../../../icons/deleteicon.svg";

export class ShalemStudentPanelMyDocumentsList extends BaseDashboardConsumer(BaseClass(LitElement)){
    connectedCallback(){
        super.connectedCallback();
    }

    render(){
        let page = this.documentsPagination?.current_page ?? 1;
        if(this.documents[page] && this.documents[page].length > 0){

            return html`
                <ul class="documents_list">
                    ${this.documents[page].map(document => {
                        console.log(document);
                        let date = dateToString(document.created_at);
                        let buttons = this._renderActions(document);
                        return html`
                        <li class="${document.document_status.status} grid grid_50">
                            <div class='header'>
                                <h4>${document.title}</h4>
                                <p class="description">${document.description}</p>
                                <p class="uploaded_on">${date}</p>
                            </div>
                            <div class="status">
                                <p><strong>${documentStatusMap[document.document_status.status]}</strong></p>
                                ${document.document_status.status == 'approved' && document.document_status.status_message ? html`<p class="status_message">${document.document_status.status_message}</p>` : ''}
                            </div>
                            ${buttons}
                        </li>`
                    })}
                </ul>
            `;
        }
        return html`<p>You don't have any documents yet. <a href="/upload" @click=${this._goToUpload}>Add one?</a></p>`;
    }

    _renderActions(document) {
        // Implement the logic to render action buttons based on the document
        if (document.document_status.status === 'pending') {
            //compare document created time to current time, if more than 3 days have passed, allow help button
            let createdDate = new Date(document.created_at);
            let createdDatePlusAppTime =  new Date(createdDate);
            createdDatePlusAppTime.setDate(createdDate.getDate() + this.documentApprovalTime);
            let currentDate = new Date();
            let helpButton = '';
            if (currentDate > createdDatePlusAppTime) {
                helpButton = html`<button @click=${() => this._helpWithDocument(document)}>${unsafeSVG(help)}Help</button>`;
            }
            return html`
                <button @click=${() => this._viewDocument(document)}>${unsafeSVG(view)}View</button>
                ${helpButton}
            `;
        }
        if(document.document_status.status === 'changes_requested'){
            return html`
                <button @click=${() => this._editDocument(document)}>${unsafeSVG(edit)}Edit</button>
                <button @click=${() => this._seeMessage(document)}>${unsafeSVG(help)}What do I need to do?</button>
            `;
        }
        if(document.document_status.status === 'approved'){
            return html`
                <button @click=${() => this._viewDocument(document)}>${unsafeSVG(view)}View</button>
            `;
        }
        if(document.document_status.status === 'rejected'){
            return html`
                <button @click=${() => this._deleteDocument(document)}>${unsafeSVG(deleteicon)}Delete</button>
                <button @click=${() => this._helpWithDocument(document)}>${unsafeSVG(help)}Help</button>
            `;
        }
        return html`
            <button @click=${() => this._viewDocument(document)}>${unsafeSVG(view)}View</button>
        `;
    }


    _goToUpload(e){
        e.preventDefault();
        this._updateContext({panel: 'upload', view: null});
    }
}