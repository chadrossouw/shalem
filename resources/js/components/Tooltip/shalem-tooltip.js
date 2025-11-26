import { LitElement, html, css } from 'lit';
import { BaseClass } from '../BaseClass.js';
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import tooltipIcon from '../../icons/tooltip-icon.svg';
import close from '../../icons/close-icon.svg';

export class ShalemTooltip extends  BaseClass(LitElement) {
    static properties = {
        buttonText: { type: String },
    }
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        //this._handleHideReveal();
        if(!this.buttonText){
            this.buttonText = 'What\'s this?';
        }
        this.id = `tooltip_${Math.random().toString(36).substring(7)}`;
    }

    get button(){
        return this.renderRoot.querySelector('.trigger');
    }

    get modal(){
        return this.renderRoot.querySelector('.tooltip_modal');
    }

    get closer(){
        return this.renderRoot.querySelector('.close');
    }

    render(){
        
        return html`
            <div class="tooltip_wrapper">
                <button class="tooltip trigger" aria-label="Opens a modal showing more information" @click=${this.openClose}><span aria-hidden="true">${unsafeSVG(tooltipIcon)}</span>${this.buttonText}</button>
                <div class="tooltip_modal" id="" role="dialog" aria-label="Tooltip" aria-describedby="${this.id}"><h4>${this.buttonText}</h4><p id="${this.id}"><slot></slot></p><button class="close" @click=${this.openClose}><span aria-hidden="true">${unsafeSVG(close)}</span><span class="screen-reader-text">Close Tooltip</span></button></div>
            </div>
        `;
    }

    

    openClose(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.modal.classList.contains('open')){
            this.close();
        }
        else{
            this.open();
        }
    }

    open(){
        this.modal.classList.add('open');
        let rect = this.modal.getBoundingClientRect();
        let winDiff = window.innerWidth - (rect.left + rect.width);
        if(winDiff < 0){
            this.modal.style.right = `${winDiff * -1 + 20}px`;
        }
        else{
            this.modal.style.right = null;
        }
        this.closer.focus();
        this._scrollHandler = this.close.bind(this);
        this._keyHandler = this.keyHandler.bind(this);
        this._clickHandler = this.closeOnClickOff.bind(this);
        this.modal.addEventListener("keydown", this._keyHandler);
        this.modal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.addEventListener("click", this._clickHandler);
        setTimeout(() => {
            document.addEventListener("scroll", this._scrollHandler);
        },500); 
    }

    close(){
        this.modal.classList.remove('open');
        this.button.focus();
        this.modal.removeEventListener("keydown", this._keyHandler);
        document.removeEventListener("click", this._clickHandler);
        document.removeEventListener("scroll", this._scrollHandler);
    }

    keyHandler(e){
        console.log(e)
        if(e.key == "Escape" ){
            e.preventDefault();
            this.close();
        }
        if(e.key=='Tab'){
            e.preventDefault();
            this.closer.focus();
        }
    }

    closeOnClickOff(e){
        if(e.target==this.button||e.target==this||e.target.closest('.tooltip_modal') || e.target.closest('.trigger')){
            return;
        }
        else{
            this.close();
        }
    }

    static styles = [
        super.styles,
        css`
            .tooltip_wrapper{
                position: relative;
                display: inline-block;
            }

            .trigger {
                color: var(--black);
                display: flex;
                align-items: center;
                border:none;
                background-color: transparent;
                padding: 0;
                gap:0.25rem;
                text-decoration: none;
                font-size: 1rem;
                cursor: pointer;
                &:hover,&:focus{
                    background-color: transparent;
                    text-decoration: underline;
                    color:var(--black);
                    svg{
                        transform:translateY(-0.5rem);
                    }
                }
            }
            button{
                cursor: pointer;
                display: flex;
                align-items: center;
                border:none;
            }
            .tooltip_modal {
                background-color: var(--yellow-shade-2);
                right: 0;
                width:300px;
                max-width: 90vw;
                padding: 2rem 1rem;
                opacity: 0;
                transform: scale(0) translate(50%,-50%);
                transition-behavior: allow-discrete;
                transition: opacity calc(var(--transition) / 2) ease,
                    transform var(--move-transition) ease, display var(--transition) ease;
                transform-origin: 100% 0;
                display: none;
                z-index:100;
                scroll-margin-top: var(--header-height);
                position: absolute;
            }
            .tooltip_modal.open  {
                margin-top:1rem;
                opacity: 1;
                transform: scale(1) translate(50%,-50%);
                display: block;
            }
            @media (min-width: 1200px){
                .tooltip_modal {
                    position: absolute;
                }
                .tooltip_modal.open{
                    transform: scale(1) translate(50%,-50%);
                }
            }
            button.close {
                color: var(--black);
                transition: background-color var(--transition) ease;
                padding: 0.5rem;
                line-height: 0;
                position: absolute;
                top: 0;
                right: 0;
                svg{
                    width:1rem;
                    height:1rem;
                }
            }
            button.close:focus-visible {
                outline: 2px solid var(--green);
                outline-offset: 2px;
            }

            button.close:hover{
                background-color: var(--light_blue);
            }
            .trigger svg{
                width: 2rem;
                height: 2rem;
                transition: transform var(--transition) ease;
            }
        `
    ]
}


