//General Imports
import {blinkAllEyes,throbAllEyes} from "./common/blink.js";
blinkAllEyes();
throbAllEyes();

//Web Components
import { ShalemLoginForm } from "./components/LoginForm/shalem-login-form";
import { ShalemResetPasswordForm } from "./components/ResetPasswordForm/shalem-reset-password-form.js";

import { ShalemEditableField } from "./components/EditableField/shalem-editable-field";
import { ShalemStudentDashboard } from "./components/Dashboard/shalem-student-dashboard.js";
import { ShalemAvatarSelector } from "./components/Dashboard/shalem-avatar-selector.js";
import { ShalemLoginRedirector } from "./components/LoginForm/shalem-login-redirector.js";
import { ShalemUpdates } from "./components/Dashboard/shalem-updates.js";


window.customElements.define("shalem-login-form", ShalemLoginForm);
window.customElements.define("shalem-reset-password-form", ShalemResetPasswordForm);

window.customElements.define("shalem-editable-field", ShalemEditableField);
window.customElements.define("shalem-student-dashboard", ShalemStudentDashboard);
window.customElements.define("shalem-avatar-selector", ShalemAvatarSelector);
window.customElements.define("shalem-login-redirector", ShalemLoginRedirector);
window.customElements.define("shalem-updates", ShalemUpdates);
