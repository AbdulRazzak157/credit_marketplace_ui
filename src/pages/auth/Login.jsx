import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ErrorMessage from '../../shared/ErrorMessage';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { getFirebaseErrorMessage } from '../../helpers/firebaseErrors';
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import API_URL from '../../api/apiConfig';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [isLogging, setIsLogging] = useState(false);

    const navigate = useNavigate();

    const { login, loading, otpSession, setOtpSession, userEmail, setUserEmail } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const showUserPassword = () => {
        setShowPassword((prev) => !prev);
    };
    const { getAccessToken } = useAuth();

    console.log("loading : ", loading);
    if (loading) {
        return <div>Loading...</div>
    }

    const onSubmit = async (data) => {
        try {
            setIsLogging(true);
            // await login(data.email, data.password);
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.auth.login}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data?.password
                })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }
            const result = await response.json();
            const responseData = {
                otpToken: result?.response?.otpSessionToken,
                email: result?.response?.email,
            }

            setOtpSession(responseData.otpToken);
            setUserEmail(responseData.email)

            navigate("/login-verification");
        } catch (error) {
            toast.error(getFirebaseErrorMessage(error));
            console.error("Login error:", error);
            setIsLogging(false);
        }
    };
    return (
        <form className='flex flex-col items-start justify-center gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h2 className='text-2xl md:text-3xl font-semibold text-(--primary)'>Welcome back</h2>
                <div className='text-sm text-[#424754]'>Enter Your Email and Password to access your account securely</div>
            </div>
            <div className='w-full flex flex-col gap-2.5'>
                <div className="w-full flex flex-col gap-1">
                    <label htmlFor="Login-email" className="font-medium text-xs md:text-sm">Email Address*</label>
                    <div className='flex flex-row border border-[#CCCCCC] items-center rounded-md py-1 px-3'>
                        <input
                            type='text'
                            // type={showPassword ? "text" : "password"}
                            placeholder="Enter Email"
                            className="w-full outline-none border-none placeholder:text-[#CCCCCC] placeholder:text-sm"
                            {...register("email", {
                                required: "*Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "*Enter a valid email address",
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <ErrorMessage message={errors.email.message} />
                    )}
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label htmlFor="Login-password" className="font-medium text-xs md:text-sm">Password*</label>
                    <div className='flex flex-row border border-[#CCCCCC] items-center rounded-md py-1 px-3'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="w-full outline-none border-none placeholder:text-[#CCCCCC] placeholder:text-sm"
                            {...register("password", {
                                required: "*Password is required",
                                minLength: { value: 8, message: "*Password must be at least 8 characters long" },
                                maxLength: { value: 20, message: "*Password cannot exceed more than 20 characters" },
                            })}
                        />
                        {showPassword ? (
                            <FaEye className='text-gray-400 text-[1.5rem] cursor-pointer' onClick={showUserPassword} />
                        ) : (
                            <FaEyeSlash className='text-gray-400 text-[1.5rem] cursor-pointer' onClick={showUserPassword} />
                        )}
                    </div>
                    {errors.password && (
                        <ErrorMessage message={errors.password.message} />
                    )}
                </div>

                <Link
                    className='text-sm text-(--primary) font-semibold cursor-pointer hover:underline self-end'
                    to="/forgot-password"
                >
                    Forgot password?
                </Link>
            </div>
            <button className='w-full h-9 button bg-(--primary) rounded-3xl px-3 py-2 text-white font-semibold mb-10 flex justify-center items-center gap-1'
                type="submit"
                disabled={isSubmitting}
            >
                {
                    !isLogging ? (
                        <div className='flex gap-1 justify-center items-center'>Login < Icon icon="mi:arrow-right" fontSize={20} /></div>
                    ) : (
                        <Icon icon="line-md:loading-twotone-loop" className="w-7 h-7" />
                    )
                }
            </button>
        </form>
    )
}

export default Login