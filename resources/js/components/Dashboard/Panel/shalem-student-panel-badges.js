import { LitElement, html, css } from 'lit';
import { BaseDashboardConsumer } from '../base-dashboard-consumer.js';
import { BaseClass } from '../../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { safeFetch } from '../../../common/xsrf.js';
import pointsIcon from '../../../icons/points-icon.svg';
import { badgeStyles } from '../../../utilities/badgeStyles.js';

export class ShalemStudentPanelBadges extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        year: { type: String },
        badges: { type: Array, state: true },
        mode: { type: String },
    }

    connectedCallback() {
        super.connectedCallback();
        ({ fields: this.fields, user: this.user, pillars: this.pillars } = this._dashboard);
        if (this.mode === 'staff') {
            this.user = this.pupil;
            this.panel = this.view_panel;
        }
        console.log(this.panel);
        this._getBadges();
        if (this.panel){
            
            this.pillar = this.pillars.find(pillar => {
                let slug = pillar.name.toLowerCase().replace(/\s+/g,'-');
                return slug === this.panel;
            });
        }
    }

    updated(){
        if (this.mode === 'staff') {
            this.user = this.pupil;
            this.panel = this.view_panel;
        }
    }

    render() {
        if (this.mode === 'staff') {
            this.user = this.pupil;
            this.panel = this.view_panel;
        }
        if(!this.badges ){
            return html`<div class="margins"><shalem-loader>Digging in the back of the drawer...</shalem-loader></div>`;
        }
        let  title = 'Admire your badges';
        if(this.year == 'this_year'){
            if(this.panel){
                title = `Admire your ${this.pillar.name} badges`;
            }
        }
        else{
            if(this.panel){
                title = `Admire all your ${this.pillar.name} badges`;
            }
            else{
                title = 'Admire all your badges';
            }
        }
        let badges = this.badges;
        if(this.panel){
            badges = this.badges.filter(badge => badge.badge.pillar_id === this.pillar.id);
        }
        if(this.year == 'this_year'){
            const currentYear = new Date().getFullYear();
            badges = badges.filter(badge => {
                const awardedDate = new Date(badge.created_at);
                return awardedDate.getFullYear() === currentYear;
            });
        }
        return html`
            <div class="header_with_icon ${this.mode!='staff'?'margins':''}">
                <div class="icon" aria-hidden="true">${unsafeSVG(pointsIcon)}</div>
                <h1>${title}</h1>
            </div>
            <div class="${this.mode!='staff'?'margins':''}">
               <div class="badges_container flex">
                    ${badges.length ? badges.map(badge => this._processBadgeToHtml(badge)) : html`No badges to see yet. Earn badges by getting points in different pillars!`}
               </div>
            </div>
        `;
    }

    async _getBadges(){
        if(this.user.badges){
            this.badges =  this.user.badges;
        }
        else{
            let response = await safeFetch(`${this.restUrl}badges`);
            let data = await response.json();
            this.badges = data.badges;
            this.user.badges = data.badges;
            this._updateContext({user: this.user});
        }
    }

    _processBadgeToHtml(badge){
        badge = badge.badge;
        let name = badge.name.split(' ');
        let name1 = name.shift();
        let name2 = name.join(' ');
        let pillar = this.pillars.find(pillar => pillar.id === badge.pillar_id);
        return html`
            <div class="badge_card style_${badge.style} ${pillar?.colour}">
                <h3>${name1}</h3>
                <div class="badge_avatar" aria-hidden="true">
                    <shalem-avatar avatarid=${badge.avatar_id}></shalem-avatar>
                </div>
                <h3>${name2}</h3>
                <shalem-anchor-modal>
                    <button slot="trigger" class="view_details"><span class="screen-reader-text">View details</span></button>
                    <div class="modal" slot="body">
                        <h3 class="">${badge.name}<span class="dot bg_${pillar?.colour}"></span><span class="dot level_${badge.level}"></span></h3>
                        <p>${this._badgeDescription(pillar,badge.level)}</p>
                        <p class="badge_description">${badge.text}</p>
                        <button class="button bg_blue" @click=${() => {this._updateContext({dashboard:'goals',panel:null,view:null});}}>I want to set some goals!</button>
                    </div>
                </shalem-anchor-modal>
            </div>
        `;
    }

    _badgeDescription(pillar, level){
        let levelMap = {
            1: 'Blue',
            2: 'Silver',
            3: 'Gold',
            4: 'Wizard',
        };
        return html`${levelMap[level]} badge <span class="dot level_${level}"></span> in ${pillar?.name} <span class="dot bg_${pillar?.colour}"></span>.`;
    }

    static styles = [
        super.styles,
        badgeStyles,
        css`
        .badges_container{
            gap:1rem;
            flex-wrap: wrap;
        }
        .badge_card{
            position:relative;
        }
        shalem-anchor-modal, shalem-anchor-modal button.view_details{
            position: absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            cursor: pointer;
            background-color: transparent !important;
            border:none;
            z-index:15;
            &:hover .view_details, &:focus .view_details{
                background-color:transparent
            }
        }
        .dot{
            display:inline-block;
            width:1rem;
            height:1rem;
            border-radius:50%;
            margin-left:0.1rem;
            margin-right:0.1rem;
            &.level_1{
                background-image:linear-gradient(45deg, var(--blue), var(--blue-shade-2));
            }
            &.level_2{
                background-image:linear-gradient(126deg, #fff8f8 10%, #c0c0c0 35%, #ccc 38%, #f0f0f0 90%);
            }
            &.level_3{
                background-image: linear-gradient(133deg, #ffd483 35%, #ffc128 45%, #fee502 74%, #ffee55);
            }
            &.level_4{
                background-image: linear-gradient(47deg, var(--purple), var(--aqua), #040848, var(--yellow), var(--green));
            }
        }
        .modal{
            h3{
                margin-bottom:1rem;
                font-size:1.2rem;
                padding-right:2rem;
                text-align: left;
            }
            p{
                text-align: left;
            }
        }
        `
       
    ];
}