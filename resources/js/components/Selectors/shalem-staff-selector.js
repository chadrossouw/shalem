import { BaseDashboardConsumer } from "../Dashboard/base-dashboard-consumer.js";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";

import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";

export class ShalemStaffSelector extends LitElement {
    static properties = {
        ...super.properties,
        name: {type: String},
        required: {type: Boolean},
        filter: {type:Array},
        restUrl: {type: String},
    }


    connectedCallback() {
        super.connectedCallback();
        this._getStaff = new Task(this,{
            task: async () => {
                const response = await safeFetch(`${this.restUrl}staff?filter=${this.filter ? JSON.stringify(this.filter) : ''}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch staff');
                }
                return await response.json();
            },
            args: () => [],
        });
        
    }
    
    createRenderRoot() {
        return this;
    }

    render() {
        return html`
        

        ${this._getStaff.render({
            initial: () => html`<shalem-loader spinner>Fetching staff...</shalem-loader>`,
            pending: () => html`<shalem-loader spinner>Assembling the troops...</shalem-loader>`,
            complete: (value) => this._renderStaffSelector(value),
            error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
        })}
    `;
    }


    _renderStaffSelector(staff) {
        staff = staff.staff;
        let staffFiltered = [];
        for(const role in staff){
            if(this.filter && this.filter.length > 0){
                if(this.filter.includes(role)){
                    staffFiltered = staffFiltered.concat(staff[role]);
                }
            }
            else{
                staffFiltered = staffFiltered.concat(staff[role]);
            }
        }
        let mappedRoles = {
            'admin':'Administrator',
            'super_admin':'Administrator',
            'staff':'Teacher',
            'grade_head':'Grade Head',
            'systemic_head':'Systemic Head',
        };
        return html`
            <slot></slot>
            <select name="${this.name}" id="${this.name}" aria-required=${this.required}>
                <option value="">Select</option>
                ${staffFiltered.map(staffMember => html`
                    <option value="${staffMember.id}">${staffMember.first_name} ${staffMember.last_name} (${mappedRoles[staffMember.staff_role.role]})</option>
                `)}
            </select>
        `
    }

}