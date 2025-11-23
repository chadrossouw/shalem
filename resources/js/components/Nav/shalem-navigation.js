import {html, css, LitElement} from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { EventManager } from '../../utilities/events.js';
import { BaseClass } from '../BaseClass';
import uploadIcon from '../../icons/upload-icon.svg';
import pointsIcon from '../../icons/points-icon.svg';
import goalsIcon from '../../icons/goals-icon.svg';
import documentsIcon from '../../icons/archive-icon.svg';
import cvSupportIcon from '../../icons/cv-support-icon.svg';
import notificationsIconOpen from '../../icons/notification-icon-open.svg';
import notificationsIconClosed from '../../icons/notification-icon-closed.svg';
import fredExhaustedIcon from '../../icons/fred-exhausted.svg';


export class ShalemNavigation extends BaseClass(LitElement) {
    static properties = {
        user: { type: Object },
        _dashboard: { type: Object, state: true },
        _panel: { type: String, state: true },
        _notifications: { type: Array, state: true },
    }


    constructor() {
        super();
        this._eventManager = new EventManager(this);
        this._menuIsOpen = false;
        this._transitionEndIsAdded = false;
        this._prefersReduced =  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||window.matchMedia("(prefers-reduced-motion: reduce)").matches ==true;

    }

    get lastFocusable() {
        return this.shadowRoot.querySelector('ul li:last-of-type a');
    }

    get firstFocusable() {
        return this.shadowRoot.querySelector('.hamburger');
    }

    get button() {
        return this.shadowRoot.querySelector('.hamburger');
    }

    get menu() {
        return this.shadowRoot.querySelector('nav');
    }

    connectedCallback() {
        super.connectedCallback();
        this._eventManager.listen('shalem-dashboard-updated',this._handleDashboardUpdate.bind(this));   
    }

    render() {
        let nav;
        switch(this.user?.type){
            case 'student':
                nav = this._renderStudentNavigation();
                break;
            case 'staff':
                nav = this._renderStaffNavigation();
                break;
            case 'admin':
                nav = this._renderAdminNavigation();
                break;
            case 'parent':
                nav = this._renderParentNavigation();
                break;
            default:
                nav = this._renderDefaultNavigation();
                break;
        }
        return html`
            <div class="hamburger_container">
				<button @click=${this._toggleMenu} class="hamburger hamburger--collapse" type="button" id="hamburger" aria-controls="main-navigation" aria-expanded="false">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                    <span class="screen-reader-text menu_closed"><?php echo __('Open Main Navigation','ace'); ?></span>
                    <span class="screen-reader-text menu_open"><?php echo __('Close Main Navigation','ace'); ?></span>
				</button>
			</div>
            ${nav}
        `;
    }

    _renderStudentNavigation(){
         let notificationsIcon = notificationsIconClosed;
         if(this._notifications && this._notifications.length > 0 ){
            let count = this._notifications.length <10 ? this._notifications.length : '+';
            notificationsIcon = notificationsIconOpen.replace('<tspan x="0" y="0">1</tspan>', `<tspan x="0" y="0">${count}</tspan>`);
         }
         return html`
            <nav>
                <ul>
                    <li><a href="/dashboard/documents/upload" aria-current="${this._dashboard=='documents/upload'&&this._panel=='upload'?'true':'false'}">${unsafeSVG(uploadIcon)}Upload a document</a></li>
                    <li><a href="/dashboard/points" aria-current="${this._dashboard=='points'?'true':'false'}">${unsafeSVG(pointsIcon)}See my points</a></li>
                    <li><a href="/dashboard/goals" aria-current="${this._dashboard=='goals'?'true':'false'}">${unsafeSVG(goalsIcon)}Set a goal</a></li> 
                    <li><a href="/dashboard/documents" aria-current="${this._dashboard=='documents'?'true':'false'}">${unsafeSVG(documentsIcon)}My documents</a></li>
                    <li><a href="/dashboard/cv-support" aria-current="${this._dashboard=='cv-support'?'true':'false'}">${unsafeSVG(cvSupportIcon)}Build a CV support</a></li>
                    <li><a href="/dashboard/notifications" aria-current="${this._dashboard=='notifications'?'true':'false'}">${unsafeSVG(notificationsIcon)}Notifications</a></li>
                    <li><a href="/logout">${unsafeSVG(fredExhaustedIcon)}Log out</a></li>
                </ul>
            </nav>
        `;
    }

    _handleDashboardUpdate(dashboardContext){
        console.log('Navigation received dashboard update', dashboardContext);
        let dashboard = dashboardContext.detail;
        this._dashboard = dashboard.dashboard;
        this._panel = dashboard.panel;
        this._notifications = dashboard.notifications;
        this.requestUpdate();
    }


    _toggleMenu() {
        if (this._menuIsOpen) {
            this._closeMenu();
        } else {
            this._openMenu();
        }
    }

    _openMenu(){
        this._menuIsOpen = true;
        this.menu.style.visibility = "visible";
        this.menu.classList.add("toggled");
        this.button.classList.add("is-active");
        this.button.setAttribute("aria-expanded", "true");
        this.firstFocusable.focus();
        document.documentElement.classList.add("scroll-lock", "menu-open");
        this.menu.addEventListener("focusout", this.focusHandler.bind(this));
        this.menu.addEventListener("keydown", this.escHandler.bind(this));
    }

    _closeMenu(){
        this._menuIsOpen = false;
        this.menu.classList.remove("toggled");
        this.button.classList.remove("is-active");
        this.button.setAttribute("aria-expanded", "false");
        this.button.focus();
        document.documentElement.classList.remove("scroll-lock","menu-open");
        this.menu.removeEventListener("focusout", this.focusHandler.bind(this));
        this.menu.removeEventListener("keydown", this.escHandler.bind(this));
        if(this.prefersReduced){
            this.hideVisibilityOnEnd();
            return;
        };
        if(!this.transitionEndIsAdded){
            this.menu.addEventListener("transitionend", this.hideVisibilityOnEnd.bind(this));
        }

    }
    
    hideVisibilityOnEnd(){
        if(this._menuIsOpen) return;
        this.menu.style.visibility = "hidden";
    }

    closeMenuClean(){
        this.menu.classList.remove("toggled");
        this.button.classList.remove("is-active");
        this.button.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("scroll-lock");
        if(this.prefersReduced){
            this.hideVisibilityOnEnd();
            return;
        };
    }

    focusHandler(e) {
        if(e.target == this.lastFocusable && !this.menu.contains(e.relatedTarget)){
            e.preventDefault();
            this.firstFocusable.focus();
        }
    }

    escHandler(e){
        if(e.key == "Escape"){
            this.closeMenu();
        }
    }

    static styles = [
        ...super.styles,
        css`
        nav {
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            background: var(--purple);
            height: auto;
            color: var(--white);
            transform: translateY(-150%);
            transition: transform calc(var(--transition) * 2) ease-in;
            z-index: 100;
            height: 100dvh;
            overflow: auto;
            &.toggled {
                transform: translate(0, 0);
            }

            ul {
                list-style: none;
                margin: 0;
                padding-left: var(--margins);
                padding-right: var(--margins);
                padding-top:calc(var(--header-height) + 2rem);
                padding-bottom: 2rem;
                display: grid;
                gap:1rem;
            }

            li {
                position: relative;
                
            }

            a {
                display:grid;
                align-items: center;
                gap:1rem;
                grid-template-columns: 2rem 1fr;
                text-decoration: none;
                color: var(--white);
                font-size: 1.5rem;
                svg{
                    width:2rem;
                    height:2rem;
                }
                &:visited{
                    color: var(--white);
                }
                &:hover, &:focus{
                    text-decoration: underline;
                }
                &[aria-current="true"]{
                    font-weight: bold;
                    text-decoration: underline;
                    color: var(--yellow);
                }
            }
        }
        @media (orientation: landscape) {
            nav ul{
                grid-template-columns: repeat(2, 1fr);
                column-gap: 3rem;
            }
        }
        .hamburger_container {
            position:relative;
            z-index: 110;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #hamburger {
            position: relative;
            background: transparent;
            transition: top var(--transition) ease;
            z-index: 10;
            width: 3rem;
            height: 3rem;
            &:focus-visible{
                outline: var(--white) 3px solid;
                outline-offset: 3px;
            }
        }

        .hamburger {
            padding: 0;
            display: inline-block;
            cursor: pointer;
            transition-property: opacity, filter;
            transition-duration: calc(var(--transition) / 2);
            transition-timing-function: linear;
            font: inherit;
            text-transform: none;
            background-color: transparent;
            border: 0;
            margin: 0;
            overflow: visible;
        }

        .hamburger.is-active .hamburger-inner,
        .hamburger.is-active .hamburger-inner::before,
        .hamburger.is-active .hamburger-inner::after {
            background-color: var(--white);
        }

        .hamburger-box {
            width: 3rem;
            height: 3rem;
            display: inline-block;
            position: relative;
        }

        .hamburger-inner {
            display: block;
        }

        .hamburger-inner,
        .hamburger-inner::before,
        .hamburger-inner::after {
            width: 100%;
            height: 6px;
            background-color: var(--blue);
            border-radius: 4px;
            position: absolute;
            transition: transform calc(var(--transition) / 2.2) cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color var(--transition) ease;
        }

        .hamburger-inner::before,
        .hamburger-inner::after {
            content: "";
            display: block;
        }

        .hamburger-inner::before {
            top: -1rem;
        }

        .hamburger-inner::after {
            top: -2rem;
        }

        .hamburger--collapse .hamburger-inner {
            top: auto;
            bottom: 0;
        }

        .hamburger--collapse .hamburger-inner::after {
            transition: top calc(var(--transition) / 2) calc(var(--transition) / 2)
                    cubic-bezier(0.33333, 0.66667, 0.66667, 1),
                opacity calc(var(--transition) / 4) linear;
        }

        .hamburger--collapse .hamburger-inner::before {
            transition: top calc(var(--transition) / 3) calc(var(--transition) / 2)
                    cubic-bezier(0.33333, 0.66667, 0.66667, 1),
                transform calc(var(--transition) / 3) cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color var(--transition) ease;
        }

        .hamburger--collapse.is-active .hamburger-inner {
            transform: translate3d(0, -7px, 0) rotate(-45deg);
            transition: transform calc(var(--transition) / 1.8)
                cubic-bezier(0.215, 0.61, 0.355, 1), background-color var(--transition) ease;
        }

        .hamburger--collapse.is-active .hamburger-inner::after {
            top: 0;
            opacity: 0;
            transition: top calc(var(--transition) / 2)
                    cubic-bezier(0.33333, 0, 0.66667, 0.33333),
                opacity calc(var(--transition) / 4) calc(var(--transition) / 2) linear;
        }

        .hamburger--collapse.is-active .hamburger-inner::before {
            top: 0;
            transform: rotate(-90deg);
            transition: top calc(var(--transition) / 4) calc(var(--transition) / 3)
                    cubic-bezier(0.33333, 0, 0.66667, 0.33333),
                transform calc(var(--transition) / 3) calc(var(--transition) / 2)
                    cubic-bezier(0.215, 0.61, 0.355, 1), background-color var(--transition) ease;
        }
        `
    ];
    
	
}

