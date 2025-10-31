//General Imports
import {blinkAllEyes,throbAllEyes} from "./common/blink.js";
blinkAllEyes();
throbAllEyes();

//Web Components
import { ShalemLoginForm } from "./components/LoginForm/shalem-login-form";
import { ShalemEditableField } from "./components/EditableField/shalem-editable-field";
import { ShalemStudentDashboard } from "./components/Dashboard/shalem-student-dashboard.js";
import { ShalemAvatarSelector } from "./components/Dashboard/shalem-avatar-selector.js";

window.customElements.define("shalem-login-form", ShalemLoginForm);
window.customElements.define("shalem-editable-field", ShalemEditableField);
window.customElements.define("shalem-student-dashboard", ShalemStudentDashboard);
window.customElements.define("shalem-avatar-selector", ShalemAvatarSelector);
