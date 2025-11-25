import { LitElement,html, css } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import pointsIcon from '../../icons/points-magen-david.svg';
import { BaseDashboardConsumer } from '../Dashboard/base-dashboard-consumer.js';
import { BaseClass } from '../BaseClass.js';
import { pointsByPillar } from './points-aggregators.js';

export class ShalemPointsIcon extends BaseDashboardConsumer(BaseClass(LitElement)){
    static properties = {
        ...super.properties,
        year: {type: String},
    }

    connectedCallback(){
        super.connectedCallback();
        console.log(this.year);
        ({user: this.user,pillars: this.pillars} = this._dashboard);
    }

    firstUpdated(){
        this.points = this.user.user_points;
        if(!this._year||this._year == 'this_year'){
            this._filterPointsByYear();
        }
        this._aggregatePoints();
    }

    render(){
        return html`${unsafeSVG(pointsIcon)}`;
    }

    _filterPointsByYear(){
        let currentYear = new Date().getFullYear();
        this.points = this.points.filter( userPoint => {
            let pointDate = new Date(userPoint.created_at);
            return pointDate.getFullYear() === currentYear;
        });
    }

    _aggregatePoints(){
        let pillarPoints = pointsByPillar(this.points,this.pillars);
        for(let pillarId in pillarPoints){
            this.shadowRoot.querySelectorAll(`[data-pillar='${pillarPoints[pillarId].slug}']`).forEach( el => {
                el.style.opacity = pillarPoints[pillarId].proportion;
            });
        }

    }
}