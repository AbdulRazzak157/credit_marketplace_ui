import React, { useRef, useState } from 'react'
import Header from '../components/Header';
import MobileSidebar from './MobileSideBar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const mainRef = useRef(null);

    return (
        <div className='h-screen flex flex-col'>
            {/* Fixed Header */}
            <Header onMenuClick={() => setIsMenuOpen(true)} />``

            {/* MobileSidebar */}
            <MobileSidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />


            <div className='flex flex-1 overflow-hidden pt-16'>

                {/* Sidebar Menu */}
                <div className='hidden lg:block'>
                    <Sidebar />
                </div>


                <main ref={mainRef} className="flex-1 overflow-y-auto bg-(--secondary) px-4 sm:px-6 py-4 sm:py-5">
                    <Outlet context={{ mainRef }} />
                </main>
            </div>
        </div>
    )
}

export default UserLayout;