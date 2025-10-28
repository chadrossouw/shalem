import { ShalemBaseDashboardConsumer } from "./shalem-base-dashboard-consumer";
import { html, css } from "lit";
import { Task } from "@lit/task";

export class ShalemAvatarSelector extends ShalemBaseDashboardConsumer {
    static properties = {
        ...super.properties,
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._getAvatars = new Task(this,{
            task: async () => {
                const response = await fetch('/api/avatars');
                if (!response.ok) {
                    throw new Error('Failed to fetch avatars');
                }
                return await response.json();
            },
        });
        ({fields: this.fields, user: this.user} = this._dashboard);
    }

    render() {
        return html`
        

        ${this._getAvatars.render({
            initial: () => html`<shalem-loader>Fetching avatars...</shalem-loader>`,
            pending: () => html`<shalem-loader>Assembling the troops...</shalem-loader>`,
            complete: (value) => this._renderAvatarSelector(value),
            error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
        })}
    `;
    }


    _renderAvatarSelector(avatars) {
    }

}