import React from 'react'
import { useAuth } from '../context/AuthContext';

const HasPermission = ({ permission, children, fallback = null }) => {
    const { userProfile } = useAuth();

    const permissions = new Set(userProfile?.permissions || []);

    return permissions.has(permission) ? children : fallback;
}

export default HasPermission;