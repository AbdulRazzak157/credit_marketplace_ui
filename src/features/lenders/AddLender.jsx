import React from 'react'
import NavigationHeadline from '../../components/NavigationHeadline'
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { toast } from 'react-toastify';
import ErrorMessage from '../../shared/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../api/apiConfig';

const AddLender = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm();

  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const addLenderHandler = async (data) => {
    console.log("form data : ", data);

    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderManagement.addLender}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          legalEntityName: data?.lenderName,
          lenderType: data?.lenderType?.value,
          rbiRegistrationNumber: data?.lenderRbiRegNo,
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
        throw new Error(errorData?.response?.message || "Failed to add Lender");
      }
      toast.success("Lender Onboarded Successfully");
      reset();
      navigate("/lenders");

      // await new Promise(resolve => setTimeout(resolve, 3000));
      // toast.success("Staff added successfully");
      // navigate("/staff");

    } catch (error) {
      console.log("Error adding Lender : ", error);
      toast.error(error?.message);
    }
  }
  return (
    <div className='flex flex-col gap-8'>
      <div>
        <NavigationHeadline content={"Back"} to="/lenders" />
      </div>
      <div className='flex flex-col gap-4 bg-white px-2 py-4 sm:px-4 sm:py-4 rounded-md '>
        <h1 className='text-2xl font-semibold text-(--primary)'>Onboard Lender</h1>
        <form action="" onSubmit={handleSubmit(addLenderHandler)} className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 sm:py-8'>
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
                    { label: "LSP", value: "LSP" },
                    { label: "FINTECH", value: "FINTECH" },
                    { label: "NBFC P2P", value: "NBFC P2P" },
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
              id="lenderRbiRegNo"
              type="text"
              placeholder="Enter RBI Reg No"
              {...register("lenderRbiRegNo", {
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
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
            <label htmlFor="lender-address" className='text-gray-600 text-sm sm:text-base'>Customer Care Phone Number*</label>
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
              </div> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLender