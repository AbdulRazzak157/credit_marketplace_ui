import React from 'react'
import NavigationHeadline from '../../components/NavigationHeadline'
import { NavLink, Outlet } from 'react-router-dom'

const LenderViewParent = () => {
    return (
        <div className='flex flex-col gap-8'>
            <NavigationHeadline content="Back" to="/lenders" />

            <div className='bg-white px-2 py-4 sm:px-8 flex flex-col gap-6 rounded-md'>
                <section>
                    <div className='border-b  border-gray-400 flex gap-x-8 text-xs whitespace-nowrap max-sm:overflow-x-scroll sm:text-lg'>
                         <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to=""
                            end
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="lender-lead-metrics"
                            end
                        >
                            Lead Metrics
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="products"
                            end
                        >
                            Products
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="support"
                            end
                        >
                            Support & Contacts
                        </NavLink>
                        {/* <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="agreements"
                            end
                        >
                            Agreements
                        </NavLink> */}
                    </div>
                    {/* <hr className='border-b  border-gray-300'/> */}
                </section>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default LenderViewParent