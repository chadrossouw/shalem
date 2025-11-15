import { ContextConsumer } from "@lit/context";
import { dashboardContext } from "../../utilities/context.js";
import { EventManager } from "../../utilities/events.js";

export const BaseNavConsumer = (superClass) => class extends superClass{
    async _markAsRead(id) {
        const response = await safeFetch(`${this.restUrl}notifications/${id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        });
        if (!response.ok) {
            console.error('Failed to mark update as read');
            return;
        }
        this.notifications = response.notifications;
        this._updateContext({ notifications: this.notifications });
    }
}