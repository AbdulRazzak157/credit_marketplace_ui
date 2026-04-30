import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom'
import NavigationHeadline from '../../../components/NavigationHeadline'
import { Icon } from '@iconify/react'
import { LeadSource, LeadStatus } from '../../../components/LeadStatus'
import { UpdateLeadStatusModal } from '../../../components/UpdateLeadStatusModal'
import { AssignLeadModal } from '../../../components/AssignLeadModal'
import { useQuery } from '@tanstack/react-query'
import API_URL from '../../../api/apiConfig'
import { useAuth } from '../../../context/AuthContext'
import CustomCircleLoader from '../../../shared/CustomCircleLoader'
import { normalizeSentence } from '../../../helpers'

const LeadOverviewParent = () => {
    const { leadId } = useParams();
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const formatPhone = (p) => p.replace(/^\+(\d{2})(\d{5})(\d{5})$/, '+$1 $2 $3');

    formatPhone('+919848485853');

    const { getAccessToken } = useAuth();

    const mainRef = useOutletContext();
    useEffect(() => {
        console.log("mainRef : ", mainRef?.current, mainRef);
        if (mainRef?.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [])

    const getLenderList = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.getSpecificLeadProfile(leadId)}`, {
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

            const lead = result?.response;
            const sources = {
                picApp: "IN_APP",
                picAgent: "PIC_AGENT",
                referral: "REFERRAL",
                store: "STORE",
                website: "WEB"
            }
            const data = {
                id: lead?.id,
                customId: lead?.customId,
                firstName: lead?.firstName,
                lastName: lead?.lastName,
                email: lead?.email,
                mobileNumber: lead?.mobileNumber,
                status: lead?.status,
                assignedStaffId: lead?.executiveId,
                sourceChannel: sources[lead?.sourceChannel],
            }
            return data;


        } catch (error) {
            console.log("Error in fetch specific Lead profile : ", error?.message);
        }
    }

    const { data: leadData, refetch, isLoading } = useQuery({
        queryKey: ["fetchSpecificLeadProfile"],
        queryFn: getLenderList
    });

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        )
    }

    const onAssignStaffMember = async (staffId, reason) => {
        console.log("Test : ")
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.assignLeadToStaff(leadId)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    executiveId: staffId,
                    reason,
                })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }
            const result = await response.json();
            await refetch();
            console.log("result : ", result);
        } catch (error) {
            console.log("Error in Assign to staff member : ", error?.message);
            throw error;
        }
    }
    return (
        <div className='space-y-4'>
            <NavigationHeadline content="Back" to="/leads" />

            <div className='bg-white px-2 py-4 sm:px-8 flex flex-col gap-6 rounded-md'>
                <div className='space-y-2'>
                    <div className='flex flex-col justify-center items-between md:justify-between md:flex-row md:items-center gap-4'>
                        <div className='flex items-center gap-x-4 gap-y-1.5'>
                            <h2 className='text-2xl font-bold text-(--primary)'>{normalizeSentence(`${leadData?.firstName} ${leadData?.lastName}`)}</h2>
                            <LeadStatus status={leadData?.status} />
                            <LeadSource source={leadData?.sourceChannel} />
                        </div>
                        <div className='flex items-center gap-2'>
                            {leadData.status !== "DISBURSED" &&
                                <>
                                    <div onClick={() => setIsStatusModalOpen(true)} className='flex items-center gap-x-1.5 py-1 px-3 rounded-lg bg-gray-100 border border-gray-300 cursor-pointer'>
                                        <Icon icon="lets-icons:edit-fill" width="16" height="16" />
                                        <span className='text-xs font-semibold text-[#232323]'>Update Status</span>
                                    </div>
                                    <div onClick={() => setIsAssignModalOpen(true)} className='flex items-center gap-x-1.5 py-1 px-3 rounded-lg bg-(--primary) cursor-pointer'>
                                        <span className='text-white'>
                                            <Icon icon="mynaui:user-solid" width="13" height="13" />
                                        </span>
                                        <span className='text-xs font-semibold  text-white'>Assign</span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='text-xs text-gray-400'>{leadData?.customId}</div>
                        <span className="min-w-1 min-h-1 rounded-full bg-gray-500" />
                        <div className='text-xs text-gray-400'>{leadData?.email}</div>
                        <span className="min-w-1 min-h-1 rounded-full bg-gray-500" />
                        <div className='text-xs text-gray-400'>{formatPhone(leadData?.mobileNumber)}</div>
                    </div>
                </div>
                <section>
                    <div className='border-b  border-gray-400 flex gap-x-8 text-xs whitespace-nowrap max-sm:overflow-x-scroll sm:text-lg'>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to=""
                            end
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="bureau"
                            end
                        >
                            Bureau
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="products"
                            end
                        >
                            Lenders
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => `font-bold border-b-2 pb-1 ${isActive ? "text-(--primary) border-(--primary)" : "text-gray-500 border-transparent"}`}
                            to="activity"
                            end
                        >
                            Activity
                        </NavLink>
                    </div>
                    {/* <hr className='border-b  border-gray-300'/> */}
                </section>
                <div>
                    <Outlet />
                </div>
                {
                    isStatusModalOpen && (
                        <UpdateLeadStatusModal refetch={refetch} currentStatus={leadData?.status} onClose={() => setIsStatusModalOpen(false)} />
                    )
                }
                {
                    isAssignModalOpen && (
                        <AssignLeadModal refetch={refetch} currentAgentId={leadData?.assignedStaffId} onAssign={onAssignStaffMember} onClose={() => setIsAssignModalOpen(false)} />
                    )
                }
            </div>
        </div>
    )
}

export default LeadOverviewParent