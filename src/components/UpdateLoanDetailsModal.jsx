import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import API_URL from "../api/apiConfig";
import { toast } from "react-toastify";
import CustomThreeDotsLoader from "../shared/CustomThreeDotsLoader";
import { useEffect } from "react";


export function UpdateLoanDetailsModal({ loanDetails, refetch, onClose }) {
    const { leadId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoanAccountNumber, setLoanAccountNumber] = useState(loanDetails?.loanAccountNumber || "");
    const [isDisbursedLoanAmount, setDisbursedLoanAmount] = useState(loanDetails?.disbursedLoanAmount || "");

    const { getAccessToken } = useAuth();

    useEffect(() => {
        setLoanAccountNumber(loanDetails?.loanAccountNumber || "");
        setDisbursedLoanAmount(loanDetails?.disbursedLoanAmount || "");
    }, [loanDetails]);

    const handleUpdateLoanDetails = async () => {
        setIsLoading(true);
        console.log({
            loanAccountNumber: isLoanAccountNumber,
            disbursedLoanAmount: isDisbursedLoanAmount
        })

        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.updateLoanDetails(leadId)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loanAccountNumber: isLoanAccountNumber || loanDetails.loanAccountNumber,
                    disbursedLoanAmount: isDisbursedLoanAmount || loanDetails.disbursedLoanAmount
                })
            });
            console.log({ response })

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }

            const result = await response.json();

            console.log("Result from get Specific Lead profile API: ", result.response);

            await refetch();
            toast.success("Loan details updated...");
            onClose();
            setIsLoading(false);

        } catch (error) {
            console.log("Error updating loan details:", error?.message);
            toast.error(error?.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <span className="text-xl font-medium text-gray-900">Update loan details</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none"><Icon icon="maki:cross" width="15" height="15" /></button>
                </div>

                {/* Update Loan Details */}
                <div className="flex flex-col gap-3">

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Loan Account Number</label>
                        <input
                            type="text"
                            value={isLoanAccountNumber}
                            onChange={(e) => setLoanAccountNumber(e.target.value)}
                            placeholder="Enter loan account number"
                            className="px-3 py-2.5 rounded-lg text-sm text-gray-800 border border-gray-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Disbursed Loan Amount</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-(--primary) focus-within:ring-1 focus-within:ring-(--primary) transition-colors">
                            <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={isDisbursedLoanAmount}
                                onChange={(e) => setDisbursedLoanAmount(e.target.value)}
                                placeholder="Enter disbursed amount"
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    {
                        isLoading ? (
                            <button
                                className="w-25 border border-gray-300 px-4 py-2 text-xs font-semibold rounded-lg bg-white"
                            >
                                <CustomThreeDotsLoader />
                            </button>

                        ) : (

                            <button
                                onClick={handleUpdateLoanDetails}
                                // disabled={!loanAccountNumber && !disbursedLoanAmount}
                                // onClick={() => selected && onSaveStatus(selected)}
                                // disabled={!selected}
                                className="px-4 py-2 text-xs font-semibold rounded-lg bg-(--primary) text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Update
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}