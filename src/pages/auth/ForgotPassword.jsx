import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../api/apiConfig';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { toast } from 'react-toastify';

const ForgotPassword = () => {

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [requestedOtp, setRequestedOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { otpSession, setOtpSession, setOtpReferenceId, otpReferenceId } = useAuth();

  // requesting otp
  const requestOtpHandler = async () => {
    setSendOtpLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch(`${API_URL.auth.sentForgotPasswordEmailOtp(userEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message);
      }

      const result = await response.json();

      setOtpReferenceId(result?.response?.referenceId);
      setOtpSession(result?.response?.otpSessionToken)
      setRequestedOtp(true);
      toast.success("Reset OTP Send Successfully");
      console.log("Forgot Password OTP Send Result : ", result);
    } catch (error) {
      toast.error(error?.message)
      console.log("Error in Send Forgot Password OTP :", error?.message);
    }
    setSendOtpLoading(false);
  }


  // verifying otp
  const verifyLoginOtpHandler = async () => {
    setVerifyOtpLoading(true);

    try {
      const response = await fetch(`${API_URL.auth.verifyForgotPasswordEmailOtp}`, {
        method: "POST",
        headers: {
          "otp-session": otpSession,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp_reference: otpReferenceId,
          otp_number: otp
        })
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message);
      }

      const result = await response.json();

      toast.success("Reset OTP Verified Successfully");
      navigate("/reset-password");
      console.log("Forgot Password OTP Verify Result : ", result);
    } catch (error) {
      toast.error(error?.message)
      console.log("Error in Verify Forgot password OTP :", error?.message);
    }
    setVerifyOtpLoading(false);
  }

  return (
    <div className='space-y-4 -mt-5'>
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold text-(--primary)'>Verify your identity</h2>
        <p className='text-sm text-[#424754]'>Enter your email to receive a password reset OTP.</p>
      </div>
      <div className='mb-10'>
        <div className='flex justify-between items-end gap-2 py-1'>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="Login-email" className="font-medium text-xs md:text-sm">Email Address*</label>
            <div className='flex justify-between flex-row  border border-[#CCCCCC] items-center rounded-md py-1 px-3'>
              <input
                type='text'
                value={userEmail}
                placeholder="Enter Email"
                // disabled={true}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full outline-none border-none placeholder:text-[#CCCCCC] placeholder:text-sm"
              />
            </div>
          </div>
          {
            sendOtpLoading ? (
              <div className='min-w-25 flex justify-center items-center text-xs py-2.75 px-4 rounded-md whitespace-nowrap border border-[#CCCCCC]'><CustomThreeDotsLoader /></div>
            ) : (
              <button onClick={requestOtpHandler} className='min-w-25 text-xs bg-(--primary) py-2 px-4 rounded-md text-white whitespace-nowrap'>Request OTP</button>
            )
          }
        </div>
        {
          requestedOtp && (
            <div className='space-y-4 pb-10'>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                  Enter the 6-digit code below
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className='flex justify-center items-center'>
                <OtpInput onComplete={setOtp} />
              </div>
              {
                verifyOtpLoading ? (
                  <div className={`border border-[#CCCCCC] w-full text-xs py-2.75 px-4 rounded-2xl whitespace-nowrap`}><CustomThreeDotsLoader /></div>
                ) : (
                  <button onClick={verifyLoginOtpHandler} disabled={otp.length !== 6} className={`border border-[#CCCCCC] w-full text-xs ${otp.length === 6 ? "bg-(--primary) text-white" : "text-gray-400"} py-2 px-4 rounded-2xl  whitespace-nowrap`}>Verify OTP</button>
                )
              }
            </div>
          )
        }

      </div>
    </div>
  )
}

function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < length - 1) inputs.current[index + 1].focus();
    onComplete?.(newOtp.join(""));
    // if (newOtp.every((d) => d !== "")) onComplete?.(newOtp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    const next = Math.min(pasted.length, length - 1);
    inputs.current[next].focus();
    if (newOtp.every((d) => d !== "")) onComplete?.(newOtp.join(""));
  };

  return (
    <div className="flex gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`
            w-11 h-12 text-center text-lg font-bold rounded-xl border
            bg-gray-50 text-gray-900 outline-none transition-all duration-150
            ${digit
              ? "border-gray-900 bg-white"
              : "border-gray-200"
            }
            focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10
          `}
        />
      ))}
    </div>
  );
}

export default ForgotPassword