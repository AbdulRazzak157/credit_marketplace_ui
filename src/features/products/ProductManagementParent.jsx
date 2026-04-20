import React from 'react'
import { Outlet } from 'react-router-dom'

const ProductManagementParent = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default ProductManagementParent