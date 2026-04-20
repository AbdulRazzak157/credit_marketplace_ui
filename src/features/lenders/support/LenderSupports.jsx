import React, { useState } from 'react'
import AddButton from '../../../components/buttons/AddButton'
import { IoSearch } from 'react-icons/io5'
import DataTableBase from '../../../components/DataTableBase';
import { Link, useParams } from 'react-router-dom';
import ActionButton from '../../../components/buttons/ActionButton';
import ToggleSwitch from '../../../components/buttons/ToggleSwitch';
import CustomThreeDotsLoader from '../../../shared/CustomThreeDotsLoader';
import { toast } from 'react-toastify';
import API_URL from '../../../api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import useDebounce from '../../../hooks/useDebounce';
import CustomCircleLoader from '../../../shared/CustomCircleLoader';

const LenderSupports = () => {
  const { id } = useParams();
  const [searchKey, setSearchKey] = useState("");
  const [statusLoading, setStatusLoading] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchKey);

  const { getAccessToken } = useAuth();

  const getLenderSupports = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderSupport.getLenderSupports(id)}?search=${debouncedSearch}&page=${currentPage}&limit=${rowsPerPage}`, {
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
      console.log("Result from get Lender Support List API: ", result.response);

      const supports = result.response?.supportStaff?.map((support) => {
        return {
          id: support?.id,
          customId: support?.customId,
          name: support?.name,
          designation: support?.designation,
          email: support?.officialEmail,
          mobileNumber: support?.mobileNumber,
          isActive: support?.isActive,
        }
      });


      return {
        totalSupports: result?.response?.totalSupportStaff,
        supports
      };

    } catch (error) {
      console.log("Error in fetch lender product list : ", error?.message);
    }
  }

  const { data: lenderSupports, isLoading, refetch } = useQuery({
    queryKey: ["fetchLenderSupport", id, debouncedSearch, currentPage, rowsPerPage],
    queryFn: getLenderSupports
  });

  // if (isLoading) {
  //   return (
  //     <div className='flex justify-center items-center w-full h-screen'>
  //       <CustomCircleLoader />
  //     </div>
  //   )
  // }


  const handleUpdateLenderSupportStatus = async (supportId) => {
    setStatusLoading((prev) => ({ ...prev, [supportId]: true }));
    try {

      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderSupport.updateLenderSupportStatus(id, supportId)}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // body: JSON.stringify({ staffId })
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message);
      }
      await response.json();
      await refetch();
      toast.success("Product Status Updated Successfully")
    } catch (error) {
      toast.error(error?.message)
      console.log("Error in handle update lender support status : ", error?.message);
    }
    setStatusLoading((prev) => ({ ...prev, [supportId]: false }));
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
      name: "Lender ID",
      selector: (row) => (
        <div className='text-sm text-blue-600 underline'>
          {row?.customId}
        </div>
      ),
      center: "true",
      width: "170px"
    },
    {
      name: "Name",
      selector: (row) => (
        <div className='' title={row?.name}>
          {row?.name}
        </div>
      ),
      // center: "true",
      width: "180px"
    },
    {
      name: "Designation",
      selector: (row) => (
        <div className='' title={row?.name}>
          {row?.designation}
        </div>
      ),
      // center: "true",
      width: "180px"
    },
    {
      name: "Email",
      selector: (row) => (
        <div className='' title={row?.name}>
          {row?.email}
        </div>
      ),
      // center: "true",
      width: "220px"
    },
    {
      name: "Mobile Number",
      selector: (row) => (
        <div className='' title={row?.name}>
          {row?.mobileNumber}
        </div>
      ),
      // center: "true",
      width: "150px"
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          {statusLoading[row?.customId] ? (
            <CustomThreeDotsLoader />
          ) : (
            <ToggleSwitch
              id={row?.index}
              checked={row?.isActive}
              onChange={() => handleUpdateLenderSupportStatus(row?.customId)}
              name={row?.customId}
              disabled={statusLoading[row?.customId]}
            />

          )}
        </div>
      ),
      center: "true",
      width: "100px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-5 items-center ">
          <Link to={`/lenders/view/${id}/support/view/${row?.customId}`}>
            <ActionButton type="view" />
          </Link>
          <Link to={`/lenders/view/${id}/support/view/${row?.customId}/edit`}>
            <ActionButton type="edit" />
          </Link>
        </div>
      ),
      center: "true",
      width: "120px"
    },
  ];
  return (
    <div>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl text-(--primary) font-semibold'>
            Support & Contacts
          </h2>
          <button className='flex gap-3 bg-(--primary) text-white rounded-md'>
            <AddButton icon="icons8:add-user" content="Add Contact" to="add" />
          </button>
        </div>
        <div className='bg-white py-2 rounded-md '>
          <div className='flex flex-col gap-2 '>
            <label htmlFor="search" className="text-[#232323] text-sm">Search by ID / Name / Email / Mobile </label>
            <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 max-sm:w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                placeholder="Ex: LPS989484949956"
              />
            </div>
          </div>
        </div>
        <div className='bg-white flex flex-col gap-4 rounded-md'>
          <h2 className='text-xl text-(--primary) font-semibold'>List of Support</h2>
          <DataTableBase
            columns={columns}
            data={lenderSupports?.supports || []}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationPerPage={rowsPerPage}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        </div>
      </div>
    </div>
  )
}

export default LenderSupports