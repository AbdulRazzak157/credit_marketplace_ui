import React, { useEffect, useState } from 'react'
import AddButton from '../../components/buttons/AddButton';
import StaffCard from '../../components/cards/StaffCard';
import { IoSearch } from "react-icons/io5";
import DataTableBase from '../../components/DataTableBase';
import ActionButton from '../../components/buttons/ActionButton';
import { Link, useOutletContext } from 'react-router-dom';
import ToggleSwitch from '../../components/buttons/ToggleSwitch';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import moment from 'moment/moment';
import useDebounce from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { formatSentence, normalizeSentence, truncateString } from '../../helpers';

const StaffManagement = () => {

  const [statusLoading, setStatusLoading] = useState({});
  const [staffPage, setStaffPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearchKey = useDebounce(searchKey);

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

  const getStaffStatCards = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.staffManagement.getStaffStatCards}`, {
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
      console.log("Result from getStaffStatCards API: ", result.response);

      const data = {
        totalStaff: result?.response?.cards?.total || 0,
        activeStaff: result?.response?.cards?.active || 0,
        inactiveStaff: result?.response?.cards?.inActive || 0,
      }
      console.log({ data })

      return data;

    } catch (error) {
      console.log("Error in fetch staff stat cards : ", error?.message);
    }
  }

  const { data: staffStatCards, isLoading, refetch: refetch2 } = useQuery({
    queryKey: ["getStaffStatCards"],
    queryFn: getStaffStatCards
  });

  const getStaffList = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.staffManagement.getStaffList}?page=${staffPage}&limit=${rowsPerPage}&searchKey=${debouncedSearchKey}`, {
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
      console.log("staff List: ", result.response);


      const data = {
        totalStaff: result?.response?.totalExecutives,
        staffList: result?.response?.executives || [],
      }
      data.staffList.forEach((item) => {
        item.firstName = item?.firstName?.split(" ").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" ") || "";
        item.lastName = item?.lastName?.split(" ").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" ") || "";
      })
      console.log({ data })

      return data;

    } catch (error) {
      console.log("Error in fetch Staff list : ", error?.message);
    }
  }

  const { data: staffData, isLoading: isStaffLoading, refetch } = useQuery({
    queryKey: ["getStaffList", staffPage, debouncedSearchKey, rowsPerPage],
    queryFn: getStaffList
  });

  if (isLoading) {
    return (

      <div className='flex justify-center items-center w-full h-screen'>
        <CustomCircleLoader />
      </div>
    )
  }
  const handlePageChange = (page) => {
    setStaffPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setStaffPage(page);
  };

  const handleUpdateStaffStatus = async (staffId) => {
    console.log("staffId ", staffId)
    setStatusLoading((prev) => ({ ...prev, [staffId]: true }));
    try {

      const token = await getAccessToken();
      console.log("token")
      const response = await fetch(`${API_URL.staffManagement.updateStaffStatus(staffId)}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // body: JSON.stringify({ staffId })
      });
      console.log("response : ", response)
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message);
      }
      const result = await response.json();
      console.log("result : ", result);
      await refetch();
      await refetch2();
      toast.success("Staff Status Updated Successfully")
    } catch (error) {
      toast.error(error?.message)
      console.log("Error in handle update staff status : ", error?.message);
    }
    setStatusLoading((prev) => ({ ...prev, [staffId]: false }));
  }

  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "",
      phone: "",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "",
      phone: "",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "",
      phone: "",
      status: "Active",
    }
  ]

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
      name: "Staff ID",
      selector: (row) => (
        <div className='text-sm text-blue-600 underline cursor-pointer'>
          <Link to={`view/${row?.customId}`}>
            {row?.customId}
          </Link>
        </div>
      ),
      center: "true",
      width: "170px"
    },
    {
      name: "Staff Details",
      selector: (row) => (
        <div className='flex flex-col items-start py-4'>
          <div className='text-sm font-semibold text-(--primary)' title={`${row?.firstName} ${row?.lastName}`}>{truncateString(normalizeSentence(`${row?.firstName} ${row?.lastName}`))}</div>
          <div className='flex flex-col'>
            <div className='text-xs text-gray-600 font-medium'>{row?.mobileNumber}</div>
            <div className='text-xs text-gray-600 font-medium'>{row?.email}</div>
          </div>
        </div>
      ),
      // center: "true",
      width: "200px"
    },
    {
      name: "Assigned Leads",
      selector: (row) => (
        <div className='text-sm font-medium text-(--primary)'>
          {row?.assignedLeads || 0}
        </div>
      ),
      center: "true",
      width: "140px"
    },
    {
      name: "Disbursed Leads",
      selector: (row) => (
        <div className='text-sm font-medium text-(--primary)'>
          {row?.disbursedLeads || 0}
        </div>
      ),
      center: "true",
      width: "150px"
    },
    {
      name: "Onboarded By",
      selector: (row) => (
        <div >
          <div className='text-sm font-medium text-(--primary)'>{formatSentence(row?.onboardedBy)}</div>
          { row?.onboardedBy !== "Admin" && <div className='text-xs '>{normalizeSentence(row?.onboardedUserDesignation)}</div>}
        </div>
      ),
      center: "true",
      width: "190px"
    },
    {
      name: "Onboarded On",
      selector: (row) => (
        <div className='text-sm font-medium text-(--primary)'>
          {moment(row?.createdAt).format("DD MMM YYYY") || "10 Oct 2023"}
        </div>
      ),
      center: "true",
      width: "130px"
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          {statusLoading[row?.customId] ? (
            <CustomThreeDotsLoader />
          ) : (
            <ToggleSwitch
              id={3}
              checked={row?.isActive}
              onChange={() => handleUpdateStaffStatus(row?.customId)}
              name={row?.id}
              disabled={statusLoading[row?.customId]}
            />

          )}
        </div>
      ),
      width: "80px",
      center: "true"
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-5 items-center ">
          <Link to={`view/${row?.customId}`}>
            <ActionButton type="view" />
          </Link>

          {/* <ActionButton
            type="delete"
          // onClick={() => handleDeleteModal(row?.customId)}
          /> */}
        </div>
      ),
      width: "150px",
      center: "true",
    },
  ]
  return (
    <div className='flex flex-col gap-4 sm:gap-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl text-(--primary) font-semibold' >Staff Management</h1>
        <AddButton icon="material-symbols-light:person-add" content="Add Staff" to="add" />
      </div>
      <div className='flex gap-4 max-sm:flex-col px-2 py-2 sm:py-4 sm:px-4 bg-white rounded-md divide-[#B4B4B4] sm:divide-x-2 max-sm:divide-y'>
        <StaffCard label="Total Staff" value={staffStatCards?.totalStaff} color="text-green-600" />
        <StaffCard label="Active Staff" value={staffStatCards?.activeStaff} color="text-blue-600" />
        <StaffCard label="Inactive Staff" value={staffStatCards?.inactiveStaff} color="text-gray-600" />
      </div>
      <div className='bg-white flex flex-col gap-4 sm:gap-6 rounded-md px-2 py-2 sm:py-6 sm:px-4'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-2 '>
            <label htmlFor="search" className="text-[#232323] text-sm">Search Your Staff ID / Name </label>
            <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md px-2 py-[7px] max-sm:w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                placeholder="Eg:- STF123456789012"
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h2 className='text-xl text-(--primary) font-semibold'>List Of Staff Members</h2>
          {
            isStaffLoading ? (
              <div className='flex justify-center items-center w-full h-52'>
                <CustomCircleLoader />
              </div>
            ) : staffData?.staffList?.length === 0 ? (
              <div className='flex flex-col items-center gap-4 py-10'>
                <img src="/assets/no-data.png" alt="No data" className='w-24' />
                <p className='text-sm text-gray-600'>No staff found.</p>
              </div>
            ) : (
              <DataTableBase
                columns={columns}
                data={staffData?.staffList || []}
                progressPending={isStaffLoading}
                pagination
                paginationServer
                paginationPerPage={10}
                paginationTotalRows={staffData?.staffList?.length}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StaffManagement;