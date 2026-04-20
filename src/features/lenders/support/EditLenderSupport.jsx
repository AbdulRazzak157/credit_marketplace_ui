import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import ErrorMessage from '../../../shared/ErrorMessage';
import CustomThreeDotsLoader from '../../../shared/CustomThreeDotsLoader';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import API_URL from '../../../api/apiConfig';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CustomCircleLoader from '../../../shared/CustomCircleLoader';

const EditLenderSupport = () => {
  const { id, employeeId } = useParams();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm();


  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const mainRef = useOutletContext();
  useEffect(() => {
    console.log("mainRef : ", mainRef?.current, mainRef);
    if (mainRef?.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [employeeId])

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
        supportName: support?.name,
        supportDesignation: support?.designation,
        supportEmail: support?.email,
        mobileNumber: support?.mobileNumber
      }
      // console.log("data:",data)
      reset(data);


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



  const UpdateLenderSupportDetails = async (data) => {
    console.log("data: ", data);
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderSupport.updateLenderSupport(id, employeeId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data?.supportName,
          designation: data?.supportDesignation,
          officialEmail: data?.supportEmail,
          mobileNumber: data?.mobileNumber,
          // contactPreference: ""
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.response?.message || "Failed to Update Lender Support");
      }
      // const result = await response.json();
      // console.log("result : ",result);

      toast.success("Lender Support Updated Successfully");
      reset();
      navigate(`/lenders/view/${id}/support`);

    } catch (error) {
      console.log("Error adding Lender Support : ", error);
      toast.error(error?.message);
    }
  }
  return (
    <div>
      <div>
        <h2 className='text-lg text-(--primary) font-semibold'>Edit Contact</h2>
      </div>
      <form action="" onSubmit={handleSubmit(UpdateLenderSupportDetails)} className='bg-white grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 sm:py-8 rounded-md'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="support-name" className='text-gray-600 text-sm sm:text-base'>Enter Name*</label>
          <input
            id="supportName"
            type="text"
            placeholder="Enter Name"
            {...register("supportName", {
              required: "*Name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.supportName && <ErrorMessage message={errors?.supportName.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="staff-designation" className='text-gray-600 text-sm sm:text-base'>Enter Designation*</label>
          <input
            id="supportDesignation"
            type="text"
            placeholder="Enter Designation"
            {...register("supportDesignation", {
              required: "*Designation is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Designation should only contain letters",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.supportDesignation && <ErrorMessage message={errors?.supportDesignation.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="staff-designation" className='text-gray-600 text-sm sm:text-base'>Enter Mobile Number*</label>

          <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-[6px] rounded-md">

            <Controller
              name="mobileNumber"
              control={control}
              rules={{
                required: '*Phone number is required',
                validate: (value) => {
                  if (!value) return '*Phone number is required';
                  if (!value.startsWith('+91')) return '*Only Indian numbers are allowed';
                  return isValidPhoneNumber(value) ? true : '*Invalid phone number';
                },
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  // readOnly={mobileOtpSent}
                  defaultCountry="IN"
                  countries={['IN']} // restrict dropdown to India only
                  international
                  countryCallingCodeEditable={false}
                  placeholder="Enter your phone number"
                  className="phone-input w-full min-w-37.5"
                />
              )}
            />
          </div>
          {
            errors.mobileNumber && <ErrorMessage message={errors?.mobileNumber.message} />
          }
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-gray-600 text-sm sm:text-base'>Enter Email id*</label>
          <input
            id="addStaffEmail"
            type="text"
            name="addStaffEmail"
            placeholder="Enter Email Address"
            {...register('supportEmail', {
              required: '*Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '*Enter a valid email address',
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.supportEmail && <ErrorMessage message={errors?.supportEmail.message} />
          }
        </div>
        <div className="flex items-center justify-end md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-(--primary) text-white font-medium text-base py-2 w-32 xs:w-36 rounded-md">
            {isSubmitting ? <div className='inline-block'>
              <CustomThreeDotsLoader color="white" />
            </div> : "Save"}
          </button>
        </div>
      </form>

    </div>
  )
}

export default EditLenderSupport;