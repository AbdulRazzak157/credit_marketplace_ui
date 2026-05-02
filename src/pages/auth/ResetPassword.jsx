import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../shared/ErrorMessage";
import CustomThreeDotsLoader from "../../shared/CustomThreeDotsLoader";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../api/apiConfig";

const requirements = [
    { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "uppercase", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lowercase", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
    { id: "symbol", label: "One special character (!@#$)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const EyeIcon = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {open ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

const CheckIcon = ({ passed }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="6"
            fill={passed ? "#639922" : "currentColor"}
            opacity={passed ? 0.15 : 0.08} />
        {passed ? (
            <path d="M3 6l2 2 4-4" stroke="#639922" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
        ) : (
            <path d="M4 4l4 4M8 4l-4 4" stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" />
        )}
    </svg>
);

const PasswordInput = ({ label, value, onChange, show, onToggle, error }) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={label} className="text-gray-600 text-sm">
            {label}
        </label>
        <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-2 rounded-md">
            <input
                type={show ? "text" : "password"}
                placeholder={label}
                value={value}
                onChange={onChange}
                className="outline-none border-none grow placeholder:text-[#CCCCCC]"
            />
            <div
                className="text-[1.2rem] cursor-pointer"
                onClick={onToggle}
            >
                {show ? (
                    <FaEye className="text-gray-400 text-[1.5rem]" />
                ) : (
                    <IoMdEyeOff className="text-gray-400 text-[1.5rem]" />
                )}
            </div>
        </div>
        {error && <ErrorMessage message={error} />}
    </div>
);

const ResetPassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(true);

    const { otpSession } = useAuth();

    // useEffect(() => {
    //     if (!otpSession) {
    //         navigate("/forgot-password");
    //     }
    // }, [otpSession, navigate]);

    // if (!otpSession) return null;

    // Evaluate each requirement live
    const results = requirements.map((r) => ({ ...r, passed: r.test(password) }));
    const allPassed = results.every((r) => r.passed);

    // Errors shown only after first submit attempt
    const passwordError = submitted && !allPassed
        ? "Password does not meet all requirements." : "";
    const confirmError = submitted && password !== confirm
        ? "Passwords do not match." : "";



    const handleSubmit = async () => {
        setSubmitted(true);
        if (!allPassed || password !== confirm) {
            setSubmitted(false);
            return;
        };
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            // const response = await fetch(`${API_URL.auth.sendLoginOTP}`, {
            //     method: "POST",
            //     headers: {
            //         "otp-session": otpSession,
            //         "Content-Type": "application/json",
            //     },
            //     body:JSON.stringify({

            //     })
            // });
            // if (!response.ok) {
            //     const errorResult = await response.json();
            //     throw new Error(errorResult?.message);
            // }
            // const result = await response.json();
            // console.log("Result of Reset Password : ",result);
            setSuccess(true);
        } catch (error) {
            console.log("Error in Reset Password : ", error?.message);
        }
        setSubmitted(false)
    };

    if (success) {
        return (
            <div>
                <div className="text-center py-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="#639922" strokeWidth="2.2" strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1.5">
                        Password reset successful
                    </p>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            <p className="text-xl font-semibold mb-1.5">Set a new password</p>
            <p className="text-sm text-[#424754]">
                Choose a strong password you haven't used before.
            </p>

            <PasswordInput
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
                error={passwordError}
            />

            {/* Live requirements checklist */}
            <div className="mb-4 px-3 py-2.5 ">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                    Password requirements
                </p>
                <div className="flex flex-col gap-1">
                    {results.map((r) => (
                        <div
                            key={r.id}
                            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${r.passed ? "text-green-800" : "text-gray-400"}`}
                        >
                            <CheckIcon passed={r.passed} />
                            {r.label}
                        </div>
                    ))}
                </div>
            </div>

            <PasswordInput
                label="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                show={showConfirm}
                onToggle={() => setShowConfirm((p) => !p)}
                error={confirmError}
            />

            {
                submitted ? (
                    <div className={`border border-[#CCCCCC] w-full text-xs py-2.75 px-4 rounded-2xl whitespace-nowrap`}><CustomThreeDotsLoader /></div>
                ) : (
                    <button onClick={handleSubmit} disabled={password.length === 0 || confirm.length === 0} className={`border border-[#CCCCCC] w-full text-xs ${password.length !== 0 && confirm.length !== 0 ? "bg-(--primary) text-white" : "text-gray-400 cursor-default"} py-2 px-4 rounded-2xl  whitespace-nowrap`}>Reset Password</button>
                )
            }

            <p className="text-center text-xs text-gray-400 mb-10">
                Remembered it?{" "}
                <span
                    onClick={() => navigate("/login")}
                    className="text-gray-900 font-medium cursor-pointer hover:underline"
                >
                    Back to login
                </span>
            </p>
        </div>
    );
};

export default ResetPassword;