import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom';

const SubAdminManagementParent = () => {

    const { mainRef } = useOutletContext();

    return (
        <Outlet context={mainRef} />
    )
}

export default SubAdminManagementParent;