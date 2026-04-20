import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';
import CustomCircleLoader from '../shared/CustomCircleLoader';


export const PrivateRoute = () => {

    const { currentUser, loading, userProfile } = useAuth();

    console.log("Current User Details from Route Guard : ", currentUser);

    if (loading) return <div>Loading...</div>

    if (!currentUser) return <Navigate to="/login" replace />

    // if (!userProfile?.id) {
    //     return (
    //         <div className='flex items-center justify-center h-screen w-full'>
    //             <CustomCircleLoader />
    //         </div>
    //     )
    // }

    return <Outlet />
}

export const PublicRoute = () => {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}