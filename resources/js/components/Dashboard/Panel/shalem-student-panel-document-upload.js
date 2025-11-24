import { html, LitElement } from "lit";
import { BaseDashboardConsumer } from "../base-dashboard-consumer.js";
import { BaseClass } from "../../BaseClass.js";
import { BaseForm } from "../../Form/base-form.js";
import uploadIcon from "../../../icons/upload-icon.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../../common/accessibility.js";

export class ShalemStudentPanelDocumentUpload extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))){

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
        <form @submit=${this._handleSubmit} action="${this.restUrl}document/upload" enctype="multipart/form-data">
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
                <label for="document_file">Upload Document 
                    <shalem-tooltip>
                        <shalem-editable-field name="student_panel_document_upload_file_tooltip" location="student-dashboard" ?admin=${this.isAdmin}>
                            <p>${this.fields?.student_panel_document_upload_file_tooltip ?? 'Choose the document file from your device. Accepted formats are PDF, Word, JPG, and PNG'}</p>
                        </shalem-editable-field>
                    </shalem-tooltip>
                </label>
                ${this.document ? html`<p class="description">Uploading a new file will replace the existing one.</p>` : ''}
                <input type="file" id="document_file" name="document_file" accept=".pdf,.jpg,.png" ?required=${!this.document} />
            </div>
            ${this.document ? html`<input type="hidden" name="document_id" .value=${this.document.id} />` : ''}
            <button type="submit">Ok. Let's go!</button>
        </form>
        `;
    }
}