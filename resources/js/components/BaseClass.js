import { baseStyles } from '../utilities/baseStyles';
import { LitElement, css } from 'lit';
import {blink,throb} from '../common/blink.js';
export const BaseClass = (superClass) => class extends superClass {
    // Common functionality for all components
    static properties = {
        ...super.properties,
    };
    static styles = [
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
        `
    ];

    constructor() {
        super();
        this.updateComplete.then(() => {
            this.goBlink();
        });
        //Vite env variable for API base URL
        this.restUrl = import.meta.env.VITE_API_URL;
    }

    get eyes(){
        return this.shadowRoot.querySelectorAll('.eyes');
    }

    get throb(){
        return this.shadowRoot.querySelectorAll('.throb');
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