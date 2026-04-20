import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom';

const ManageLeadsParent = () => {

    const { mainRef } = useOutletContext();

    return (
        <Outlet context={mainRef} />
    )
}

export default ManageLeadsParent