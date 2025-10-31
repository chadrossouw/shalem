import { html } from "lit";
import { BaseClassConsumer } from "../base-class-consumer.js";

export class ShalemStudentDashboardHome extends ShalemBaseDashboardConsumer {

    static properties = {
        ...super.properties,
    }

    constructor(){
        super();
    }

    render(){
        return html`
        <h1>Hi</h1>
        `;
    }
}