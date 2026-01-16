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
import { ShalemAnchorModal } from "./components/Modal/shalem-anchor-modal.js";
import { ShalemFormWrapper } from "./components/Form/form-wrapper.js";

//Student Dashboard elements
import { ShalemStudentDashboard } from "./components/Dashboard/shalem-student-dashboard.js";
import { ShalemStudentDashboardHome } from "./components/Dashboard/shalem-student-dashboard-home.js";
import { ShalemAvatarSelector } from "./components/Dashboard/shalem-avatar-selector.js";
import { ShalemLoginRedirector } from "./components/LoginForm/shalem-login-redirector.js";
import { ShalemUpdates } from "./components/Dashboard/shalem-updates.js";
import { ShalemStudentDashboardDocuments } from "./components/Dashboard/shalem-student-dashboard-documents.js";
import { ShalemStudentDashboardPoints } from "./components/Dashboard/shalem-student-dashboard-points.js";
import { ShalemStudentDashboardGoals } from "./components/Dashboard/shalem-student-dashboard-goals.js";
import { ShalemDashboardNotifications } from "./components/Dashboard/shalem-dashboard-notifications.js";
import { ShalemStudentDashboardCVSupport } from "./components/Dashboard/shalem-student-dashboard-cv-support.js";

//Staff Dashboard elements
import { ShalemStaffDashboard } from "./components/Dashboard/shalem-staff-dashboard.js";
import { ShalemStaffDashboardHome } from "./components/Dashboard/shalem-staff-dashboard-home.js";
import { ShalemStaffDashboardDocuments } from "./components/Dashboard/shalem-staff-dashboard-documents.js";

//Documents
import { ShalemStudentPanelDocumentUpload } from "./components/Dashboard/Panel/shalem-student-panel-document-upload.js";
import { ShalemStudentPanelMyDocuments } from "./components/Dashboard/Panel/shalem-student-panel-my-documents.js";
import { ShalemStudentPanelMyDocumentsList } from "./components/Dashboard/Panel/shalem-student-panel-my-documents-list.js";
import { ShalemDocument } from "./components/Dashboard/View/shalem-document.js";
import { ShalemStaffPanelDocumentReviewEdit } from "./components/Dashboard/Panel/shalem-staff-panel-document-review-edit.js";

//Notifications
import { ShalemPanelNotificationsList } from "./components/Dashboard/Panel/shalem-panel-notifications-list.js";

//Points
import { ShalemStudentDashboardPointsPanel } from "./components/Dashboard/Panel/shalem-student-dashboard-points-panel.js";

//Badges
import { ShalemStudentPanelBadges } from "./components/Dashboard/Panel/shalem-student-panel-badges.js";

//Goals
import { ShalemStudentPanelGoals } from "./components/Dashboard/Panel/shalem-student-panel-goals-panel.js";

//CV Support
import { ShalemStudentPanelCVSupport } from "./components/Dashboard/Panel/shalem-student-panel-cv-support.js";
import { ShalemStudentPanelCVSupportList } from "./components/Dashboard/Panel/shalem-student-panel-cv-support-list.js";
import { ShalemStudentPanelCVSupportCreate } from "./components/Dashboard/Panel/shalem-student-panel-cv-support-create.js";
import { ShalemStudentPanelCVSupportDocumentSelector } from "./components/Dashboard/Panel/shalem-student-panel-cv-support-document-selector.js";
import { ShalemCvSupport } from "./components/Dashboard/View/shalem-cv-support.js";

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
window.customElements.define("shalem-anchor-modal", ShalemAnchorModal);
window.customElements.define("shalem-form-wrapper", ShalemFormWrapper);

//Student Dashboard elements
window.customElements.define("shalem-student-dashboard", ShalemStudentDashboard);
window.customElements.define("shalem-student-dashboard-home", ShalemStudentDashboardHome);
window.customElements.define("shalem-avatar-selector", ShalemAvatarSelector);
window.customElements.define("shalem-login-redirector", ShalemLoginRedirector);
window.customElements.define("shalem-updates", ShalemUpdates);
window.customElements.define("shalem-student-dashboard-documents", ShalemStudentDashboardDocuments);
window.customElements.define("shalem-student-dashboard-points", ShalemStudentDashboardPoints);
window.customElements.define("shalem-student-dashboard-goals", ShalemStudentDashboardGoals);
window.customElements.define("shalem-dashboard-notifications", ShalemDashboardNotifications);
window.customElements.define("shalem-student-dashboard-cv-support", ShalemStudentDashboardCVSupport);

//Staff Dashboard elements
window.customElements.define("shalem-staff-dashboard", ShalemStaffDashboard);
window.customElements.define("shalem-staff-dashboard-home", ShalemStaffDashboardHome);
window.customElements.define("shalem-staff-dashboard-documents", ShalemStaffDashboardDocuments);

//Documents
window.customElements.define("shalem-student-panel-document-upload", ShalemStudentPanelDocumentUpload);
window.customElements.define("shalem-student-panel-my-documents", ShalemStudentPanelMyDocuments);
window.customElements.define("shalem-student-panel-my-documents-list", ShalemStudentPanelMyDocumentsList);
window.customElements.define("shalem-document", ShalemDocument);
window.customElements.define("shalem-staff-panel-document-review-edit", ShalemStaffPanelDocumentReviewEdit);

//Notifications
window.customElements.define("shalem-panel-notifications-list", ShalemPanelNotificationsList);

//Points
window.customElements.define("shalem-student-dashboard-points-panel", ShalemStudentDashboardPointsPanel);

//Badges
window.customElements.define("shalem-student-panel-badges", ShalemStudentPanelBadges);

//Goals
window.customElements.define("shalem-student-panel-goals-panel", ShalemStudentPanelGoals);

//CV Support
window.customElements.define("shalem-student-panel-cv-support", ShalemStudentPanelCVSupport);
window.customElements.define("shalem-student-panel-cv-support-list", ShalemStudentPanelCVSupportList);
window.customElements.define("shalem-student-panel-cv-support-create", ShalemStudentPanelCVSupportCreate);
window.customElements.define("shalem-student-panel-cv-support-document-selector", ShalemStudentPanelCVSupportDocumentSelector);
window.customElements.define("shalem-cv-support", ShalemCvSupport);

//Help Dashboard
window.customElements.define("shalem-dashboard-help", ShalemDashboardHelp);

//Nav elements
window.customElements.define("shalem-nav-notifications", ShalemNavNotifications);
window.customElements.define("shalem-navbar", ShalemNavbar);
window.customElements.define("shalem-navigation", ShalemNavigation);
