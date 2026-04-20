import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import Select from 'react-select';
import FilterRangeOption from '../../components/FilterRangeOption';
import DataTableBase from '../../components/DataTableBase';
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import { Link } from 'react-router-dom';
import ActionButton from '../../components/buttons/ActionButton';
import { formatINRShort, normalizeSentence } from '../../helpers';

const ProductManagement = () => {
  const [searchKey, setSearchKey] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLender, setSelectedLender] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minTenure, setMinTenure] = useState("");
  const [maxTenure, setMaxTenure] = useState("");
  const [minInterest, setMinInterest] = useState("");
  const [maxInterest, setMaxInterest] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sortedBy, setSortedBy] = useState(null);

  const debouncedSearch = useDebounce(searchKey);

  const { getAccessToken } = useAuth();

  const getLenderNames = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.lenderManagement.getLenderNames}`, {
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
      console.log("Result from get Lender Staff List API: ", result.response);

      const lenders = result.response?.map((lender) => {
        return {
          label: lender?.legalEntityName,
          value: lender?.id,
        }
      });


      return lenders;

    } catch (error) {
      console.log("Error in fetch lender product list : ", error?.message);
    }
  }

  const { data: lenderNames } = useQuery({
    queryKey: ["fetchLenderNames"],
    queryFn: getLenderNames
  });

  const getAllProductList = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.productManagement.getProductList}?minRoi=${minInterest || ''}&maxRoi=${maxInterest}&minTenure=${minTenure}&maxTenure=${maxTenure}&minAmount=${minAmount}&maxAmount=${maxAmount}&minBureauScore=${minScore}&maxBureauScore=${maxScore}&minAge=${minAge}&maxAge=${maxAge}&sortBy=${sortedBy?.value || ""}&lenderId=${selectedLender?.value || ""}&loanType=${selectedProductType?.value || ""}&search=${debouncedSearch}&page=${currentPage}&limit=${rowsPerPage}`, {
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
      console.log("Result from get product List API: ", result.response);

      const data = result.response?.products?.map((product) => {
        return {
          id: product?.id,
          productId: product?.customId,
          productName: product?.productName,
          productCode: product?.productCode,

          lenderId: product?.lenderId,
          lenderCustomId: product?.lender?.customId,
          lenderEntityName: product?.lender?.legalEntityName,

          lenderLoanType: product?.lenderLoanType,
          fixedRateOfInterest: product?.fixedRateOfInterest,
          minAmount: product?.minAmount,
          maxAmount: product?.maxAmount,
          processingFeePercentage: product?.processingFeePercentage,
          minTenureInMonths: product?.lenderProductPolicy?.minTenureInMonths,
          maxTenureInMonths: product?.lenderProductPolicy?.maxTenureInMonths,

          bureauScore: product?.lenderProductPolicy?.minBureauScore,
          minAge: product?.lenderProductPolicy?.minAge,
          maxAge: product?.lenderProductPolicy?.maxAge,

          employmentTypes: product?.lenderProductPolicy?.employmentTypes,

        }
      });


      return {
        totalProducts: result?.response?.totalProducts,
        products: data
      };

    } catch (error) {
      console.log("Error in fetch lender product list : ", error?.message);
    }
  }

  const { data: productDataList, isLoading } = useQuery({
    queryKey: [
      "fetchAllProducts",
      selectedLender,
      selectedProductType,
      minAmount,
      maxAmount,
      minTenure,
      maxTenure,
      minInterest,
      maxInterest,
      minScore,
      maxScore,
      minAge,
      maxAge,
      sortedBy,
      debouncedSearch,
      currentPage,
      rowsPerPage
    ],
    queryFn: getAllProductList
  });
  const clearAllFilters = () => {
    console.log("Clear Filters")
    setSelectedLender(null);
    setSelectedProductType(null);
    setMinAmount("");
    setMaxAmount("");
    setMinTenure("");
    setMaxTenure("");
    setMinInterest("");
    setMaxInterest("");
    setMinScore("");
    setMaxScore("");
    setMinAge("");
    setMaxAge("");
    setSortedBy(null);
    setSearchKey("");
    setCurrentPage(1);
    setRowsPerPage(10);
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
      name: "Product ID",
      selector: (row) => (
        <Link to={`/products/${row?.productId}`} className='text-sm text-blue-600 underline cursor-pointer'>
          {row?.productId}
        </Link>
      ),
      center: "true",
      width: "230px"
    },
    {
      name: "Product & Code",
      selector: (row) => (
        <div className='space-y-1 py-1'>
          <div className='font-semibold text-base'>{row?.productName}</div>
          <div className='text-gray-500 text-xs'>{row?.productCode}</div>
        </div>
      ),
      // center: "true",
      width: "150px"
    },
    {
      name: "Lender",
      selector: (row) => (
        <div className='text-sm font-semibold text-[#374151]'>
          {row?.lenderEntityName}
        </div>
      ),
      center: "true",
      width: "190px"
    },
    {
      name: "Type",
      selector: (row) => (
        <div className={`text-xs font-semibold py-1 px-4 rounded-full ${row?.lenderLoanType !== "UNSECURED_PERSONAL_LOAN" ? "bg-yellow-50 text-amber-700" : "bg-purple-100 text-blue-600"} `}>
          {normalizeSentence(row?.lenderLoanType)}
        </div>
      ),
      center: "true",
      width: "220px"
    },
    {
      name: "Interest",
      selector: (row) => (
        <div className='text-sm font-semibold text-blue-600'>
          {row?.fixedRateOfInterest} %
        </div>
      ),
      center: "true",
      width: "100px"
    },
    {
      name: "Product Amount",
      selector: (row) => (
        <div className='text-[#374151] space-y-2'>
          <div className='flex gap-x-2 items-center font-semibold'>
            <span>{formatINRShort(row?.minAmount)}</span>-
            <span>{formatINRShort(row?.maxAmount)}</span>
          </div>
          <div className='text-[#707B8F] text-xs'>Processing : {row?.processingFeePercentage} %</div>
        </div>
      ),
      center: "true",
      width: "180px"
    },
    {
      name: "Tenure in months",
      selector: (row) => (
        <div className='font-semibold text-[#374151]'>
          <div className='flex gap-x-2 items-center font-semibold'>
            <span>{row?.minTenureInMonths}</span>-
            <span>{row?.maxTenureInMonths}</span>
          </div>
        </div>
      ),
      center: "true",
      width: "150px"
    },
    {
      name: "Bureau Score",
      selector: (row) => (
        <div className='font-semibold text-green-600'>
          {row?.bureauScore}+
        </div>
      ),
      center: "true",
      width: "130px"
    },
    {
      name: "Age",
      selector: (row) => (
        <div className='font-semibold text-[#374151]'>
          <div className='flex gap-x-2 items-center font-semibold'>
            <span>{row?.minAge}</span>-
            <span>{row?.maxAge}</span>
          </div>
        </div>
      ),
      center: "true",
      width: "150px"
    },
    {
      name: "Employment",
      selector: (row) => (
        <div className='font-semibold text-xs text-[#5a6a86] flex flex-col gap-1 py-2'>
          {
            row?.employmentTypes && row?.employmentTypes?.map((type) => (
              <div className='py-1 px-3 border rounded-lg border-gray-400'>
                {employmentTypes[type]}
              </div>
            ))
          }
          {/* <div className='py-1 px-3 border rounded-lg border-gray-400'>Self Emp</div>
          <div className='py-1 px-3 border rounded-lg border-gray-400'>Retired</div> */}
        </div>
      ),
      center: "true",
      width: "150px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-5 items-center ">
          <Link to={`/products/${row?.productId}`}>
            <ActionButton type="view" />
          </Link>
        </div>
      ),
      center: "true",
      width: "120px"
    },
  ];

  return (
    <div className='space-y-4 md:space-y-8'>
      <h2 className='text-2xl font-semibold text-(--primary)'>Product Management</h2>

      <div className='bg-white p-4 rounded-md space-y-2'>
        <div className='flex justify-between items-center gap-4'>
          <h3 className='text-xl font-semibold'>Filter Products</h3>
          <button onClick={clearAllFilters} className='cursor-pointer py-2 px-4 rounded-md border border-gray-300 flex items-center gap-x-2'>
            <Icon icon="solar:eraser-linear" width="24" height="24" /> <span>Clear All</span></button>
        </div>
        <div className='py-2 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex flex-col gap-2 '>
            <label htmlFor="search" className="text-[#232323] text-sm">Search by ID / Name / Code </label>
            <div className="flex items-center gap-1 border border-[#d1d5db] rounded-md py-3 px-2 w-full">
              <IoSearch className="text-[#707B8F]"
              />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="outline-none placeholder:text-[#707B8F] placeholder:text-sm w-full text-xs text-[#232323]"
                placeholder="Ex: LPR989484949956"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="lender-type" className='text-gray-600 text-sm sm:text-base'>Select Lender</label>
            <Select
              options={lenderNames}
              value={selectedLender || null}
              onChange={(option) => setSelectedLender(option)}
              placeholder="Ex: HDFC"
              // styles={reactSelectCustomStyles}
              className="capitalize"
              isClearable
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="lender-type" className='text-gray-600 text-sm sm:text-base'>Select Product Type</label>
            <Select
              options={[
                { label: "Unsecured Personal Loan", value: "UNSECURED_PERSONAL_LOAN" },
              ]}
              value={selectedProductType || null}
              onChange={(option) => setSelectedProductType(option)}
              placeholder="Ex: Unsecured Personal Loan"
              // styles={reactSelectCustomStyles}
              className="capitalize"
              isClearable
            />
          </div>
          <FilterRangeOption label={"Amount"} logo={"$"} minValue={minAmount} setMinValue={setMinAmount} setMaxValue={setMaxAmount} type="number" maxValue={maxAmount} />
          <FilterRangeOption label={"Tenure"} logo={"M"} minValue={minTenure} setMinValue={setMinTenure} setMaxValue={setMaxTenure} type="number" maxValue={maxTenure} />
          <FilterRangeOption label={"Rate Of Interest"} logo={"%"} minValue={minInterest} setMinValue={setMinInterest} setMaxValue={setMaxInterest} type="number" maxValue={maxInterest} />
          <FilterRangeOption label={"Bureau Score"} minValue={minScore} setMinValue={setMinScore} setMaxValue={setMaxScore} type="number" maxValue={maxScore} />
          <FilterRangeOption label={"Age"} minValue={minAge} setMinValue={setMinAge} setMaxValue={setMaxAge} type="number" maxValue={maxAge} />
          <div className='flex flex-col gap-2'>
            <label htmlFor="lender-type" className='text-gray-600 text-sm sm:text-base'>Sort By</label>
            <Select
              options={[
                { label: "Rate Of Interest", value: "ROI" },
                { label: "Bureau Score", value: "SCORE" },
              ]}
              onChange={(option) => setSortedBy(option)}
              placeholder="Ex: Rate Of Interest"
              // styles={reactSelectCustomStyles}
              className="capitalize"
              isClearable
            />
          </div>
        </div>
      </div>
      <div className='bg-white rounded-md px-2 md:px-4 py-4 md:py-6 space-y-4'>
        <h2 className='text-lg font-semibold text-(--primary)'>List Of Products</h2>
        <DataTableBase
          columns={columns}
          data={productDataList?.products || []}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationPerPage={10}
          paginationTotalRows={productDataList?.totalProducts}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>
    </div>
  )
}

export default ProductManagement