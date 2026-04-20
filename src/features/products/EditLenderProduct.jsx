import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../shared/ErrorMessage';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import { State, City } from 'country-state-city';
import { toast } from 'react-toastify';
import API_URL from '../../api/apiConfig';
import CustomThreeDotsLoader from '../../shared/CustomThreeDotsLoader';
import { useQuery } from '@tanstack/react-query';
import CustomCircleLoader from '../../shared/CustomCircleLoader';
import { normalizeSentence } from '../../helpers';

const EditLenderProduct = () => {
  const { id, productId } = useParams();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm();
  const [includePincode, setIncludePincode] = useState("");
  const [includePincodeErr, setIncludePincodeErr] = useState("");
  const [excludePincode, setExcludePincode] = useState("");
  const [excludePincodeErr, setExcludePincodeErr] = useState("");
  const [includePincodeList, setIncludePincodeList] = useState([]);
  const [excludePincodeList, setExcludePincodeList] = useState([]);
  const states = State.getStatesOfCountry("IN").map((state) => ({ label: state.name, value: state.name }));
  const cities = City.getCitiesOfCountry("IN").map((city) => ({ label: city.name, value: city.name }));
  const [includeCities, setIncludeCities] = useState([]);
  const [excludeCities, setExcludeCities] = useState([]);

  const [includeStates, setIncludeStates] = useState([]);
  const [excludeStates, setExcludeStates] = useState([]);

  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const mainRef = useOutletContext();
  useEffect(() => {
    console.log("mainRef : ", mainRef?.current, mainRef);
    if (mainRef?.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [id, productId])

  const getSpecificLenderProductData = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.productManagement.getLenderProductDetails(productId)}`, {
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
      console.log("Result from get specific Lender API: ", result.response);
      const product = result?.response;
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // const product = {
      //   productName: 'Life Saver',
      //   productCode: 'WEALTH2026003346',
      //   lenderLoanType: 'UNSECURED_PERSONAL_LOAN',
      //   minAmount: 200000,
      //   maxAmount: 500000,
      //   fixedRateOfInterest: 12.5,
      //   processingFeePercentage: 1.5,
      //   minAge: 19,
      //   maxAge: 45,
      //   minTenureInMonths: 12,
      //   maxTenureInMonths: 36,
      //   minIncome: 30000,
      //   maxActiveLoans: 2,
      //   minBureauScore: 650,
      //   maxFoir: 30,
      //   employmentTypes: ['SELF_EMPLOYED', 'SALARIED'],
      //   maxDpd30: 5,
      //   maxDpd60: 0,
      //   maxDpd90: 1,
      //   last30DaysEnquiries: 1,
      //   defaultGeoDecision: 'ALLOW',
      //   utmLink: 'https://www.google.com',
      //   genders: ['FEMALE'],
      //   includeCities: ['Hyderabad'],
      //   excludeCities: ['Bangalore Urban'],
      //   includeStates: ['Telangana'],
      //   excludeStates: ['Tamil Nadu'],
      //   includePincodes: ['505401', '500046', '500098', '500062', '500031'],
      //   excludePincodes: ['500037', '500032']
      // }
      const data = {
        productName: product?.productName,
        productCode: product?.productCode,
        productType: product?.lenderLoanType,
        productUtm: product?.utmLink,
        productMinAmount: product?.minAmount,
        productMaxAmount: product?.maxAmount,
        productInterest: product?.fixedRateOfInterest,
        productProcessingFee: product?.processingFeePercentage,
        productMinAge: product?.minAge,
        productMaxAge: product?.maxAge,
        productMinTenure: product?.minTenureInMonths,
        productMaxTenure: product?.maxTenureInMonths,
        productMinIncome: product?.minIncome,
        productActiveLoans: product?.maxActiveLoans,
        productBureauScore: product?.minBureauScore,
        productFoir: product?.maxFoir,
        productEmploymentTypes: product?.employmentTypes,
        productDpd30: product?.maxDpd30,
        productDpd60: product?.maxDpd60,
        productDpd90: product?.maxDpd90,
        product30daysEnquiries: product?.last30DaysEnquiries,
        defaultGeo: product?.defaultGeoDecision,
        productGender: product?.genders,

      }

      setIncludePincodeList(product?.includePincodes);
      setExcludePincodeList(product?.excludePincodes);

      const incCities = product?.includeCities?.map((city) => ({ label: city, value: city }));
      const excCities = product?.excludeCities?.map((city) => ({ label: city, value: city }));

      const incStates = product?.includeStates?.map((state) => ({ label: state, value: state }));
      const excStates = product?.excludeStates?.map((state) => ({ label: state, value: state }));

      setIncludeCities(incCities);
      setExcludeCities(excCities);

      setIncludeStates(incStates);
      setExcludeStates(excStates);



      const lenderProductData = {
        ...product,
        includeCities: product?.includeCities,
        excludeCities: product?.excludeCities,
        includeStates: product?.includeStates,
        excludeStates: product?.excludeStates,
        includePincodes: product?.includePincodes,
        excludePincodes: product?.excludePincodes
      }
      data.productType = { value: product?.lenderLoanType, label: normalizeSentence(product?.lenderLoanType) };
      data.productEmploymentTypes = product?.employmentTypes?.map((type) => ({ value: type, label: type })) || [];
      data.defaultGeo = product?.defaultGeoDecision === "ALLOW" ? "INCLUDE" : "EXCLUDE";
      data.productGender = product?.genders?.map((gender) => ({ value: gender, label: gender })) || [];

      reset(data);

      return lenderProductData;

    } catch (error) {
      console.log("Error in fetch specific lender product: ", error?.message);
    }
  }

  const { data: lenderProductDetails, isLoading } = useQuery({
    queryKey: ["fetchSpecificLenderEditData", id,productId],
    queryFn: getSpecificLenderProductData,
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-screen'>
        <CustomCircleLoader />
      </div>
    )
  }

  const handleAddIncludePincode = () => {
    const trimmedPincode = includePincode.trim();

    // validation
    if (!trimmedPincode) {
      setIncludePincodeErr("Please enter a pincode");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(trimmedPincode)) {
      setIncludePincodeErr("Please enter a valid 6-digit pincode");
      return;
    }

    if (includePincodeList.includes(trimmedPincode)) {
      setIncludePincodeErr("This pincode is already added");
      return;
    }

    setIncludePincodeList((prev) => [...prev, trimmedPincode]);
    setIncludePincode("");
    setIncludePincodeErr("");
  };

  const handleAddExcludePincode = () => {
    const trimmedPincode = excludePincode.trim();
    console.log("state : ", State.getStatesOfCountry("IN"));

    // validation
    if (!trimmedPincode) {
      setExcludePincodeErr("Please enter a pincode");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(trimmedPincode)) {
      setExcludePincodeErr("Please enter a valid 6-digit pincode");
      return;
    }

    if (excludePincodeList.includes(trimmedPincode)) {
      setExcludePincodeErr("This pincode is already added");
      return;
    }

    setExcludePincodeList((prev) => [...prev, trimmedPincode]);
    setExcludePincode("");
    setExcludePincodeErr("");
  };

  const removeIncludePincode = (pincode) => {
    const pincodes = [...includePincodeList].filter((pin) => pin != pincode);
    setIncludePincodeList(pincodes);
  }
  const removeExcludePincode = (pincode) => {
    const pincodes = [...excludePincodeList].filter((pin) => pin != pincode);
    setExcludePincodeList(pincodes);
  }

  const updateDropdownList = ({ action, data, stateList, setStateList }) => {
    console.log("update dropdown list event : ", action, data, stateList);

    if (action === "select-option") {
      const state = [...stateList];
      state.push(data.option);
      setStateList(state);
    }

    if (action === "remove-value") {
      const state = [...stateList].filter((option) => option.label !== data.removedValue.label);
      console.log({ state });
      setStateList(state);
    }

    if (action === "clear") {
      setStateList([]);
    }
  }

  const onUpdateHandler = async (data) => {
    // console.log("product data: ", data, { includePincode, excludePincode, includeCities, excludeCities, includeStates, excludeStates });

    if (!includePincodeList?.length && !excludePincodeList?.length && !includeCities?.length && !excludeCities?.length && !includeStates?.length && !excludeStates?.length) {
      toast.error("Add Geo Rules");
      return;
    }

    try {
      const productFields = [
        "productName",
        "productCode",
        "lenderLoanType",
        "minAmount",
        "maxAmount",
        "fixedRateOfInterest",
        "processingFeePercentage",
        "utmLink"
      ];
      const productPolicyFields = [
        "minAmount",
        "maxAmount",
        "minAge",
        "maxAge",
        "minTenureInMonths",
        "maxTenureInMonths",
        "minIncome",
        "maxActiveLoans",
        "minBureauScore",
        "maxFoir",
        "employmentTypes",
        "maxDpd30",
        "maxDpd60",
        "maxDpd90",
        "last30DaysEnquiries",
        "defaultGeoDecision",
        "genders"
      ];
      const productGeo = [
        "includePincodes",
        "excludePincodes",
        "includeCities",
        "excludeCities",
        "includeStates",
        "excludeStates"
      ]
      const payload = {
        lenderId: id,
        productName: data?.productName,
        productCode: data?.productCode,
        lenderLoanType: data?.productType?.value,
        fixedRateOfInterest: +data?.productInterest,
        processingFeePercentage: +data?.productProcessingFee,
        minAmount: +data?.productMinAmount,
        maxAmount: +data?.productMaxAmount,
        utmLink: data?.productUtm,

        minAge: +data?.productMinAge,
        maxAge: +data?.productMaxAge,
        minTenureInMonths: +data?.productMinTenure,
        maxTenureInMonths: +data?.productMaxTenure,
        minIncome: data?.productMinIncome,
        maxActiveLoans: +data?.productActiveLoans,
        minBureauScore: +data?.productBureauScore,
        maxFoir: +data?.productFoir,
        employmentTypes: data?.productEmploymentTypes?.map((type) => type.value) || [],
        maxDpd30: +data?.productDpd30,
        maxDpd60: +data?.productDpd60,
        maxDpd90: +data?.productDpd90,
        last30DaysEnquiries: +data?.product30daysEnquiries,
        defaultGeoDecision: data?.defaultGeo === "INCLUDE" ? "ALLOW" : "REJECT",
        genders: data?.productGender?.map((gender) => gender?.value),

        includePincodes: includePincodeList,
        excludePincodes: excludePincodeList,

        includeCities: includeCities?.map((type) => type.value) || [],
        excludeCities: excludeCities?.map((type) => type.value) || [],

        includeStates: includeStates?.map((type) => type.value) || [],
        excludeStates: excludeStates?.map((type) => type.value) || []
      }

      const productData = {};
      const productPolicyData = {};
      const productGeoData = {};

      for (let field of Object.keys(payload)) {

        // For Product
        if (productFields.includes(field)) {
          console.log("field: ", field, ", status : ", productFields.includes(field), " , name : Product");
          if (payload[field] && Array.isArray(payload[field])) {
            if (payload[field]?.length !== lenderProductDetails[field]?.length) {
              productData[field] = payload[field];
            } else {
              let isChanged = false;
              payload[field].forEach((value) => {
                if (!lenderProductDetails[field]?.includes(value)) {
                  isChanged = true;
                }
              })
              if (isChanged) {
                productData[field] = payload[field];
              }
            }
          } else {
            if (lenderProductDetails[field] !== payload[field]) {
              productData[field] = payload[field];
            }
          }
        }

        // For Product Policies
        if (productPolicyFields.includes(field)) {
          console.log("field: ", field, ", status : ", productPolicyFields.includes(field), " , name : Policy");
          if (payload[field] && Array.isArray(payload[field])) {
            if (payload[field]?.length !== lenderProductDetails[field]?.length) {
              productPolicyData[field] = payload[field];
            } else {
              let isChanged = false;
              payload[field].forEach((value, index) => {
                if (!lenderProductDetails[field]?.includes(value)) {
                  isChanged = true;
                }
              })
              if (isChanged) {
                productPolicyData[field] = payload[field];
              }
            }
          } else {
            if (lenderProductDetails[field] !== payload[field]) {
              productPolicyData[field] = payload[field];
            }
          }
        }

        // For Product Geo
        if (productGeo.includes(field)) {
          console.log("field: ", field, ", status : ", productGeo.includes(field), " , name : Geo");
          if (payload[field] && Array.isArray(payload[field])) {
            if (payload[field]?.length !== lenderProductDetails[field]?.length) {
              productGeoData[field] = payload[field];
            } else {
              let isChanged = false;
              payload[field].forEach((value, index) => {
                if (!lenderProductDetails[field]?.includes(value)) {
                  isChanged = true;
                }
              })
              if (isChanged) {
                productGeoData[field] = payload[field];
              }
            }
          }
        }


      }

      console.log("payload : ", payload);
      console.log("lender Product Payload : ", lenderProductDetails);
      console.log("Product Data : ", productData);
      console.log("Product Policy : ", productPolicyData);
      console.log("product geo : ", productGeoData);

      const token = await getAccessToken();
      const response = await fetch(`${API_URL.productManagement.updateLenderProduct(id, productId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productData,
          policyData: productPolicyData,
          geoPolicyData: productGeoData
        })
      });
      console.log({ response });



      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.response?.message || "Failed to add Lender");
      }
      // const result = await response.json();
      // console.log("result from Update lender product ", result);
      reset();
      navigate(`/lenders/view/${id}/products`);

      toast.success("Product Updated Successfully");

    } catch (error) {
      console.log("Error in add Lender Product : ", error?.message);
      toast.error(error?.message);
    }
  }
  return (
    <div className='space-y-4'>
      <h2 className='text-xl text-(--primary) font-semibold'>Update Lender Product Rules</h2>
      <form action="" onSubmit={handleSubmit(onUpdateHandler)} className='space-y-4 md:space-y-6'>

        <div className='space-y-1 md:space-y-2 border-b border-gray-300 pb-4'>
          <div>
            <h3 className='font-semibold'>1. Product Details</h3>
            <p className='text-xs text-gray-500'>Configure basic information and identifiers for this product</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-name" className='text-gray-600 text-sm sm:text-base'>Product Name*</label>
              <input
                type="text"
                placeholder="Enter Product Name"
                {...register("productName", {
                  required: "*Product Name is required",
                  pattern: {
                    value: /^[A-Za-z0-9 ]+$/,
                    message: "Please enter only letters, numbers, and spaces",
                  }
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productName && <ErrorMessage message={errors?.productName.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-type" className='text-gray-600 text-sm sm:text-base'>Product Type*</label>
              <Controller
                control={control}
                name="productType"
                rules={{ required: "*This field is required." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Unsecured Personal Loan", value: "UNSECURED_PERSONAL_LOAN" },
                    ]}
                    placeholder="Ex: Unsecured Personal Loan"
                    // styles={reactSelectCustomStyles}
                    className="capitalize"
                    isClearable
                  />
                )}
              >
              </Controller>
              {
                errors.productType && <ErrorMessage message={errors?.productType.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-code" className='text-gray-600 text-sm sm:text-base'>Product Code*</label>
              <input
                type="text"
                placeholder="Enter Product Code"
                {...register("productCode", {
                  required: "*Product Code is required",
                  pattern: {
                    value: /^[A-Za-z0-9-]*$/,
                    message: "Please enter only letters, numbers, and hyphens",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productCode && <ErrorMessage message={errors?.productCode.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-utmLink" className='text-gray-600 text-sm sm:text-base'>UTM Link*</label>
              <input
                type="text"
                placeholder="Enter UTM Link"
                {...register("productUtm", {
                  required: "*UTM Link is required",
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/,
                    message: "Enter a valid URL",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productUtm && <ErrorMessage message={errors?.productUtm.message} />
              }
            </div>
          </div>
        </div>

        <div className='space-y-1 md:space-y-4 border-b border-gray-300 pb-4'>
          <div>
            <h3 className='font-semibold'>2. Financial Criteria</h3>
            <p className='text-xs text-gray-500'>Define product amount, tenure, pricing and income related data.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-name" className='text-gray-600 text-sm sm:text-base'>Fixed Rate Of Interest*</label>
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Enter Rate of Interest"
                  {...register("productInterest", {
                    required: "*Rate of Interest is required",
                    pattern: {
                      value: /^(100(\.0+)?|([0-9]{1,2})(\.\d+)?)$/,
                      message: "Please enter a valid percentage between 0 and 100",
                    }
                  })}
                  className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                />
                <Icon icon="carbon:percentage-filled" className="absolute right-2 bottom-3 text-gray-600" />
              </div>
              {
                errors.productInterest && <ErrorMessage message={errors?.productInterest.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-processingFee" className='text-gray-600 text-sm sm:text-base'>Processing Fee*</label>
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Enter Processing Fee"
                  {...register("productProcessingFee", {
                    required: "*Processing Fee is required",
                    pattern: {
                      value: /^(100(\.0+)?|([0-9]{1,2})(\.\d+)?)$/,
                      message: "Please enter a valid percentage between 0 and 100",
                    }
                  })}
                  className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                />
                <Icon icon="carbon:percentage-filled" className="absolute right-2 bottom-3 text-gray-600" />
              </div>
              {
                errors.productProcessingFee && <ErrorMessage message={errors?.productProcessingFee.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-income" className='text-gray-600 text-sm sm:text-base'>Min Income*</label>
              <input
                type="text"
                placeholder="Enter Income"
                {...register("productMinIncome", {
                  required: "*Income is required",
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Enter a valid income",
                  }
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productMinIncome && <ErrorMessage message={errors?.productMinIncome.message} />
              }
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <h2 className='text-sm font-semibold text-gray-600'>Product Amount Range</h2>
              <div className='flex flex-col md:flex-row justify-between items-start  gap-4'>
                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-minAmount" className='text-gray-600 text-sm sm:text-base'>Min Amount*</label>
                  <input
                    type="text"
                    placeholder="Enter Min Amount"
                    {...register("productMinAmount", {
                      required: "*Min Amount is required",
                      pattern: {
                        value: /^[1-9][0-9]*$/,
                        message: "Enter a valid Amount"
                      }
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                  />
                  {
                    errors.productMinAmount && <ErrorMessage message={errors?.productMinAmount.message} />
                  }
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-minAmount" className='text-gray-600 text-sm sm:text-base'>Max Amount*</label>
                  <input
                    type="text"
                    placeholder="Enter Max amount"
                    {...register("productMaxAmount", {
                      required: "*Max Amount is required",
                      pattern: {
                        value: /^[1-9][0-9]*$/,
                        message: "Enter a valid Amount"
                      }
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                  />
                  {
                    errors.productMaxAmount && <ErrorMessage message={errors?.productMaxAmount.message} />
                  }
                </div>
              </div>
            </div>
            <div className='space-y-1'>
              <h2 className='text-sm font-semibold text-gray-600'>Product Tenure Range in Months</h2>
              <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-minTenure" className='text-gray-600 text-sm sm:text-base'>Min Tenure*</label>
                  <input
                    type="text"
                    placeholder="Enter Min Months"
                    {...register("productMinTenure", {
                      required: "*Min Tenure is required",
                      pattern: {
                        value: /^[1-9][0-9]*$/,
                        message: "Enter a valid Tenure"
                      }
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                  />
                  {
                    errors.productMinTenure && <ErrorMessage message={errors?.productMinTenure.message} />
                  }
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-maxTenure" className='text-gray-600 text-sm sm:text-base'>Max Tenure*</label>
                  <input
                    type="text"
                    placeholder="Enter Max Months"
                    {...register("productMaxTenure", {
                      required: "*Max Amount is required",
                      pattern: {
                        value: /^[1-9][0-9]*$/,
                        message: "Enter a valid tenure"
                      }
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                  />
                  {
                    errors.productMaxTenure && <ErrorMessage message={errors?.productMaxTenure.message} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-1 md:space-y-4 border-b border-gray-300 pb-4'>
          <div>
            <h3 className='font-semibold'>3. Application Eligibility</h3>
            <p className='text-xs text-gray-500'>Set borrower qualification rules such as Age, employment Type, bureau and active loans threshold.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-activeLoans" className='text-gray-600 text-sm sm:text-base'>Max Active Loans*</label>
              <input
                type="text"
                placeholder="Enter Active Loans"
                {...register("productActiveLoans", {
                  required: "*Max Active Loans is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productActiveLoans && <ErrorMessage message={errors?.productActiveLoans.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-bureauScore" className='text-gray-600 text-sm sm:text-base'>Min Bureau Score*</label>
              <input
                type="text"
                placeholder="Enter Bureau Score"
                {...register("productBureauScore", {
                  required: "*Bureau Score is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                  validate: (value) =>
                    (Number(value) >= 300 && Number(value) <= 900) ||
                    "Enter score between 300 and 900",
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productBureauScore && <ErrorMessage message={errors?.productBureauScore.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-foir" className='text-gray-600 text-sm sm:text-base'>Max FOIR*</label>
              <div className='relative w-full'>
                <input
                  type="text"
                  placeholder="Enter FOIR"
                  {...register("productFoir", {
                    required: "*FOIR is required",
                    pattern: {
                      value: /^(100(\.0+)?|([0-9]{1,2})(\.\d+)?)$/,
                      message: "Please enter a valid percentage between 0 and 100",
                    },
                    validate: (value) =>
                      (Number(value) >= 0 && Number(value) <= 100) ||
                      "Enter value between 0 and 100",
                  })}
                  className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                />
                <Icon icon="carbon:percentage-filled" className="absolute right-2 bottom-3 text-gray-600" />
              </div>
              {
                errors.productFoir && <ErrorMessage message={errors?.productFoir.message} />
              }
            </div>
            <div className='flex flex-col gap-1 mt-1'>
              <label htmlFor="product-EmploymentType" className='text-gray-600 text-sm sm:text-base'>Select Genders*</label>
              <Controller
                control={control}
                name="productGender"
                rules={{ required: "*This field is required." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "MALE", value: "MALE" },
                      { label: "FEMALE", value: "FEMALE" },
                      { label: "OTHERS", value: "OTHERS" },
                    ]}
                    placeholder="Ex: MALE"
                    // styles={reactSelectCustomStyles}
                    className="capitalize"
                    isClearable
                    isMulti={true}
                  />
                )}
              >
              </Controller>
              {
                errors.productGender && <ErrorMessage message={errors?.productGender.message} />
              }
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-end'>
            <div className='space-y-1'>
              <h2 className='text-sm font-semibold text-gray-600'>Age Qualification Range</h2>
              <div className='flex flex-col md:flex-row justify-between items-start  gap-4'>
                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-minAmount" className='text-gray-600 text-sm sm:text-base'>Min Age*</label>
                  <input
                    type="number"
                    placeholder="Enter Min Age"
                    {...register("productMinAge", {
                      required: "*Min Age is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers allowed",
                      },
                      validate: (value) =>
                        (Number(value) >= 18 && Number(value) <= 100) ||
                        "Enter age between 18 and 100",
                      min: { value: 18, message: "Min age is 18" },
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md'
                  />
                  {
                    errors.productMinAge && <ErrorMessage message={errors?.productMinAge.message} />
                  }
                </div>

                <div className='flex flex-col gap-1 w-full'>
                  <label htmlFor="product-minAmount" className='text-gray-600 text-sm sm:text-base'>Max Age*</label>
                  <input
                    type="number"
                    placeholder="Enter Max Age"
                    {...register("productMaxAge", {
                      required: "*Max Age is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers allowed",
                      },
                      validate: (value) =>
                        (Number(value) >= 18 && Number(value) <= 100) ||
                        "Enter age between 18 and 100",
                      max: { value: 100, message: "Max age is 100" },
                    })}
                    className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                  />
                  {
                    errors.productMaxAge && <ErrorMessage message={errors?.productMaxAge.message} />
                  }
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-EmploymentType" className='text-gray-600 text-sm sm:text-base'>Select Employment Types*</label>
              <Controller
                control={control}
                name="productEmploymentTypes"
                rules={{ required: "*This field is required." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "SALARIED", value: "SALARIED" },
                      { label: "SELF_EMPLOYED", value: "SELF_EMPLOYED" },
                      { label: "RETIRED", value: "RETIRED" },
                    ]}
                    placeholder="Ex: SALARIED"
                    // styles={reactSelectCustomStyles}
                    className="capitalize"
                    isClearable
                    isMulti={true}
                  />
                )}
              >
              </Controller>
              {
                errors.productEmploymentTypes && <ErrorMessage message={errors?.productEmploymentTypes.message} />
              }
            </div>
          </div>
        </div>

        <div className='space-y-1 md:space-y-4 border-b border-gray-300 pb-4'>
          <div>
            <h3 className='font-semibold'>4. Credit History Rules</h3>
            <p className='text-xs text-gray-500'>Configure repayment behavior and recent credit activity limits.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-dpd30" className='text-gray-600 text-sm sm:text-base'>Max DPD 30*</label>
              <input
                type="number"
                placeholder="Enter DPD 30"
                {...register("productDpd30", {
                  required: "*DPD 30 is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productDpd30 && <ErrorMessage message={errors?.productDpd30.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-dpd60" className='text-gray-600 text-sm sm:text-base'>Max DPD 60*</label>
              <input
                type="number"
                placeholder="Enter DPD 60"
                {...register("productDpd60", {
                  required: "*DPD 60 is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productDpd60 && <ErrorMessage message={errors?.productDpd60.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-dpd90" className='text-gray-600 text-sm sm:text-base'>Max DPD 90*</label>
              <input
                type="number"
                placeholder="Enter DPD 90"
                {...register("productDpd90", {
                  required: "*DPD 90 is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.productDpd90 && <ErrorMessage message={errors?.productDpd90.message} />
              }
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="product-income" className='text-gray-600 text-sm sm:text-base'>Last 30 days Enquiries*</label>
              <input
                type="number"
                placeholder="Enter enquires"
                {...register("product30daysEnquiries", {
                  required: "*Enquires are required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
                className='outline-none border border-gray-300 px-4 py-2 rounded-md'
              />
              {
                errors.product30daysEnquiries && <ErrorMessage message={errors?.product30daysEnquiries.message} />
              }
            </div>
          </div>
        </div>

        <div className='space-y-1 md:space-y-4 border-b border-gray-300 pb-4'>
          <div>
            <h3 className='font-semibold'>5. Geo Eligibility Rules</h3>
            <p className='text-xs text-gray-500'>Check the 'i' card to configure the geo priority rule.</p>
          </div>
          <div className='space-y-2'>
            <div>
              <h3 className='font-semibold'>Priority Rule 1</h3>
              <p className='text-xs text-gray-500'>Highest Priority. If a customer pincode matches here, city/state rules will be ignored.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className=''>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="product-includePincode" className='text-gray-600 text-sm sm:text-base'>Include Pincode</label>
                  <div className='relative'>
                    <input
                      type="text"
                      placeholder="Enter Pincode"
                      value={includePincode}
                      onChange={(e) => {
                        setIncludePincode(e.target.value);
                        if (includePincodeErr !== "") {
                          setIncludePincodeErr("");
                        }
                      }}
                      className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                    />
                    <Icon icon="flat-color-icons:plus" onClick={handleAddIncludePincode} width={28} height={28} className="absolute right-2 bottom-2 text-gray-600 cursor-pointer" />
                  </div>
                  {
                    includePincodeErr && <ErrorMessage message={includePincodeErr} />
                  }
                </div>
                <div className='flex gap-2 flex-wrap lg:gap-x-2 py-2'>
                  {
                    includePincodeList?.length > 0 && includePincodeList.map((pincode) =>
                      <div
                        className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                        style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                      >
                        {pincode}
                        <span onClick={() => removeIncludePincode(pincode)} className='text-xs min-w-4 min-h-2 pb-px bg-white rounded-full text-black text-center cursor-pointer'>
                          x
                        </span>
                      </div>
                    )
                  }
                </div>
              </div>
              <div>
                <div className='flex flex-col gap-1 relative'>
                  <label htmlFor="product-excludePincode" className='text-gray-600 text-sm sm:text-base'>Exclude Pincode</label>
                  <div className='relative'>
                    <input
                      type="text"
                      placeholder="Enter Pincode"
                      value={excludePincode}
                      onChange={(e) => {
                        setExcludePincode(e.target.value);
                        if (excludePincodeErr !== "") {
                          setExcludePincodeErr("");
                        }
                      }}
                      className='outline-none border border-gray-300 px-4 py-2 rounded-md w-full'
                    />
                    <Icon icon="flat-color-icons:plus" onClick={handleAddExcludePincode} width={28} height={28} className="absolute right-2 bottom-2 text-gray-600 cursor-pointer" />
                  </div>
                  {
                    excludePincodeErr && <ErrorMessage message={excludePincodeErr} />
                  }
                </div>
                <div className='flex gap-2 lg:gap-x-2 py-2'>
                  {
                    excludePincodeList?.length > 0 && excludePincodeList.map((pincode) =>
                      <div
                        className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                        style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                      >
                        {pincode}
                        <span onClick={() => removeExcludePincode(pincode)} className='text-xs min-w-4 min-h-2 pb-px bg-white rounded-full text-black text-center cursor-pointer'>
                          x
                        </span>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <div>
              <h3 className='font-semibold'>Priority Rule 2</h3>
              <p className='text-xs text-gray-500'>Applied only when no pincode rule is matched. State rule will be ignored. </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="product-type" className='text-gray-600 text-sm sm:text-base'>Include Cities</label>
                <Select
                  options={cities}
                  placeholder="Ex: Hyderabad"
                  // styles={reactSelectCustomStyles}
                  value={includeCities}
                  name='includeCity'
                  className="capitalize"
                  isClearable
                  isMulti={true}
                  onChange={(selectedOptions, actionMeta) => {
                    updateDropdownList({
                      action: actionMeta.action,
                      data: actionMeta,
                      stateList: includeCities,
                      setStateList: setIncludeCities
                    });
                  }}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="product-type" className='text-gray-600 text-sm sm:text-base'>Exclude Cities</label>
                <Select
                  options={cities}
                  placeholder="Ex: Bangaluru"
                  value={excludeCities}
                  // styles={reactSelectCustomStyles}
                  name="excludeCity"
                  className="capitalize"
                  isClearable
                  isMulti={true}
                  onChange={(selectedOptions, actionMeta) => {
                    updateDropdownList({
                      action: actionMeta.action,
                      data: actionMeta,
                      stateList: excludeCities,
                      setStateList: setExcludeCities
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <div>
              <h3 className='font-semibold'>Priority Rule 3</h3>
              <p className='text-xs text-gray-500'>Applied when no pincode or city rule is matched.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="product-includeState" className='text-gray-600 text-sm sm:text-base'>Include States</label>
                <Select
                  options={states}
                  placeholder="Ex: Telangana"
                  // styles={reactSelectCustomStyles}
                  className="capitalize"
                  isClearable
                  isMulti={true}
                  value={includeStates}
                  onChange={(selectedOptions, actionMeta) => {
                    updateDropdownList({
                      action: actionMeta.action,
                      data: actionMeta,
                      stateList: includeStates,
                      setStateList: setIncludeStates
                    });
                  }}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="product-excludeState" className='text-gray-600 text-sm sm:text-base'>Exclude States</label>
                <Select
                  options={states}
                  placeholder="Ex: Karnataka"
                  // styles={reactSelectCustomStyles}
                  className="capitalize"
                  isClearable
                  isMulti={true}
                  value={excludeStates}
                  onChange={(selectedOptions, actionMeta) => {
                    updateDropdownList({
                      action: actionMeta.action,
                      data: actionMeta,
                      stateList: excludeStates,
                      setStateList: setExcludeStates
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className='flex gap-2 py-2 border rounded-md border-gray-300 px-2'>
            <Icon icon="material-symbols:info" className='text-amber-500' width="16" height="16" />
            <div className='space-y-0.5'>
              <h3 className='text-sm font-medium'>Note</h3>
              <p className='text-xs text-gray-500'>Do not configure the same geo value in both Include and Exclude lists. In case of overlap. higher priority geo logic will determine the final eligibility.</p>
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold'>Default Geo Decision</h3>
              <p className='text-xs text-gray-500'>This rule is used only when no priority rules added or customer location does not match any configured pincode, city, or state eligibility rule.</p>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-8 items-center'>
                <div className='space-x-2'>
                  <input
                    type="radio"
                    value="INCLUDE"
                    {...register("defaultGeo", {
                      required: "Please select a default geo type",
                    })}
                    className='min-w-4 min-h-4'
                  />
                  <label>INCLUDE</label>
                </div>

                <div className='space-x-2'>
                  <input
                    type="radio"
                    value="EXCLUDE"
                    {...register("defaultGeo", {
                      required: "Please select a default geo type",
                    })}
                    className='min-w-4 min-h-4'
                  />
                  <label>EXCLUDE</label>
                </div>
              </div>
              {
                errors.defaultGeo && <ErrorMessage message={errors?.defaultGeo.message} />
              }
            </div>
          </div>
        </div>
        <div className='flex justify-end'>

          {isSubmitting ? <div className='inline-block place-items-center mt-4 md:mt-8 px-8 py-4 min-w-35.5 rounded-md bg-(--primary) text-white'>
            <CustomThreeDotsLoader color="white" />
          </div> : (<button
            type="submit"
            disabled={isSubmitting}
            className="'place-items-end mt-4 md:mt-8 px-4 py-2 min-w-32 rounded-md bg-(--primary) text-white">
            Update Product
          </button>)}
        </div>
        <div className='hidden md:block min-h-40'></div>
      </form>
    </div>
  )
}

export default EditLenderProduct