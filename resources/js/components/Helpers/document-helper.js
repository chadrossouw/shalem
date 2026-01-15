import help from '../../icons/help.svg';
import edit from '../../icons/edit.svg';
import editFormal from '../../icons/edit-formal.svg';
import view from '../../icons/view.svg';
import approve from '../../icons/approve.svg';
import deleteicon from '../../icons/deleteicon.svg';
import forward from '../../icons/forward.svg';
import arrowLeft from '../../icons/arrow-left.svg';
import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export const DocumentHelper = (superClass) => class extends superClass{

    _renderActions = (document) => {
        // Implement the logic to render action buttons based on the document
        let buttons = [];
        if(this.action == 'review'){
            buttons.push({name:'approve',html: html`
                <shalem-dialog>
                    <button slot="trigger">${unsafeSVG(approve)}Approve</button>
                    <h2 slot="title" class="white">Approve this document</h2>
                    <div slot="body">
                        <shalem-form-wrapper identifier=${this.identifier}>
                            <form id="approve_document_form" action="${this.restUrl}document/approve"}>
                                <label for="type" class="white">Select document type
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
                                <label for="status_message" class="white">Optional message to the student</label>
                                <textarea name="status_message" placeholder="Enter a message to the student (optional)"></textarea>
                                <input type="hidden" name="document_id" value="${document.id}" />
                                <div class="form_response white"></div>
                                <div class="flex button-group">
                                    <button class="bg_blue" type="submit" @click=${(e)=>{e.stopPropagation()}}>${unsafeSVG(approve)}Approve Document</button>
                                </div>
                                
                            </form>
                        </shalem-form-wrapper>
                    </div>
                </shalem-dialog>
            `});
            buttons.push({name:'edit',html: html`
                <button class="bg_blue" @click=${() => this._clickHandler('review-edit', document)}>${unsafeSVG(editFormal)}Edit</button>
            `});
            buttons.push({name:'forward',html: html`
                <shalem-dialog>
                    <button slot="trigger" class="bg_blue" @click=${() => this._clickHandler('forward', document)}>${unsafeSVG(forward)}Forward</button>
                    <h2 slot="title" class="white">Forward this document</h2>
                    <div slot="body">
                        <shalem-editable-field name="staff_document_forward_instructions" location="staff-dashboard" ?admin=${this.isAdmin}>
                            <p class="white">${this.fields?.staff_document_forward_instructions ?? 'Forward a document to only if you don\'t recognise the document type'}</p>
                        </shalem-editable-field>
                        <shalem-form-wrapper identifier=${this.identifier}>
                            <form class="white" id="approve_document_form" action="${this.restUrl}document/forward"}>
                                <shalem-staff-selector resturl="${this.restUrl}" name="recipient" required filter="${JSON.stringify(['grade_head','systemic_head'])}">
                                    <label class="white" for="recipient">Recipient*</label>
                                </shalem-staff-selector>
                                <label for="reason" class="white">Add a reason</label>
                                <textarea name="reason" data-label="Reason" id="reason" placeholder="Add a reason for forwarding this document" aria-required="true"></textarea>
                                <input type="hidden" name="document_id" value="${document.id}" />
                                <div class="form_response white"></div>
                                <div class="flex button-group">
                                    <button class="bg_blue" type="submit" @click=${(e)=>{e.stopPropagation()}}>${unsafeSVG(approve)}Forward Document</button>
                                </div>
                            </form>
                        </shalem-form-wrapper>
                    </div>
                </shalem-dialog>
            `});
        }
        else if(this.action == 'review-edit'){
            buttons.push({name:'review',html: html`
                <button class="bg_blue" @click=${() => this._clickHandler('review', document)}>${unsafeSVG(approve)}Return to Review</button>
            `});
        }
        else{
            if (document.document_status.status === 'pending'||document.document_status.status === 'forwarded'){ 
                //compare document created time to current time, if more than 3 days have passed, allow help button
                let createdDate = new Date(document.created_at);
                let createdDatePlusAppTime =  new Date(createdDate);
                if(document.document_status.status === 'pending'){
                    createdDatePlusAppTime.setDate(createdDate.getDate() + this.documentApprovalTime);
                }
                else{
                    //Double the time if forwarded
                    createdDatePlusAppTime.setDate(createdDate.getDate() + this.documentApprovalTime + this.documentApprovalTime);
                }
                let currentDate = new Date();
                
                buttons.push({name:'view',html: html`
                    <button @click=${() => this._clickHandler('view', document)}>${unsafeSVG(view)}View</button>
                `});
                if (currentDate > createdDatePlusAppTime) {
                    buttons.push({name:'help',html: html`<button @click=${() => this._clickHandler('help', document)}>${unsafeSVG(help)}Help</button>`});
                }
            }
            if(document.document_status.status === 'changes_requested'){
                buttons.push({name:'edit',html: html`
                    <button @click=${() => this._clickHandler('edit', document)}>${unsafeSVG(edit)}Edit</button>
                `});
                buttons.push({name:'seeMessage',html: html`
                    <shalem-dialog>
                        <button slot="trigger">${unsafeSVG(help)}What do I need to do?</button>
                        <h2 slot="title" class="white">Changes Requested</h2>
                        <div slot="body">
                            ${document.document_status.user ? html`
                                <p class="big white">${document.document_status.user.honorific} ${document.document_status.user.last_name} requested the following changes</p>
                            ` : ''}
                            <p class="white">${document.document_status.status_message}</p>
                            <div class="flex button-group">
                                <button class="bg_blue" @click=${() => this._clickHandler('edit', document)}>${unsafeSVG(edit)}Edit</button>
                                <button class="bg_blue" @click=${() => this._clickHandler('help', document)}>${unsafeSVG(help)}Help</button>
                            </div>
                        </div>
                    </shalem-dialog>
                `});
            }
            if(document.document_status.status === 'approved'){
                buttons.push({name:'view',html: html`
                    <button @click=${() => this._clickHandler('view', document)}>${unsafeSVG(view)}View</button>
                `});
            }
            if(document.document_status.status === 'rejected'){
                buttons.push({name:'delete',html: html`
                    <button @click=${() => this._clickHandler('delete', document)}>${unsafeSVG(deleteicon)}Delete</button>
                `});
                buttons.push({name:'help',html: html`   
                    <button @click=${() => this._clickHandler('help', document)}>${unsafeSVG(help)}Help</button>
                `});
            }
            
        }
        if(this.action){
            buttons = buttons.filter(b => b.name !== this.action).map(b => b.html);
            buttons.push(html`<button class="back" @click=${() => this._clickHandler('return',null)}>${unsafeSVG(arrowLeft)}Back to my documents</button>`);
            return buttons;
        }
        return buttons.map(b => b.html);
    }

    _getStatusMessage(){
        let statusMessage;
        if(this.action == 'review'||this.action == 'review-edit'){
            let createdDate = new Date(this.document.created_at);
            let createdDatePlusAppTime =  new Date(createdDate);
            createdDatePlusAppTime.setDate(createdDate.getDate() + this.documentApprovalTime);
            let currentDate = new Date();

            if (currentDate > createdDatePlusAppTime) {
                statusMessage = 'Urgently awaiting approval'
            }
            if(this.document.document_status == 'pending'){

                statusMessage = 'Awaiting approval'
            }
        }
        else{
            if(this.document.document_status.status == 'forwarded'){
                statusMessage = 'Document has been forwarded for further review';
            }
            statusMessage = this.document.document_status.status_message
        }
        return statusMessage;
    }

    _clickHandler(action, document){
        switch(action){
            case 'edit':
                this._editDocument(document);
                break;
            case 'help':
                this._getHelp(document);
                break;
            case 'view':
                this._viewDocument(document);
                break;
            case 'return':
                this._updateContext({panel: 'my-documents', view: null, action: null});
                break;
            case 'review':
                this._updateContext({panel: 'documents', view: document.id, action: 'review'});
                break;
            case 'review-edit':
                this._updateContext({panel: 'documents', view: document.id, action: 'review-edit'});
                break;
        }
    }

    _viewDocument(document){
        this._updateContext({panel: 'my-documents', view: document.id, action:'view'});
    }
    
    _editDocument(document){
        this._updateContext({panel: 'my-documents', view: document.id, action:'edit'});
    }

    _getHelp(document){
        this._updateContext({dashboard:'help', panel: 'document', view: document.id, action:null});
    }

    
   /*  _handleApproveSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        const approveData = {
            document_id: formData.get('document_id'),
            type: formData.get('type'),
            status_message: formData.get('status_message')
        };
        this._approveDocument(approveData); */
    
}