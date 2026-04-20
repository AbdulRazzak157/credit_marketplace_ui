import React, { useState } from 'react'
import { getUserSidebarItems } from '../constants/sidebarTabs.constant';
import { useAuth } from '../context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { MdOutlineLogout } from 'react-icons/md';
import LogoutModal from '../components/LogoutModal';

const Sidebar = () => {
    const { pathname } = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { userProfile } = useAuth();



    const updatedSidebarItems = getUserSidebarItems(userProfile);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };
    return (
        <>

            <div className={`relative ${isCollapsed ? "w-25" : "w-64"} h-full bg-white px-4 border-r border-gray-300 shadow overflow-visible transition-all duration-500 ease-in-out`}>

                <button
                    className='absolute top-4 right-0 translate-x-1/2 w-8 h-8 rounded-full bg-(--primary) text-white flex justify-center items-center'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {
                        isCollapsed ? (
                            <Icon icon="mingcute:arrows-right-line" width="16" height="16" />
                        ) : (
                            <Icon icon="mingcute:arrows-left-line" width="16" height="16" />
                        )
                    }
                </button>
                <nav className="flex flex-col h-full justify-between min-h-[calc(100vh-120px)] px-2 pt-14">
                    <div className="flex flex-col gap-3 text-sm">
                        {updatedSidebarItems?.map((detail) => (
                            <NavLink
                                key={detail.name}
                                to={detail.to}
                                title={isCollapsed ? detail.name : null}
                                className={({ isActive }) => {
                                    return `flex items-center gap-1 px-4 h-11 rounded-md transition-colors duration-500 whitespace-nowrap ${isActive ? 'bg-(--primary) text-white font-semibold' : 'font-medium text-[#64646E] hover:bg-gray-200'}`
                                }}
                            >
                                <span className="min-w-8">
                                    <Icon icon={detail.icon} className={detail.iconClass} />
                                </span>
                                {!isCollapsed && <span>{detail.name}</span>}
                            </NavLink>
                        ))}
                    </div>

                    <div
                        className="flex items-center gap-2 text-[#64646E] px-4 py-6 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <MdOutlineLogout className="text-[1.4rem] min-w-8" />
                        <span className="text-base">Logout</span>
                    </div>
                </nav>
                {isLogoutModalOpen && (
                    <LogoutModal setIsLogoutModalOpen={setIsLogoutModalOpen} />
                )}
            </div>
        </>
    )
}

export default Sidebar