import React, { useEffect } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';

const LenderOverview = () => {
    const { id } = useParams();
    console.log("id : ", id)

    const mainRef = useOutletContext();
    useEffect(() => {
        console.log("mainRef : ", mainRef?.current, mainRef);
        if (mainRef?.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [])


    const { getAccessToken } = useAuth();

    const getSpecificLenderData = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getLenderOverview(id)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }
            const result = await response.json();
            // console.log("subAdmin List: ", result.response.moduleKeys);
            console.log("Result from get specific Lender API: ", result.response);
            const lender = result?.response;

            const data = {
                id: lender?.id,
                lenderId: lender?.customId,
                lenderName: lender?.legalEntityName,
                lenderType: lender?.lenderType,
                rbiRegistrationNumber: lender?.rbiRegistrationNumber,
                cin: lender?.cin,
                pan: lender?.pan,
                gstin: lender?.gstin,
                addressLine1: lender?.addressLine1,
                websiteUrl: lender?.websiteUrl,
                city: lender?.city,
                state: lender?.state,
                pincode: lender?.pincode,
                customerCareEmail: lender?.customerCareEmail,
                customerCarePhone: lender?.customerCarePhone,
                createdAt: lender?.createdAt,
            }


            return data;

        } catch (error) {
            console.log("Error in fetch specific lender : ", error?.message);
        }
    }

    const { data: lenderDetails, isLoading } = useQuery({
        queryKey: ["fetchSpecificLenderData", id],
        queryFn: getSpecificLenderData,
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-end'>
                    <div className='text-lg font-semibold text-(--primary)'>Lender Information</div>
                    <Link to="edit">
                        <button className='sm:mr-8 px-8 py-1 rounded-md bg-(--primary) text-white font-semibold'>Edit</button>
                    </Link>
                </div>
                <hr className="border-gray-200" />
            </div>
            <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="">Lender ID</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full text-xs sm:text-base sm:px-4'>{lenderDetails?.lenderId}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >Legal Entity Name</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 font-semibold text-xs sm:text-base' >{lenderDetails?.lenderName}<span className='ml-2 sm:ml-4 bg-green-600 rounded-sm text-sm text-white py-1 px-2'>{lenderDetails?.lenderType}</span></div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >RBI Registration No</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.rbiRegistrationNumber}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >CIN</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.cin}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >PAN</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.pan}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >GSTIN</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.gstin}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >Website URL</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.websiteUrl}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >Customer Care Phone</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.customerCarePhone}</div>
                </div>
                <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >Customer Care Email</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{lenderDetails?.customerCareEmail}</div>
                </div>
                {/* <div className='flex'>
                    <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
                        <label htmlFor="" >Customer Care Email</label>
                        <span className='text-(--primary) font-bold pr-1'>:</span>
                    </div>
                    <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>support@lender.com</div>
                </div> */}

            </div>
            <hr className='border border-gray-200' />
            <div className='space-y-4'>
                <h3 className='font-semibold text-(--primary)'>Registered Address</h3>
                <div className='flex gap-2 text-xs sm:text-base whitespace-nowrap max-sm:overflow-x-scroll'>
                    <span>{lenderDetails?.addressLine1},</span>
                    <span>{lenderDetails?.city},</span>
                    <span>{lenderDetails?.state} -</span>
                    <span>{lenderDetails?.pincode}</span>
                </div>
            </div>
        </div>
    )
}

export default LenderOverview