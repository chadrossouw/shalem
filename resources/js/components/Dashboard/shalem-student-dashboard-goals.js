import { html, LitElement,css } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import goalsIcon from "../../icons/goals-icon.svg";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { cards,toggle } from '../../utilities/baseStyles.js';
import closeIcon from "../../icons/close-icon.svg";
import waves from "../../icons/waves.svg";

export class ShalemStudentDashboardGoals extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
        _year: {type: String, state: true},
    }

    constructor(){
        super();
        if(!this._year){
            this._year = 'this_year';
        }
    }

    connectedCallback(){
        super.connectedCallback();
        ({fields: this.fields, user: this.user, pillars: this.pillars, selectableGoals: this.selectableGoals} = this._dashboard);
        this._goalsByPillar();
    }

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }


    render(){
        let body = '';
        if(this.panel){
            body = html`<shalem-student-panel-goals-panel
                identifier="${this.identifier}"
            ></shalem-student-panel-goals-panel>`;
        }
        else{
            body = html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${unsafeSVG(goalsIcon)}</div>
                ${this._year == 'this_year' ? html`
                    <shalem-editable-field name="student_dashboard_goals_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_goals_header ?? 'My goals'}</h1>
                    </shalem-editable-field>
                ` : html`
                <shalem-editable-field name="student_dashboard_goals_header_all_time" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.student_dashboard_goals_header_all_time ?? 'All my goals'}</h1>
                </shalem-editable-field>
                `}

            </div>
            <div class="margins grid grid_50 cards">
                ${this.pillars.map( pillar => {
                    return html`
                    <div class="card radius-big shadow ${pillar.colour}">
                        <h3 class="h4">
                            ${pillar.name}
                        </h3>
                        <button class="add bg_${pillar.colour}" @click=${() => this._handleAddGoal(pillar)}>+</button>
                        ${this.goals[pillar.id].goals.length > 0 ? html`
                            <div class="goals_list grid">
                                ${this.goals[pillar.id].goals.map( goal => html`
                                <div class="goal_item">
                                    <shalem-anchor-modal>

                                        <button slot="trigger" class="radius bg_pale_grey ${pillar.colour}" id="goal_${pillar.id}_${goal.id}" @click=${() => {
                                            this._openModal(`modal_goal_${pillar.id}_${goal.id}`);
                                        }}>
                                            ${unsafeSVG(waves)}
                                            
                                        </button>
                                        <div slot="modal" class="modal bg_yellow bg_shade_2 radius shadow" id="modal_goal_${pillar.id}_${goal.id}">
                                            <button class="close_button bg_yellow bg_shade_2" aria-label="Close goal details for ${goal.name}">${unsafeSVG(closeIcon)}</button>
                                            <h4>${goal.name}</h4>
                                            <div>${goal.description}</div>
                                        </div>
                                    </shalem-anchor-modal>
                                </div>
                            `)}</div>
                        ` : html`<div class="no_goals">No goals set yet.</div>`}
                    </div>`;
                })}
            `;
        }
        
        return html`
        <slot></slot>
        <div class="margins">
            <div class="toggle">
                <input type="checkbox" id="year_toggle" name="year_toggle" @change=${this._handleYearToggle} ?checked=${this._year && this._year != 'this_year'}>
                <label for="year_toggle" class="screen_reader_only">Toggle between viewing points for this year and all time</label>
                <div class="toggle_text unchecked"><span>This year</span></div>
                <div class="toggle_text checked"><span>All time</span></div>
            </div>
        </div>
        
        ${body}
        `;
    }
    _openModal(id){
        let modal = this.shadowRoot.getElementById(id);
        if(modal){
            modal.style.scale = '1';
            modal.style.opacity = '1';
            let closeButton = modal.querySelector('.close_button');
            if(closeButton){
                closeButton.focus();
                closeButton.onclick = () => {
                    modal.style.scale = '0';
                    modal.style.opacity = '0';
                };
            }
        }
        this.shadowRoot.querySelectorAll('.modal').forEach( otherModal => {
            if(otherModal.id != id){
                otherModal.style.scale = '0';
                otherModal.style.opacity = '0';
            }
        });
    }
    
    _goalsByPillar(){
        let goals = this.user.user_goals;
        this.goals = {};
        for(let pillar of this.pillars){
            let slug = pillar.name.toLowerCase().replace(/\s+/g,'-');
            this.goals[pillar.id] = {name:pillar.name,colour:pillar.colour,slug:slug,goals:[]};
        }
        goals.forEach( userGoal => {
            let goalName = userGoal.name;
            let descriptions = userGoal.goals.criteria;
            descriptions=descriptions.map( desc => html`<li>${desc.description}</li>`);
            let description = html`<ul>${descriptions}</ul>`;
            let pillarId = userGoal.goals.pillar_id;
            if(this.goals.hasOwnProperty(pillarId)){
                this.goals[pillarId].goals.push({name:goalName,description:description,id:userGoal.id});
            }
        });
    }
    
    _handleYearToggle(e){
        if(e.target.checked){
            this._year = 'all_time';
        }
        else{
            this._year = 'this_year';
        }
    }

    _handleAddGoal(pillar){
        this._updateContext({panel: pillar.slug});
    }
    
    static styles = [
        super.styles,
        cards,
        toggle,
        css`
            .cards{
                gap:2rem;
            }
            .card{
                position:relative;
                padding:1rem;
                .add{
                    position:absolute;
                    top:1rem;
                    right:1rem;
                    width:2rem;
                    height:2rem;
                    border:none;
                    border-radius:50%;
                    padding:0;
                }
            }
            
            .goals_list{
                grid-template-columns:1fr 1fr 1fr;
                .goal_item{
                    aspect-ratio:1 / 1;
                    position:relative;
                    &>button{
                        width:100%;
                        height:100%;
                        border:none;
                        cursor:pointer;
                        position:absolute;
                        top:0;
                        left:0;
                        padding:0;
                        display:block;
                        overflow:clip;
                        svg{
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            position:absolute;
                            top:50%;
                            left:0;
                            fill:currentColor;
                        }
                        &:hover,&:focus{
                            background-color:var(--pale-grey);
                            color:currentColor;
                        }
                    }
                }
            }
        `
    ];
}