import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";
import anonymousAvatar from "../../icons/anonymousAvatar.svg";
import arrowLeftSvg from "../../icons/arrow-left.svg";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemAvatarSelector extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        select: { type: Boolean },
        _avatars: { type: Array, state: true },
        _selectedAvatar: { type: Object, state: true },
        _status: { type: String, state: true },
    }
    connectedCallback() {
        super.connectedCallback();

        this._getAvatars = new Task(this,{
            task: async () => {
                if(this._avatars){
                    return this._avatars;
                }
                const response = await safeFetch(`${this.restUrl}avatars`);
                if (!response.ok) {
                    throw new Error('Failed to fetch avatars');
                }
                const json = await response.json();
                this._avatars = json.avatars;
                return json.avatars;
            },
            args: () => [],
        });
        ({fields: this.fields, user: this.user} = this._dashboard);
    }

    createRenderRoot() {
        if(this.select){
            return this;
        }
        return super.createRenderRoot();
    }

    render() {
        if(this._status === 'success'){
            let currentAvatar = this.user.student.avatar;
            let avatarSVG = this._avatars.find(avatar => avatar.id == currentAvatar).svg;
            let avatarDeclaration = html`<h3>You are now <span class="screen-reader-text">${currentAvatar.name}</span>${unsafeSVG(avatarSVG)}</h3>`;

            return html`
                ${avatarDeclaration} 
                <div class="button-group flex">
                    <a href="/" class="button bg_green white">Go back to your dashboard</a>
                    <button @click=${() => {this._status = null}}>Not so sure about this one... Let me start over</button>
                </div>
            `;
        }
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
        if(this.select){
            return html`
                <details .open=${!this._selectedAvatar}>
                    <summary>${this._selectedAvatar ? html`<span class="screen-reader-text">${this._selectedAvatar.name}</span><span class="avatar-svg" aria-hidden="true">${unsafeSVG(this._selectedAvatar.svg)}</span>` : html`Select an emoji`}</summary>
                    <div class="avatar-options">
                        ${avatars.map(avatar => html`
                            <div class="avatar-option">
                                <input type="radio" name="avatar" id="avatar-${avatar.id}" value="${avatar.id}"} @change=${() => this._selectedAvatar=avatar}>
                                <label for="avatar-${avatar.id}"><span class="screen-reader-text">${avatar.name}</span><span class="avatar-svg" aria-hidden="true">${unsafeSVG(avatar.svg)}</span></label>
                            </div>
                        `)}
                        ${this._selectedAvatar ? html`<div class="avatar-option">
                                <input type="radio" name="avatar" id="avatar-empty" value=""} @change=${() => this._selectedAvatar=null}>
                                <label for="avatar-empty">No emoji</label>
                            </div>` : ''}
                    </div>
                </details>
            `;
        }
        let currentAvatar = this.user.student.avatar;
        let avatarDeclaration = '';
        let backButton = html`<button @click=${() => this._goBack()}><span aria-hidden="true">${unsafeSVG(arrowLeftSvg)}</span>Back</button>`;
        if(!currentAvatar){
            avatarDeclaration = html`<h3>I'm <span class="screen-reader-text">selecting an avatar</span>${unsafeSVG(anonymousAvatar)}</h3>`;
            backButton = '';
        }
        else {
            let avatarSVG = avatars.find(avatar => avatar.id == currentAvatar).svg;
            avatarDeclaration = html`<h3>I'm <span class="screen-reader-text">${currentAvatar.name}</span>${unsafeSVG(avatarSVG)}</h3>`;
        }
        

        return html`
            <slot></slot>
            ${avatarDeclaration}
            <p>Your avatar shows up in the app and in any messages you send. You can change it anytime.</p>
            <p>Select your avatar:</p>
            <form class="avatar-options">
                ${avatars.map(avatar => html`
                    <div class="avatar-option">    
                        <input type="radio" name="avatar" id="avatar-${avatar.id}" .checked=${currentAvatar && avatar.id == currentAvatar} @change=${() => this._updateAvatar(avatar)}>
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
        let currentAvatar = this.user.student.avatar;
        if(currentAvatar){
            this._status = 'success';
        }
        this.user.student.avatar = avatar.id;
        this._updateContext({user: this.user});
    }

    static styles = [
        super.styles,
        css`
            h3{
                display: flex;
                gap:1rem;
                align-items: center;
                margin:2rem 0;
                svg{
                    width:3rem;
                    height:auto;
                }
            }
            .avatar-options{
                display:grid;
                grid-template-columns:1fr 1fr 1fr 1fr 1fr;
                gap:1rem;
            }
            @media (min-width:1000px){
                .avatar-options{
                    gap:2rem;
                }
            }
            .avatar-option{
                position:relative;
                padding:0.5rem;
                input[type="radio"]{
                    position:absolute;
                    opacity:0;
                    width:100%;
                    height:100%;
                    z-index:-1;
                }
                label{
                    cursor:pointer;
                }
                &:hover,&:has(>:hover),&:has(input[type="radio"]:checked){
                    background-color:var(--green-shade-2);
                    border-radius:var(--border-radius);
                }
                
            }
            .button-group{
                .button,button{
                    text-decoration:none;
                    width:fit-content;
                    &:visited{
                        color:white;
                    }
                }
            }
        `
    ]
}

