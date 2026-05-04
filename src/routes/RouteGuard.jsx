import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';
import CustomCircleLoader from '../shared/CustomCircleLoader';
import AccessRestricted from '../pages/AccessRestricted';
import { userPermissions } from '../constants/subadminPermissions';


export const PrivateRoute = () => {

    const { currentUser, loading, userProfile } = useAuth();

    // console.log("Current User Details from Route Guard : ", currentUser);

    if (loading) return <div>Loading...</div>

    if (!currentUser) return <Navigate to="/login" replace />

    if (!userProfile?.id) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <CustomCircleLoader />
            </div>
        )
    }

    return <Outlet />
}

export const PublicRoute = () => {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}

const PERMISSIONS_MAP = {
    '/lenders': userPermissions.LENDER.VIEW_LENDERS,
    '/staff': userPermissions.EXECUTIVES.VIEW_EXECUTIVES,
    '/leads': userPermissions.LEADS_MANAGEMENT.VIEW_LEADS,
    '/manage-leads': userPermissions.LEADS_MANAGEMENT.VIEW_MANAGE_LEADS,
    '/products': userPermissions.LENDER_PRODUCT.VIEW_LENDER_PRODUCTS,

    // LENDER
    '/lenders/onboard': userPermissions.LENDER.ONBOARD_LENDER,
    'lenders/view/:id/edit': userPermissions.LENDER.EDIT_LENDER,

    // LENDER PRODUCT
    '/lenders/view/:id/products': userPermissions.LENDER_PRODUCT.VIEW_LENDER_PRODUCTS,
    // add lender product
    // edit lender product

    // LENDER SUPPORT

    // STAFf
    '/staff/add': userPermissions.EXECUTIVES.ADD_EXECUTIVE,

    // LEAD
}

export const ProtectedPage = ({ path, children, permission }) => {
    const { userProfile } = useAuth();

    if (userProfile?.userRole === "ADMIN") return children;

    if (userProfile?.userRole === "EXECUTIVE") {
        const paths = ['/lenders', '/staff', '/sub-admins'];
        if (paths.includes(path)) {
            return <AccessRestricted />
        } else {
            return children;
        }
    };

    const permissions = new Set(userProfile?.permissions ?? []);

    const required = permission || PERMISSIONS_MAP[path];

    const hasAccess = !required || permissions.has(required);

    return hasAccess ? children : <AccessRestricted />
}