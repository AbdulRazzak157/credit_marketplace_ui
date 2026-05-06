import React, { use, useEffect, useState } from 'react'
import Headline from '../../components/Headline';
import { Controller, useForm } from 'react-hook-form';
import ErrorMessage from '../../shared/ErrorMessage';
import Select from 'react-select';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { Link, useOutletContext } from 'react-router-dom';
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import API_URL from '../../api/apiConfig';
import { useQuery } from "@tanstack/react-query";
import DataTableBase from '../../components/DataTableBase';
import ToggleSwitch from "../../components/buttons/ToggleSwitch"
import ActionButton from "../../components/buttons/ActionButton";
import { useAuth } from "../../context/AuthContext"
import { toast } from 'react-toastify';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import DeleteAlertModal from '../../components/DeleteAlertModal';
import { formatSentence } from '../../helpers';


const SubAdminManagement = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [staffPermissions, setStaffPermissions] = useState({});
    const [addSubAdminClicked, setAddSubAdminClicked] = useState(false)

    const [statusLoading, setStatusLoading] = useState({});
    const [deletableId, setDeletableId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loadMorePermissions, setLoadMorePermissions] = useState({})

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm();

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

    const getSubAdminList = async () => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.subAdminManagement.getSubAdminList}`, {
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
            console.log("subAdmin List: ", result.response.moduleKeys);

            const data = {
                moduleKeys: result?.response?.moduleKeys,
                permissions: result?.response?.permissions,
                subAdmins: result?.response?.subAdmins || []
            }
            console.log({ data })
            const allPermissions = Object.values(data.permissions).reduce((acc, permissions) => {
                permissions.forEach((permission) => {
                    acc[permission.value] = permission.isAdded;
                });

                return acc;
            }, {});
            setStaffPermissions(allPermissions);

            return data;

        } catch (error) {
            console.log("Error in fetch SubAdmin list : ", error?.message);
        }
    }

    const { data: subAdminList, isLoading, refetch } = useQuery({
        queryKey: ["getSubAdminList"],
        queryFn: getSubAdminList
    });

    if (isLoading) {
        return (

            <div className='flex justify-center items-center w-full h-screen'>
                <CustomCircleLoader />
            </div>
        )
    }

    const ROLE_OPTIONS = [
        { label: "Sub Admin", value: "sub_admin" },
        { label: "Operations Manager", value: "operations_manager" },
        { label: "Lender Manager", value: "lender_manager" },
        { label: "Product Manager", value: "product_manager" },
        { label: "Support Manager", value: "support_manager" },
        { label: "Executive Manager", value: "executive_manager" },
        { label: "Lead Manager", value: "lead_manager" },
        { label: "Sales Executive", value: "sales_executive" },
        { label: "Support Executive", value: "support_executive" },
        { label: "Partner Viewer", value: "partner_viewer" },
        { label: "Viewer", value: "viewer" }
    ];


    const handleUpdateStaffStatus = async (staffId) => {
        console.log("staffId ", staffId)
        setStatusLoading((prev) => ({ ...prev, [staffId]: true }));
        try {


            const token = await getAccessToken();
            console.log("token")
            const response = await fetch(`${API_URL.subAdminManagement.updateStaffAdminStatus(staffId)}`, {
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
            toast.success("Staff Status Updated Successfully")
        } catch (error) {
            toast.error(error?.message)
            console.log("Error in handle update staff status : ", error?.message);
        }
        setStatusLoading((prev) => ({ ...prev, [staffId]: false }));
    }

    const handleDeleteModal = (id) => {
        setDeletableId(id);
        setIsDeleteModalOpen(true);
    }

    const handleConfirmDeleteRecord = async (id) => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.subAdminManagement.deleteStaffAdmin(id)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ deleteReason: "Delete Staff Member" }) //
            });
            if (!response.ok) {
                const errorResult = await response.json();
                toast.error(errorResult?.message);
                throw new Error(errorResult?.message);
            };
            const result = await response.json();
            await refetch();
            toast.success(result?.message);
            console.log("Staff Deleted Successfully", result?.response);
        } catch (error) {
            toast.error(error?.message);
            console.log("Error in confirm delete :", error);
        }
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
            width: "80px"
        },
        {
            name: "Sub Admin ID",
            selector: (row) => (
                <div className='text-sm text-blue-600 underline cursor-pointer'>
                    {row?.customId}
                </div>
            ),
            // center: "true",
            width: "170px"
        },
        {
            name: "Sub Admin Role",
            selector: (row) => (
                <div className='text-sm font-semibold text-(--primary) cursor-pointer'>
                    {row?.staffRole}
                </div>
            ),
            // center: "true",
            width: "190px"
        },
        {
            name: "Sub Admin Details",
            selector: (row) => (
                <div className='flex flex-col gap-1 items-start py-4'>
                    <div className='font-semibold text-(--primary)'>{formatSentence(row?.name)}</div>
                    <div className='flex flex-col gap-0.5'>
                        <div className='text-xs text-gray-600 font-medium'>{row?.mobileNumber}</div>
                        <div className='text-xs text-gray-600 font-medium'>{row?.email}</div>
                    </div>
                </div>
            ),
            // center: "true",
            width: "250px"
        },
        {
            name: "Permissions",
            selector: (row) => {
                const permissions = loadMorePermissions[row?.email] ? row?.permissions : row?.permissions.slice(0, 3);
                return <div className='py-4 flex flex-col gap-1'>
                    {permissions?.map((permission) => (
                        <div className='py-1'>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#EEF4FF] text-[#3156D3] border border-[#D7E3FF]">{permission}</span>
                        </div>
                    ))}
                    {
                        row?.permissions?.length > 3 && (
                            <div className='mt-2' onClick={() => setLoadMorePermissions((prev) => ({ ...prev, [row?.email]: !(prev[row?.email] || false) }))}>
                                <span className='text-xs cursor-pointer py-1 px-2 bg-blue-500 text-white rounded-md'>{loadMorePermissions[row?.email] ? "Show Less" : "Load More..."}</span>
                            </div>
                        )
                    }
                </div>
            },
            // center: "true",
            width: "210px"
        },
        {
            name: "Status",
            cell: (row) => (
                <div>
                    {statusLoading[row?.customId] ? (
                        <CustomThreeDotsLoader />
                    ) : (
                        <ToggleSwitch
                            id={row.id}
                            checked={row?.isActive === true}
                            onChange={() => handleUpdateStaffStatus(row?.customId)}
                            name={row?.id}
                            disabled={statusLoading[row?.customId]}
                        />

                    )}
                </div>
            ),
            width: "100px",
            center: "true"
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-5 items-center ">
                    <Link to={`view/${row?.customId}`}>
                        <ActionButton type="edit" />
                    </Link>

                    <ActionButton
                        type="delete"
                        onClick={() => handleDeleteModal(row?.customId)}
                    />
                </div>
            ),
            width: "175px",
            center: "true",
        },
    ];

    const permissionChangeHandler = (e) => {
        console.log("event : ", e)
        const permissions = { ...staffPermissions };
        permissions[e.target.name] = e.target.checked;
        setStaffPermissions(permissions);
    }



    const addStaffHandler = async (data) => {

        if (data.staffPassword !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        console.log("form data : ", data);
        const permissions = Object.keys(staffPermissions).filter((permission) => staffPermissions[permission] === true);
        console.log("permissions to be sent : ", permissions);
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.subAdminManagement.addSubAdmin}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.staffEmail,
                    designation: data.staffDesignation.value,
                    mobileNumber: data.mobileNumber,
                    fullName: data.staffName,
                    password: data.staffPassword,
                    permissions
                })
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.response?.message);
            }

            toast.success("Sub Admin Added Successfully");
            setAddSubAdminClicked(!addSubAdminClicked)
            reset();
            setStaffPermissions({});
            await refetch();

        } catch (error) {
            toast.error(error?.message);
            console.log("Error in Adding Sub Admin: ", error?.message);
        }
    }



    return (
        <div className='flex flex-col gap-8'>
            <div>
                <Headline title="Sub Admin Management" />
            </div>
            {addSubAdminClicked &&
                <div className='bg-white rounded-md px-2 py-4 sm:px-4 sm:py-4 '>
                    <div className="flex justify-between">
                    <h2 className='text-xl font-semibold text-(--primary)'>Add Sub Admin</h2>
                    {addSubAdminClicked && (
                            <svg onClick={() => setAddSubAdminClicked(!addSubAdminClicked)} xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="currentColor" d="m8.4 16.308l3.6-3.6l3.6 3.6l.708-.708l-3.6-3.6l3.6-3.6l-.708-.708l-3.6 3.6l-3.6-3.6l-.708.708l3.6 3.6l-3.6 3.6zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
                        )}
                         </div>
                    <form autoComplete="off" onSubmit={handleSubmit(addStaffHandler)} action="" className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 '>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Enter Full Name*</label>
                            <input
                                id="staffName"
                                type="text"
                                placeholder="Enter Full Name"
                                {...register("staffName", {
                                    required: "*Full Name is required",
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Full Name should only contain letters",
                                    },
                                })}
                                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                            />
                            {
                                errors.staffName && <ErrorMessage message={errors?.staffName.message} />
                            }
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="staff-designation" className='text-gray-600 text-sm sm:text-base'>Enter Role*</label>
                            <Controller
                                control={control}
                                name="staffDesignation"
                                rules={{ required: "*This field is required." }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value}
                                        options={ROLE_OPTIONS}
                                        placeholder="Eg: Operations Manager"
                                        // styles={reactSelectCustomStyles}
                                        className="capitalize"
                                        isClearable
                                    />
                                )}
                            >
                            </Controller>
                            {
                                errors.staffDesignation && <ErrorMessage message={errors?.staffDesignation.message || "*This field is required."} />
                            }
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="staff-designation" className='text-gray-600 text-sm sm:text-base'>Enter Mobile Number*</label>

                            <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-[6px] rounded-md">

                                <Controller
                                    name="mobileNumber"
                                    control={control}
                                    rules={{
                                        required: '*Phone number is required',
                                        validate: (value) => {
                                            if (!value) return '*Phone number is required';
                                            if (!value.startsWith('+91')) return '*Only Indian numbers are allowed';
                                            return isValidPhoneNumber(value) ? true : '*Invalid phone number';
                                        },
                                    }}
                                    render={({ field }) => (
                                        <PhoneInput
                                            {...field}
                                            // readOnly={mobileOtpSent}
                                            defaultCountry="IN"
                                            countries={['IN']} // restrict dropdown to India only
                                            international
                                            countryCallingCodeEditable={false}
                                            placeholder="Enter your phone number"
                                            className="phone-input w-full min-w-37.5"
                                        />
                                    )}
                                />
                            </div>
                            {
                                errors.mobileNumber && <ErrorMessage message={errors?.mobileNumber.message} />
                            }
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-600 text-sm sm:text-base'>Enter Email id*</label>
                            <input
                                id="staffEmail"
                                type="text"
                                placeholder="Enter Email Address"
                                {...register('staffEmail', {
                                    required: '*Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: '*Enter a valid email address',
                                    },
                                })}
                                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                            />
                            {
                                errors.staffEmail && <ErrorMessage message={errors?.staffEmail.message} />
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-gray-600 text-sm xs:text-base">
                                Enter Password
                            </label>
                            <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-2 rounded-md">
                                <input
                                    id="staffPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    autoComplete="new-password"
                                    className="outline-none border-none grow placeholder:text-[#CCCCCC]"
                                    {...register("staffPassword", {
                                        required: "*Password is required",
                                        validate: {
                                            length: (v) =>
                                                /.{8,20}/.test(v) || "Password must be 8–20 characters",
                                            uppercase: (v) =>
                                                /[A-Z]/.test(v) ||
                                                "Password must include at least one uppercase letter",
                                            number: (v) =>
                                                /\d/.test(v) || "Password must include at least one number",
                                            specialChar: (v) =>
                                                /[@$!%*?&]/.test(v) ||
                                                "Password must include at least one special character",
                                        },
                                    })}
                                />
                                <div
                                    className="text-[1.2rem] cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <FaEye className="text-gray-400 text-[1.5rem]" />
                                    ) : (
                                        <IoMdEyeOff className="text-gray-400 text-[1.5rem]" />
                                    )}
                                </div>
                            </div>
                            {errors.staffPassword && <ErrorMessage message={errors.staffPassword.message} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-gray-600 text-sm xs:text-base">
                                Confirm Password
                            </label>
                            <div className="flex items-center gap-2 justify-between border border-gray-300 px-4 py-2 rounded-md">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="outline-none border-none flex-grow placeholder:text-[#CCCCCC]"
                                    {...register("confirmPassword", {
                                        required: "*Confirm Password is required",
                                        // validate: (value) => {
                                        //     if (value !== password) {
                                        //         return "*Passwords do not match";
                                        //     }
                                        // }
                                    })}
                                />
                                <div
                                    className="text-[1.2rem] cursor-pointer"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEye className="text-gray-400 text-[1.5rem]" />
                                    ) : (
                                        <IoMdEyeOff className="text-gray-400 text-[1.5rem]" />
                                    )}
                                </div>
                            </div>
                            {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
                        </div>

                        <div className='py-4'>
                            <h3 className='text-lg font-semibold text-(--primary)'>Permissions</h3>

                            {
                                subAdminList?.moduleKeys && Object.keys(subAdminList?.moduleKeys).map((module, idx) => (
                                    <div className='mt-3' key={idx}>
                                        <label htmlFor="" className='text-sm font-semibold text-(--primary)'>{subAdminList?.moduleKeys[module]}</label>
                                        <div className='flex max-sm:flex-wrap gap-4 md:gap-6 mt-1 border-gray-300 rounded-lg'>
                                            {
                                                subAdminList?.permissions && subAdminList?.permissions[module]?.map((permission, index) => (
                                                    <div key={permission?.value || index} className='min-w-62.5 max-w-fit px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 flex w-full gap-4'>
                                                        <input
                                                            name={permission.value}
                                                            type="checkbox"
                                                            checked={staffPermissions[permission.value]}
                                                            className='w-5 h-5 min-w-5 min-h-5 cursor-pointer accent-(--primary) rounded'
                                                            onClick={permissionChangeHandler}
                                                        />
                                                        <div className='text-sm text-gray-600 font-medium whitespace-nowrap'>{permission?.label}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex items-center justify-end md:col-span-2 mt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-(--primary) text-white font-medium text-base py-2 w-32 xs:w-36 rounded-md">
                                {isSubmitting ? <div className='inline-block'>
                                    <CustomThreeDotsLoader color="white" />
                                </div> : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>}
            <div className='bg-white px-2 py-4 sm:px-4 rounded-md'>
                <div className="flex justify-between">
                    <h1 className='text-xl font-semibold text-(--primary) py-2'>Sub Admin's List</h1>
                    <div className="flex items-center justify-end md:col-span-2 mt-2">
                        {!addSubAdminClicked && <button
                            type="button"
                            disabled={addSubAdminClicked}
                            onClick={() => setAddSubAdminClicked(!addSubAdminClicked)}
                            className="bg-(--primary) text-white font-medium text-base py-2 w-32 xs:w-36 rounded-md">
                            Add Sub Admin
                        </button>
                        }
                    </div>
                </div>
                <DataTableBase
                    columns={columns}
                    data={subAdminList?.subAdmins || []}
                    progressPending={isLoading}
                    pagination
                    paginationServer
                    paginationPerPage={10}
                    paginationTotalRows={subAdminList?.subAdmins?.length}
                />

            </div>
            {
                isDeleteModalOpen && (
                    <DeleteAlertModal
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        deletableId={deletableId}
                        setDeletableId={setDeletableId}
                        mainText={"Delete Staff Member?"}
                        subText={"Are you sure  want to remove this Staff ?"}
                        handleConfirmDeleteRecord={handleConfirmDeleteRecord}
                    />
                )
            }
        </div>
    );
}

export default SubAdminManagement