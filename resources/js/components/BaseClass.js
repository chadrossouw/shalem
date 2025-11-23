import { baseStyles} from '../utilities/baseStyles';
import { accessibilityStyles } from '../utilities/accessibility.js';
import { LitElement, css } from 'lit';
import {blink,throb} from '../common/blink.js';
export const BaseClass = (superClass) => class extends superClass {
    // Common functionality for all components
    static properties = {
        ...super.properties,
    };
    static styles = [
        accessibilityStyles,
        baseStyles,
        css`
            @keyframes blink {
                0%, 20.75%, 21.5%, 100% {
                    transform: scaleY(1);
                }
                21%, 21.25% {
                    transform: scaleY(0.1);
                }
            }
            .blinking {
                animation-name: blink;
                animation-iteration-count: infinite;
                transform-box: fill-box;
                transform-origin: center bottom;
            }
            @keyframes throb {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }
            .throbbing {
                animation-name: throb;
                animation-iteration-count: infinite;
                transform-box: fill-box;
                transform-origin: center bottom;
            }
            .loading{
                position: relative;
            }
            .loading::after{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                backdrop-filter: blur(1px);
                z-index: 10;
            }
            .loading::before{
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 4px solid var(--blue);
                border-top-color: var(--yellow);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 11;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `
    ];

    constructor() {
        super();
        this.updateComplete.then(() => {
            this.goBlink();
        });
        //Vite env variable for API base URL
        this.restUrl = import.meta.env.VITE_API_URL;
        this.baseUrl = import.meta.env.VITE_BASE_URL;
    }

    async connectedCallback() {
        super.connectedCallback();
    }

    get eyes(){ 
        return this.shadowRoot.querySelectorAll('.eyes,[data-eyes]');
    }

    get throb(){
        return this.shadowRoot.querySelectorAll('.throb,[data-throb]');
    }

    goBlink(){
        this.eyes.forEach(eye => {
            blink(eye);
        });
        this.throb.forEach(eye => {
            throb(eye);
        });
    }
}