import { ShalemBaseDashboardConsumer } from "./shalem-base-dashboard-consumer";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";
import anonymousAvatar from "../../icons/anonymousAvatar.svg";
import arrowLeftSvg from "../../icons/arrow-left.svg";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemAvatarSelector extends ShalemBaseDashboardConsumer(BaseClass(LitElement)) {

    connectedCallback() {
        super.connectedCallback();

        this._getAvatars = new Task(this,{
            task: async () => {
                const response = await safeFetch(`${this.restUrl}avatars`);
                if (!response.ok) {
                    throw new Error('Failed to fetch avatars');
                }
                return await response.json();
            },
            args: () => [],
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
        avatars = avatars.avatars;
        let currentAvatar = this.user.student.avatar;
        let avatarDeclaration = '';
        let backButton = html`<button @click=${() => window.history.back()}><span aria-hidden="true">${unsafeSVG(arrowLeftSvg)}</span>Back</button>`;
        if(!currentAvatar){
            avatarDeclaration = html`<h3>I'm <span class="screen-reader-text">selecting an avatar</span>${unsafeSVG(anonymousAvatar)}</h3>`;
            backButton = '';
        }
        else {
            let avatarSVG = avatars.find(avatar => avatar.id === currentAvatar.id).svg;
            avatarDeclaration = html`<h3>I'm <span class="screen-reader-text">${currentAvatar.name}</span>${unsafeSVG(avatarSVG)}</h3>`;
        }

        return html`
            <slot></slot>
            ${avatarDeclaration}
            <form class="avatar-options">
                <p>Select your avatar:</p>
                ${avatars.map(avatar => html`
                    <div class="avatar-option">
                        <input type="radio" name="avatar" id="avatar-${avatar.id}" ?checked=${currentAvatar && avatar.id === currentAvatar.id} @change=${() => this._updateAvatar(avatar)}>
                        <label for="avatar-${avatar.id}"><span class="screen-reader-text">${avatar.name}</span><span class="avatar-svg" aria-hidden="true">${unsafeSVG(avatar.svg)}</span></label>
                    </div>
                `)}
            </form>

        `
    }

    async _updateAvatar(avatar) {
        let response = await safeFetch(`${this.restUrl}set-avatars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({avatar_id: avatar.id }),
        });
        response = await response.json();
        if (!response.success) {
            console.error('Failed to update avatar:', response.message);
            return;
        }
        this.user.student.avatar = {id: avatar.id, name: avatar.name, path: avatar.svg};
        this._updateContext({user: this.user});
    }
}