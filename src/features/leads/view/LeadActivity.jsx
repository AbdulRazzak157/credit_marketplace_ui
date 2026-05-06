import React from 'react'
import LeadActivityLogs from './LeadActivityLogs'
import { useAuth } from '../../../context/AuthContext';
import API_URL from '../../../api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { formatSentence, normalizeSentence } from '../../../helpers';
import CustomCircleLoader from '../../../shared/CustomCircleLoader';


export function splitTimestamp(iso) {
    const d = new Date(iso);
    const date = d.toISOString().split("T")[0];
    const time = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    return { date, time };
}

function nameTagInitials(name) {
    let initials = "";
    name?.split(" ")?.forEach((str) => {
        initials += str[0];
    });

    return initials?.slice(0, 2)?.toUpperCase();
}

function formatDateOrValue(value) {
    if (typeof value !== 'string' || !Date.parse(value)) {
        if (typeof value === "boolean") {
            return String(value)
        }
        return value
    };

    const { date, time } = splitTimestamp(value);
    return `${date} ${time}`;
}

function normalizeStateChanges(beforeState, afterState) {

    const changesData = Object.keys(beforeState)?.map((key) => {
        return {
            field: normalizeSentence(key),
            oldVal: formatDateOrValue(beforeState[key]) || "-",
            newVal: formatDateOrValue(afterState[key])
        }
    });

    return changesData;
}
const LeadActivity = () => {
    const { leadId } = useParams();


    const { getAccessToken } = useAuth();
    const getLeadsActivityLogs = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.leadManagement.getLeadActivityLogs(leadId)}`, {
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
            console.log("Result from get lead Activity Logs API: ", result.response);

            const data = [];
            result.response?.forEach((record) => {

                // console.log("records : ",record);
                record?.records?.forEach((lead) => {

                    const { date, time } = splitTimestamp(lead?.createdAt || new Date())
                    const obj = {
                        id: lead?.id,
                        type: formatSentence(lead?.eventType),
                        date,
                        time,
                        actor: {
                            name: lead?.performerName,
                            role: lead?.performerRef === "EXECUTIVE" ? "STAFF" : lead?.performerRef === "SUB_ADMIN" ? "MANAGER" : "SYSTEM",
                            initials: lead?.performerRef === "SYSTEM" ? "SM" : nameTagInitials(lead?.performerName),
                            bg: "bg-amber-100",
                            text: "text-amber-800"
                        },
                        log: lead?.log,
                        changes: normalizeStateChanges(lead?.beforeState, lead?.afterState)
                    }
                    // console.log("obj : ",obj);
                    data.push(obj)
                });
            })

            console.log("Data : ", data);

            return data;

        } catch (error) {
            console.log("Error in fetch Manage Lead list : ", error?.message);
        }
    }

    const { data: leadActivityLogs, isLoading } = useQuery({
        queryKey: ["fetchLeadActivityLogs"],
        queryFn: getLeadsActivityLogs
    });
    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        );
    }
    return (
        <div>
            <LeadActivityLogs activities={leadActivityLogs} />
        </div>
    )
}

export default LeadActivity