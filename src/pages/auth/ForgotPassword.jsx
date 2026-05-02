// import React from 'react'

// const ForgotPassword = () => {
//   return (
//     <div>Forgot Password</div>
//   )
// }

// export default ForgotPassword

import { Icon } from '@iconify/react'
import React, { useState } from 'react'

const ForgotPassword = () => {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)

  // 🔹 Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) return alert("Enter email")

    setLoading(true)
    try {
      // 🔗 API CALL
      // await fetch('/send-otp', { method: 'POST', body: JSON.stringify({ email }) })

      console.log("OTP sent to:", email)
      setStep(2)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter valid 6 digit OTP")

    setLoading(true)
    try {
      // 🔗 API CALL
      // await fetch('/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) })

      console.log("OTP verified")
      setStep(3)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Fill all fields")
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match")
    }

    setLoading(true)
    try {
      // 🔗 API CALL
      // await fetch('/reset-password', {
      //     method: 'POST',
      //     body: JSON.stringify({ email, newPassword })
      // })

      console.log("Password updated")
      alert("Password reset successful")
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-100 bg-gray-100 rounded-xl">

        {/* STEP 1: EMAIL */}
        {step === 1 && (

          <>
          <div className="space-y-5">

            {/* HEADER WITH BACK */}
            <div className="flex flex-col">
        
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 text-gray-500 mb-8 hover:text-gray-700"
              >
                <Icon icon="mdi:chevron-left" width="20" />
                <span className="text-base font-medium">Back</span>
              </button>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Email Address
                </h2>
                <p className="text-sm text-gray-500">
                  Enter your registered email to receive OTP
                </p>
              </div>
            </div>

            {/* INPUT */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                📧
              </span>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition 
        ${loading || !email
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
                }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </div>
        </>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </>
        )}

    </div>
  )
}

export default ForgotPassword