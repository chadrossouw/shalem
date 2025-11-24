import help from '../../icons/help.svg';
import edit from '../../icons/edit.svg';
import view from '../../icons/view.svg';
import deleteicon from '../../icons/deleteicon.svg';
import arrowLeft from '../../icons/arrow-left.svg';
import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export const DocumentHelper = (superClass) => class extends superClass{

    _renderActions = (document) => {
        // Implement the logic to render action buttons based on the document
        let buttons = [];
        if (document.document_status.status === 'pending') {
            //compare document created time to current time, if more than 3 days have passed, allow help button
            let createdDate = new Date(document.created_at);
            let createdDatePlusAppTime =  new Date(createdDate);
            createdDatePlusAppTime.setDate(createdDate.getDate() + this.documentApprovalTime);
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
            console.log(document.document_status);
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
        if(this.action){
            
            buttons = buttons.filter(b => b.name !== this.action).map(b => b.html);
            buttons.push(html`<button class="back" @click=${() => this._clickHandler('return',null)}>${unsafeSVG(arrowLeft)}Back to my documents</button>`);
            return buttons;
        }
        return buttons.map(b => b.html);
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
    
}