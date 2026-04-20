import { Icon } from '@iconify/react'
import React from 'react'
import assets from '../constants/assets.constant'
import QuickActions from './QuickActions'

const Header = ({ onMenuClick }) => {
    return (
        <div className='relative'>
            <header className='fixed top-0 left-0 w-full h-16 bg-white shadow flex justify-between items-center px-4 xs:px-6 md:px-10 z-50'>
                <button
                    onClick={onMenuClick}
                    className='lg:hidden text-gray-700'
                    aria-label="Toggle menu"
                >
                    <Icon icon="pajamas:hamburger" className='text-2xl xs:text-3xl' />
                </button>
                <div
                    className='max-lg:hidden'
                >
                    <img src={assets.picLogo} alt="picLogo" className='h-10' />
                </div>
                <div className='flex justify-end items-center gap-4 sm:gap-8'>
                    <div className='max-lg:hidden'>
                        <QuickActions />
                    </div>
                    <div>
                        <button className='h-9 sm:h-10 w-9 sm:w-10 bg-[#F3F3F3] flex items-center justify-center rounded-full'>
                            <Icon icon="ic:baseline-notifications-none" width="18" height="18" />
                        </button>
                    </div>
                    <div className='flex justify-end items-center gap-4'>
                        <div className='flex flex-col items-end max-lg:hidden'>
                            <div className="text-sm text-(--primary) font-semibold">Mohammed Qureshi</div>
                            <div className="text-[#64646E] text-xs">SUB987645678637</div>
                        </div>
                        <h1 className='flex justify-center items-center text-white bg-(--primary) w-9 h-9 sm:w-10 sm:h-10 rounded-full capitalize'>
                            <span>R</span>
                        </h1>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header