import { LitElement, html, css } from 'lit';
import { BaseClass } from '../BaseClass';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import closeIcon from '../../icons/close-icon.svg';

export class ShalemAnchorModal extends BaseClass(LitElement) {

    static properties = {
        ...super.properties,
        open: { type: Boolean, reflect: true },
    }

    get modal() {
        return this.shadowRoot.querySelector('.modal');
    }

    render(){
        return html`
            <div @click=${this._handleModal}>
                <slot name="trigger"></slot>
            </div>
            <div class="modal modal bg_yellow bg_shade_2 radius shadow ${this.open ? 'open' : ''}" aria-modal="true">
                <button class="close" autofocus @click=${this._handleModal}><span aria-hidden="true">${unsafeSVG(closeIcon)}</span><span class="screen-reader-text">Close</span></button>
                <slot name="body" @click=${this._handleModal}></slot>
            </dialog>
        `
    }

    _handleModal(e){
        console.log(e);
        if(this.open){
            this.closeModal();
        }
        else{
            this.showModal();
        }
    }

    showModal(){
        this.open = true;
        //check if modal would intersect viewport edges
        const rect = this.modal.getBoundingClientRect();
        if(rect.right > window.innerWidth){
            this.modal.classList.add('intersect');
        }
        document.querySelectorAll('shalem-anchor-modal').forEach( otherModal => {
            if(otherModal !== this){
                otherModal.closeModal();
            }
        });
    }

    closeModal(){
        this.open = false;
    }

    static styles = [
        ...super.styles,
        css`
        .modal{
            scale:0;
            opacity:0;
            transition: scale var(--transition) ease, opacity var(--transition) ease;
            position:absolute;
            width:300px;
            max-width:90vw;
            bottom:110%;
            left:100%;
            transform:translateX(-50%) scale(0);
            transform-origin: bottom center;
            padding:1rem;
            z-index:10;
            color:var(--black);
            &.open{
                transform:translateX(-50%) scale(1);
                opacity:1;
            }
            &.intersect{
                left:0;
                &::after{
                    left:75%;
                }
            }
            &::after{
                content:'';
                position:absolute;
                bottom:-0.5rem;
                left:25%;
                transform:translateX(-50%);
                border-left:0.5rem solid transparent;
                border-right:0.5rem solid transparent;
                border-top:0.5rem solid var(--yellow-shade-2);
            }
        }
        .close{
            position:absolute;
            top:0.5rem;
            right:0.5rem;
            border:none;
            background:transparent;
            cursor:pointer;
            padding:0;
            display:block;
            aspect-ratio:1 / 1;
            width:1.5rem;
            svg{
                width:1.5rem;
                height:1.5rem;
                fill:var(--black);
                rect{
                    fill:var(--black);
                }
            }
        }

        `
    ];
}