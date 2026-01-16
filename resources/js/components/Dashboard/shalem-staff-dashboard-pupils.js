import { css,html, LitElement } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { safeFetch } from "../../common/xsrf.js";
import view from '../../icons/view.svg';
import message from '../../icons/message.svg';
import pupilsIcon from '../../icons/pupils-icon.svg';
export class ShalemStaffDashboardPupils extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user} = this._dashboard);
    }

    disconnectedCallback(){
        super.disconnectedCallback();
    }

    updated(changedProperties){
        if(changedProperties.has('panel')){
            this._setPupilFromPanel();
        }
        cardLinks(this.shadowRoot);
    }

    firstUpdated(){
        this._setDocumentTitle('My Pupils');
    }

    render(){
        let panel = '';
        if(this.panel == 'list'||!this.panel){
                let header = html`
                <div class="header_with_icon margins">
                    ${unsafeSVG(pupilsIcon)}
                    <shalem-editable-field name="staff_dashboard_my_pupils_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.staff_dashboard_my_pupils_header ?? 'My pupils'}</h1>
                    </shalem-editable-field>
                </div>
                `;
                panel = html`
                    ${header}
                    <div class="margins">
                        <ul class="pupils_list cards grid grid_50">
                        ${this.mentees.length == 0 ? html`
                            <p>No pupils assigned to you yet.</p>
                        ` : html`
                            ${this.mentees.map(mentee => html`
                                <li class="card flex shadow radius bg_white">
                                    <div class="card_content">
                                        <h2 class="h3">${mentee.first_name} ${mentee.last_name}</h2>
                                    </div>
                                    <shalem-avatar avatarid="${mentee.student.avatar??8}"></shalem-avatar>
                                    <button @click=${() => this._handleAction({dashboard: 'pupils', panel: mentee.id, view: null})}>
                                        ${unsafeSVG(view)}
                                        View
                                    </button>
                                    <button class="bg_blue" @click=${() => this._handleAction({dashboard: 'pupils', panel: mentee.id, view: message})}>
                                        ${unsafeSVG(message)}
                                        Message
                                    </button>
                                </li>
                            `)}
                        `}
                    </div>
                `
            
        }
        else if (this.panel){
            panel = html`
                <shalem-staff-panel-pupil-details
                    identifier="${this.identifier}"
                >
                </shalem-staff-panel-pupil-details>
            `
        }
        return html`
        <slot></slot>
        ${panel}
        `;
    }

    _setPupilFromPanel(){
        let pupil = this.mentees.find(mentee => mentee.id == this.panel);
        if(pupil){
            this._updateContext({pupil: pupil});
        }
    }

    static styles = [
        super.styles,
        css`
         .pupils_list.cards{
            display:grid;
            gap:2rem;
            margin-bottom:2rem;
            li{
                padding:1rem;
                flex-wrap:wrap;
                align-items:center;
                gap:1rem;
                .card_content{
                    flex-basis:calc(100% - 4rem);
                }
                h2{
                    margin:0;
                }
                shalem-avatar{
                    flex-basis:3rem;
                }
                svg{
                    width:3rem;
                    display:
                }
                h4{
                    margin-top:0;
                }
                .header{
                    margin:0;
                }
                &>button{
                    height:fit-content;
                    flex-basis:45%;
                    font-size:1rem;
                    padding:0.75rem 1rem;
                    gap:0.5rem;
                }
            }
        }
        @media (min-width:1000px){
            .pupils_list{
                grid-template-columns:1fr 1fr;
            }
        }`
    ];
}