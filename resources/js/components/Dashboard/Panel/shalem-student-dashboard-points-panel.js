import { LitElement, html, css } from 'lit';
import { BaseDashboardConsumer } from '../base-dashboard-consumer.js';
import { BaseClass } from '../../BaseClass.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { pointsByPillar } from '../../Points/points-aggregators.js';
import arrowLeft from '../../../icons/arrow-left.svg';

export class ShalemStudentDashboardPointsPanel extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        year: { type: String },
        mode: { type: String },
    }

    connectedCallback() {
        super.connectedCallback();
        ({ fields: this.fields, user: this.user, pillars: this.pillars } = this._dashboard);
        if(this.mode === 'staff'){
            this.user = this.pupil;
            this.panel = this.view_panel;
        }
        console.log(this.panel);
        this.points = pointsByPillar(this.user.user_points,this.pillars);
        this.pillar = this.points ? Object.values(this.points).find(pillar => pillar.slug === this.panel) : null;
    }

    render() {
        return html`
            <div class="header_with_icon margins">
                <div class="icon" aria-hidden="true">
                    <div class="points_total star bg_${this.pillar?.colour??'white'} bg_shade_2">
                        ${this.pillar?.points}
                    </div>
                </div>
                ${this.year == 'this_year' ? html`
                    <h1>My ${this.pillar?.name} points</h1>
                ` : html`
                    <h1>All my ${this.pillar.name} points</h1>
                `}
            </div>
            <div class="margins">
                <ul>
                    ${Object.entries(this.pillar.types).map(([type, points]) => html`<li class="grid"><span>${type}</span> <span>${points}</span></li>`)}
                </ul>
                <div class="grid button_grid">
                    <button class="bg_green black" @click=${() => this._handleAction({dashboard:'goals'})}>Set a Goal</button>
                    <button class="bg_green black" @click=${() => this._handleAction({dashboard:'documents',pane:'upload'})}>Upload a Document</button>
                </div>
            </div>
            <div class="margins">
                <div class="">
                    <button class="back" @click=${() => this._handleAction({ dashboard: 'points', panel: null, view: null })}>
                        ${unsafeSVG(arrowLeft)}
                        Back to all points
                    </button>
                </div>
            </div>
        `;
    }

    static styles = [
        super.styles,
        css`
        .points_total{
            width:6rem;
            height:6rem;
            display:flex;
            justify-content:center;
            align-items:center;
            font-size:3rem;
            font-weight:600;
            color:var(--black);
            clip-path: shape(from 46.94% 1.49%,curve to 53.28% 1.5% with 48.48% -0.5%/51.74% -0.5%,line to 67.73% 20.32%,curve to 70.64% 21.81% with 68.4% 21.19%/69.47% 21.73%,line to 96.4% 23.42%,curve to 99.58% 28.48% with 99.16% 23.59%/100.83% 26.25%,line to 88.34% 48.5%,curve to 88.33% 51.64% with 87.79% 49.48%/87.78% 50.65%,line to 99.48% 71.7%,curve to 96.28% 76.74% with 100.72% 73.93%/99.04% 76.58%,line to 70.52% 78.27%,curve to 67.6% 79.75% with 69.35% 78.33%/68.28% 78.88%,line to 53.06% 98.51%,curve to 46.72% 98.5% with 51.52% 100.5%/48.26% 100.5%,line to 32.27% 79.68%,curve to 29.36% 78.19% with 31.6% 78.81%/30.53% 78.27%,line to 3.6% 76.58%,curve to 0.42% 71.52% with 0.84% 76.41%/-0.83% 73.75%,line to 11.66% 51.5%,curve to 11.67% 48.36% with 12.21% 50.52%/12.22% 49.35%,line to 0.52% 28.3%,curve to 3.72% 23.26% with -0.72% 26.07%/0.96% 23.42%,line to 29.48% 21.73%,curve to 32.4% 20.25% with 30.65% 21.67%/31.72% 21.12%,line to 46.94% 1.49%,close);
        }
        @media (min-width:700px){
            .points_total{
                width:8rem;
                height:8rem;
                font-size:4rem;
            }
        }
        @media (min-width:1200px){
            .points_total{
                width:10rem;
                height:10rem;
                font-size:5rem;
            }
        }
        ul{
            list-style:none;
            padding:0;
            margin:0 0 2rem 0;
            li{
                width:100%;
                max-width:400px;
                margin:0 auto 1rem auto;
                grid-template-columns:4fr 1fr;
                gap:4rem;
                padding:0.5rem 0;
                border-bottom:1px solid var(--green-shade-2);
                &:last-child{
                    border-bottom:none;
                }
                span:last-child{
                    text-align:right;
                }
            }
        }
        .button_grid {
            button:not(.back) {
                width:100%;
                max-width:400px;
                margin:0 auto;
            }
            margin-bottom:2rem;
        }
        `
    ];
}