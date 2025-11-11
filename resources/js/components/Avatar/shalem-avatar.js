import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemAvatar extends LitElement{
    static properties = {
        avatarId: { type: String },
    }
    constructor(){
        super();
        this.restUrl = import.meta.env.VITE_API_URL;
    }
    connectedCallback(){
        super.connectedCallback();
        this._getAvatar = new Task(this,{
            task: async () => {
                const response = await safeFetch(`${this.restUrl}avatar/${this.avatarId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch avatars');
                }

                return await response.json();
            },
            args: () => [],
        });
    }

    createRenderRoot(){
        return this;
    }

    render() {
        return html`
        ${this._getAvatar.render({
            initial: () => html`<shalem-loader spinner></shalem-loader>`,
            pending: () => html`<shalem-loader spinner></shalem-loader>`,
            complete: (value) => this._renderAvatar(value),
            error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
        })}
    `;
    }

    _renderAvatar(response) {
        return html`${unsafeSVG(response.avatar.svg)}`;
    }
}