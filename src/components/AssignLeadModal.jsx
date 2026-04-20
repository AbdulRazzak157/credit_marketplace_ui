import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import API_URL from "../api/apiConfig";
import { useAuth } from "../context/AuthContext";
import CustomCircleLoader from "../shared/CustomCircleLoader";
import { IoSearch } from "react-icons/io5";
import useDebounce from "../hooks/useDebounce";
import { toast } from "react-toastify";
import CustomThreeDotsLoader from "../shared/CustomThreeDotsLoader";

// Replace with your actual staff data or fetch from API
const STAFF = [
    { id: "STF001787652346", name: "Rahul Sharma", email: "rahul.s@co.in", mobile: "+919848011234", leads: 12, avatar: "RS", color: "#6B21A8", bg: "#F3E8FF" },
    { id: "STF002787652346", name: "Priya Menon", email: "priya.m@co.in", mobile: "+919848122345", leads: 8, avatar: "PM", color: "#0E8A3E", bg: "#E6F4ED" },
    { id: "STF003787652346", name: "Anil Kumar", email: "anil.k@co.in", mobile: "+919848233456", leads: 20, avatar: "AK", color: "#1B4FD8", bg: "#EEF2FF" },
    { id: "STF004787652346", name: "Sneha Reddy", email: "sneha.r@co.in", mobile: "+919848344567", leads: 5, avatar: "SR", color: "#B45309", bg: "#FEF3C7" },
    { id: "STF005787652346", name: "Vikram Nair", email: "vikram.n@co.in", mobile: "+919848455678", leads: 15, avatar: "VN", color: "#C0280C", bg: "#FEE8E5" },
];
export function AssignLeadModal({ currentAgentId, onAssign, onClose }) {
    const [query, setQuery] = useState("");
    const [assignReason, setAssignReason] = useState("");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const debounceReason = useDebounce(assignReason)

    const { getAccessToken } = useAuth();

    const getLeadStaffList = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.getLeadStaffList}`, {
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
            console.log("Result from get Specific Lead profile API: ", result.response);



            const colors = [
                { color: "#6B21A8", bg: "#F3E8FF" },
                { color: "#0E8A3E", bg: "#E6F4ED" },
                { color: "#1B4FD8", bg: "#EEF2FF" },
                { color: "#B45309", bg: "#FEF3C7" },
                { color: "#C0280C", bg: "#FEE8E5" },
            ]

            const data = result?.response?.executives?.map((executive, idx) => {
                const random = parseInt(Math.random() * colors.length)

                return {
                    id: executive?.id,
                    customId: executive?.customId,
                    firstName: (executive?.firstName),
                    lastName: executive?.lastName,
                    email: executive?.email,
                    mobileNumber: executive?.mobileNumber,
                    assignedLeads: executive?.assignedLeads,
                    avatar: executive?.firstName[0]?.toUpperCase() + executive?.lastName[0]?.toUpperCase(),
                    color: colors[random].color,
                    bg: colors[random].bg,
                }
            });
            return data;


        } catch (error) {
            console.log("Error in fetch lead staff list : ", error?.message);
        }
    }

    const { data: leadStaffList, isLoading } = useQuery({
        queryKey: ["fetchLeadStaffList"],
        queryFn: getLeadStaffList
    });

    const currentAgent = leadStaffList?.find((a) => a.id === currentAgentId);
    const filtered = useMemo(() => {
        const q = query.toLowerCase().replace(/\s/g, "");
        if (!q) return leadStaffList;
        return leadStaffList?.filter((a) =>
            a.firstName.toLowerCase().includes(q) ||
            a.lastName.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.mobileNumber.replace(/\s/g, "").includes(q)
        );
    }, [query, leadStaffList]);

    const selectedAgent = leadStaffList?.find((a) => a.id === selected);

    const onAssignStaffHandler = async () => {

        console.log("Assign Click")
        if (!selected) {
            toast.error("Select the Staff First");
            return;
        }
        if (!assignReason) {
            toast.error("Reason is required");
            return;
        }
        setLoading(true);

        try {

            console.log("before ")
            await onAssign(selected, debounceReason);
            console.log("after")
            // await new Promise(resolve => setTimeout(resolve, 3000));
            onClose();
            toast.success(`Lead ${currentAgentId ? 'Reassigned' : 'Assigned'} Successfully`)
        } catch (error) {
            console.log("Error in Assign Staff : ", error?.message);
            toast.error(error?.message);
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            {
                isLoading ? (
                    <div className='flex justify-center items-center bg-white rounded-2xl h-screen md:h-125 border border-gray-200 w-full max-w-md p-6 shadow-lg'>
                        <CustomCircleLoader />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md p-6 shadow-lg">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-sm font-medium text-gray-900">Assign agent</span>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                        </div>

                        {/* Current assignment banner */}
                        {currentAgent && (
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-4"
                                style={{ background: "#EEF2FF", border: "1px solid #3B72F640" }}>
                                <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                    style={{ background: currentAgent.bg, color: currentAgent.color }}>
                                    {currentAgent.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-medium tracking-widest uppercase mb-0.5" style={{ color: "#94a3b8" }}>
                                        Currently assigned
                                    </p>
                                    <p className="text-sm font-medium truncate capitalize" style={{ color: "#1B4FD8" }}>
                                        {currentAgent.firstName + " " + currentAgent?.lastName}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 text-xs" style={{ color: "#64748b" }}>
                                    {currentAgent.customId}<br />
                                    <span>{currentAgent.assignedLeads} leads</span>
                                </div>
                            </div>
                        )}

                        {/* Search */}
                        <div className="relative mb-3">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, ID, email or mobile..."
                                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* List */}
                        <div>
                            <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                                Staff members
                            </p>
                            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
                                {filtered.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 py-6">No staff found</p>
                                ) : (
                                    filtered.map((a) => {
                                        const isCurrent = a.id === currentAgentId;
                                        const isSel = a.id === selected;
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => !isCurrent && setSelected(isSel ? null : a.id)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
                                                style={{
                                                    border: `1.5px solid ${isSel ? a.color + "50" : isCurrent ? "#3B72F640" : "#e5e7eb"}`,
                                                    background: isSel ? a.bg : isCurrent ? "#EEF2FF" : "white",
                                                    cursor: isCurrent ? "default" : "pointer",
                                                }}
                                            >
                                                <div className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                                    style={{ background: a.bg, color: a.color }}>
                                                    {a.avatar}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="text-sm font-medium text-gray-900 capitalize">{a.firstName + " " + a.lastName}</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                                                            {a.customId}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                                                style={{ background: "#DBEAFE", color: "#1B4FD8", border: "0.5px solid #3B72F640" }}>
                                                                current
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                                        {a.email} · {a.mobileNumber}
                                                    </div>
                                                </div>

                                                <div className="text-right flex-shrink-0 mr-1">
                                                    <div className="text-sm font-medium text-gray-800">{a.assignedLeads}</div>
                                                    <div className="text-[10px] text-gray-400">leads</div>
                                                </div>

                                                {!isCurrent && (
                                                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ background: isSel ? "#2563EB" : "transparent", border: isSel ? "none" : "1.5px solid #d1d5db" }}>
                                                        {isSel && (
                                                            <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                                                                <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className='flex flex-col gap-2 py-4'>
                                <label htmlFor="search" className="text-[#232323] text-sm">Enter Reason*</label>
                                <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 max-sm:w-full">
                                    <IoSearch className="text-[#707B8F]"
                                    />
                                    <input
                                        type="text"
                                        value={assignReason}
                                        onChange={(e) => setAssignReason(e.target.value)}
                                        className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                                        placeholder="Ex: Assigning to a staff member"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reassigning to */}
                        {selectedAgent && (
                            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-1.5">
                                    Reassigning to
                                </p>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                        style={{ background: selectedAgent.bg, color: selectedAgent.color }}>
                                        {selectedAgent.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 capitalize">{selectedAgent.firstName + " " + selectedAgent?.lastName}</div>
                                        <div className="text-[11px] text-gray-400">{selectedAgent.customId} · {selectedAgent.assignedLeads} leads assigned</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            {
                                loading ? (
                                    <button
                                        className="w-25 border border-gray-300 px-4 py-2 text-xs font-semibold rounded-lg bg-white"
                                    >
                                        <CustomThreeDotsLoader />
                                    </button>

                                ) : (

                                    <button
                                        onClick={onAssignStaffHandler}
                                        disabled={!selected}
                                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-(--primary) text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {currentAgentId ? "Assign Staff" : "Reassign Staff"}
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
}