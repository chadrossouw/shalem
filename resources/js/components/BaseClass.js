import { baseStyles } from '../utilities/baseStyles';
import { LitElement, css } from 'lit';
export class BaseClass extends LitElement {
    // Common functionality for all components
    static styles = [
        baseStyles
    ];
}