import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import API_URL from "../api/apiConfig";
import { toast } from "react-toastify";
import CustomThreeDotsLoader from "../shared/CustomThreeDotsLoader";
import { useEffect } from "react";


export function UpdateRemarkDetailsModal({ remarkDetails, refetch, onClose }) {
    const { leadId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isNotes, setNotes] = useState(remarkDetails?.notes || "");
    const [isComments, setComments] = useState(remarkDetails?.comments || "");

    const { getAccessToken } = useAuth();

    useEffect(() => {
        setNotes(remarkDetails?.notes || "");
        setComments(remarkDetails?.comments || "");
    }, [remarkDetails]);

    const handleUpdateRemarkDetails = async () => {
        setIsLoading(true);
        console.log({
            notes: isNotes,
            comments: isComments
        })

        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.updateRemarkDetails(leadId)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notes: isNotes || remarkDetails.notes,
                    comments: isComments || remarkDetails.comments
                })
            });
            console.log({ response })

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }

            const result = await response.json();

            console.log("Result: ", result.response);

            await refetch();
            toast.success("Remark details updated...");
            onClose();
            setIsLoading(false);

        } catch (error) {
            console.log("Error updating remark details:", error?.message);
            toast.error(error?.message);
            setIsLoading(false);
        }
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <span className="text-xl font-medium text-gray-900">Update remark details</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none"><Icon icon="maki:cross" width="15" height="15" /></button>
                </div>

                {/* Update Loan Details */}
                <div className="flex flex-col gap-3">

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Notes</label>
                        <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
                            <textarea
                                className='w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-(--primary) focus:border-(--primary)'
                                rows={4}
                                type="text"
                                value={isNotes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder='Enter notes...'
                                defaultValue={remarkDetails?.notes ?? ''}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Comments</label>
                        <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
                            <textarea
                                className='w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-(--primary) focus:border-(--primary)'
                                rows={5}
                                type="text"
                                value={isComments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder='Enter comments...'
                                defaultValue={remarkDetails?.comments ?? ''}
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
                                onClick={handleUpdateRemarkDetails}
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