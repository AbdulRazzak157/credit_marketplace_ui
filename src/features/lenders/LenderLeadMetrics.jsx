import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import { Icon } from "@iconify/react";
import ManageLeadCard from "../manageLeads/ManageLeadCard";
import useDebounce from '../../hooks/useDebounce';
import ActionButton from '../../components/buttons/ActionButton';
import { LeadStatus } from '../../components/LeadStatus';
import moment from 'moment';
import { formatINR, formatINRShort, formatSentence, normalizeSentence, truncateString } from '../../helpers';
import { IoSearch } from 'react-icons/io5';
import DataTableBase from '../../components/DataTableBase';
import { getBureauScoreColor } from '../../shared/utils';
import * as XLSX from "xlsx";
import { toast } from 'react-toastify';

const LenderLeadMetrics = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchKey, setSearchKey] = useState("");
    const debouncedSearch = useDebounce(searchKey);
    const { getAccessToken } = useAuth();

    const getLenderLeadMetrics = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getlenderLeadMetrics(id)}`, {
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
        queryKey: ["fetchLenderLeadMetrics", id],
        queryFn: getLenderLeadMetrics,
        enabled: !!id,
    });

    const getSpecificLenderLeads = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getSpecificLenderLeads(id)}?search=${debouncedSearch || ""}`, {
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
                lenderLegalEntityName: leads?.lenderLegalEntityName,
                totalLeads: leads?.totalLeads,
                leads: leads?.leads
            }
            console.log("data: ", data);
            return data;

        } catch (error) {
            console.log("Error in fetch specific lender : ", error?.message);
        }
    }

    const { data: lenderLeads, isLoading: isLoading2 } = useQuery({
        queryKey: ["fetchSpecificLenderLeads", id, searchKey, currentPage, rowsPerPage],
        queryFn: getSpecificLenderLeads,
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

    const employmentTypes = {
        SALARIED: "Salaried",
        SELF_EMPLOYED: "Self Emp",
        RETIRED: "Retired"
    }

    const downloadExcel = (rows, fileName) => {
        if (!rows || !rows.length) {
            toast.info("No data available to download");
            return;
        }

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        // Trigger file download
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
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
                <div className='text-sm text-blue-600 underline cursor-pointer'>
                    <Link to={`/leads/view/${row?.id}`}>
                        {row?.id}
                    </Link>
                </div>
            ),
            center: "true",
            width: "250px"
        },
        {
            name: "Name",
            selector: (row) => (
                <div className='text-sm font-semibold text-[#374151]'>
                    {formatSentence(`${row?.firstName} ${row?.lastName}`)}
                </div>
            ),
            center: "true",
            width: "210px"
        },
        {
            name: "Email & Mobile",
            selector: (row) => (
                <div className='space-y-1.5 py-1.5'>
                    <div className='text-base text-[#374151]'>{row?.email}</div>
                    <div className='text-gray-600 text-sm'>{row?.mobileNumber}</div>
                </div>
            ),
            // center: "true",
            width: "200px"
        },
        {
            name: "Product Name & Code",
            selector: (row) => (
                <div className='space-y-1.5 py-1.5'>
                    <div className='text-sm '>{row?.productName}</div>
                    <div className='text-gray-600 text-xs'>{row?.productCode}</div>
                </div>
            ),
            // center: "true",
            width: "200px"
        },
        {
            name: "Gender",
            selector: (row) => (
                <div className='text-sm'>
                    {row?.gender}
                </div>
            ),
            center: "true",
            width: "90px"
        },
        {
            name: "Employment",
            selector: (row) => (
                <div className='py-1 px-3 border rounded-lg border-gray-400'>
                    {employmentTypes[row?.employmentType]}
                </div>
            ),
            center: "true",
            width: "120px"
        },
        {
            name: "Location",
            selector: (row) => (
                <div className='space-y-1.5 py-1.5'>
                    <div className='text-base text-[#374151]'>{row?.city}</div>
                    <div className='text-gray-500 text-sm'>{row?.state} - {row?.pincode}</div>
                </div>
            ),
            // center: "true",
            width: "220px"
        },
        {
            name: "Customer Type",
            selector: (row) => (
                <div style={{
                    backgroundColor: row.isNTC ? '#E6F1FB' : '#F1EFE8',
                    color: row.isNTC ? '#0C447C' : '#444441',
                    border: `0.5px solid ${row.isNTC ? '#85B7EB' : '#B4B2A9'}`,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                }}>
                    {row.customerType ? 'NTC' : 'Non NTC'}
                </div>
            ),
            center: "true",
            width: "170px"
        },
        {
            name: "DOB",
            selector: (row) => (
                <div className='text-sm text-[#374151]'>
                    {moment(new Date(row?.dateOfBirth || new Date())).format('DD/MM/YYYY HH:MM A')}
                </div>
            ),
            center: "true",
            width: "190px"
        },
        {
            name: "Requested Loan Amount",
            selector: (row) => (
                <div className='text-sm text-[#374151]'>
                    {formatINR(row?.requestedLoanAmount)}
                </div>
            ),
            center: "true",
            width: "230px"
        },
        {
            name: "Bureau Score",
            selector: (row) => {
                const { dot, text } = getBureauScoreColor(+row?.bureauScore)
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {
                            row?.bureauScore === 0 ? "N/A" : (
                                <>
                                    <span style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: dot,
                                        flexShrink: 0
                                    }} />
                                    <span style={{ color: text, fontWeight: 500, fontSize: '13px' }}>
                                        {row?.bureauScore}+
                                    </span>
                                </>
                            )
                        }
                    </div>
                )
            },
            center: "true",
            width: "140px"
        },
        {
            name: "Active Loans",
            selector: (row) => (
                <div className='text-sm text-[#374151]'>
                    {row?.activeLoans}
                </div>
            ),
            center: "true",
            width: "180px"
        },
        {
            name: "Status",
            selector: (row) => {

                return (
                    <div>
                        <LeadStatus status={row?.status} />
                    </div>
                )
            },
            center: "true",
            width: "150px"
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-5 items-center ">
                    <Link to={`/leads/view/${row?.id}`}>
                        <ActionButton type="view" />
                    </Link>
                </div>
            ),
            center: "true",
            width: "120px"
        },
    ]
    return (
        <div className='flex flex-col gap-y-4'>
            <div className='space-y-4'>
                <div className='place-items-end'>
                    <div onClick={() => downloadExcel([leadDetails], `${lenderLeads?.lenderLegalEntityName}_${moment(new Date()).format('DD_MM_YYYY')}`)} className='flex items-center gap-1 py-1.5 px-4 rounded-md  bg-green-800 border border-gray-400 cursor-pointer'>
                        {/* <Icon icon="fe:download" width="20" height="20" color='white' /> */}
                        <Icon icon="mdi:microsoft-excel" width="24" height="24" color='white' />
                        <span className='text-white font-semibold'>Export</span>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>

                    <ManageLeadCard
                        value={leadDetails?.totalLeads}
                        bgColor="bg-(--primary)"
                        icon={<Icon icon="carbon:application" width="24" />}
                        label="Total Leads"
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
                        value={formatINRShort(leadDetails?.disbursedAmount)}
                        bgColor="bg-emerald-600"
                        icon={<Icon icon="ic:baseline-currency-rupee" width="24" />}
                        label="Disbursed Amount"
                    />

                </div>
            </div>
            <div className="space-y-4 mt-5 md:mt-10">
                <div className=' flex items-center justify-between gap-4'>
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
                    <div onClick={() => downloadExcel(lenderLeads?.leads, `${lenderLeads?.lenderLegalEntityName}_${moment(new Date()).format('DD_MM_YYYY')}`)} className='flex items-center gap-1 py-1.5 px-4 rounded-md  bg-green-800 border border-gray-400 cursor-pointer'>
                        <Icon icon="mdi:microsoft-excel" width="24" height="24" color='white' />
                        <span className='text-white font-semibold'>Export</span>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-xl text(--primary) font-semibold'>Lender Leads</h2>
                    <DataTableBase
                        columns={columns}
                        data={lenderLeads?.leads || []}
                        progressPending={isLoading2}
                        pagination
                        paginationServer
                        paginationPerPage={10}
                        paginationTotalRows={lenderLeads?.totalLeads || 0}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default LenderLeadMetrics