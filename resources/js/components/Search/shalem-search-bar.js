import {html,css, LitElement} from "lit";
import search from "../../icons/search.svg";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { BaseClass } from "../BaseClass.js";

export class ShalemSearchBar extends BaseDashboardConsumer(BaseClass(LitElement)) {

    static properties = {
        ...super.properties,
        searchID: { type: String },
        query: { type: String },
    }

    connectedCallback(){
        super.connectedCallback();
    }

    render() {
        console.log('Rendering search bar with term:', this.query);
        return html`
        <form class="search-bar" @submit=${e => { e.preventDefault(); this._search(); }}>
            <label for="search-input" class="screen-reader-text">Search</label>
            <input
                id="search-input"
                name="search-input"
                type="text"
                .value=${this.query}
                @blur=${e => this._setSearchTerm(e.target.value)}
                placeholder="Search..."
            />
            <button class="bg_aqua" type="submit">${unsafeSVG(search)}<span class="screen-reader-text">Search</span></button>
        </form>
        <div class="search-results-info">
            ${this.query ? html`Showing results for <strong>${this.query}</strong><button @click=${this._clearSearch}>Clear</button>` : ''}
        </div>
        `;
    }

    _clearSearch(){
        this.query = '';
        this._search();
    }

    _setSearchTerm(value){
        this.query = value;
    }

    _search(){
        this._eventManager.emit(`shalem-search-${this.searchID}`, {query: this.query});
    }

    static styles = [
        super.styles,
        css`
        .search-bar {
            display: grid;
            margin-bottom: 1rem;
            width: 100%;
            grid-template-columns: 1fr 4rem;
            button{
                padding:0;
                display:flex;
                align-items:center;
                justify-content:center;
                border-top-left-radius:0;
                border-bottom-left-radius:0;
                svg{
                    width:2.5rem;
                    height:2.5rem;
                }
            }
        }
        
        input{
            padding:0.5rem 1rem;
            font-size:var(--big-body);
            border-top-left-radius:var(--border-radius);
            border-bottom-left-radius:var(--border-radius);
            border:2px solid var(--purple-shade-1);
            border-right:0;
        }
        button [data-eyebrow-up],button [data-eyebrow-down]{
            transition: transform var(--transition) ease;
        }
        button:hover [data-eyebrow-up]{
            transform: translateY(0.2em);
        }
        button:hover [data-eyebrow-down]{
            transform: translateY(-0.1em);
        }
        `
    ]
}