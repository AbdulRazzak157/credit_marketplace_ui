import { Icon } from '@iconify/react'
import React from 'react'

const ProductRangeCard = ({ label, minValue, maxValue}) => {
    return (
        <div className='bg-white rounded-md px-4 py-4'>
            <div className='text-[#64748B] max-md:text-sm'>{label}</div>
            <div className='flex justify-between items-center gap-y-2 w-full md:w-[70%]'>
                <span className='text-[#374151] font-semibold'>{minValue}</span> <Icon icon="mynaui:minus-solid" width="24" height="24" />
                <span className='text-[#374151] font-semibold'>{maxValue}</span>
            </div>
            <div className='flex justify-between items-center gap-y-2 text-xs w-full md:w-[70%]'>
                <span>Min</span>
                <span>Max</span>
            </div>
        </div>
    )
}

export default ProductRangeCard