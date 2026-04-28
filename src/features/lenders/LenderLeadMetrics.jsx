import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import { Icon } from "@iconify/react";
import ManageLeadCard from "../manageLeads/ManageLeadCard";

const LenderLeadMetrics = () => {
    const { id } = useParams();
    const [lenderUuid, setLenderUuid] = useState('')
    const { getAccessToken } = useAuth();

    const getLenderLeadMetrics = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getlenderLeadMetrics(lenderUuid)}`, {
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
            const leads = result?.response;

            const data = {
                totalLeads: leads?.totalLeads,
                new: leads?.new,
                inReview: leads?.inReview,
                rejected: leads?.rejected,
                disbursed: leads?.disbursed,
                disbursedAmount: leads?.disbursedAmount,
            }
            return data;

        } catch (error) {
            console.log("Error in fetch specific lender : ", error?.message);
        }
    }

    const { data: leadDetails, isLoading } = useQuery({
        queryKey: ["fetchLenderLeadMetrics", lenderUuid],
        queryFn: getLenderLeadMetrics,
        enabled: !!lenderUuid,
    });

    const getLender = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getLenderOverview(id)}`, {
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
            const lender = result?.response;
            setLenderUuid(lender?.id)

        } catch (error) {
            console.log("Error in fetch specific lender : ", error?.message);
        }
    }

    useEffect(() => {
        getLender()
    }, [])

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>

                <ManageLeadCard
                    value={leadDetails?.totalLeads}
                    bgColor="bg-(--primary)"
                    icon={<Icon icon="carbon:application" width="24" />}
                    label="Total Leads"
                />

                <ManageLeadCard
                    value={leadDetails?.new}
                    bgColor="bg-blue-600"
                    icon={<Icon icon="mdi:new-box" width="20" />}
                    label="New"
                />

                <ManageLeadCard
                    value={leadDetails?.inReview}
                    bgColor="bg-yellow-500"
                    icon={<Icon icon="qlementine-icons:preview-16" width="16" />}
                    label="In Review"
                />

                <ManageLeadCard
                    value={leadDetails?.rejected}
                    bgColor="bg-gradient-to-r from-orange-500 to-red-500"
                    icon={<Icon icon="fluent:person-error-20-regular" width="20" />}
                    label="Rejected"
                />

                <ManageLeadCard
                    value={leadDetails?.disbursed}
                    bgColor="bg-green-600"
                    icon={<Icon icon="tabler:transaction-rupee" width="24" />}
                    label="Disbursed"
                />

                <ManageLeadCard
                    value={`₹${leadDetails?.disbursedAmount}`}
                    bgColor="bg-emerald-600"
                    icon={<Icon icon="ic:baseline-currency-rupee" width="24" />}
                    label="Disbursed Amount"
                />

            </div>
        </div>
    )
}

export default LenderLeadMetrics