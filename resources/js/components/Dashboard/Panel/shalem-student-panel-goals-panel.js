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
        console.log('Goals Panel', this.pillars, this.selectableGoals);
        if(!this.selectableGoals||!this.selectableGoals[this.panel]){
            this._getSelectableGoals();
        }
        else{
            this.goalList = this.selectableGoals[this.panel];
        }
    }

    render() {
        if(!this.goalList || !this.goalList.length){
            return html`<shalem-loader>Climbing that hill...</shalem-loader>`
        }
        console.log('Rendering Goals Panel', this.goalList);
        return html`
            <h1>Hello from Goals ${this.panel} Panel</h1>
        `;
    }

    async _getSelectableGoals(){
        let pillar = this.pillars.find(pillar => {
            return pillar.slug === this.panel;
        });
        try{
            const response = await safeFetch(`${this.restUrl}goals/by-pillar?pillar_id=${pillar.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.goalList = data.goals;
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