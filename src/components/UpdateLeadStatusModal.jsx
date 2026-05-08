import { Icon } from "@iconify/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api/apiConfig";
import CustomThreeDotsLoader from "../shared/CustomThreeDotsLoader";

const STATUS_COLORS = {
    NEW: { label: "New", color: "#6B21A8", bg: "#F3E8FF", dot: "#9333EA" },
    IN_REVIEW: { label: "Under Review", color: "#1B4FD8", bg: "#EEF2FF", dot: "#3B72F6" },
    REJECTED: { label: "Rejected", color: "#C0280C", bg: "#FEE8E5", dot: "#DC2626" },
    DISBURSED: { label: "Disbursed", color: "#0E8A3E", bg: "#E6F4ED", dot: "#12A84C" },
};

function StatusBadge({ statusKey }) {
    const c = STATUS_COLORS[statusKey];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}28` }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
            {c.label}
        </span>
    );
}

export function UpdateLeadStatusModal({ currentStatus, refetch, onClose }) {
    const { leadId } = useParams();
    console.log("id: ", leadId);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(null);

    const { getAccessToken } = useAuth();

    const onSaveStatus = async () => {
        if (!selected) {
            toast.error("Status is required");
            return;
        }
        setIsLoading(true);
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.updateLeadStatus(leadId)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: selected?.toUpperCase() })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.response?.message);
            }
            const result = await response.json();

            console.log("Result from get Specific Lead profile API: ", result.response);

            await refetch();
            toast.success("Status Updated Successfully");
            onClose();
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.message);
            console.log("Error in Update Status Modal : ", error?.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <span className="text-sm font-medium text-gray-900">Update lead status</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none"><Icon icon="maki:cross" width="15" height="15" /></button>
                </div>

                {/* Current status */}
                <div className="mb-4">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                        Current status
                    </p>
                    <StatusBadge statusKey={currentStatus} />
                </div>

                {/* Select new status */}
                <div>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                        Select new status
                    </p>
                    <div className="flex flex-col gap-1.5">
                        {Object.entries(STATUS_COLORS).map(([key, c]) => {
                            const isCurrent = key === currentStatus;
                            const isSelected = key === selected;
                            return (
                                <div
                                    key={key}
                                    onClick={() => !isCurrent && setSelected(key)}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors"
                                    style={{
                                        border: `1.5px solid ${isSelected ? c.dot : "#e5e7eb"}`,
                                        background: isSelected ? c.bg : "white",
                                        cursor: isCurrent ? "default" : "pointer",
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                                        <span
                                            className="text-sm"
                                            style={{ color: isSelected ? c.color : "#111827", fontWeight: isSelected ? 500 : 400 }}
                                        >
                                            {c.label}
                                        </span>
                                    </span>
                                    {isCurrent && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                                            current
                                        </span>
                                    )}
                                </div>
                            );
                        })}
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
                                onClick={() => selected && onSaveStatus(selected)}
                                disabled={!selected}
                                className="px-4 py-2 text-xs font-semibold rounded-lg bg-(--primary) text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Save Status
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}