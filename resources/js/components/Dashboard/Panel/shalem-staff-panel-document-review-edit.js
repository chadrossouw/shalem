import { html, LitElement, css } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { BaseForm } from "../../Form/base-form.js";
import uploadIcon from "../../../icons/upload-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../../common/accessibility.js";

export class ShalemStaffPanelDocumentReviewEdit extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))){

    static properties = {
        ...super.properties,
        document: { type: Object }
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user} = this._dashboard);
    }

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }

    render(){
        return html`
        <form @submit=${this._handleSubmit} action="${this.restUrl}document/upload">
            <div class="form-response"></div>
            <div class="input_group">
                <label for="document_title">Document Title 
                    <shalem-tooltip>
                        <shalem-editable-field name="student_panel_document_upload_title_tooltip" location="student-dashboard" ?admin=${this.isAdmin}>
                            <p>${this.fields?.student_panel_document_upload_title_tooltip ?? 'A document should have a title that will help you find it again if you need it'}</p>
                        </shalem-editable-field>
                    </shalem-tooltip>
                </label>
                <input type="text" id="document_title" name="document_title" required .value=${this.document?.title ?? ''} />
            </div>
            <div class="input_group">
                <label for="document_pillar">Pillar 
                    <shalem-tooltip>
                        <shalem-editable-field name="student_panel_document_upload_pillar_tooltip" location="student-dashboard" ?admin=${this.isAdmin}>
                            <p>${this.fields?.student_panel_document_upload_pillar_tooltip ?? 'Select the pillar that this document is related to'}</p>
                        </shalem-editable-field>
                    </shalem-tooltip>
                </label>
                <select id="document_pillar" name="document_pillar" required>
                    <option value="" disabled selected>Select a pillar</option>
                    ${this.pillars?.map(pillar => html`<option value="${pillar.id}" ?selected=${this.document?.pillar_id == pillar.id}>${pillar.name}</option>`)}
                </select>
            </div>
            <div class="input_group">
                <label for="document_description">Description
                    <shalem-tooltip>
                        <shalem-editable-field name="student_panel_document_upload_description_tooltip" location="student-dashboard" ?admin=${this.isAdmin}>
                            <p>${this.fields?.student_panel_document_upload_description_tooltip ?? 'Provide a brief description of the document you are uploading. This will appear on your CV support when you need it'}</p>
                        </shalem-editable-field>
                    </shalem-tooltip>
                </label>
                <textarea id="document_description" name="document_description" required>${this.document?.description ?? ''}</textarea>
            </div>
            <div class="input_group">
                <label for="approval_message">Approval Message
                    <shalem-tooltip>
                        <shalem-editable-field name="staff_document_approval_message_tooltip" location="staff-dashboard" ?admin=${this.isAdmin}>
                            <p>${this.fields?.staff_document_approval_message_tooltip ?? 'When a document is approved it sends a notification to the pupil. You can customize this message to give the pupil encouragement.'}</p>
                        </shalem-editable-field>
                    </shalem-tooltip>
                </label>
                <textarea id="approval_message" name="approval_message"></textarea>
            </div>
            <label for="type">Select document type
                <shalem-tooltip>
                    <shalem-editable-field name="staff_document_approve_type_tooltip" location="staff-dashboard" ?admin=${this.isAdmin}>
                        <p>${this.fields?.staff_document_approve_type_tooltip ?? 'An internal document is one that is awarded by the school and carries a higher point weighting. External documents are from outside the school and carry a lower point weighting.'}</p>
                    </shalem-editable-field>
                </shalem-tooltip>
            </label>
            <select name="type" required>
                <option value="" disabled selected>Select document type</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
            </select>
            ${this.document ? html`<input type="hidden" name="document_id" .value=${this.document.id} />` : ''}
            <input type="hidden" name="review_edit" value="1" />
            <button type="submit">Save and approve</button>
        </form>
        `;
    }

    static styles = [
        ...super.styles,
        css`
        form{
            margin-bottom:2rem;
        }`
    ];
}