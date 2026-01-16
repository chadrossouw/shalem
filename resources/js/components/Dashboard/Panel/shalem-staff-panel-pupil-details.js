import { LitElement, html, css } from 'lit';
import { BaseDashboardConsumer } from '../base-dashboard-consumer.js';
import { BaseClass } from '../../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import arrowLeft from '../../../icons/arrow-left.svg';
import { safeFetch } from '../../../common/xsrf.js';

export class ShalemStaffPanelPupilDetails extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        loading: { type: Boolean, state: true },
    }

    async connectedCallback() {
        super.connectedCallback();
        if(!this.pupil){
            this._setPupilFromPanel();
        }
        if(!this.pupil.user_points){
            this.loading = true;
            await this._getPupilDetails();
        }
    }

    async updated(changedProperties){
        if(!this.pupil){
            this._setPupilFromPanel();
        }
        if(!this.pupil.user_points){
            this.loading = true;
            await this._getPupilDetails();
        }
    }

    render() {
        let view = '';
        if(this.loading){
            view = html`<shalem-loader>Calling on the intercom...</shalem-loader>`;
        }
        else if(this.view == 'points' || !this.view){
            view = html`<shalem-student-dashboard-points
                identifier="${this.identifier}"
                mode="staff"
            ></shalem-student-dashboard-points>`;
        }
        else if(this.view == 'goals'){
            view = html`<shalem-student-dashboard-goals
                identifier="${this.identifier}"
                mode="staff"
            ></shalem-student-dashboard-goals>`;
        }
        else if(this.view == 'documents'){
            view = html`<shalem-student-dashboard-documents
                identifier="${this.identifier}"
                mode="staff"
            ></shalem-student-dashboard-documents>`;
        }
        else if(this.view == 'messages'){
            view = html`<shalem-staff-messages
                identifier="${this.identifier}"
            ></shalem-staff-messages>`;
        }
        return html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">
                    <shalem-avatar avatarid="${this.pupil.student.avatar??8}"></shalem-avatar>
                </div>
                <h1 >${this.pupil.first_name} ${this.pupil.last_name}</h1>
            </div>
            <div class="margins tabs_wrapper">
                <nav class="tabs">
                    <ul class="flex">
                        <li><button class="tab ${this.view=='points'||!this.view?'active':''}" @click=${() => this._handleAction({ dashboard: 'pupils', panel: this.pupil.id, view: 'points' })}>Points</button></li>
                        <li><button class="tab ${this.view=='goals'?'active':''}" @click=${() => this._handleAction({ dashboard: 'pupils', panel: this.pupil.id, view: 'goals' })}>Goals</button></li>
                        <li><button class="tab ${this.view=='documents'?'active':''}" @click=${() => this._handleAction({ dashboard: 'pupils', panel: this.pupil.id, view: 'documents' })}>Documents</button></li>
                        <li><button class="tab ${this.view=='messages'?'active':''}" @click=${() => this._handleAction({ dashboard: 'pupils', panel: this.pupil.id, view: 'messages' })}>Messages</button></li>
                    </ul>
                </nav>
            </div>
            <div class="margins">
               ${view}
            </div>
        `;
    }

    _setPupilFromPanel(){
        let pupil = this.mentees.find(mentee => mentee.id == this.panel);
        if(pupil){
            this._updateContext({pupil: pupil});
        }
    }

    async _getPupilDetails(){
        try{
            let response = await safeFetch(`${this.restUrl}student/${this.panel}`);
            let pupilDetails = await response.json();
            this._updateContext({pupil: pupilDetails.pupil});
        }
        catch(error){
            console.error('Error fetching pupil details:', error);
        }
        finally{
            this.loading = false;
        }
    }
    
    static styles = [
        super.styles,
        css`
            .tabs_wrapper{
                position:relative;
                margin-bottom:2rem;
                &::after{
                    content:'';
                    position:absolute;
                    width:100vw;
                    height:3px;
                    bottom:0;
                    left:calc(-50vw + 50%);
                    background-color:var(--purple-shade-2);
                }
            }
            ul.flex{
                list-style:none;
                padding:0;
                margin:0;
                gap:0.5rem;
                justify-content:flex-start;
                li{
                    margin:0;
                    paddng:0;
                    button{
                        background-color:var(--purple-shade-2);
                        color:var(--white);
                        border:3px solid var(--purple-shade-2);
                        border-bottom:none;
                        width:clamp(100px, 10vw, fit-content);
                        border-radius:var(--border-radius) var(--border-radius) 0 0;
                        max-width:calc((100vw - 2 * var(--margins) - 3 * 0.5rem) / 4);
                        font-size:clamp(0.9rem, 2.5vw, 1.25rem);
                        padding:0.75rem clamp(0.25rem,0.75vw,1.5rem);
                        &.active{
                            background-color:var(--white);
                            color:var(--purple);
                            font-weight:bold;
                            position:relative;
                            z-index:2;
                            &::after{
                                content:'';
                                position:absolute;  
                                width:100%;
                                height:3px;
                                bottom:0;
                                left:0;
                                background-color:var(--white);
                            }
                        }
                    }
                }
            }

            @media screen and (min-width:700px){
                ul.flex li button{
                    width:fit-content;
                    max-width:unset;
                    font-size:1.25rem;
                    padding:0.75rem 1.5rem;
                }
            }
        `,
    ];
}