import React from 'react'

const ManageLeadCard = ({ value, bgColor, icon, label }) => {
    return (
        <div className="bg-white rounded-lg p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-6">
                <span className="text-[#1E293B] font-semibold text-2xl md:text-3xl">{value ?? 0}</span>
                <div className={`w-9 h-9 grid place-content-center ${bgColor} rounded-full`}>
                    <span className={`text-white text-[1.2rem]`}>{icon}</span>
                </div>
            </div>
            <span className="text-[#1E293B] font-medium text-base md:text-lg">{label}</span>
        </div>
    )
}

export default ManageLeadCard