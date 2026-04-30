import { UpdateLoanDetailsModal } from "../components/UpdateLoanDetailsModal";


export const type = "DEV";
// export const type = "PROD";

let API_BASE_URL;

if (type === 'DEV') {
    API_BASE_URL = "http://localhost:4000";

    // hari
    // API_BASE_URL = "https://b3fn5jvm-4000.inc1.devtunnels.ms"

    // razzak
    // API_BASE_URL = "https://57gph04g-4000.inc1.devtunnels.ms";
}


const API_URL = {

    auth:{
        login: `${API_BASE_URL}/api/v1/auth/sign-in`,
        sendLoginOTP: `${API_BASE_URL}/api/auth/login/send-otp`,
        verifyLoginOTP: `${API_BASE_URL}/api/v1/auth/login/verify-otp`
    },

    profile: {
        getUserProfile: `${API_BASE_URL}/api/v1/users/profile`
    },

    subAdminManagement: {
        addStaffAdmin: `${API_BASE_URL}/api/admin/sub-admins`,
        getSubAdminList: `${API_BASE_URL}/api/admin/sub-admins`,
        getSpecificStaffAdmin: (id) => `${API_BASE_URL}/api/admin/sub-admins/${id}`,
        updateStaffAdminStatus: (id) => `${API_BASE_URL}/api/admin/sub-admins/${id}/status`,
        updateStaffAdminPermissions: (id) => `${API_BASE_URL}/api/admin/sub-admins/${id}/permissions`,
        deleteStaffAdmin: (id) => `${API_BASE_URL}/api/admin/sub-admins/${id}`,
    },
    staffManagement: {
        getStaffStatCards: `${API_BASE_URL}/api/v1/executives/cards`,
        getStaffList: `${API_BASE_URL}/api/v1/executives/list`,
        updateStaffStatus: (id) => `${API_BASE_URL}/api/v1/executives/${id}/status`,
        addStaff: `${API_BASE_URL}/api/v1/executives`,
        getSpecificStaff: (id) => `${API_BASE_URL}/api/v1/executives/${id}/details`,
        getSpecificStaffLeads: (id) => `${API_BASE_URL}/api/v1/executives/${id}/leads/list`,
    },
    lenderManagement: {
        getOnboardedLenderList: `${API_BASE_URL}/api/v1/lenders/list`,
        addLender: `${API_BASE_URL}/api/v1/lenders/on-boarding-lender`,
        getLenderList: `${API_BASE_URL}/api/v1/lenders`,
        getLenderNames: `${API_BASE_URL}/api/v1/lenders/names`,
        getLenderOverview: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/details`,
        updateLenderDetails: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}`,
        getLenderProducts: (lenderId) => `${API_BASE_URL}/api/v1/lender-products/${lenderId}/list`,
        getlenderLeadMetrics: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/lender-lead-metrics`,
        getSpecificLenderLeads: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/leads`,
    },

    productManagement: {
        addProduct: (lenderId) => `${API_BASE_URL}/api/v1/lender-products/${lenderId}`,
        updateProductStatus: (lenderId, productId) => `${API_BASE_URL}/api/v1/lender-products/${lenderId}/${productId}/status`,
        getLenderProductDetails: (productId) => `${API_BASE_URL}/api/v1/lender-products/${productId}/details`,
        updateLenderProduct: (lenderId, productId) => `${API_BASE_URL}/api/v1/lender-products/${lenderId}/${productId}`,
        getProductList: `${API_BASE_URL}/api/v1/lender-products/list`,

    },

    lenderSupport: {
        addLenderSupport: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/support-staff`,
        getLenderSupports: (lenderId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/support-staff`,
        getSpecificLenderSupport: (lenderId, supportId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/support-staff/${supportId}/details`,
        updateLenderSupport: (lenderId, supportId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/support-staff/${supportId}`,
        updateLenderSupportStatus: (lenderId, supportId) => `${API_BASE_URL}/api/v1/lenders/${lenderId}/support-staff/${supportId}/status`,
    },

    leadManagement: {
        getManageLeadsList: `${API_BASE_URL}/api/v1/leads/non-new`,
        getManageLeadCards: `${API_BASE_URL}/api/v1/leads/overview/cards`,
        getLeadManagementList: `${API_BASE_URL}/api/v1/leads/list`,
        getSpecificLeadProfile: (leadId) => `${API_BASE_URL}/api/v1/leads/specific-lead/${leadId}`,
        updateLeadStatus: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/status`,
        getLeadStaffList: `${API_BASE_URL}/api/v1/executives/names`,
        assignLeadToStaff: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/assignment`,
        getLeadOverview: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/details`,
        updateLoanDetails: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/credit-details`,
        updateRemarkDetails: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/remarks`,
        getBureauReport: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/bureau-report`,
        getUpdateBureauReport: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/update-bureau-report`,
        getLeadMatchedProducts: (leadId) => `${API_BASE_URL}/api/v1/leads/${leadId}/matched-products/details`
    }

};


export default API_URL;