import {html, LitElement,css} from 'lit';
import {BaseForm} from '../../Form/base-form.js';
import { BaseDashboardConsumer } from '../base-dashboard-consumer.js';
import { BaseClass } from '../../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { safeFetch } from '../../../common/xsrf.js';
import goalsIcon from '../../../icons/goals-icon.svg';

export class ShalemStudentPanelGoals extends BaseForm(BaseDashboardConsumer(BaseClass(LitElement))) {
    static properties = {
        ...super.properties,
        goalList: { type: Array, state: true }
    }

    connectedCallback() {
        super.connectedCallback();
        ({fields: this.fields, user: this.user, pillars: this.pillars, selectableGoals: this.selectableGoals} = this._dashboard);
        this.userGoals = this.user.user_goals;
        this.pillar = this.pillars.find(pillar => {
            return pillar.slug === this.panel;
        });
        if(!this.selectableGoals||!this.selectableGoals[this.panel]){
            this._getSelectableGoals();
        }
        else{
            this.goalList = this.selectableGoals[this.panel];
        }
    }

    render() {
        if(!this.goalList || !this.goalList.length){
            return html`<div class="margins"><shalem-loader>Climbing that hill...</shalem-loader></div>`;
        }
        return html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${unsafeSVG(goalsIcon)}</div>
                <h1>Set a${this.pillar.name.startsWith('A') || this.pillar.name.startsWith('E') || this.pillar.name.startsWith('I') || this.pillar.name.startsWith('O') || this.pillar.name.startsWith('U') ? 'n' : ''} ${this.pillar.name} goal</h1>
            </div>
            <div class="margins">
                <form id="add_goal_form" @submit=${this._handleSubmit} action="${this.restUrl}goals/set">
                    <fieldset>
                        <legend class="sr-only">Choose a goal to set</legend>
                        ${this.goalList.map( goal => html`
                            <div class="goal_group">
                                <input type="radio" id="goal_${goal.id}" name="goal" value="${goal.id}">
                                <label for="goal_${goal.id}">${goal.name}</label>
                                <p>${goal.description}</p>
                            </div>
                        `)} 
                    </fieldset>
                    <label for="goal_name">Optional: Give your goal a custom name</label>
                    <input type="text" id="goal_name" name="goal_name" placeholder="My custom goal name">
                    <button type="submit" class="button">Set Goal</button>
                </form>
            </div>
        `;
    }

    _beforeHandleSuccess(response){
        if(response && response.user_goal){
            this.userGoals = [...this.userGoals, response.user_goal];
            this.user.user_goals = this.userGoals;
            this._updateContext({user: this.user});
        }
    }

    async _getSelectableGoals(){
        try{
            const response = await safeFetch(`${this.restUrl}goals/by-pillar?pillar_id=${this.pillar.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.goalList = data.goals.filter( goal => {
                return !this.userGoals.some(userGoal => userGoal.goal_id === goal.id);
            });
            
            this.selectableGoals = {
                ...this.selectableGoals,
                [this.panel]: data.goals
            };
            this._updateContext({selectableGoals: this.selectableGoals});
            
        }
        catch(error){
            console.error('Error fetching selectable goals:', error);
        }
    }

    static styles = [
        super.styles,
        css`
            fieldset{
                border: none;
                margin: 0;
                padding: 0;
            }
            legend{
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }
            .goal_group{
                margin-bottom: 1.5rem;
                padding: 1rem;
                border: 2px solid var(--yellow-shade-1);
                border-radius: var(--border-radius);
                background-color: var(--yellow-shade-2);
                label{
                    font-weight: bold;
                    font-size:1.2rem;
                }
                p{
                    margin-bottom:0;
                }
            }
        `
    ];

}