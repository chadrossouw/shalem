import { BaseClass } from "../BaseClass";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer";
import { html, LitElement, css } from "lit";

export class ShalemBreadcrumbs extends BaseDashboardConsumer(BaseClass(LitElement)) {
    static properties = {
        ...super.properties,
        _breadcrumbs: { type: Array, state: true },
    }

    constructor(){
        super();
    }

    connectedCallback(){
        super.connectedCallback();
        this._setCrumbs();
    }

    updated(changedProperties){
        console.log('breadcrumbs updated',changedProperties);
        if(!changedProperties.has('_breadcrumbs')){
            this._setCrumbs();
        }
    }

    render(){
        if(!this._dashboard){
            return html`<shalem-loader>Putting pins in the map...</shalem-loader>`;
        }
        console.log('rendering breadcrumbs', this._breadcrumbs);
        if(!this._breadcrumbs||Object.keys(this._breadcrumbs).length==0){
            return html``;
        }
        let crumbs = [];
        for (let type in this._breadcrumbs){
            let crumb = html`
                <li>
                    <a href="${this._breadcrumbs[type].link?this._breadcrumbs[type].link:'#'}" class="${this._breadcrumbs[type].current?'current':''}" aria-current="${this._breadcrumbs[type].current?'page':''}">
                        ${this._breadcrumbs[type].title}
                    </a>
                </li>
            `;
            crumbs.push(crumb);
        }
        return html`
        <nav aria-label="Breadcrumb" class="breadcrumbs margins">
            <ul>
                <li><a href="/">Home</a></li>
                ${crumbs}
            </ul>
        </nav>
        `;
    }

    _setCrumbs(){
        let breadcrumbs = {
            dashboard: {slug:this.dashboard},
            panel: {slug:this.panel},
            view: {slug:this.view},
        }
        if(this.identifier=='staff'){
            if(breadcrumbs.dashboard.slug){
                if(breadcrumbs.dashboard.slug == 'home'){
                    breadcrumbs = {};
                }
                else{
                    if(!breadcrumbs.panel.slug){
                        delete breadcrumbs.panel;
                        delete breadcrumbs.view;
                    }
                    if(breadcrumbs.dashboard.slug=='documents'){
                        breadcrumbs.dashboard.title = 'Verify documents'
                        breadcrumbs.dashboard.link = `/dashboard/documents`;
                        breadcrumbs.dashboard.current = true;
                        if(breadcrumbs.panel?.slug){
                            breadcrumbs.panel = breadcrumbs.view;
                            delete breadcrumbs.view;
                            breadcrumbs.dashboard.current = false;
                            breadcrumbs.panel.title = `${this.document?.userName}: ${this.document?.title}`;
                            breadcrumbs.panel.link = `/dashboard/documents/document/${breadcrumbs.panel.slug}`;
                            breadcrumbs.panel.current = true;
                        }
                    }
                    else if(breadcrumbs.dashboard.slug=='pupils'){
                        breadcrumbs.dashboard.title = 'My pupils';
                        breadcrumbs.dashboard.link = `/dashboard/pupils`;
                        breadcrumbs.dashboard.current = true;
                        if(breadcrumbs.panel?.slug){
                            breadcrumbs.dashboard.current = false;
                            breadcrumbs.panel.title = this._dashboard.pupil?`${this._dashboard.pupil?.first_name} ${this._dashboard.pupil?.last_name}`:'';
                            breadcrumbs.panel.link = `/dashboard/pupils/${breadcrumbs.panel.slug}`;
                            breadcrumbs.panel.current = true;
                            if(!breadcrumbs.view?.slug){
                                breadcrumbs.view.slug = 'points';
                            }
                            if(breadcrumbs.view?.slug){
                                breadcrumbs.panel.current = false;
                                breadcrumbs.view.title = breadcrumbs.view.slug.charAt(0).toUpperCase() + breadcrumbs.view.slug.slice(1);
                                breadcrumbs.view.link = `/dashboard/pupils/${breadcrumbs.panel.slug}/${breadcrumbs.view.slug}`;
                                breadcrumbs.view.current = true;
                            }
                        }
                    }
                    else if(breadcrumbs.dashboard?.slug=='notifications'){
                        breadcrumbs.dashboard.title = 'Notifications'
                        breadcrumbs.dashboard.link = `/dashboard/notifications`;
                        breadcrumbs.dashboard.current = true;
                    }
                }
            }
            else{
                breadcrumbs = {};
            }
        }
        else if(this.identifier=='student'){
                
            if(breadcrumbs.dashboard.slug){
                if(breadcrumbs.dashboard.slug == 'home'){
                    breadcrumbs = {};
                }
                else{
                    if(!breadcrumbs.panel.slug){
                        delete breadcrumbs.panel;
                        delete breadcrumbs.view;
                    }
                    if(breadcrumbs.dashboard.slug=='documents'){
                        breadcrumbs.dashboard.title = 'My documents'
                        breadcrumbs.dashboard.link = `/dashboard/documents`;
                        breadcrumbs.dashboard.current = true;
                        if(breadcrumbs.panel.slug){
                            breadcrumbs.dashboard.current = false;
                            breadcrumbs.panel.title = `${this.document?.title}`;
                            breadcrumbs.panel.link = `/dashboard/documents/document/${breadcrumbs.panel.slug}`;
                            breadcrumbs.panel.current = true;
                            if(!breadcrumbs.view.slug){
                                breadcrumbs.view.slug = 'view';
                            }
                            if(breadcrumbs.view.slug){
                                breadcrumbs.panel.current = false;
                                breadcrumbs.view.title = breadcrumbs.view.slug.charAt(0).toUpperCase() + breadcrumbs.view.slug.slice(1);
                                breadcrumbs.view.link = `/dashboard/documents/document/${breadcrumbs.panel.slug}/${breadcrumbs.view.slug}`;
                                breadcrumbs.view.current = true;
                            }
                        }
                    }
                    else if(breadcrumbs.dashboard.slug=='notifications'){
                        delete breadcrumbs.view;
                        delete breadcrumbs.panel;
                        breadcrumbs.dashboard.title = 'My notifications'
                        breadcrumbs.dashboard.link = `/dashboard/notifications`;
                        breadcrumbs.dashboard.current = true;
                    }
                    else if(breadcrumbs.dashboard.slug=='points'){
                        breadcrumbs.dashboard.title = 'My points'
                        breadcrumbs.dashboard.link = `/dashboard/points`;
                        breadcrumbs.dashboard.current = true;
                        delete breadcrumbs.view;
                        if(breadcrumbs.panel?.slug){
                            breadcrumbs.dashboard.current = false;
                            let pillar = this.pillars.find(p => p.slug == breadcrumbs.panel.slug);
                            breadcrumbs.panel.title = `${pillar?.name}`;
                            breadcrumbs.panel.link = `/dashboard/points/${breadcrumbs.panel.slug}`;
                            breadcrumbs.panel.current = true;
                        }
                    }
                }
            }
            else{
                breadcrumbs = {};
            }

        }
       this._breadcrumbs = breadcrumbs;
    }

    static styles = [
        ...super.styles,
        css`
        `
    ];
}