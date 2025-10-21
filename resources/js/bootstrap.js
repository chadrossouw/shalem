//General Imports
import {blinkAllEyes,throbAllEyes} from "./common/blink.js";
blinkAllEyes();
throbAllEyes();

//Web Components
import { ShalemLoginForm } from "./components/LoginForm/shalem-login-form";
import { ShalemEditableField } from "./components/EditableField/shalem-editable-field";
window.customElements.define("shalem-login-form", ShalemLoginForm);
window.customElements.define("shalem-editable-field", ShalemEditableField);
