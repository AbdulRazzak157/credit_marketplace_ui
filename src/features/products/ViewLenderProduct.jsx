import React, { useEffect } from 'react'
import NavigationHeadline from '../../components/NavigationHeadline'
import moment from 'moment'
import { Icon } from '@iconify/react'
import ProductRangeCard from '../../components/cards/ProductRangeCard'
import ProductFieldCard from '../../components/cards/ProductFieldCard'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API_URL from '../../api/apiConfig'
import { useQuery } from '@tanstack/react-query'
import CustomCircleLoader from '../../shared/CustomCircleLoader'
import { formatINR, normalizeSentence } from '../../helpers'

const ViewLenderProduct = () => {

  const { productId } = useParams();
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
  }, [productId])

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
      console.log("Result from get specific Lender product API: ", result.response);
      const product = result?.response;
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
        defaultGeo: product?.defaultGeoDecision === "ALLOW" ? "INCLUDE" : "EXCLUDE",
        productGender: product?.genders,
        includePincodes: product?.includePincodes,
        excludePincodes: product?.excludePincodes,
        includeCities: product?.includeCities,
        excludeCities: product?.excludeCities,
        includeStates: product?.includeStates,
        excludeStates: product?.excludeStates,
        createdAt: product?.createdAt,
        totalApplications: product?.assignedLeads?.totalLeads || 0,
        totalDisbursed: product?.assignedLeads?.totalDisbursed || 0,
        disbursalRate: product?.assignedLeads?.disbursalRate

      }

      console.log("specific lender product Data : ", data);

      return data;

    } catch (error) {
      console.log("Error in fetch specific lender product: ", error?.message);
    }
  }

  const { data: lenderProductDetails, isLoading } = useQuery({
    queryKey: ["fetchSpecificLenderEditData", productId],
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
  return (
    <div className='space-y-7'>
      <NavigationHeadline content="Back" to="/products" />
      <div className='grid gird-cols-1 md:grid-cols-4 bg-white rounded-md p-4 gap-y-4'>
        <div className='col-span-3 space-y-1'>
          <div className='flex gap-x-4 items-center'><h2 className='text-2xl font-semibold'>{lenderProductDetails?.productName}</h2> <span className='py-1 px-4 rounded-2xl bg-purple-200 text-xs text-purple-600'>{normalizeSentence(lenderProductDetails?.productType)}</span></div>
          <p className='text-[#64748B] font-medium max-sm:text-sm'>Code: <span className="text-[#374151] max-lg:text-sm">{lenderProductDetails?.productCode}</span></p>
          <p className="text-[#64748B] font-medium max-lg:text-sm">Product Added Date: <span className="text-[#374151] max-lg:text-sm">{moment(lenderProductDetails?.createdAt || new Date()).format("DD/MM/YYYY, h:mm a")}</span></p>
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between items-center'><span className='text-[#64748B] font-medium max-sm:text-sm'>Total Applications :</span> <span className="text-[#374151] max-lg:text-sm font-extrabold">{lenderProductDetails?.totalApplications}</span></div>
          <div className='flex justify-between items-center'><span className='text-[#64748B] font-medium max-sm:text-sm'>Disbursed :</span> <span className="text-[#374151] max-lg:text-sm font-extrabold">{lenderProductDetails?.totalDisbursed}</span></div>
          <div className='flex justify-between items-center'><span className='text-[#64748B] font-medium max-sm:text-sm'>Disbursed Rate :</span> <span className="text-[#374151] max-lg:text-sm font-extrabold">{lenderProductDetails?.disbursalRate} %</span></div>
        </div>
      </div>
      <div className=' rounded-md space-y-2'>
        <h2 className='text-lg font-semibold'>Financial Criteria</h2>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-8'>
            <ProductRangeCard label="Loan Amount" minValue={formatINR(lenderProductDetails?.productMinAmount)} maxValue={formatINR(lenderProductDetails?.productMaxAmount)} />
            <ProductRangeCard label="Tenure (Months)" minValue={lenderProductDetails?.productMinTenure} maxValue={lenderProductDetails?.productMaxTenure} />
            <ProductFieldCard label={"Rate Of Interest"} value={lenderProductDetails?.productInterest + " %"} />
            <ProductFieldCard label={"Processing Fee"} value={lenderProductDetails?.productProcessingFee + " %"} />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-8'>
            <ProductFieldCard label="Min Income" value={formatINR(lenderProductDetails?.productMinIncome)} />
            <div className='col-span-3'>
              <div className='bg-white px-4 py-4 rounded-md flex flex-col justify-between items-start gap-4'>
                <div className='text-[#64748B] font-medium max-lg:text-sm'>UTM Link</div>
                <a
                  className='text-[#3e7ce0] text-sm cursor-pointer underline font-semibold'
                  href={lenderProductDetails?.productUtm}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lenderProductDetails?.productUtm}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold'>Application Criteria</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-x-4 md:gap-x-8'>
          <div className='bg-white col-span-3 rounded-md space-y-2 pb-4'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className="w-full md:w-[60%]">
                <ProductRangeCard label="Age Range" minValue={lenderProductDetails?.productMinAge} maxValue={lenderProductDetails?.productMaxAge} />
              </div>
              <ProductFieldCard label={"Min Bureau Score"} value={lenderProductDetails?.productBureauScore+"+"} />
              <ProductFieldCard label={"FOIR"} value={lenderProductDetails?.productFoir + " %"} />
              <ProductFieldCard label={"Max Active Loans"} value={lenderProductDetails?.productActiveLoans} />
              <div className='space-y-2 px-4'>
                <h3 className='text-[#64748B] font-medium max-lg:text-sm'>Gender</h3>
                <div className='flex gap-2 gap-x-4'>
                  {
                    lenderProductDetails?.productGender?.length && lenderProductDetails?.productGender?.map((gender, index) => (
                      <div key={index} className='text-[#374151] font-semibold py-0.5 px-2 border border-gray-400 rounded-md text-xs'>{gender}</div>
                    ))
                  }
                </div>
              </div>
              <div className='space-y-2 px-4 max-sm:divide-y-[1px] sm:divide-x-[1px] divide-[#B4B4B4]'>
                <h3 className='text-[#64748B] font-medium max-lg:text-sm'>Employment Types</h3>
                <div className='flex gap-2 gap-x-4'>
                  {
                    lenderProductDetails?.productEmploymentTypes?.length && lenderProductDetails?.productEmploymentTypes?.map((type, index) => (
                      <div key={index} className='text-[#374151] font-semibold py-0.5 px-2 border border-gray-400 rounded-md text-xs'>{type}</div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-md space-y-4 px-4 py-4'>
            <h2 className='text-lg font-semibold'>DPD & Enquiries Limits</h2>
            <div className='space-y-2 '>
              <div className='flex justify-between items-center gap-4'> <span className='text-[#64748B] font-medium text-sm'>DPD 30</span> <span className='text-[#374151] font-extrabold'>{lenderProductDetails?.productDpd30 || 0}</span></div>
              <div className='flex justify-between items-center gap-4'> <span className='text-[#64748B] font-medium text-sm'>DPD 60</span> <span className='text-[#374151] font-extrabold'>{lenderProductDetails?.productDpd60 || 0}</span></div>
              <div className='flex justify-between items-center gap-4'> <span className='text-[#64748B] font-medium text-sm'>DPD 90</span> <span className='text-[#374151] font-extrabold'>{lenderProductDetails?.productDpd90 || 0}</span></div>
              <div className='flex justify-between items-center gap-4'> <span className='text-[#64748B] font-medium text-sm'>Last 30 Days Enquiries</span> <span className='text-[#374151] font-extrabold'>{lenderProductDetails?.product30daysEnquiries || 0}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold'>Geo Priority Rules</h2>
        <div className='space-y-4 px-4 py-4 bg-white rounded-md'>

          <div className='flex gap-x-4'>
            <h3 className='text-[#64748B] font-semibold'>Default Decision :</h3>
            <div className='border border-[#64748B] px-4 py-1 rounded-full bg-purple-100 text-blue-600 text-sm'>{lenderProductDetails?.defaultGeo}</div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:divide-y-[1px] sm:divide-x-[1px] divide-[#B4B4B4]'>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Include Pincodes</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.includePincodes?.length && lenderProductDetails?.includePincodes?.map((pincode, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {pincode}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Exclude Pincodes</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.excludePincodes?.length && lenderProductDetails?.excludePincodes?.map((pincode, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {pincode}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Include Cities</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.includeCities?.length && lenderProductDetails?.includeCities?.map((city, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {city}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Exclude Cities</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.excludeCities?.length && lenderProductDetails?.excludeCities?.map((city, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {city}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Include States</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.includeStates?.length && lenderProductDetails?.includeStates?.map((state, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {state}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='space-y-2'>
              <h4 className='text-sm text-[#374151] font-semibold'>Exclude States</h4>
              <div className='flex gap-x-4'>
                {
                  lenderProductDetails?.excludeStates?.length && lenderProductDetails?.excludeStates?.map((state, idx) => (
                    <div
                      key={idx}
                      className='flex gap-x-2 items-center py-0.5 px-2 rounded-md text-white'
                      style={{ background: "linear-gradient(135deg, #F4795A, #F4705C, #F55960, #F73367, #F90070)", }}
                    >
                      {state}
                    </div>
                  ))
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewLenderProduct