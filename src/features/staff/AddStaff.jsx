import React, { useState } from 'react'
import NavigationHeadline from '../../components/NavigationHeadline'
import { useAuth } from '../../context/AuthContext';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import ErrorMessage from '../../shared/ErrorMessage';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { toast } from 'react-toastify';
import API_URL from '../../api/apiConfig';

const AddStaff = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm();

    const { getAccessToken } = useAuth();
    const navigate = useNavigate();

    const addStaffHandler = async (data) => {
        if (data.staffPassword !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        console.log("form data : ", data);

        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.staffManagement.addStaff}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: data.staffFirstName,
                    lastName: data.staffLastName,
                    email: data.addStaffEmail,
                    mobileNumber: data.mobileNumber,
                    password: data.staffPassword,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.response?.message || "Failed to add staff");
            }
            toast.success("Staff added successfully");
            reset();
            navigate("/staff");

            // await new Promise(resolve => setTimeout(resolve, 3000));
            // toast.success("Staff added successfully");
            // navigate("/staff");

        } catch (error) {
            console.log("Error adding staff : ", error);
            toast.error(error?.message);
        }
    }
    return (
        <div className='flex flex-col gap-8'>
            <div>
                <NavigationHeadline content={"Back"} to="/staff" />
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(addStaffHandler)} action="" className='bg-white grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 sm:py-8 rounded-md'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Enter First Name*</label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Enter First Name"
                        {...register("staffFirstName", {
                            required: "*First Name is required",
                            pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: "First Name should only contain letters",
                            },
                        })}
                        className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                    />
                    {
                        errors.staffFirstName && <ErrorMessage message={errors?.staffFirstName.message} />
                    }
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Enter Last Name*</label>
                    <input
                        id="staffLastName"
                        type="text"
                        placeholder="Enter Last Name"
                        {...register("staffLastName", {
                            required: "*Last Name is required",
                            pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: "Last Name should only contain letters",
                            },
                        })}
                        className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                    />
                    {
                        errors.staffLastName && <ErrorMessage message={errors?.staffLastName.message} />
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
                        {...register('addStaffEmail', {
                            required: '*Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: '*Enter a valid email address',
                            },
                        })}
                        className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                    />
                    {
                        errors.addStaffEmail && <ErrorMessage message={errors?.addStaffEmail.message} />
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-gray-600 text-sm xs:text-base">
                        Enter Password
                    </label>
                    <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-2 rounded-md">
                        <input
                            id="staffPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter New Password"
                            name="staffPassword"
                            autoComplete="new-password"
                            className="outline-none border-none grow placeholder:text-[#CCCCCC]"
                            {...register("staffPassword", {
                                required: "*Password is required",
                                validate: {
                                    length: (v) =>
                                        /.{8,20}/.test(v) || "Password must be 8–20 characters",
                                    uppercase: (v) =>
                                        /[A-Z]/.test(v) ||
                                        "Password must include at least one uppercase letter",
                                    number: (v) =>
                                        /\d/.test(v) || "Password must include at least one number",
                                    specialChar: (v) =>
                                        /[@$!%*?&]/.test(v) ||
                                        "Password must include at least one special character",
                                },
                            })}
                        />
                        <div
                            className="text-[1.2rem] cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? (
                                <FaEye className="text-gray-400 text-[1.5rem]" />
                            ) : (
                                <IoMdEyeOff className="text-gray-400 text-[1.5rem]" />
                            )}
                        </div>
                    </div>
                    {errors.staffPassword && <ErrorMessage message={errors.staffPassword.message} />}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-gray-600 text-sm xs:text-base">
                        Confirm Password
                    </label>
                    <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-2 rounded-md">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="outline-none border-none flex-grow placeholder:text-[#CCCCCC]"
                            {...register("confirmPassword", {
                                required: "*Confirm Password is required",
                                // validate: (value) => {
                                //     if (value !== password) {
                                //         return "*Passwords do not match";
                                //     }
                                // }
                            })}
                        />
                        <div
                            className="text-[1.2rem] cursor-pointer"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                            {showConfirmPassword ? (
                                <FaEye className="text-gray-400 text-[1.5rem]" />
                            ) : (
                                <IoMdEyeOff className="text-gray-400 text-[1.5rem]" />
                            )}
                        </div>
                    </div>
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
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
    )
}

export default AddStaff