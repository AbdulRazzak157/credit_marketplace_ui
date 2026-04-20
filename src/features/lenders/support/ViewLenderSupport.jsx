import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext';
import API_URL from '../../../api/apiConfig';
import moment from 'moment';
import CustomCircleLoader from '../../../shared/CustomCircleLoader';

const ViewLenderSupport = () => {
  const { id, employeeId } = useParams();

  const { getAccessToken } = useAuth();

  const getSpecificLenderSupportData = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderSupport.getSpecificLenderSupport(id, employeeId)}`, {
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
      console.log("Result from get specific Lender Support API: ", result.response);
      const support = result?.response;
      const data = {
        customId:support?.staffId,
        onboardedOn: moment(support?.createdAt || new Date()).format('DD-MM-YYYY'),
        isActive: support?.isActive,
        supportName: support?.name,
        supportDesignation: support?.designation,
        supportEmail: support?.email,
        mobileNumber: support?.mobileNumber
      }

      return data;

    } catch (error) {
      console.log("Error in fetch specific lender support: ", error?.message);
    }
  }

  const { data: supportDetails, isLoading } = useQuery({
    queryKey: ["fetchSpecificLenderSupportEditData", employeeId],
    queryFn: getSpecificLenderSupportData,
    enabled: !!employeeId,
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
          <div className='text-lg font-semibold text-(--primary)'>Lender Support Information</div>
          <Link to="edit">
            <button className='sm:mr-8 px-8 py-1 rounded-md bg-(--primary) text-white font-semibold'>Edit</button>
          </Link>
        </div>
        <hr className="border-gray-200" />
      </div>
      <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="">ID</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full text-xs sm:text-base sm:px-4'>{supportDetails?.customId}</div>
        </div>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="" >Name</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full px-2 sm:px-4 font-semibold text-xs sm:text-base' >{supportDetails?.supportName}<span className={`ml-2 sm:ml-4 ${supportDetails?.isActive ? "bg-green-600" : "bg-red-500"}  rounded-sm text-sm text-white py-1 px-2`}>{supportDetails?.isActive ? "ACTIVE" : "INACTIVE"}</span></div>
        </div>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="" >Designation</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{supportDetails?.supportDesignation}</div>
        </div>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="" >Mobile Number</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{supportDetails?.mobileNumber}</div>
        </div>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="" >Email</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{supportDetails?.supportEmail}</div>
        </div>
        <div className='flex'>
          <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
            <label htmlFor="" >Onboarded On</label>
            <span className='text-(--primary) font-bold pr-1'>:</span>
          </div>
          <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{supportDetails?.onboardedOn}</div>
        </div>

      </div>
    </div>
  )
}

export default ViewLenderSupport