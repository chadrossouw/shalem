//General Imports
import {blinkAllEyes,throbAllEyes} from "./common/blink.js";
blinkAllEyes();
throbAllEyes();

//Web Components
// Base provider
import { ShalemBaseProvider } from "./components/Provider/shalem-base-provider.js";

//Auth elements
import { ShalemLoginForm } from "./components/LoginForm/shalem-login-form";
import { ShalemResetPasswordForm } from "./components/ResetPasswordForm/shalem-reset-password-form.js";

//Utility components
import { ShalemEditableField } from "./components/EditableField/shalem-editable-field";
import { ShalemAvatar } from "./components/Avatar/shalem-avatar.js";
import { ShalemPaginator } from "./components/Pagination/shalem-paginator.js";
import { ShalemSearchBar } from "./components/Search/shalem-search-bar.js";
import { ShalemLoader } from "./components/Loader/shalem-loader.js";
import { ShalemPdfViewer } from "./components/Pdf/shalem-pdf-viewer.js";
import { ShalemDialog } from "./components/Modal/shalem-dialog.js";
import { ShalemPointsIcon } from "./components/Points/shalem-points-icon.js";
import { ShalemTooltip } from "./components/Tooltip/shalem-tooltip.js";

//Student Dashboard elements
import { ShalemStudentDashboard } from "./components/Dashboard/shalem-student-dashboard.js";
import { ShalemStudentDashboardHome } from "./components/Dashboard/shalem-student-dashboard-home.js";
import { ShalemAvatarSelector } from "./components/Dashboard/shalem-avatar-selector.js";
import { ShalemLoginRedirector } from "./components/LoginForm/shalem-login-redirector.js";
import { ShalemUpdates } from "./components/Dashboard/shalem-updates.js";
import { ShalemStudentDashboardDocuments } from "./components/Dashboard/shalem-student-dashboard-documents.js";
import { ShalemStudentDashboardPoints } from "./components/Dashboard/shalem-student-dashboard-points.js";
import { ShalemStudentDashboardGoals } from "./components/Dashboard/shalem-student-dashboard-goals.js";
//Documents
import { ShalemStudentPanelDocumentUpload } from "./components/Dashboard/Panel/shalem-student-panel-document-upload.js";
import { ShalemStudentPanelMyDocuments } from "./components/Dashboard/Panel/shalem-student-panel-my-documents.js";
import { ShalemStudentPanelMyDocumentsList } from "./components/Dashboard/Panel/shalem-student-panel-my-documents-list.js";
import { ShalemDocument } from "./components/Dashboard/View/shalem-document.js";

//Points
import { ShalemStudentDashboardPointsPanel } from "./components/Dashboard/Panel/shalem-student-dashboard-points-panel.js";

//Help Dashboard
import { ShalemDashboardHelp } from "./components/Dashboard/shalem-dashboard-help.js";

//Nav elements
import { ShalemNavNotifications } from "./components/Notifications/shalem-nav-notifications.js";
import { ShalemNavbar } from "./components/Nav/shalem-navbar.js";
import { ShalemNavigation } from "./components/Nav/shalem-navigation.js";

//Base provider
window.customElements.define("shalem-base-provider", ShalemBaseProvider);

//Auth elements
window.customElements.define("shalem-login-form", ShalemLoginForm);
window.customElements.define("shalem-reset-password-form", ShalemResetPasswordForm);

//Utility components
window.customElements.define("shalem-editable-field", ShalemEditableField);
window.customElements.define("shalem-avatar", ShalemAvatar);
window.customElements.define("shalem-paginator", ShalemPaginator);
window.customElements.define("shalem-search-bar", ShalemSearchBar);
window.customElements.define("shalem-loader", ShalemLoader);
window.customElements.define("shalem-pdf-viewer", ShalemPdfViewer);
window.customElements.define("shalem-dialog", ShalemDialog);
window.customElements.define("shalem-points-icon", ShalemPointsIcon);
window.customElements.define("shalem-tooltip", ShalemTooltip);

//Student Dashboard elements
window.customElements.define("shalem-student-dashboard", ShalemStudentDashboard);
window.customElements.define("shalem-student-dashboard-home", ShalemStudentDashboardHome);
window.customElements.define("shalem-avatar-selector", ShalemAvatarSelector);
window.customElements.define("shalem-login-redirector", ShalemLoginRedirector);
window.customElements.define("shalem-updates", ShalemUpdates);
window.customElements.define("shalem-student-dashboard-documents", ShalemStudentDashboardDocuments);
window.customElements.define("shalem-student-dashboard-points", ShalemStudentDashboardPoints);
window.customElements.define("shalem-student-dashboard-goals", ShalemStudentDashboardGoals);

//Documents
window.customElements.define("shalem-student-panel-document-upload", ShalemStudentPanelDocumentUpload);
window.customElements.define("shalem-student-panel-my-documents", ShalemStudentPanelMyDocuments);
window.customElements.define("shalem-student-panel-my-documents-list", ShalemStudentPanelMyDocumentsList);
window.customElements.define("shalem-document", ShalemDocument);

//Points
window.customElements.define("shalem-student-dashboard-points-panel", ShalemStudentDashboardPointsPanel);

//Goals

//Help Dashboard
window.customElements.define("shalem-dashboard-help", ShalemDashboardHelp);

//Nav elements
window.customElements.define("shalem-nav-notifications", ShalemNavNotifications);
window.customElements.define("shalem-navbar", ShalemNavbar);
window.customElements.define("shalem-navigation", ShalemNavigation);
