import { LitElement, html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import closeIcon from '../../icons/close-icon.svg';

export class ShalemDialog extends BaseClass(LitElement) {

    static properties = {
        ...super.properties,
        background: { type: String },
    }
    get dialog() {
        return this.shadowRoot.querySelector('dialog');
    }

    render(){
        return html`
            <slot name="trigger" @click=${this._handleModal}></slot>
            <dialog class="${this.background ? this.background : 'bg_purple'} radius-big inner_padding" aria-labelledby="dialog-title" aria-modal="true">
                <button class="close" autofocus @click=${this._handleModal}><span aria-hidden="true">${unsafeSVG(closeIcon)}</span><span class="screen-reader-text">Close</span></button>
                <slot name="title" id="dialog-title"></slot>
                <slot name="body" @click=${this._handleModal}></slot>
            </dialog>
        `
    }

    _handleModal(e){
        if(e.target.tagname == 'BUTTON' || e.target.closest('button')){
            if(this.dialog.open){
                this.dialog.close();
            }
            else{
                this.dialog.showModal();
            }
        }
    }

    static styles = [
        ...super.styles,
        css`
        ::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
        }
        dialog[open] {
            opacity: 1;
        }
        dialog {
            opacity:0;
            transition:opacity var(--transition) ease;
            width:680px;
            max-width:95vw;
            border:none;
            padding:6rem 2rem 2rem;
            border-radius:1rem;
            box-sizing:border-box;
        }
        dialog .close{
            color:var(--allin-highlight-color,#472961);
            background-color:transparent;
            position:absolute;
            top:2rem;
            right:2rem;
            display:flex;
            align-items:center;
            gap:0.5rem;
        }
        @starting-style{
            dialog[open]{
                opacity:0;
            }
        }
        `
    ];
}