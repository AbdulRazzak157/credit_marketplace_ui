import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { reactSelectCustomStyles } from '../../shared/customStyles';
import { IoSearch } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import Select from 'react-select'
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt } from 'react-icons/fa';
import DataTableBase from '../../components/DataTableBase';
import { formatINRShort } from '../../helpers';
import { getBureauScoreColor, STATUS_COLORS, timeAgo } from '../../shared/utils';
import ActionButton from '../../components/buttons/ActionButton';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import API_URL from '../../api/apiConfig';
import { LeadStatus } from '../../components/LeadStatus';
import { employmentTypes } from '../../constants/subadminPermissions';

const LeadManagement = () => {
  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [geoSearch, setGeoSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [selectedNtcCustomer, setSelectedNtcCustomer] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedStaffIdSearch = useDebounce(staffId);
  const debouncedLeadIdSearch = useDebounce(leadId);
  const debouncedCustomerSearch = useDebounce(customerSearch);
  const debounceGeoSearch = useDebounce(geoSearch);

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


  const getManageLeadList = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.leadManagement.getLeadManagementList}?fromDate=${fromDate}&toDate=${toDate}&employmentType=${selectedEmploymentType?.value || ""}&customerType=${selectedNtcCustomer?.value || ""}&staffId=${debouncedStaffIdSearch}&leadId=${debouncedLeadIdSearch}&search=${debouncedCustomerSearch}&address=${debounceGeoSearch}&gender=${selectedGender?.value || ""}&status=${selectedStatus?.value || ""}&page=${currentPage}&limit=${rowsPerPage}`, {
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
      console.log("Result from get lead List API: ", result.response);

      const data = result.response?.leads?.map((lead) => {
        return {
          id: lead?.id,
          leadId: lead?.leadId,
          name: lead?.name,
          email: lead?.email,
          mobileNumber: lead?.mobileNumber,
          gender: lead?.gender,
          employmentType: lead?.employmentType,
          address: lead?.address,
          state: lead?.state,
          city: lead?.city,
          pincode: lead?.pincode,
          country: lead?.country,
          income: lead?.income,
          customerType: lead?.customerType,
          bureauScore: lead?.bureauScore,
          status: lead?.status,
          updatedAt: lead?.updatedAt,
          matchedProducts: lead?.matchedProducts
        }
      });


      return {
        totalLeads: result?.response?.totalLeads,
        leads: data
      };

    } catch (error) {
      console.log("Error in fetch Manage Lead list : ", error?.message);
    }
  }

  const { data: leadManageListData, isLoading } = useQuery({
    queryKey: ["fetchLeadManageListData",
      currentPage,
      rowsPerPage,
      debounceGeoSearch,
      debouncedCustomerSearch,
      debouncedLeadIdSearch,
      debouncedStaffIdSearch,
      fromDate,
      toDate,
      selectedGender,
      selectedEmploymentType,
      selectedNtcCustomer,
      selectedStatus
    ],
    queryFn: getManageLeadList
  });

  const clearAllFilters = () => {
    console.log("Clear Filters")
    setGeoSearch("");
    setCustomerSearch("");
    setLeadId("");
    setStaffId("");
    setFromDate([]);
    setToDate([]);
    setSelectedGender(null);
    setSelectedEmploymentType(null);
    setSelectedNtcCustomer(null);
    setSelectedStatus(null);
    setCurrentPage(1);
    setRowsPerPage(10);
  }


  const handleFromDateChange = (selectedDates) => {
    setFromDate(selectedDates);
  };

  const handleToDateChange = (selectedDates) => {
    setToDate(selectedDates);
  };

  const handleCancelFromDate = () => {
    setFromDate([]);
  };

  const handleCancelToDate = () => {
    setToDate([]);
  };
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
        <div className='text-sm text-blue-600 underline cursor-pointer'>
          <Link to={`/leads/view/${row?.leadId}`}>
            {row?.leadId}
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
          {row?.name}
        </div>
      ),
      center: "true",
      width: "180px"
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
      selector: (row) => {
        return <div>
          {
            row?.customerType === null ? (<div className='text-xs'>N/A</div>) : (
              <div style={{
                backgroundColor: row.customerType ? '#E6F1FB' : '#F1EFE8',
                color: row.customerType ? '#0C447C' : '#444441',
                border: `0.5px solid ${row.customerType ? '#85B7EB' : '#B4B2A9'}`,
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                {row.customerType ? 'NTC' : 'Non NTC'}
              </div>
            )
          }
        </div>
      },
      center: "true",
      width: "170px"
    },
    {
      name: "Income",
      selector: (row) => (
        <div className='text-sm text-[#374151]'>
          {formatINRShort(+row?.income)}
        </div>
      ),
      center: "true",
      width: "150px"
    },
    {
      name: "Bureau Score",
      selector: (row) => {
        const { dot, text } = getBureauScoreColor(+row?.bureauScore)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {
              !row?.bureauScore ? "N/A" : (
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
      name: "Top Match Products",
      selector: (row) => (
        <div className={`font-semibold text-lg ${row?.matchedProducts && "text-blue-600 underline cursor-pointer"} `}>
          <Link to={`/leads/view/${row?.leadId}/products`}>
            {row?.matchedProducts}
          </Link>
        </div>
      ),
      center: "true",
      width: "190px"
    },
    {
      name: "Last Updated On",
      selector: (row) => (
        <div className='text-sm text-[#374151]'>
          {timeAgo(row?.updatedAt)}
        </div>
      ),
      center: "true",
      width: "190px"
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
          <Link to={`/leads/view/${row?.leadId}`}>
            <ActionButton type="view" />
          </Link>
        </div>
      ),
      center: "true",
      width: "120px"
    },
  ]
  return (
    <div className='space-y-4 md:space-y-6'>
      <h2 className='text-xl font-semibold text-(--primary)'>Lead Management</h2>
      <div className='bg-white px-2 md:px-4 py-4 rounded-md space-y-4'>

        <div className='flex justify-between items-center gap-4'>
          <h3 className='text-lg font-semibold'>Filter Products</h3>
          <button onClick={clearAllFilters} className='cursor-pointer py-2 px-4 rounded-md border border-gray-300 flex items-center gap-x-2'>
            <Icon icon="solar:eraser-linear" width="24" height="24" /> <span>Clear All</span></button>
        </div>
        <div className='bg-white px-2 md:px-4 py-4 rounded-md grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor="search" className="text-gray-600 text-sm">Search by Staff Id</label>
            <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md py-2 px-2 w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="outline-none placeholder:text-gray-400 placeholder:text-sm w-full text-sm text-[#232323]"
                placeholder="Ex: STF93623236577"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor="search" className="text-gray-600 text-sm">Search by lead Id</label>
            <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md py-2 px-2 w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="outline-none placeholder:text-gray-400 placeholder:text-sm w-full text-sm text-[#232323]"
                placeholder="Ex: LD-PL-STR-20260402-8381B964"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor="search" className="text-gray-600 text-sm">Search by Name / Mobile / Email</label>
            <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md py-2 px-2 w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="outline-none placeholder:text-gray-400 placeholder:text-sm w-full text-sm text-[#232323]"
                placeholder="Search by Name, +91XXXXX or email"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor="search" className="text-gray-600 text-sm">Search by State / City / Pincode</label>
            <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md py-2 px-2 w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={geoSearch}
                onChange={(e) => setGeoSearch(e.target.value)}
                className="outline-none placeholder:text-gray-400 placeholder:text-sm w-full text-sm text-[#232323]"
                placeholder="Search by State, City or Pincode"
              />
            </div>
          </div>
          <div className='flex justify-between items-center gap-x-4'>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="lender-type" className='text-gray-600 text-sm'>Select Gender</label>
              <Select
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Others", value: "OTHERS" },
                ]}
                value={selectedGender || null}
                onChange={(option) => setSelectedGender(option)}
                placeholder="Ex: Male"
                styles={reactSelectCustomStyles}
                className="capitalize placeholder:text-gray-400 placeholder:text-xs"
                isClearable
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="lender-type" className='text-gray-600 text-sm'>Select Employment Type</label>
              <Select
                options={[
                  { label: "Salaried", value: "SALARIED" },
                  { label: "Self Employed", value: "SELF_EMPLOYED" },
                  { label: "Retired", value: "RETIRED" },
                  { label: "Students", value: "STUDENT" },
                ]}
                value={selectedEmploymentType || null}
                onChange={(option) => setSelectedEmploymentType(option)}
                placeholder="Ex: Salaried"
                styles={reactSelectCustomStyles}
                className="capitalize"
                isClearable
              />
            </div>
          </div>
          <div className='flex justify-between items-center gap-x-4'>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="lender-type" className='text-gray-600 text-sm'>Select Customer Type</label>
              <Select
                options={[
                  { label: "NTC Only", value: "NTC_ONLY" },
                  { label: "Non NTC Only", value: "NON_NTC_ONLY" },
                ]}
                value={selectedNtcCustomer || null}
                onChange={(option) => setSelectedNtcCustomer(option)}
                placeholder="Ex: NTC Only"
                styles={reactSelectCustomStyles}
                className="capitalize"
                isClearable
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="lender-type" className='text-gray-600 text-sm'>Select Status</label>
              <Select
                options={[
                  { label: "New", value: "NEW" },
                  { label: "In Review", value: "IN_REVIEW" },
                  { label: "Rejected", value: "REJECTED" },
                  // { label: "Approved", value: "APPROVED" },
                  { label: "Disbursed", value: "DISBURSED" },
                ]}
                value={selectedStatus || null}
                onChange={(option) => setSelectedStatus(option)}
                placeholder="Ex: New"
                styles={reactSelectCustomStyles}
                className="capitalize"
                isClearable
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 place-items-end">
            <div className="inline-flex relative items-center w-full">
              <Flatpickr
                placeholder="From Date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="border border-[#d1d5db] rounded-md outline-none px-4 py-[10px] pr-10 text-sm w-full"
                options={{
                  mode: "single",
                  dateFormat: "d-m-Y",
                  disableMobile: true,
                  maxDate: toDate[0] || new Date()
                }}
              />

              {fromDate?.length === 0 ? (
                <FaCalendarAlt className="absolute right-3 text-[#d1d5db] pointer-events-none" />
              ) : (
                <RxCross2
                  className="absolute right-3 text-gray-500 cursor-pointer"
                  onClick={handleCancelFromDate}
                />
              )}
            </div>

            <div className="inline-flex relative items-center w-full">
              <Flatpickr
                placeholder="To Date"
                value={toDate}
                onChange={handleToDateChange}
                className="border border-[#d1d5db] rounded-md outline-none px-4 py-[10px] text-sm w-full"
                options={{
                  mode: "single",
                  dateFormat: "d-m-Y",
                  maxDate: new Date(),
                  minDate: fromDate[0] || "",
                  disableMobile: true,
                }}
              />
              {toDate?.length === 0 ? (
                <FaCalendarAlt className="absolute right-3 text-[#d1d5db] pointer-events-none" />
              ) : (
                <RxCross2
                  className="absolute right-3 text-gray-500 cursor-pointer"
                  onClick={handleCancelToDate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white rounded-md px-2 md:px-4 py-4 md:py-6 space-y-4'>
        <h2 className='text-lg font-semibold text-(--primary)'>List Of Leads</h2>
        <DataTableBase
          columns={columns}
          data={leadManageListData?.leads || []}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationPerPage={10}
          paginationTotalRows={leadManageListData?.totalLeads}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>
    </div>
  )
}

export default LeadManagement