import React, { useEffect, useState } from 'react'
import Headline from '../../components/Headline'
import { Icon } from '@iconify/react'
import AddButton from '../../components/buttons/AddButton'
import { IoSearch } from 'react-icons/io5'
import DataTableBase from '../../components/DataTableBase'
import moment from 'moment'
import { Link, useOutletContext } from 'react-router-dom'
import ActionButton from '../../components/buttons/ActionButton'
import useDebounce from '../../hooks/useDebounce'
import { useAuth } from '../../context/AuthContext'
import API_URL from '../../api/apiConfig'
import { useQuery } from '@tanstack/react-query'
import CustomCircleLoader from '../../shared/CustomCircleLoader'
import HasPermission from '../../components/HasPermission'
import { userPermissions } from '../../constants/subadminPermissions'

const LenderManagement = () => {
  const [searchKey, setSearchKey] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const debouncedSearch = useDebounce(searchKey);

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

  const { getAccessToken } = useAuth();

  const getLenderList = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderManagement.getLenderList}?search=${debouncedSearch}&page=${currentPage}&limit=${rowsPerPage}`, {
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
      // console.log("Result from get Lender List API: ", result.response);

      const data = result.response?.lenders?.map((lender) => {
        return {
          id: lender?.id,
          lenderId: lender?.customId,
          lenderName: lender?.legalEntityName,
          lenderType: lender?.lenderType,
          rbiRegistrationNumber: lender?.rbiRegistrationNumber,
          cin: lender?.cin,
          websiteUrl: lender?.websiteUrl,
          city: lender?.city,
          state: lender?.state,
          customerCareEmail: lender?.customerCareEmail,
          customerCarePhone: lender?.customerCarePhone,
          createdAt: lender?.createdAt,
        }
      })

      return {
        totalLenders: result?.response?.totalLenders,
        lenders: data
      };

    } catch (error) {
      console.log("Error in fetch lenders list : ", error?.message);
    }
  }

  const { data: lenderList, isLoading } = useQuery({
    queryKey: ["fetchLenderList",
      currentPage,
      rowsPerPage,
      debouncedSearch
    ],
    queryFn: getLenderList
  });

  const clearAllFilters = () => {
    console.log("Clear Filters");
    setSearchKey("");
    setCurrentPage(1);
    setRowsPerPage(10);
    setResetPaginationToggle(prev => !prev)
  }


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page);
  };

  // if (isLoading) {
  //   return (
  //     <div className='flex justify-center items-center w-full h-screen'>
  //       <CustomCircleLoader />
  //     </div>
  //   )
  // }


  const LENDER_DETAILS = [
    {
      legalEntityName: "Axis Capital Finance Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/1e3a8a/ffffff&text=AC",
      lenderType: "NBFC",
      rbiRegistrationNumber: "B-01.00231",
      cin: "U65923MH2010PLC204567",
      pan: "AACCA1234K",
      gstin: "27AACCA1234K1Z5",
      addressLine1: "12th Floor, One Horizon Center",
      addressLine2: "Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      country: "India",
      websiteUrl: "https://www.axiscapitalfinance.in",
      customerCarePhone: "+91 9876543210",
      customerCareEmail: "support@axiscapitalfinance.in",
    },
    {
      legalEntityName: "Shree Finserve Private Limited",
      legalEntityLogo: "https://dummyimage.com/100x100/7c3aed/ffffff&text=SF",
      lenderType: "Fintech NBFC",
      rbiRegistrationNumber: "B-02.01987",
      cin: "U67190KA2015PTC087654",
      pan: "AAHCS4567L",
      gstin: "29AAHCS4567L1Z9",
      addressLine1: "No. 45, MG Road",
      addressLine2: "Ashok Nagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      websiteUrl: "https://www.shreefinserve.com",
      customerCarePhone: "+91 9988776655",
      customerCareEmail: "care@shreefinserve.com",
    },
    {
      legalEntityName: "Bharat Credit Line Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/0f766e/ffffff&text=BC",
      lenderType: "NBFC",
      rbiRegistrationNumber: "B-03.00567",
      cin: "U65999DL2012PLC223344",
      pan: "AACCB5678P",
      gstin: "07AACCB5678P1Z2",
      addressLine1: "Tower B, Connaught Place",
      addressLine2: "Barakhamba Road",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
      websiteUrl: "https://www.bharatcreditline.in",
      customerCarePhone: "+91 9811122233",
      customerCareEmail: "help@bharatcreditline.in",
    },
    {
      legalEntityName: "Prime Urban Finance Pvt Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/d97706/ffffff&text=PU",
      lenderType: "Housing Finance",
      rbiRegistrationNumber: "B-04.04561",
      cin: "U65922TN2014PTC098765",
      pan: "AACCP7890D",
      gstin: "33AACCP7890D1Z8",
      addressLine1: "No. 18, Anna Salai",
      addressLine2: "Teynampet",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600018",
      country: "India",
      websiteUrl: "https://www.primeurbanfinance.com",
      customerCarePhone: "+91 9840011122",
      customerCareEmail: "support@primeurbanfinance.com",
    },
    {
      legalEntityName: "NeoTrust Lending Services",
      legalEntityLogo: "https://dummyimage.com/100x100/2563eb/ffffff&text=NT",
      lenderType: "Digital Lender",
      rbiRegistrationNumber: "B-05.07654",
      cin: "U72900MH2018PLC312345",
      pan: "AACCN1122Q",
      gstin: "27AACCN1122Q1Z3",
      addressLine1: "Cyber Park, Unit 304",
      addressLine2: "Vikhroli West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400079",
      country: "India",
      websiteUrl: "https://www.neotrustlending.in",
      customerCarePhone: "+91 9765432101",
      customerCareEmail: "hello@neotrustlending.in",
    },
    {
      legalEntityName: "Sai Wealth Finance Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/be123c/ffffff&text=SW",
      lenderType: "NBFC",
      rbiRegistrationNumber: "B-06.08890",
      cin: "U65921TG2011PLC074321",
      pan: "AACCS3344M",
      gstin: "36AACCS3344M1Z4",
      addressLine1: "Plot No. 9, Hitech City",
      addressLine2: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
      country: "India",
      websiteUrl: "https://www.saiwealthfinance.com",
      customerCarePhone: "+91 9701234567",
      customerCareEmail: "care@saiwealthfinance.com",
    },
    {
      legalEntityName: "UrbanRise Credit Solutions",
      legalEntityLogo: "https://dummyimage.com/100x100/334155/ffffff&text=UR",
      lenderType: "MSME Lender",
      rbiRegistrationNumber: "B-07.06789",
      cin: "U65929WB2016PLC209876",
      pan: "AACCU5566T",
      gstin: "19AACCU5566T1Z7",
      addressLine1: "Sector V, Salt Lake",
      addressLine2: "Block DN-32",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      country: "India",
      websiteUrl: "https://www.urbanrisecredit.in",
      customerCarePhone: "+91 9831123456",
      customerCareEmail: "support@urbanrisecredit.in",
    },
    {
      legalEntityName: "CrediSure Finance Corp",
      legalEntityLogo: "https://dummyimage.com/100x100/15803d/ffffff&text=CS",
      lenderType: "NBFC",
      rbiRegistrationNumber: "B-08.03211",
      cin: "U65910GJ2013PLC076543",
      pan: "AACCC7788X",
      gstin: "24AACCC7788X1Z1",
      addressLine1: "Prahlad Nagar Corporate Road",
      addressLine2: "Satellite",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
      country: "India",
      websiteUrl: "https://www.credisurefinance.com",
      customerCarePhone: "+91 9909988776",
      customerCareEmail: "help@credisurefinance.com",
    },
    {
      legalEntityName: "Aarohan Micro Credit Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/7e22ce/ffffff&text=AM",
      lenderType: "Microfinance",
      rbiRegistrationNumber: "B-09.09876",
      cin: "U65991OR2017PLC123456",
      pan: "AACCA9988B",
      gstin: "21AACCA9988B1Z5",
      addressLine1: "Janpath Road",
      addressLine2: "Saheed Nagar",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751007",
      country: "India",
      websiteUrl: "https://www.aarohanmicrocredit.in",
      customerCarePhone: "+91 9437001122",
      customerCareEmail: "support@aarohanmicrocredit.in",
    },
    {
      legalEntityName: "BluePeak Financial Services",
      legalEntityLogo: "https://dummyimage.com/100x100/1d4ed8/ffffff&text=BP",
      lenderType: "Personal Loan Lender",
      rbiRegistrationNumber: "B-10.01234",
      cin: "U65999RJ2019PLC065432",
      pan: "AACCB6655N",
      gstin: "08AACCB6655N1Z6",
      addressLine1: "Tonk Road",
      addressLine2: "Malviya Nagar",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302017",
      country: "India",
      websiteUrl: "https://www.bluepeakfinance.in",
      customerCarePhone: "+91 9782123456",
      customerCareEmail: "care@bluepeakfinance.in",
    },
    {
      legalEntityName: "FinBridge Lending Pvt Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/ea580c/ffffff&text=FB",
      lenderType: "SME Lender",
      rbiRegistrationNumber: "B-11.07621",
      cin: "U65990UP2016PTC087123",
      pan: "AACCF2211R",
      gstin: "09AACCF2211R1Z0",
      addressLine1: "Vibhuti Khand",
      addressLine2: "Gomti Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226010",
      country: "India",
      websiteUrl: "https://www.finbridgelending.com",
      customerCarePhone: "+91 9795123456",
      customerCareEmail: "hello@finbridgelending.com",
    },
    {
      legalEntityName: "TrustLeaf Capital India Ltd",
      legalEntityLogo: "https://dummyimage.com/100x100/0f172a/ffffff&text=TL",
      lenderType: "Corporate Lender",
      rbiRegistrationNumber: "B-12.04589",
      cin: "U65920PB2011PLC044321",
      pan: "AACCT3344G",
      gstin: "03AACCT3344G1Z3",
      addressLine1: "Ferozepur Road",
      addressLine2: "Model Town",
      city: "Ludhiana",
      state: "Punjab",
      pincode: "141002",
      country: "India",
      websiteUrl: "https://www.trustleafcapital.in",
      customerCarePhone: "+91 9872012345",
      customerCareEmail: "support@trustleafcapital.in",
    },
    {
      legalEntityName: "CapitalNest Lending Solutions",
      legalEntityLogo: "https://dummyimage.com/100x100/9333ea/ffffff&text=CN",
      lenderType: "Business Loan Lender",
      rbiRegistrationNumber: "B-13.08901",
      cin: "U65999KL2020PLC067890",
      pan: "AACCC4455Y",
      gstin: "32AACCC4455Y1Z1",
      addressLine1: "MG Road",
      addressLine2: "Ernakulam",
      city: "Kochi",
      state: "Kerala",
      pincode: "682016",
      country: "India",
      websiteUrl: "https://www.capitalnestlending.in",
      customerCarePhone: "+91 9847011122",
      customerCareEmail: "help@capitalnestlending.in",
    },
    {
      legalEntityName: "EverGrow Loan Partners",
      legalEntityLogo: "https://dummyimage.com/100x100/475569/ffffff&text=EG",
      lenderType: "Consumer Finance",
      rbiRegistrationNumber: "B-14.03290",
      cin: "U65992AP2018PLC108765",
      pan: "AACCE5566Z",
      gstin: "37AACCE5566Z1Z9",
      addressLine1: "Beach Road",
      addressLine2: "Siripuram",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      pincode: "530003",
      country: "India",
      websiteUrl: "https://www.evergrowloans.in",
      customerCarePhone: "+91 9985123456",
      customerCareEmail: "care@evergrowloans.in",
    },
    {
      legalEntityName: "MitraPay Credit Finance",
      legalEntityLogo: "https://dummyimage.com/100x100/0369a1/ffffff&text=MP",
      lenderType: "Embedded Finance Lender",
      rbiRegistrationNumber: "B-15.05543",
      cin: "U65990MH2021PLC378901",
      pan: "AACCM6677H",
      gstin: "27AACCM6677H1Z2",
      addressLine1: "Andheri Kurla Road",
      addressLine2: "Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059",
      country: "India",
      websiteUrl: "https://www.mitrapaycredit.com",
      customerCarePhone: "+91 9819988776",
      customerCareEmail: "support@mitrapaycredit.com",
    },
  ];
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
        <div className='text-sm text-blue-600 underline cursor-pointer'>
          <Link to={`view/${row?.lenderId}`}>
            {row?.lenderId}
          </Link>
        </div>
      ),
      center: "true",
      width: "170px"
    },
    {
      name: "Lender Name",
      selector: (row) => (
        <div className='text-sm font-semibold cursor-pointer' title={row?.lenderName}>
          {row?.lenderName}
        </div>
      ),
      // center: "true",
      width: "220px"
    },
    {
      name: "Type",
      selector: (row) => (
        <div className='text-sm cursor-pointer' title={row?.lenderType}>
          {row?.lenderType}
        </div>
      ),
      // center: "true",
      width: "140px"
    },
    {
      name: "RBI Reg No",
      selector: (row) => (
        <div className='text-sm cursor-pointer'>
          {row?.rbiRegistrationNumber}
        </div>
      ),
      // center: "true",
      width: "140px"
    },
    {
      name: "CIN",
      selector: (row) => (
        <div className='text-sm cursor-pointer' title={row?.cin}>
          {row?.cin}
        </div>
      ),
      // center: "true",
      width: "180px"
    },
    {
      name: "Website URL",
      selector: (row) => (
        <a
          href={row?.websiteUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm cursor-pointer underline flex gap-2 items-center"
          title={row?.websiteUrl}
        >
          Visit Site
          <Icon
            icon="streamline-sharp:link-share-2-remix"
            width="16"
            height="16"
          />
        </a>
      ),
      width: "130px",
    },
    {
      name: "Location",
      selector: (row) => (
        <div className='flex flex-col gap-1.5 items-start py-4'>
          <div className=' text-(--primary)' title={row?.city}>{row?.city}</div>
          <div className='flex flex-col'>
            <div className='text-xs text-gray-600 font-medium'>{row?.state}</div>
            {/* <div className='text-xs text-gray-600 font-medium'>{row?.email}</div> */}
          </div>
        </div>
      ),
      // center: "true",
      width: "130px"
    },
    {
      name: "Contact",
      selector: (row) => (
        <div className='flex flex-col gap-1.5 items-start py-4'>
          <div className='text-sm font-medium' title={row?.customerCareEmail}>{row?.customerCareEmail}</div>
          <div className='flex flex-col'>
            <div className='text-xs text-gray-600 font-medium' title={row?.customerCarePhone}>{row?.customerCarePhone}</div>
          </div>
        </div>
      ),
      // center: "true",
      width: "170px"
    },
    {
      name: "Onboarded On",
      selector: (row) => (
        <div className='text-sm font-medium text-(--primary)'>
          {moment(row?.createdAt || new Date()).format("DD/MM/YYYY")}
        </div>
      ),
      center: "true",
      width: "130px"
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex gap-5 items-center ">
          <Link to={`view/${row?.lenderId}`}>
            <ActionButton type="view" />
          </Link>
          <Link to={`view/${row?.lenderId}/edit`}>
            <ActionButton type="edit" />
          </Link>

        </div>
      ),
      center: "true",
      width: "170px"
    },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center gap-4'>
        <Headline title="Lender Management" />
        <button className='flex gap-3 bg-(--primary) text-white rounded-md'>
          <AddButton icon="ph:bank" content="Onboard" to="onboard" />
        </button>
      </div>


      <div className='bg-white px-2 py-4 sm:px-4 rounded-md '>
        <div className='flex items-end justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="search" className="text-[#232323] text-sm">
              Search by ID / Name / Reg No / CIN
            </label>
            <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 max-sm:w-full">
              <IoSearch className="text-[#707B8F]" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                placeholder="Ex: LDR989484949956"
              />
            </div>
          </div>

          {/* Clear All Button — Right, aligned to input height */}
          <button
            onClick={clearAllFilters}
            className='cursor-pointer py-2 px-4 rounded-md border border-gray-300 flex items-center gap-x-2'
          >
            <Icon icon="solar:eraser-linear" width="24" height="24" />
            <span>Clear All</span>
          </button>
        </div>
      </div>


      <div className='bg-white flex flex-col gap-4 rounded-md px-2 py-4 sm:px-4 sm:py-6'>
        <h2 className='text-xl text-(--primary) font-semibold'>List of Lenders</h2>
        <DataTableBase
          columns={columns}
          data={lenderList?.lenders || []}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationPerPage={10}
          paginationTotalRows={lenderList?.totalLenders}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          paginationResetDefaultPage={resetPaginationToggle}
        />
      </div>
    </div>
  )
}

export default LenderManagement