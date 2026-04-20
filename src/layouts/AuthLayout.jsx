import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import LogoHeader from '../components/LogoHeader';

const AuthLayout = () => {

    const { pathname } = useLocation();


    return (
        <div>
            <div className='w-full h-screen flex justify-center items-center gap-8 lg:gap-16 bg-[#F8F9FA]'>

                <div className='w-full lg:w-1/3 max-lg:w-2/3 flex flex-start justify-center bg-white rounded-2xl border border-[#F0F1F3] shadow-[0_8px_30px_rgba(0,0,0,0.04)] mx-2 md:mx-4'>
                    <div className='w-5/6 flex flex-col gap-6'>
                        <div className='mt-6'>
                            <LogoHeader />
                        </div>
                        {pathname === "/forgot-password" && <h2 className="text-xl md:text-2xl font-semibold text-(--primary)">Forgot Password</h2>}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout