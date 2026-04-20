import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import ErrorMessage from '../../shared/ErrorMessage';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditLenderDetails = () => {
  const { id } = useParams();
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
  }, [id])

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
      const lenderData = result?.response;
      reset({
        lenderName: lenderData?.legalEntityName || "",
        lenderType: { value: lenderData?.lenderType, label: lenderData?.lenderType },
        rbiRegistrationNumber: lenderData?.rbiRegistrationNumber || "",
        lenderCin: lenderData?.cin || "",
        lenderPan: lenderData?.pan || "",
        lenderGstin: lenderData?.gstin || "",
        lenderWebsite: lenderData?.websiteUrl || "",
        lenderAddress: lenderData?.addressLine1 || "",
        lenderCity: lenderData?.city || "",
        lenderState: lenderData?.state || "",
        lenderPincode: lenderData?.pincode || "",
        lenderCustomerCareEmail: lenderData?.customerCareEmail || "",
        lenderCustomerCarePhone: lenderData?.customerCarePhone || "",
      });


      return lenderData;

    } catch (error) {
      console.log("Error in fetch specific lender : ", error?.message);
    }
  }

  const { data: lenderDetails, isLoading } = useQuery({
    queryKey: ["fetchSpecificLenderEditData", id],
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

  const updateLenderHandler = async (data) => {

    console.log("edit lender details : ", data);

    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderManagement.updateLenderDetails(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          legalEntityName: data?.lenderName,
          lenderType: data?.lenderType?.value,
          rbiRegistrationNumber: data?.rbiRegistrationNumber,
          cin: data?.lenderCin,
          pan: data?.lenderPan,
          gstin: data?.lenderGstin,
          customerCareEmail: data?.lenderCustomerCareEmail,
          customerCarePhone: data?.lenderCustomerCarePhone,
          websiteUrl: data?.lenderWebsite,
          pincode: data?.lenderPincode,
          addressLine1: data?.lenderAddress,
          city: data?.lenderCity,
          state: data?.lenderState,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.response?.message || "Failed to Save Lender Details");
      }
      toast.success("Updated Details Saved");
      reset();
      navigate(`/lenders/view/${id}`);

      // await new Promise(resolve => setTimeout(resolve, 3000));
      // toast.success("Staff added successfully");
      // navigate("/staff");

    } catch (error) {
      console.log("Error adding Lender : ", error);
      toast.error(error?.message);
    }
  }

  return (
    <div>
      <h1 className='text-xl font-semibold text-(--primary)'>Update Lender Details</h1>
      <form action="" onSubmit={handleSubmit(updateLenderHandler)} className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 sm:py-8'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Legal Entity Name*</label>
          <input
            id="lenderName"
            type="text"
            placeholder="Enter Legal Entity Name"
            {...register("lenderName", {
              required: "*Legal Entity Name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Legal Entity Name should only contain letters",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderName && <ErrorMessage message={errors?.lenderName.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-type" className='text-gray-600 text-sm sm:text-base'>Type*</label>
          <Controller
            control={control}
            name="lenderType"
            rules={{ required: "*This field is required." }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { label: "NBFC", value: "NBFC" },
                  { label: "Bank", value: "Bank" },
                  { label: "SFB", value: "SFB" },
                  { label: "Other", value: "Other" },
                ]}
                placeholder="Eg: NBFC"
                // styles={reactSelectCustomStyles}
                className="capitalize"
                isClearable
              />
            )}
          >
          </Controller>
          {
            errors.lenderType && <ErrorMessage message={errors?.lenderType.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-rbi" className='text-gray-600 text-sm sm:text-base'>RBI Reg No*</label>
          <input
            id="rbiRegistrationNumber"
            type="text"
            placeholder="Enter RBI Reg No"
            {...register("rbiRegistrationNumber", {
              required: "*RBI Registration Number is required",
              pattern: {
                value: /^[A-Z0-9][A-Z0-9./-]{4,29}$/,
                message: "Enter a valid RBI registration number",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderRbiRegNo && <ErrorMessage message={errors?.lenderRbiRegNo.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-cin" className='text-gray-600 text-sm sm:text-base'>CIN*</label>
          <input
            id="lenderCin"
            type="text"
            placeholder="Ex: U65923MH2010PLC204567"
            {...register("lenderCin", {
              required: "*CIN is required",
              pattern: {
                value: /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
                message: "CIN must be in a valid format",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderCin && <ErrorMessage message={errors?.lenderCin.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-pan" className='text-gray-600 text-sm sm:text-base'>PAN Number*</label>
          <input
            id="lenderPan"
            type="text"
            placeholder="Enter PAN Number"
            {...register("lenderPan", {
              required: "*PAN is required",
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Enter a valid PAN number",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderPan && <ErrorMessage message={errors?.lenderPan.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-gstin" className='text-gray-600 text-sm sm:text-base'>GSTIN*</label>
          <input
            id="lenderGstin"
            type="text"
            placeholder="Enter GSTIN"
            {...register("lenderGstin", {
              required: "*GSTIN is required",
              pattern: {
                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/,
                message: "Enter a valid GSTIN",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderGstin && <ErrorMessage message={errors?.lenderGstin.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-address" className='text-gray-600 text-sm sm:text-base'>Customer Care Email*</label>
          <input
            id="lenderCustomerCareEmail"
            type="text"
            placeholder="Enter Customer Care Email"
            {...register("lenderCustomerCareEmail", {
              required: "*Customer Care Email is required",
              pattern: {
                value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderCustomerCareEmail && <ErrorMessage message={errors?.lenderCustomerCareEmail.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-address" className='text-gray-600 text-sm sm:text-base'>Customer Case Phone Number*</label>
          <input
            id="lenderCustomerCarePhone"
            type="text"
            placeholder="Enter Customer Care Phone Number"
            {...register("lenderCustomerCarePhone", {
              required: "*Customer Care is required",
              pattern: {
                value: /^[0-9+\-()\s]*$/,
                message: "Enter a valid phone number",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderCustomerCarePhone && <ErrorMessage message={errors?.lenderCustomerCarePhone.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-website" className='text-gray-600 text-sm sm:text-base'>website URL*</label>
          <input
            id="lenderWebsite"
            type="text"
            placeholder="Enter Website URL"
            {...register("lenderWebsite", {
              required: "*website is required",
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/,
                message: "Enter a valid website URL",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderWebsite && <ErrorMessage message={errors?.lenderWebsite.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-pincode" className='text-gray-600 text-sm sm:text-base'>Pincode*</label>
          <input
            id="lenderPincode"
            type="text"
            placeholder="Enter Pincode"
            {...register("lenderPincode", {
              required: "*Pincode is required",
              pattern: {
                value: "/^[1-9][0-9]{5}$/",
                message: "Enter a valid 6-digit pincode",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderPincode && <ErrorMessage message={errors?.lenderPincode.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-address" className='text-gray-600 text-sm sm:text-base'>Address*</label>
          <input
            id="lenderAddress"
            type="text"
            placeholder="Enter Address"
            {...register("lenderAddress", {
              required: "*Address is required",
              pattern: {
                value: /^[A-Za-z0-9\s,./#\-()]{5,150}$/,
                message: "Enter a valid address",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderAddress && <ErrorMessage message={errors?.lenderAddress.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-city" className='text-gray-600 text-sm sm:text-base'>City*</label>
          <input
            id="lenderCity"
            type="text"
            placeholder="Enter City"
            {...register("lenderCity", {
              required: "*City is required",
              pattern: {
                value: /^[A-Za-z\s.-]{2,50}$/,
                message: "Enter a valid city name",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderCity && <ErrorMessage message={errors?.lenderCity.message} />
          }
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="lender-state" className='text-gray-600 text-sm sm:text-base'>State*</label>
          <input
            id="lenderState"
            type="text"
            placeholder="Enter State"
            {...register("lenderState", {
              required: "*State is required",
              pattern: {
                value: /^[A-Za-z\s.-]{2,50}$/,
                message: "Enter a valid state name",
              },
            })}
            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
          />
          {
            errors.lenderState && <ErrorMessage message={errors?.lenderState.message} />
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

export default EditLenderDetails