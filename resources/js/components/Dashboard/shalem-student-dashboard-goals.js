import { html, LitElement,css } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import goalsIcon from "../../icons/goals-icon.svg";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { cards,toggle } from '../../utilities/baseStyles.js';
import closeIcon from "../../icons/close-icon.svg";
import goalRemoveIcon from "../../icons/goals-delete.svg";
import waves from "../../icons/waves.svg";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemStudentDashboardGoals extends BaseDashboardConsumer(BaseClass(LitElement)){

    static properties = {
        ...super.properties,
        mode: { type: String },
        _year: {type: String, state: true},
        _goals: {type: Object, state: true},
        _removeGoal: {type: Object, state: true},
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
        if(this.mode==='staff'){
            this.user = this.pupil;
            this.panel = null;
        }
        this._eventManager.listen('dialog-closed-goal-remove', () => {
            this._removeGoal = null;
        });
        this._goalsByPillar();
    }

    updated(changedProperties){
        super.updated(changedProperties);
        if(this.mode==='staff'){
            this.user = this.pupil;
            this.panel = null;
        }
        if(changedProperties.has('_year')){
            this._goalsByPillar();
        }
        if(changedProperties.has('_dashboard')){
            this._goalsByPillar();
        }
        cardLinks(this.shadowRoot);
    }


    render(){
        let body = '';
        if(this.mode==='staff'){
            this.user = this.pupil;
            this.panel = null;
        }
        if(this.panel){
            body = html`<shalem-student-panel-goals-panel
                identifier="${this.identifier}"
            ></shalem-student-panel-goals-panel>`;
        }
        else{
            let header = '';
            if(this.mode!=='staff'){
                header = html`
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

                </div>`;
            }
            body = html`
            ${header}
            <div class="${this.mode!=='staff' ? 'margins' : ''} grid grid_50 cards">
                ${this.pillars.map( pillar => {
                    return html`
                    <div class="card radius-big shadow ${pillar.colour}">
                        <h3 class="h4">
                            ${pillar.name}
                        </h3>
                        ${this.mode!=='staff' ? html`
                            <button class="add bg_${pillar.colour}" @click=${() => this._handleAddGoal(pillar)}>+</button>
                        ` : ''}
                        ${this._goals[pillar.id].goals.length > 0 ? html`
                            <div class="goals_list grid">
                                ${this._goals[pillar.id].goals.map( goal => html`
                                <div class="goal_item">
                                    <shalem-anchor-modal>
                                        <button slot="trigger" class="radius bg_pale_grey ${pillar.colour} ${goal.total==goal.progress?'complete':''}">
                                            <span class="screen-reader-text">View details for goal: ${goal.name}</span>
                                            <span class="progress" aria-label="Progress: ${goal.progress} out of ${goal.total}" style="--progress-percent:${(goal.total > 0&&goal.progress>0) ? (goal.progress / goal.total) * 100 : 8}%;">
                                                ${unsafeSVG(waves)}
                                            </span>
                                        </button>
                                        <div slot="body" class="grid body_container ${goal.total==goal.progress?'complete':''}">
                                            <div class="goal_details">
                                            <h4>${goal.name}</h4>
                                            <p>${goal.description}</p>
                                            </div>
                                            <div class="progress_bar_container">
                                                <div class="radius bg_white ${pillar.colour} progress_bar">
                                                    <span class="screen-reader-text">View details for goal: ${goal.name}</span>
                                                    <span class="progress" aria-label="Progress: ${goal.progress} out of ${goal.total}" style="--progress-percent:${(goal.total > 0&&goal.progress>0) ? (goal.progress / goal.total) * 100 : 8}%;">
                                                        ${unsafeSVG(waves)}
                                                    </span>
                                                </div>
                                            </div>
                                            ${this.mode!=='staff' ? html`
                                                ${goal.needsDocuments ? html`<button class="bg_${pillar.colour}" @click=${()=>this._handleAction({dashboard: 'documents', panel: 'upload', view: null})}>Upload a document</button>` : html`<div></div>`}
                                                ${goal.total!=goal.progress ? html`<button class="bg_${pillar.colour}" @click=${()=>this._handleRemoveGoal(goal)}>Remove</button>` : html`<div class="goal_complete">Goal complete!</div>`}
                                            ` : ''}

                                        </div>
                                    </shalem-anchor-modal>
                                </div>
                            `)}</div>
                        ` : html`<div class="no_goals">No goals set yet.</div>`}
                    </div>`;
                })}
            </div>`;
        }
        
        return html`
        <slot></slot>
        <div class="${this.mode!=='staff' ? 'margins' : ''}">
            <div class="toggle">
                <input type="checkbox" id="year_toggle" name="year_toggle" @change=${this._handleYearToggle} ?checked=${this._year && this._year != 'this_year'}>
                <label for="year_toggle" class="screen_reader_only">Toggle between viewing points for this year and all time</label>
                <div class="toggle_text unchecked"><span>This year</span></div>
                <div class="toggle_text checked"><span>All time</span></div>
            </div>
        </div>
        
        ${body}
        ${this._removeGoal? html`<shalem-dialog open identifier="goal-remove">
            <span slot="title" class="flex white modal_title">${unsafeSVG(goalRemoveIcon)}<h2>Remove ${this._removeGoal.name}</h2></span>
            <div slot="body" class="modal_body">
                <p class="white">Are you SURE you want to remove this goal?</p>
                <button class="bg_blue" @click=${(e)=>this._handleRemoveGoalConfirm(e)}>Yes. It's not working for me</button>
                <button class="bg_light_blue" @click=${()=>this._handleRemoveGoalCancel()}>No. Wait. I want to keep going</button>
            </div>
        </shalem-dialog>` : ''
        }
        `;
    }
   
    _goalsByPillar(){
        let goals = this.user.user_goals;
        if(this._year != 'all_time'){
            let currentYear = new Date().getFullYear();
            goals = goals.filter( userGoal => {
                let goalDate = new Date(userGoal.created_at);
                return goalDate.getFullYear() === currentYear;
            });
        }
        this._goals = {};
        for(let pillar of this.pillars){
            let slug = pillar.name.toLowerCase().replace(/\s+/g,'-');
            this._goals[pillar.id] = {name:pillar.name,colour:pillar.colour,slug:slug,goals:[]};
        }
        goals.forEach( userGoal => {
            let goalName = userGoal.name;
            let criteria = userGoal.goals.criteria;
            let progress = userGoal.progress;
            criteria = criteria.map( criterion => {
                if(progress){
                    let userCriterionProgress = progress.find( cProg => cProg.criteria_id === criterion.id );
                    if(userCriterionProgress){
                        criterion.progress = userCriterionProgress;
                        return criterion;
                    }
                }
                return criterion;
            });
            let descriptions=criteria.map( desc => html`<li><span>${desc.progress.progress_value==desc.progress.target_value?html`<span class="check"><span class="screen-reader-text">Completed:</span></span>`:''}</span>${desc.description}</li>`);
            let description = html`<p>${userGoal.goals.description}</p><ul>${descriptions}</ul>`;
            let aggregateTotal, aggregateProgress;
            if(progress && progress.length > 0){
                aggregateTotal = progress.reduce( (total,prog) => total + prog.target_value, 0);
                aggregateProgress = progress.reduce( (total,prog) => total + prog.progress_value, 0);
            }
            let pillarId = userGoal.goals.pillar_id;
            let needsDocuments = criteria.some( criterion => {return criterion.progress.progress_value!=criterion.progress.target_value && !criterion.attendance && !criterion.merits} );
            if(this._goals.hasOwnProperty(pillarId)){
                this._goals[pillarId].goals.push({name:goalName,description:description,id:userGoal.id, total:aggregateTotal, progress:aggregateProgress, needsDocuments:needsDocuments});
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

    _handleRemoveGoal(goal){
        this._removeGoal = goal;
    }

    _handleRemoveGoalCancel(){
        this._removeGoal = null;
    }

    _handleRemoveGoalConfirm(e){
        e.preventDefault();
        e.stopPropagation();
        safeFetch('/api/goals/remove',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_goal_id: this._removeGoal.id})
        })
        .then( response => {
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then( data => {
            // Refresh goals
            this._dashboard.user.user_goals = this._dashboard.user.user_goals.filter( ug => ug.id != this._removeGoal.id );
            this._goalsByPillar();
            this._removeGoal = null;
        })
        .catch( error => {
            console.error('There was a problem with the fetch operation:', error);
        });
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
                    &>button,&.progress_bar{
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
                ul{
                    margin:0;
                    list-style:none;
                    padding-left:1.2rem;
                    li{
                        margin-bottom:0.5rem;
                        position:relative;
                        &>span{
                            position:absolute;
                            left:-1.2rem;
                            top:0.5rem;
                            width:0.5rem;
                            height:0.5rem;
                            border-radius:50%;
                            background-color:var(--white);
                            span.check{
                                width: 1rem;
                                height: 0.35rem;
                                border-bottom: 2px solid var(--green);
                                border-left: 2px solid var(--green);
                                display: block;
                                transform: rotate(-45deg) translate(2px, -2px);
                            }
                        }
                    }
                }
            }
            .goal_item button.bg_pale_grey,.goal_item .progress_bar{
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                padding:0;
                overflow:clip;
                &:hover,&:focus{
                    background-color:var(--pale-grey);
                    color:currentColor;
                    .progress{
                        transform:translate(-100%,calc((var(--progress-percent) + 5%) * -1));
                    }
                }
            }
            .progress_bar_container{
                position:relative;
                aspect-ratio:1 / 1;
            }
            .progress{
                position:absolute;
                top:100%;
                left:0;
                width:100%;
                height:100%;
                transform:translate(0,calc(var(--progress-percent)  * -1));
                transition:transform calc(var(--transition) * 5) ease-in-out;
                svg{
                    width:200%;
                    height:100%;
                    object-fit:cover;
                    fill:currentColor;
                }
            }
            .body_container{
                grid-template-columns:1fr 75px;
                gap:1rem;
                h4{
                    font-size:1rem;
                    margin-bottom:0.5rem;
                }
                .progress_bar_container{
                    grid-column:2 / 3;
                }
                button{
                    grid-column:1 / -1;
                }
            }
            .goal_complete{
                grid-column:1 / -1;
                text-align:center;
                aspect-ratio:1;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-weight:bold;
                transform:scale(0.1);
                transition:transform var(--transition) cubic-bezier(0, 0.29, 1, 0.72);
                background-image:radial-gradient(
                    var(--yellow-shade-2)0 50%,transparent 0 100%),
                    conic-gradient(
                        var(--purple-shade-1) 0 10deg,
                        var(--yellow-shade-2) 0 20deg,
                        var(--blue-shade-1) 0 30deg,
                        var(--yellow-shade-2) 0 40deg,
                        var(--light-blue-shade-1) 0 50deg,
                        var(--yellow-shade-2) 0 60deg,
                        var(--aqua) 0 70deg,
                        var(--yellow-shade-2) 0 80deg,
                        var(--green-shade-1) 0 90deg,
                        var(--yellow-shade-2) 0 100deg,
                        var(--yellow-shade-1) 0 110deg,
                        var(--yellow-shade-2) 0 120deg,
                        var(--purple-shade-1) 0 130deg,
                        var(--yellow-shade-2) 0 140deg,
                        var(--blue-shade-1) 0 150deg,
                        var(--yellow-shade-2) 0 160deg,
                        var(--blue-shade-1) 0 170deg,
                        var(--yellow-shade-2) 0 180deg,
                        var(--light-blue-shade-1) 0 190deg,
                        var(--yellow-shade-2) 0 200deg,
                        var(--aqua) 0 210deg,
                        var(--yellow-shade-2) 0 220deg,
                        var(--green-shade-1) 0 230deg,
                        var(--yellow-shade-2) 0 240deg,
                        var(--yellow-shade-1) 0 250deg,
                        var(--yellow-shade-2) 0 260deg,
                        var(--purple-shade-1) 0 270deg,
                        var(--yellow-shade-2) 0 280deg,
                        var(--blue-shade-1) 0 290deg,
                        var(--yellow-shade-2) 0 300deg,
                        var(--light-blue-shade-1) 0 310deg,
                        var(--yellow-shade-2) 0 320deg,
                        var(--aqua) 0 330deg,
                        var(--yellow-shade-2) 0 340deg,
                        var(--green-shade-1) 0 350deg,
                        var(--yellow-shade-2) 0 360deg)
                ;
            }
            .open .goal_complete{
                transform:scale(1);
            }
            .modal_title{
                align-items:center;
                margin-bottom:1rem;
                gap:1rem;
                h2{
                    margin:0;
                }
            }
            .modal_body{
                button{
                    margin-bottom:1rem;
                    width:100%;
                }
            }
        `
    ];
}