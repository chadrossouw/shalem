import { ShalemBaseDashboardConsumer } from "./shalem-base-dashboard-consumer";
import { LitElement,html, css } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { Task } from "@lit/task";
import { BaseClass } from "../BaseClass.js";
import { safeFetch } from "../../common/xsrf.js";
import FredGeek from '../../../../public/avatars/fred-geek.svg';

export class ShalemUpdates extends ShalemBaseDashboardConsumer(BaseClass(LitElement)) {
    connectedCallback() {
        super.connectedCallback();
        document.body.classList.add('updates')
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.classList.remove('updates')
    }

    render() {
        return html`
        ${unsafeSVG(FredGeek)}
        `
    }
}