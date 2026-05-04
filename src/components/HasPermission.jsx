import React from 'react'
import { useAuth } from '../context/AuthContext';
import { userPermissions } from '../constants/subadminPermissions';

const HasPermission = ({ permission, children, fallback = null }) => {
    const { userProfile } = useAuth();

    if (userProfile?.userRole === "ADMIN") return children;

    if (userProfile?.userRole === "EXECUTIVE" && permission !== userPermissions.LEADS_MANAGEMENT.ASSIGN_LEADS) {
        return children;
    };


    const permissions = new Set(userProfile?.permissions || []);

    return permissions.has(permission) ? children : fallback;
}

export default HasPermission;