import React from 'react'

const FilterRangeOption = ({ label, logo, minValue, maxValue, setMinValue, setMaxValue, type }) => {
    return (
        <div className='flex flex-col gap-y-2 justify-center'>
            <label htmlFor="" className='text-gray-600 text-sm whitespace-nowrap'>{label} {logo && `(${logo})`}</label>
            <div className='flex gap-x-2 items-center'>
                <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 w-full">
                    <input
                        type={type}
                        value={minValue}
                        onChange={(e) => setMinValue(e.target.value)}
                        className='outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]'
                        placeholder='Enter Min Value'
                    />
                </div>
                <span>-</span>
                <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 w-full">
                    <input
                        type={type}
                        value={maxValue}
                        onChange={(e) => setMaxValue(e.target.value)}
                        className='outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]'
                        placeholder='Enter Max Value'
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterRangeOption