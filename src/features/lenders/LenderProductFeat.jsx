import React, { useState } from 'react'
import AddButton from '../../components/buttons/AddButton'
import { IoSearch } from 'react-icons/io5';
import DataTableBase from '../../components/DataTableBase';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import ToggleSwitch from '../../components/buttons/ToggleSwitch';
import ActionButton from '../../components/buttons/ActionButton';
import { Link, useParams } from 'react-router-dom';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { formatINR } from '../../helpers';
import { toast } from 'react-toastify';

const LenderProductFeat = () => {
    const { id } = useParams();
    const [searchKey, setSearchKey] = useState("");
    const [statusLoading, setStatusLoading] = useState({});
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = useDebounce(searchKey);

    const { getAccessToken } = useAuth();

    const getLenderProductList = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.lenderManagement.getLenderProducts(id)}?search=${debouncedSearch}&page=${currentPage}&limit=${rowsPerPage}`, {
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

            const data = result.response?.products?.map((product) => {
                return {
                    customId: product?.customId,
                    productName: product?.productName,
                    productCode: product?.productCode,
                    minAmount: product?.minAmount,
                    maxAmount: product?.maxAmount,
                    fixedRoi: product?.fixedRateOfInterest,
                    processingFee: product?.processingFeePercentage,
                    isActive: product?.isActive,
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

    const { data: lenderProducts, isLoading, refetch } = useQuery({
        queryKey: ["fetchSpecificLenderProducts", id, debouncedSearch, currentPage, rowsPerPage],
        queryFn: getLenderProductList
    });


    const handleUpdateProductStatus = async (productId) => {
        setStatusLoading((prev) => ({ ...prev, [productId]: true }));
        try {

            const token = await getAccessToken();
            const response = await fetch(`${API_URL.productManagement.updateProductStatus(id, productId)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                // body: JSON.stringify({ staffId })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.response?.message);
            }
            await response.json();
            await refetch();
            toast.success("Product Status Updated Successfully")
        } catch (error) {
            toast.error(error?.message)
            console.log("Error in handle update staff status : ", error?.message);
        }
        setStatusLoading((prev) => ({ ...prev, [productId]: false }));
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
                <div className='text-sm text-blue-600 underline cursor-pointer'>
                    {row?.customId}
                </div>
            ),
            center: "true",
            width: "230px"
        },
        {
            name: "Product Name",
            selector: (row) => (
                <div className='text-sm' title={row?.productName}>
                    {row?.productName}
                </div>
            ),
            // center: "true",
            width: "240px"
        },
        {
            name: "Product Code",
            selector: (row) => (
                <div className='text-sm'>
                    {row?.productCode}
                </div>
            ),
            // center: "true",
            width: "150px"
        },
        {
            name: "Fixed ROI",
            selector: (row) => (
                <div className='text-sm'>
                    {row?.fixedRoi || 0}%
                </div>
            ),
            center: "true",
            width: "100px"
        },
        {
            name: "Processing Fee",
            selector: (row) => (
                <div className='text-sm'>
                    {row?.processingFee} %
                </div>
            ),
            center: "true",
            width: "140px"
        },
        {
            name: "Amount",
            selector: (row) => (
                <div className='text-sm'>
                    {formatINR(row?.minAmount)}  -  {formatINR(row?.maxAmount)}
                </div>
            ),
            center: "true",
            width: "200px"
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
                            onChange={() => handleUpdateProductStatus(row?.customId)}
                            name={row?.customId}
                            disabled={statusLoading[row?.customId]}
                        />

                    )}
                </div>
            ),
            center: "true",
            width: "120px"
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-5 items-center ">
                    <Link to={`/products/${row?.customId}`}>
                        <ActionButton type="view" />
                    </Link>
                    <Link to={`/lenders/view/${id}/products/${row?.customId}/edit`}>
                        <ActionButton type="edit" />
                    </Link>
                </div>
            ),
            center: "true",
            width: "120px"
        },
    ];


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(page);
    };
    return (
        <div>
            <div className='place-items-end'>
                {/* <h2 className='text-lg font-semibold text-(--primary)'>Lender Products</h2> */}
                <AddButton icon="stash:plus-solid" content="Add Product" to={`/lenders/view/${id}/products/add-product`} />
            </div>
            <div className='py-4 sm:py-6'>
                <div className='flex flex-col gap-2 '>
                    <label htmlFor="search" className="text-[#232323] text-sm">Search by ID / Name / Code </label>
                    <div className="w-87.5 flex items-center gap-1 border border-[#d1d5db] rounded-md p-2 max-sm:w-full">
                        <IoSearch className="text-[#707B8F]"
                        />
                        <input
                            type="text"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            className="outline-none placeholder:text-[#707B8F] placeholder:text-xs w-full text-xs text-[#232323]"
                            placeholder="Ex: LPR989484949956"
                        />
                    </div>
                </div>
            </div>
            <div>
                <h2 className='text-lg font-semibold text-(--primary)'>List Of Products</h2>
                <DataTableBase
                    columns={columns}
                    data={lenderProducts?.products || []}
                    progressPending={isLoading}
                    pagination
                    paginationServer
                    paginationPerPage={10}
                    paginationTotalRows={lenderProducts?.totalProducts}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                />
            </div>
        </div>

    )
}

export default LenderProductFeat