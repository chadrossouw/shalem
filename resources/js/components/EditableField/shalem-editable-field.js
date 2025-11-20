import { LitElement, html} from 'lit';

export class ShalemEditableField extends LitElement {
    static properties = {
        admin: { type: Boolean },
        name: { type: String },
        location: { type: String },
    }

    constructor() {
        super();
    }

    createRenderRoot(){
        return this;
    }

    render(){
        if(this.admin&&this.admin==='true'){
            return html`
                <a href="/edit/${this.location}/${this.name}" class="editable-field" target="_blank" rel="noopener">
                    Edit Field
                </a>
            `;
        }
        else return html``;
    }
}