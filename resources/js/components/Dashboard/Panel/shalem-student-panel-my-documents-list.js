import { html, LitElement, css } from "lit";
import { DocumentHelper } from "../../Helpers/document-helper.js";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { dateToString } from "../../../common/date.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { documentStatusMap } from "../../../common/document-status-map.js";

export class ShalemStudentPanelMyDocumentsList extends DocumentHelper(BaseDashboardConsumer(BaseClass(LitElement))){
    connectedCallback(){
        super.connectedCallback();
    }

    render(){
        let page = this.documentsPagination?.current_page ?? 1;
        if(this.documents[page] && this.documents[page].length > 0){

            return html`
                <ul class="documents_list cards">
                    ${this.documents[page].map(document => {
                        let date = dateToString(document.created_at);
                        let buttons = this._renderActions(document);
                        return html`
                        <li class="${document.document_status.status} grid grid_50 shadow radius">
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

    _goToUpload(e){
        e.preventDefault();
        this._updateContext({panel: 'upload', view: null});
    }

    static styles = [
        super.styles,
        css`
        .documents_list.cards{
            display:grid;
            gap:2rem;
            margin-bottom:2rem;
            li{
                padding:1rem;
                h4{
                    margin-top:0;
                }
                .header{
                    margin:0;
                }
            }
        }
        @media (min-width:1000px){
            .documents_list{
                grid-template-columns:1fr 1fr;
            }
        }
        .pending .status{
            color:var(--blue);
        }
        .approved .status{
            color:var(--green);
        }
        .rejected .status{
            color:var(--purple);
        }
        .changes_requested .status{
            color:var(--yellow);
        }
        `
    ];
    
}