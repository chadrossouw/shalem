import { baseStyles } from '../utilities/baseStyles';
import { LitElement, css } from 'lit';
import {blink,throb} from '../common/blink.js';
export class BaseClass extends LitElement {
    // Common functionality for all components
    static styles = [
        baseStyles,
        css`
            @keyframes blink {
                0%, 20%, 24%, 100% {
                    transform: scaleY(1);
                }
                21%, 23% {
                    transform: scaleY(0.1);
                }
            }
            .blinking {
                animation-name: blink;
                animation-iteration-count: infinite;
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
            }
        `
    ];

    constructor() {
        super();
    }

    get eyes(){
        return this.shadowRoot.querySelectorAll('.eyes');
    }

    get throb(){
        return this.shadowRoot.querySelectorAll('.throb');
    }

    updated(){
        this.eyes.forEach(eye => {
            blink(eye);
        });
        this.throb.forEach(eye => {
            throb(eye);
        });
    }
}