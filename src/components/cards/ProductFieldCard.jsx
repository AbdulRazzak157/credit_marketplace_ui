import React from 'react'

const ProductFieldCard = ({ label, value}) => {
    return (
        <div className='bg-white px-4 py-4 rounded-md flex flex-col justify-between items-start gap-4'>
            <div className='text-[#64748B] font-medium max-lg:text-sm'>{label} </div>
            <div className='text-[#374151] font-extrabold'>{value}</div>
        </div>
    )
}

export default ProductFieldCard