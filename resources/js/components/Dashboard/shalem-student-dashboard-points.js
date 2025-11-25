import { html, LitElement,css } from "lit";
import { BaseDashboardConsumer } from "./base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";
import pointsIcon from "../../icons/points-icon.svg";
import backArrow from "../../icons/arrow-left.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { cardLinks } from "../../common/accessibility.js";
import { cards } from '../../utilities/baseStyles.js';
import view from "../../icons/view.svg";
import { pointsByPillar } from "../Points/points-aggregators.js";

export class ShalemStudentDashboardPoints extends BaseDashboardConsumer(BaseClass(LitElement)){

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
        ({fields: this.fields, user: this.user, pillars: this.pillars} = this._dashboard);
        this.points = pointsByPillar(this.user.user_points,this.pillars);
    }

    updated(changedProperties){
        cardLinks(this.shadowRoot);
    }


    render(){
        let body = '';
        if(this.panel){
            body = html`<shalem-student-dashboard-points-panel
                identifier="${this.identifier}"
                year=${this._year}
            ></shalem-student-dashboard-points-panel>`;
        }
        else{
            body = html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">${unsafeSVG(pointsIcon)}</div>
                ${this._year == 'this_year' ? html`
                    <shalem-editable-field name="student_dashboard_points_header" location="student-dashboard" ?admin=${this.isAdmin}>
                        <h1>${this.fields?.student_dashboard_points_header ?? 'My points'}</h1>
                    </shalem-editable-field>
                ` : html`
                <shalem-editable-field name="student_dashboard_points_header_all_time" location="student-dashboard" ?admin=${this.isAdmin}>
                    <h1>${this.fields?.student_dashboard_points_header_all_time ?? 'All my points'}</h1>
                </shalem-editable-field>
                `}

            </div>
            <div class="margins icon_holder">
                <shalem-points-icon year=${this._year}></shalem-points-icon>
            </div>
            <div class="margins grid grid_50 cards">
                ${this.pillars.map( pillar => {
                    let slug = pillar.name.toLowerCase().replace(/\s+/g,'-');
                    let pointsData = this.points[pillar.id];
                    return html`
                    <div class="card radius-big shadow ${pillar.colour}">
                        <h3 class="h4">
                            ${pillar.name}
                        </h3>
                        <button class="card_target bg_${pillar.colour}"  @click=${() => this._handleAction({panel: slug})}>
                            ${unsafeSVG(view)}View
                        </button>
                        <div class="points_total star bg_${pillar.colour} bg_shade_2">
                            ${pointsData.points}
                        </div>
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

    _handleYearToggle(e){
        if(e.target.checked){
            this._year = 'all_time';
        }
        else{
            this._year = 'this_year';
        }
    }
    
    static styles = [
        super.styles,
        cards,
        css`
            .toggle{
                width:8rem;
                height:2rem;
                box-sizing:border-box;
                margin:1rem 0 2rem auto;
                position:relative;
                border-radius:var(--border-radius-big);
                overflow:clip;
                input{
                    position:absolute;
                    width:100%;
                    height:100%;
                    top:0;
                    left:0;
                    opacity:0;
                    cursor:pointer;
                    z-index:5;
                }
                .toggle_text{
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    display:flex;
                    align-items:center;
                    transition: opacity var(--transition) ease;
                    &.unchecked{
                        background:var(--blue-shade-2);
                        justify-content:flex-end;
                        padding-right:1rem;
                    }
                    &.checked{
                        background:var(--purple-shade-2);
                        justify-content:flex-start;
                        padding-left:1rem;
                    }
                }
                &::after{
                    content:'';
                    position:absolute;
                    top:0;
                    left:0;
                    width:2rem;
                    height:2rem;
                    background:var(--blue);
                    border-radius:var(--border-radius-big);
                    transition: left var(--transition) ease, background-color var(--transition) ease;
                }
            }
            .toggle .checked{
                opacity:0;
            }
            .toggle:has(input:checked)::after{
                left:calc(100% - 2rem);
                background:var(--purple);
            }
            .toggle:has(input:checked) .checked{
                opacity:1;
            }
            .icon_holder{
                display:flex;
                justify-content:center;
                align-items:center;
                margin-bottom:2rem;
                shalem-points-icon{
                    width:300px;
                    height:auto;
                }
            }
            .cards{
                gap:2rem;
            }
            .card{
                position:relative;
                padding:1rem;
            }
            .points_total{
                position:absolute;
                top:-1rem;
                right:-1rem;
                width:4rem;
                height:4rem;
                display:flex;
                justify-content:center;
                align-items:center;
                font-size:1.5rem;
                font-weight:600;
                color:var(--black);
                clip-path: shape(from 46.94% 1.49%,curve to 53.28% 1.5% with 48.48% -0.5%/51.74% -0.5%,line to 67.73% 20.32%,curve to 70.64% 21.81% with 68.4% 21.19%/69.47% 21.73%,line to 96.4% 23.42%,curve to 99.58% 28.48% with 99.16% 23.59%/100.83% 26.25%,line to 88.34% 48.5%,curve to 88.33% 51.64% with 87.79% 49.48%/87.78% 50.65%,line to 99.48% 71.7%,curve to 96.28% 76.74% with 100.72% 73.93%/99.04% 76.58%,line to 70.52% 78.27%,curve to 67.6% 79.75% with 69.35% 78.33%/68.28% 78.88%,line to 53.06% 98.51%,curve to 46.72% 98.5% with 51.52% 100.5%/48.26% 100.5%,line to 32.27% 79.68%,curve to 29.36% 78.19% with 31.6% 78.81%/30.53% 78.27%,line to 3.6% 76.58%,curve to 0.42% 71.52% with 0.84% 76.41%/-0.83% 73.75%,line to 11.66% 51.5%,curve to 11.67% 48.36% with 12.21% 50.52%/12.22% 49.35%,line to 0.52% 28.3%,curve to 3.72% 23.26% with -0.72% 26.07%/0.96% 23.42%,line to 29.48% 21.73%,curve to 32.4% 20.25% with 30.65% 21.67%/31.72% 21.12%,line to 46.94% 1.49%,close);
            }
        `
    ];
}