import React from 'react'
import LeadActivityLogs from './LeadActivityLogs'
import { useAuth } from '../../../context/AuthContext';
import API_URL from '../../../api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { formatSentence, normalizeSentence } from '../../../helpers';


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

            const data = result.response?.records?.map((lead) => {
                //                 {
                //     "id": "b816f74c-5846-4337-89eb-ce76fda1c74b",
                //     "leadId": "75a4d4d8-066a-4eca-9ca5-8a5fcfe60c2c",
                //     "eventType": "CAPTURING",
                //     "action": "CREATE_LEAD",
                //     "beforeState": {
                //         "name": "",
                //         "email": "",
                //         "created_at": "",
                //         "mobile_number": ""
                //     },
                //     "afterState": {
                //         "name": "Kiran Rao",
                //         "email": "kiran.rao92@gmail.com",
                //         "created_at": "2026-05-04T06:20:20.139Z",
                //         "mobile_number": "+919123456780"
                //     },
                //     "performerId": null,
                //     "performerRef": "SYSTEM",
                //     "log": "Lead captured from the source picApp ",
                //     "requestId": "d94db5b1-cd2a-45dd-9bee-841ab19804e7",
                //     "createdAt": "2026-05-04T06:20:21.975Z",
                //     "updatedAt": "2026-05-04T06:20:21.975Z"
                // },
                //                   {
                //     id: 1, type: "reassign", date: "2026-04-28", time: "10:42 AM",
                //     actor: { name: "Ravi Patel", role: "Manager", initials: "RP", bg: "bg-amber-100", text: "text-amber-800" },
                //     log: "Specialist required",
                //     changes: [{ field: "Assigned staff", oldVal: "Anjali Sharma", newVal: "Kiran Mehta" }],
                //   },
                const { date, time } = splitTimestamp(lead?.createdAt || new Date())
                return {
                    id: lead?.id,
                    type: formatSentence(lead?.eventType),
                    date,
                    time,
                    actor: {
                        name: ""
                    }
                }
            });


            return [];

        } catch (error) {
            console.log("Error in fetch Manage Lead list : ", error?.message);
        }
    }

    const { data: leadActivityLogs, isLoading } = useQuery({
        queryKey: ["fetchLeadActivityLogs"],
        queryFn: getLeadsActivityLogs
    });
    return (
        <div>
            <LeadActivityLogs />
        </div>
    )
}

export default LeadActivity