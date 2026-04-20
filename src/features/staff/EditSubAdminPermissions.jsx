import React, { useEffect, useState } from 'react'
import Headline from '../../components/Headline';
import { Controller, useForm } from 'react-hook-form';
import ErrorMessage from '../../shared/ErrorMessage';
import Select from 'react-select';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import API_URL from '../../api/apiConfig';
import { useQuery } from "@tanstack/react-query";
import NavigationHeadline from '../../components/NavigationHeadline';
import { toast } from 'react-toastify';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { useAuth } from '../../context/AuthContext';



const EditSubAdminPermissions = () => {

    const { id } = useParams();
    const [staffName, setStaffName] = useState("");
    const [staffDesignation, setStaffDesignation] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [staffPermissions, setStaffPermissions] = useState({});
    const mainRef = useOutletContext();
    useEffect(() => {
        console.log("mainRef : ", mainRef?.current, mainRef);
        if (mainRef?.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [id])
    const { getAccessToken } = useAuth();
    const navigate = useNavigate();

    const getSpecificStaffDetails = async () => {
        try {
            const token = "";
            const response = await fetch(`${API_URL.subAdminManagement.getSpecificStaffAdmin(id)}`, {
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
            console.log("Specific Staff Profile: ", result.response);


            const data = {
                name: result?.response?.name,
                email: result?.response?.email,
                mobileNumber: result?.response?.mobileNumber,
                designation: result?.response?.designation || "operations_manager",
                moduleKeys: result?.response?.permissionKeys,
                permissions: result?.response?.userPermissions,
            }
            setStaffName(data.name);
            setStaffDesignation({
                label: data?.designation?.toLowerCase().split("_").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "),
                value: data?.designation?.toLowerCase()
            });
            const allPermissions = Object.values(data.permissions).reduce((acc, permissions) => {
                permissions.forEach((permission) => {
                    acc[permission.value] = permission.isAdded;
                });

                return acc;
            }, {});
            setStaffPermissions(allPermissions);
            data.previousPermissions = allPermissions;
            console.log({ data, allPermissions })

            return data;

        } catch (error) {
            console.log("Error in fetch SubAdmin list : ", error?.message);
        }
    };

    const { data: StaffProfile, isLoading } = useQuery({
        queryKey: ["getSpecificStaffProfile"],
        queryFn: getSpecificStaffDetails
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

    const permissionChangeHandler = (e) => {
        console.log("event : ", e)
        const permissions = { ...staffPermissions };
        permissions[e.target.name] = e.target.checked;
        setStaffPermissions(permissions);
    }

    const onSaveStaffProfile = async () => {

        setIsSaving(true);

        let isChange = false;

        if (StaffProfile.name !== staffName) isChange = true;
        if (StaffProfile.designation !== staffDesignation.value?.toLowerCase()) isChange = true;

        console.log(staffPermissions, StaffProfile.previousPermissions)
        Object.keys(staffPermissions).forEach((permission) => {

            if (StaffProfile?.previousPermissions[permission] !== staffPermissions[permission]) {
                isChange = true;
            }
        });

        if (!isChange) {
            toast.error("Staff Profile Unchanged");
            return;
        }
        try {
            const permissions = Object.keys(staffPermissions).filter((permission) => staffPermissions[permission]);
            const token = await getAccessToken();
            const response = await fetch(`${API_URL.subAdminManagement.updateStaffAdminPermissions(id)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ permissions })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }
            // const result = await response.json();
            // console.log("Result from the OnSave Permissions: ", result);
            toast.success("Staff Updated Successfully");

            navigate('/sub-admins');
        } catch (error) {
            console.log("Error in Saving Edit staff permissions : ", error?.message);
        }
        setIsSaving(false);

    }

    return (
        <div className='flex flex-col gap-5'>
            <div>
                <NavigationHeadline content={"Back"} to="/sub-admins" />
            </div>
            <div className='bg-white rounded-md px-2 py-4 sm:px-4 sm:py-4 '>
                <h2 className='text-xl font-semibold text-(--primary)'>Profile</h2>
                <div action="" className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 px-3 sm:px-8 xl:px-12 py-4 '>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Name</label>
                        <input
                            id="staffName"
                            type="text"
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                            placeholder="Enter Full Name"
                            className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                        />
                        {
                            !isLoading && !staffName && <ErrorMessage message={"This field is required."} />
                        }
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="staff-designation" className='text-gray-600 text-sm sm:text-base'>Role</label>
                        <Select
                            options={ROLE_OPTIONS}
                            value={staffDesignation?.value ? staffDesignation : ""}
                            placeholder="Eg: Operations Manager"
                            onChange={(e) => setStaffDesignation(e)}
                            // styles={reactSelectCustomStyles}
                            className="capitalize"
                            isClearable
                        />

                        {
                            !isLoading && !staffDesignation && <ErrorMessage message={"*This field is required."} />
                        }
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Mobile Number</label>
                        <input
                            id="staffMobile"
                            type="text"
                            value={StaffProfile.mobileNumber}
                            disabled={true}
                            placeholder="Enter Mobile"
                            className='outline-none border border-gray-300 px-4 py-2 rounded-md bg-gray-200 cursor-not-allowed'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="staff-name" className='text-gray-600 text-sm sm:text-base'>Email Address</label>
                        <input
                            id="staffEmail"
                            type="text"
                            value={StaffProfile.email}
                            disabled={true}
                            placeholder="Enter Email"
                            className='outline-none border border-gray-300 px-4 py-2 rounded-md bg-gray-200 cursor-not-allowed'
                        />
                    </div>

                    <div className='py-4'>
                        <h3 className='text-lg font-semibold text-(--primary)'>Permissions</h3>

                        {
                            StaffProfile?.moduleKeys && Object.keys(StaffProfile?.moduleKeys).map((module, idx) => (
                                <div className='mt-3' key={idx}>
                                    <label htmlFor="" className='text-sm font-semibold text-(--primary)'>{StaffProfile?.moduleKeys[module]}</label>
                                    <div className='flex gap-4 mt-1 border-gray-300 rounded-lg'>
                                        {
                                            StaffProfile?.permissions && StaffProfile?.permissions[module]?.map((permission, index) => (
                                                <div key={permission?.value || index} className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 flex w-full gap-4'>
                                                    <input
                                                        name={permission.value}
                                                        type="checkbox"
                                                        checked={staffPermissions[permission.value]}
                                                        onChange={permissionChangeHandler}
                                                        className='w-5 h-5 cursor-pointer accent-(--primary) rounded'
                                                    // onClick={checkHandler}
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
                            onClick={onSaveStaffProfile}
                            disabled={isSaving}
                            className="bg-(--primary) text-white font-medium text-base py-2 w-32 h-10 xs:w-36 rounded-md">
                            {isSaving ? (<CustomThreeDotsLoader color="white" />) : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditSubAdminPermissions;