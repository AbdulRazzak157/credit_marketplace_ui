import React from 'react'
import { BureauTab } from './BureauTab'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import API_URL from '../../../api/apiConfig'
import { useAuth } from '../../../context/AuthContext'
import CustomCircleLoader from '../../../shared/CustomCircleLoader'
import { IoRefreshCircleOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'


// ✅ helpers
const getScoreBandFromScore = (score) => {
    if (score >= 750) return "Excellent"
    if (score >= 700) return "Good"
    if (score >= 650) return "Fair"
    return "Poor"
}

const isSameMonth = (dateString) => {
    if (!dateString) return false

    const fetchedDate = new Date(dateString)
    const now = new Date()

    return (
        fetchedDate.getMonth() === now.getMonth() &&
        fetchedDate.getFullYear() === now.getFullYear()
    )
}

const LeadBureau = () => {
    const { leadId } = useParams()
    const { getAccessToken } = useAuth()
    const queryClient = useQueryClient()

    // ✅ 1. GET existing bureau report
    const fetchBureauReport = async () => {
        const token = await getAccessToken()

        const response = await fetch(`${API_URL.leadManagement.getBureauReport(leadId)}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            }
        )

        if (!response.ok) {
            if (response.status === 404) return null // ✅ no report case
            const err = await response.json()
            throw new Error(err?.message)
        }

        const result = await response.json()
        const b = result?.response

        if (!b) return null

        const reportValidDays = b?.reportValidDays ?? 30;

        const fetchedDate = b?.bureauLastUpdated
            ? new Date(b.bureauLastUpdated)
            : null;

        const nextReportDate = fetchedDate
            ? new Date(fetchedDate.getTime() + reportValidDays * 24 * 60 * 60 * 1000)
            : null;

        return {
            score: b?.bureauScore ?? 0,
            fetchedAt: fetchedDate
                ? fetchedDate.toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
                : null,
            nextReportAt: nextReportDate
                ? nextReportDate.toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
                : null,
            scoreBand: b?.scoreBand ?? null,
            eligibleLenders: b?.eligibleLenders ?? null,
            reportValidDays

        }
    }

    const { data: bureau, isLoading } = useQuery({
        queryKey: ['bureauReport', leadId],
        queryFn: fetchBureauReport,
        enabled: !!leadId,
        retry: false
    })

    // ✅ 2. Trigger new bureau fetch
    const triggerBureauFetch = async () => {
        const token = await getAccessToken()
        console.log({token})

        const response = await fetch(`${API_URL.leadManagement.getUpdateBureauReport(leadId)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err?.message)
        }

        return response.json()
    }

    const { mutate: fetchBureau, isPending: isFetching } = useMutation({
        mutationFn: triggerBureauFetch,
        onSuccess: async () => {
            // ⏳ wait for backend to generate report
            await new Promise((res) => setTimeout(res, 3000))
            queryClient.invalidateQueries(['bureauReport', leadId])
            toast.success("Fetched Bureau report")
        },
        onError: (error) => {
            toast.error(error?.message)
            console.log('Fetch error:', error?.message)
        }
    })

    const { mutate: refreshBureau, isPending: isRefreshing } = useMutation({
        mutationFn: triggerBureauFetch,
        onSuccess: async () => {
            await new Promise((res) => setTimeout(res, 2000))
            queryClient.invalidateQueries(['bureauReport', leadId])
            toast.success("Refreshed Bureau report")
        },
        onError: (error) => {
            toast.error(error?.message)
            console.log('Refreshed error:', error?.message)
        }
    })

    // ✅ Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-64">
                <CustomCircleLoader />
            </div>
        )
    }

    // ✅ Fetching / Refreshing loader
    if (isFetching || isRefreshing) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-64 gap-3">
                <CustomCircleLoader />
                <p className="text-sm text-gray-400">
                    Fetching bureau report...
                </p>
            </div>
        )
    }

    // ✅ derived values
    const score = bureau?.score ?? 0
    const scoreBand = bureau?.scoreBand ?? getScoreBandFromScore(score)
    const eligibleLenders = bureau?.eligibleLenders ?? "—"
    const reportValidDays = bureau?.reportValidDays ?? 30

    const normalizedBureau =
        bureau && score > 0
            ? {
                ...bureau,
                score,
                scoreBand,
                eligibleLenders,
                reportValidDays
            }
            : null

    const showRefresh = normalizedBureau && isSameMonth(normalizedBureau?.fetchedAt)
    console.log({ normalizedBureau })

    // ✅ UI Logic
    return (
        <div>
            {/* ✅ Case 1: Report exists */}
            {normalizedBureau && normalizedBureau?.score > 0 ? (
                <BureauTab
                    bureau={normalizedBureau}
                    onRefresh={() => refreshBureau()} // ✅ show refresh button
                />
            ) : (
                /* ✅ Case 2: No report */
                <div className="flex flex-col items-center py-10">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.6" />
                            <path d="M12 8v4M12 16h.01" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">No bureau report fetched yet</h3>
                    <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                        Bureau score hasn't been pulled for this lead yet.<br />
                        Fetch the report to check credit eligibility.
                    </p>
                    <button onClick={() => fetchBureau()}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                        <IoRefreshCircleOutline /> Fetch bureau report
                    </button>
                </div>
            )}
        </div>
    )
}

export default LeadBureau