import {html, LitElement} from 'lit';
import { BaseDashboardConsumer } from '../base-dashboard-consumer.js';
import { BaseClass } from '../../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { safeFetch } from '../../../common/xsrf.js';
import goalsIcon from '../../../icons/goals-icon.svg';

export class ShalemStudentPanelGoals extends BaseDashboardConsumer(BaseClass(LitElement)) {
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
        console.log('Rendering Goals Panel', this.goalList);
        return html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${unsafeSVG(goalsIcon)}</div>
                <h1>Set a${this.pillar.name.startsWith('A') || this.pillar.name.startsWith('E') || this.pillar.name.startsWith('I') || this.pillar.name.startsWith('O') || this.pillar.name.startsWith('U') ? 'n' : ''} ${this.pillar.name} goal</h1>
            </div>
            <div class="margins">
            </div>
        `;
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
}