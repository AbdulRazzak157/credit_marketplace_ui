import React, { useEffect, useState } from 'react'
import NavigationHeadline from '../../components/NavigationHeadline'
import ManageLeadCard from '../manageLeads/ManageLeadCard'
import { Icon } from '@iconify/react'
import { IoSearch } from 'react-icons/io5'
import DataTableBase from '../../components/DataTableBase'
import { leadStatusColors, normalizeSentence, truncateString } from '../../helpers'
import moment from 'moment'
import ActionButton from '../../components/buttons/ActionButton'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API_URL from '../../api/apiConfig'
import { useQuery } from '@tanstack/react-query'
import CustomCircleLoader from '../../shared/CustomCircleLoader'
import useDebounce from '../../hooks/useDebounce'

const StaffView = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchKey, setSearchKey] = useState("");
    const debouncedSearch = useDebounce(searchKey);


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


    const getSpecificStaffLeads = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.staffManagement.getSpecificStaffLeads(id)}?page=${currentPage}&limit=${rowsPerPage}&leadId=${debouncedSearch}`, {
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
            console.log("Result from getSpecificStaff Leads API: ", result.response);

            const leads = result?.response?.leads?.map((lead) => {


                return {
                    id: lead?.id,
                    dob: lead?.dateOfBirth,
                    leadId: lead?.leadId,
                    fullName: lead?.fullName,
                    email: lead?.email,
                    mobileNumber: lead?.mobileNumber,
                    dateOfBirth: lead?.dateOfBirth,
                    requestedLoanAmount: lead?.requestedLoanAmount,
                    panNumber: lead?.panNumber,
                    status: lead?.status,
                    lenderId: lead?.lender?.customId || "",
                    lenderProductId: lead?.product?.customId || ""
                }
            });
            const data = {
                leads,
                totalLeads: result.response?.totalLeads
            }

            return data;
        } catch (error) {
            console.log("Error in fetch specific staff leads : ", error?.message);
        }
    }

    const { data: staffLeadsData, isLoading: isLoading2 } = useQuery({
        queryKey: ["getSpecificStaffLeads", id, currentPage, rowsPerPage, debouncedSearch],
        queryFn: getSpecificStaffLeads,
        enabled: !!id,
    });

    const getSpecificDetailsAndStatCards = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.staffManagement.getSpecificStaff(id)}?page=${currentPage}&limit=${rowsPerPage}`, {
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
            console.log("Result from getSpecificStaff API: ", result.response);

            const staffData = {
                id: result?.response?.id,
                staffId: result?.response?.customId,
                firstName: result?.response?.firstName,
                lastName: result?.response?.lastName,
                email: result?.response?.email,
                mobileNumber: result?.response?.mobileNumber,
                status: result?.response?.isActive ? "Active" : "Inactive",
                totalLeads: result?.response?.statusCards?.total || 0,
                newLeads: result?.response?.statusCards?.new || 0,
                inReviewLeads: result?.response?.statusCards?.inReview || 0,
                approvedLeads: result?.response?.statusCards?.approved || 0,
                rejectedLeads: result?.response?.statusCards?.rejected || 0,
                disbursedLeads: result?.response?.statusCards?.disbursed || 0,
            }

            return staffData;
        } catch (error) {
            console.log("Error in fetch specific staff details and cards : ", error?.message);
        }
    }

    const { data: staffDetails, isLoading } = useQuery({
        queryKey: ["getSpecificStaffStatCards", id],
        queryFn: getSpecificDetailsAndStatCards,
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        )
    }


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(page);
    };


    const columns = [
        {
            name: "Sl.No",
            selector: (row, index) => (
                <div >
                    {index + 1}
                </div>
            ),
            center: "true",
            width: "70px"
        },
        {
            name: "Lead ID",
            selector: (row) => (
                <div className='text-sm text-blue-600 underline cursor-pointer' title="LD-PL-WEB-20260311-46B589BD">
                    {row?.leadId}
                </div>
            ),
            center: "true",
            width: "250px"
        },
        {
            name: "Customer Details",
            selector: (row) => (
                <div className='flex flex-col items-start py-4'>
                    <div className='text-sm font-semibold text-(--primary)' title={`${row?.firstName} ${row?.lastName}`}>{truncateString(row?.fullName)}</div>
                    <div className='flex flex-col'>
                        <div className='text-xs text-gray-600 font-medium'>{row?.mobileNumber}</div>
                        <div className='text-xs text-gray-600 font-medium'>{row?.email}</div>
                    </div>
                </div>
            ),
            // center: "true",
            width: "250px"
        },
        {
            name: "Date Of Birth",
            selector: (row) => (
                <div className='text-sm font-medium text-(--primary)'>
                    {moment(row?.dob || new Date()).format("DD/MM/YYYY")}
                </div>
            ),
            center: "true",
            width: "130px"
        },
        {
            name: "Requested Loan Amount",
            selector: (row) => (
                <div className='text-sm font-medium text-(--primary)'>
                    ₹ {row?.requestedLoanAmount}
                </div>
            ),
            center: "true",
            width: "200px"
        },
        {
            name: "PAN Number",
            selector: (row) => (
                <div className='text-sm font-medium text-(--primary)'>
                    {row?.panNumber}
                </div>
            ),
            center: "true",
            width: "130px"
        },
        {
            name: "Lender ID",
            selector: (row) => (

                <div className={`text-sm ${row?.lenderId && "text-blue-600 underline cursor-pointer"} `} title="LDR334455555515" >
                    {row?.lenderId || "N/A"}
                </div >
            ),
            center: "true",
            width: "220px"
        },
        {
            name: "Lender Product ID",
            selector: (row) => (
                <div className={`text-sm ${row?.lenderProductId && "text-blue-600 underline cursor-pointer"} `} title="LPR-PL-20260312-29D9F71D">
                    {row?.lenderProductId || "N/A"}
                </div>
            ),
            center: "true",
            width: "250px"
        },
        {
            name: "Action",
            selector: (row) => (
                <div className={`capitalize px-4 py-1 rounded-md text-xs font-medium ${row?.status && leadStatusColors[row?.status].bg} ${row?.action && leadStatusColors[row?.status].text}`}>
                    {row?.status ? normalizeSentence(row?.status) : "-"}
                </div>
            ),
            width: "150px",
            center: "true"
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-5 items-center ">
                    <Link to={`view/${row?.leadId}`}>
                        <ActionButton type="view" />
                    </Link>
                </div>
            ),
            width: "150px",
            center: "true",
        },
    ]

    return (
        <div className='flex flex-col gap-6'>
            <NavigationHeadline content="Staff Details" to="/staff" />
            <div className='bg-white flex justify-between items-center gap-4 max-md:divide-y-2 md:divide-x-2 divide-[#B4B4B4] px-2 py-4 sm:px-4 sm:py-6 xl:px-6 rounded-md font-medium'>
                <div className='flex flex-col justify-center items-between gap-2 w-full max-sm:py-4 pr-4'>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="staffId" className='text-[#64748B]'>Staff ID</label>
                        <div className='text-base'>{staffDetails?.staffId}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="staffLastName" className='text-[#64748B]'>Status</label>
                        <div className='text-green-600'>{staffDetails?.status}</div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-between gap-2 w-full max-sm:py-4 pr-4'>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="StaffFirstName" className='text-[#64748B]'>First Name</label>
                        <div className='text-base'>{staffDetails?.firstName}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="staffLastName" className='text-[#64748B]'>Last Name</label>
                        <div className='text-base'>{staffDetails?.lastName}</div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-between gap-2 w-full max-sm:py-4 pr-4'>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="staffId" className='text-[#64748B]'>Email</label>
                        <div className=''>{staffDetails?.email}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="StaffFirstName" className='text-[#64748B]'>Mobile Number</label>
                        <div className=''>{staffDetails?.mobileNumber}</div>
                    </div>
                </div>
            </div>
            <div className='rounded-md grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                <ManageLeadCard value={staffDetails?.totalLeads} bgColor="bg-(--primary)" icon={<Icon icon="carbon:application" width="24" height="24" />} label="Total Leads" />
                <ManageLeadCard value={staffDetails?.newLeads} bgColor="bg-blue-900" icon={<Icon icon="simple-icons:googleads" width="24" height="24" />} label="New Leads" />
                <ManageLeadCard value={staffDetails?.inReviewLeads} bgColor="bg-green-600" icon={<Icon icon="qlementine-icons:preview-16" width="16" height="16" />} label="In Review" />
                <ManageLeadCard value={staffDetails?.approvedLeads} bgColor="bg-[#4DB0FF]" icon={<Icon icon="tdesign:user-checked-filled" width="24" height="24" />} label="Approved" />
                <ManageLeadCard value={staffDetails?.rejectedLeads} bgColor="bg-[linear-gradient(180deg,_#FFA500_0%,_#EF4444_100%)]" icon={<Icon icon="fluent:person-error-20-regular" width="20" height="20" />} label="Rejected" />
                <ManageLeadCard value={staffDetails?.disbursedLeads} bgColor="bg-[#10B981]" icon={<Icon icon="tabler:transaction-rupee" width="24" height="24" />} label="Disbursed" />
            </div>
            <div className='bg-white flex flex-col gap-8 rounded-md px-2 py-4 sm:px-4 sm:py-6 xl:py-6'>
                <div className=''>
                    <div className='flex flex-col gap-2 '>
                        <label htmlFor="search" className="text-[#232323] text-sm">Search ID </label>
                        <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 max-sm:w-full">
                            <IoSearch className="text-[#707B8F]"
                            />
                            <input
                                type="text"
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value)}
                                className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                                placeholder="Eg: LD-PL-APP-20260325-AC4C89BF"
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-xl text(--primary) font-semibold'>Staff Leads</h2>
                    <DataTableBase
                        columns={columns}
                        data={staffLeadsData?.leads || []}
                        progressPending={isLoading2}
                        pagination
                        paginationServer
                        paginationPerPage={10}
                        paginationTotalRows={staffLeadsData?.leads?.length}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default StaffView