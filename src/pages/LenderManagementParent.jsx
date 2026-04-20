import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom';

const LenderManagementParent = () => {
    const { mainRef } = useOutletContext();

    return (
        <Outlet context={mainRef} />
    )
}

export default LenderManagementParent