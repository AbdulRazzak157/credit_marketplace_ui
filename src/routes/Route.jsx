import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../shared/NotFoundPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import { PrivateRoute, ProtectedPage, PublicRoute } from "./RouteGuard";
import ForgotPassword from "../pages/auth/ForgotPassword";
import UserLayout from "../layouts/UserLayout";
import Overview from "../features/overview/Overview";
import Dashboard from "../features/dashboard/Dashboard";
import LeadManagement from "../features/leads/LeadManagement";
import ManageLeads from "../features/manageLeads/ManageLeads";
import LenderManagement from "../features/lenders/LenderManagement";
import ProductManagement from "../features/products/ProductManagement";
import Reports from "../features/reports/Reports";
import ProfileSetting from "../features/profile/ProfileSetting";
import SubAdminManagementParent from "../pages/SubAdminManagementParent";
import SubAdminManagement from "../features/staff/SubAdminManagement";
import EditSubAdminPermissions from "../features/staff/EditSubAdminPermissions";
import StaffManagementParent from "../pages/StaffManagementParent";
import StaffManagement from "../features/staff/StaffManagement";
import StaffView from "../features/staff/StaffView";
import AddStaff from "../features/staff/AddStaff";
import LenderManagementParent from "../pages/LenderManagementParent";
import AddLender from "../features/lenders/AddLender";
import LenderViewParent from "../features/lenders/LenderViewParent";
import LenderSupports from "../features/lenders/support/LenderSupports";
import LenderOverview from "../features/lenders/LenderOverview";
import EditLenderDetails from "../features/lenders/EditLenderDetails";
import LenderProductFeat from "../features/lenders/LenderProductFeat";
import AddLenderProduct from "../features/products/AddLenderProduct";
import EditLenderProduct from "../features/products/EditLenderProduct";
import LenderProductParentTab from "../features/lenders/LenderProductParentTab";
import LenderSupportParent from "../features/lenders/LenderSupportParent";
import AddLenderSupport from "../features/lenders/support/AddLenderSupport";
import EditLenderSupport from "../features/lenders/support/EditLenderSupport";
import ViewLenderSupport from "../features/lenders/support/ViewLenderSupport";
import ProductManagementParent from "../features/products/ProductManagementParent";
import ViewLenderProduct from "../features/products/ViewLenderProduct";
import ManageLeadsParent from "../features/manageLeads/ManageLeadsParent";
import LeadManagementParent from "../features/leads/LeadManagementParent";
import LeadOverviewParent from "../features/leads/view/LeadOverviewParent";
import LeadOverview from "../features/leads/view/LeadOverview";
import LeadBureau from "../features/leads/view/LeadBureau";
import LeadProducts from "../features/leads/view/LeadProducts";
import LeadActivity from "../features/leads/view/LeadActivity";
import LenderLeadMetrics from "../features/lenders/LenderLeadMetrics";
import TwoFactorEmailOTP from "../pages/auth/TwoFactorEmailOTP";
import ResetPassword from "../pages/auth/ResetPassword";

export const router = createBrowserRouter([
    {
        element: <PrivateRoute />,
        children: [
            {
                path: '/',
                element: <UserLayout />,
                children: [
                    { path: "/", element: <Overview /> },
                    { path: "dashboard", element: <Dashboard /> },
                    {
                        path: "leads",
                        element: (
                            <ProtectedPage path={'/leads'} >
                                <LeadManagementParent />
                            </ProtectedPage>
                        ),
                        children: [
                            { path: "", element: <LeadManagement /> },
                            {
                                path: "view/:leadId",
                                element: <LeadOverviewParent />,
                                children: [
                                    { path: "", element: <LeadOverview /> },
                                    { path: "bureau", element: <LeadBureau /> },
                                    { path: "products", element: <LeadProducts /> },
                                    { path: "activity", element: <LeadActivity /> },
                                ]
                            }
                        ]
                    },
                    {
                        path: "manage-leads",
                        element: (
                            <ProtectedPage path={'/manage-leads'} >
                                <ManageLeadsParent />
                            </ProtectedPage>
                        ),
                        children: [
                            { path: "", element: <ManageLeads /> }
                        ]
                    },
                    {
                        path: "sub-admins",
                        element: (
                            <ProtectedPage path={'/sub-admins'} >
                                <SubAdminManagementParent />
                            </ProtectedPage>
                        ),
                        children: [
                            {
                                path: "",
                                element: <SubAdminManagement />
                            },
                            {
                                path: "view/:id",
                                element: <EditSubAdminPermissions />
                            },

                        ]
                    },
                    {
                        path: "lenders",
                        element: (
                            <ProtectedPage path={'/lenders'} >
                                <LenderManagementParent />
                            </ProtectedPage>
                        ),
                        children: [
                            {
                                path: "",
                                element: <LenderManagement />
                            },
                            {
                                path: "onboard",
                                element: <AddLender />
                            },
                            {
                                path: "view/:id",
                                element: <LenderViewParent />,
                                children: [
                                    { path: "", element: <LenderOverview /> },
                                    { path: "lender-lead-metrics", element: <LenderLeadMetrics /> },
                                    {
                                        path: "products", element: <LenderProductParentTab />,
                                        children: [
                                            { path: "", element: <LenderProductFeat /> },
                                            { path: "add-product", element: <AddLenderProduct /> },
                                            { path: ":productId/edit", element: <EditLenderProduct /> },
                                        ]
                                    },
                                    {
                                        path: "support", element: <LenderSupportParent />,
                                        children: [
                                            { path: "", element: <LenderSupports /> },
                                            { path: "add", element: <AddLenderSupport /> },
                                            { path: "view/:employeeId", element: <ViewLenderSupport /> },
                                            { path: "view/:employeeId/edit", element: <EditLenderSupport /> },
                                        ]

                                    },
                                    { path: "edit", element: <EditLenderDetails /> },
                                ]
                            },
                        ]
                    },
                    {
                        path: "staff",
                        element: (
                            <ProtectedPage path={'/staff'} >
                                <StaffManagementParent />
                            </ProtectedPage>
                        ),
                        children: [
                            { path: "", element: <StaffManagement /> },
                            { path: "view/:id", element: <StaffView /> },
                            { path: "add", element: <AddStaff /> },
                        ]
                    },
                    {
                        path: "products",
                        element: (
                            <ProtectedPage path={'/products'} >
                                <ProductManagementParent />
                            </ProtectedPage>
                        ),
                        children: [
                            { path: "", element: <ProductManagement /> },
                            { path: ":productId", element: <ViewLenderProduct /> }
                        ]
                    },
                    { path: "reports", element: <Reports /> },
                    { path: "profile", element: <ProfileSetting /> },
                ]
            }
        ]
    },

    {
        element: <PublicRoute />,
        children: [
            {
                path: "/",
                element: <AuthLayout />,
                children: [
                    { path: "login", element: <Login /> },
                    { path: "login-verification", element: <TwoFactorEmailOTP /> },
                    { path: "forgot-password", element: <ForgotPassword /> },
                    { path: "reset-password", element: <ResetPassword /> },
                ]
            }
        ]
    },

    {
        path: "*",
        element: (
            <NotFoundPage />
        )
    }
]);