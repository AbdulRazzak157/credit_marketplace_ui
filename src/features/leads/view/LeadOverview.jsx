import React, { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import API_URL from '../../../api/apiConfig';
import { useAuth } from '../../../context/AuthContext';
import CustomCircleLoader from '../../../shared/CustomCircleLoader';
import { Icon } from '@iconify/react';
import { UpdateLoanDetailsModal } from '../../../components/UpdateLoanDetailsModal';
import { UpdateRemarkDetailsModal } from '../../../components/UpdateRemarkDetailsModal';
import { normalizeSentence } from '../../../helpers';
import { userPermissions } from '../../../constants/subadminPermissions';
import HasPermission from '../../../components/HasPermission';


const LeadOverview = () => {
  const { leadId } = useParams();

  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const mainRef = useOutletContext();

  useEffect(() => {
    if (mainRef?.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);

  const { getAccessToken } = useAuth();

  const getSpecificLeadData = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL.leadManagement.getLeadOverview(leadId)}`, {
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

      // console.log("Result from get specific Lead API: ", result.response);
      const lead = result?.response;

      const data = {
        // Personal Info
        id: lead?.id,
        firstName: lead?.firstName,
        lastName: lead?.lastName,
        email: lead?.email,
        mobileNumber: lead?.mobileNumber,
        gender: lead?.gender,
        panNumber: lead?.panNumber,
        dateOfBirth: lead?.dateOfBirth ? lead.dateOfBirth.split('T')[0] : null,

        // Loan Details
        requestedLoanAmount: lead?.requestedLoanAmount,
        loanType: lead?.leadRecord?.loanType,
        loanPurpose: lead?.leadRecord?.loanPurpose,
        tenureInMonths: lead?.tenureInMonths,

        // Employment
        employmentType: lead?.employmentType,
        employmentDesignation: lead?.employmentDesignation,
        netMonthlyIncome: lead?.netMonthlyIncome,

        // Address
        addressLine: lead?.addressLine,
        addressCity: lead?.addressCity,
        addressState: lead?.addressState,
        addressPincode: lead?.addressPincode,
        addressCountry: lead?.addressCountry,

        // Bureau Details
        bureauScore: lead?.bureauScore,
        foir: lead?.foir,
        activeLoans: lead?.activeLoans,
        dpd30: lead?.dpd30,
        dpd60: lead?.dpd60,
        dpd90: lead?.dpd90,
        last7DaysEnquiries: lead?.last7DaysEnquiries,
        last30DaysEnquiries: lead?.last30DaysEnquiries,
        last60DaysEnquiries: lead?.last60DaysEnquiries,
        status: lead?.status,
        bureauLastUpdated: lead?.bureauLastUpdated ? lead?.bureauLastUpdated.split('T')[0] : null,
        isNtc: lead?.isNtc,

        // Lead Record
        loanAccountNumber: lead?.leadRecord?.loanAccountNumber,
        sourceChannel: lead?.leadRecord?.sourceChannel,
        sourceSubChannel: lead?.leadRecord?.sourceSubChannel,
        sourceId: lead?.leadRecord?.sourceId,
        sourceEmail: lead?.leadRecord?.sourceEmail,
        sourceName: lead?.leadRecord?.sourceName,
        sourceMobile: lead?.leadRecord?.sourceMobile,
        utmSource: lead?.leadRecord?.utmSource,
        utmMedium: lead?.leadRecord?.utmMedium,
        utmCampaign: lead?.leadRecord?.utmCampaign,
        utmTerm: lead?.leadRecord?.utmTerm,
        utmContent: lead?.leadRecord?.utmContent,
        notes: lead?.leadRecord?.notes,
        comments: lead?.leadRecord?.comments,
        disbursedLoanAmount: lead?.leadRecord?.disbursedLoanAmount,

        // dates
        createdAt: lead?.createdAt ? lead?.createdAt.split('T')[0] : null,
        updatedAt: lead?.updatedAt ? lead?.updatedAt.split('T')[0] : null,

      };

      return data;

    } catch (error) {
      console.log("Error in fetch specific lead : ", error?.message);
    }
  };

  const { data: leadDetails, refetch, isLoading } = useQuery({
    queryKey: ["fetchSpecificLeadData", leadId],
    queryFn: getSpecificLeadData,
    enabled: !!leadId,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-screen'>
        <CustomCircleLoader />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-4'>

      {/* Lead Information */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-end'>
            <div className='text-lg font-semibold text-blue-600'>Lead Information</div>
          </div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[90%] sm:space-y-4'>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>First Name</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.firstName}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Last Name</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.lastName}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Email</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.email}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Mobile Number</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.mobileNumber}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Gender</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.gender}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>PAN Number</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.panNumber}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Date of Birth</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.dateOfBirth}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Address</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>

            <div className='w-full px-2 sm:px-4 text-xs sm:text-base flex flex-wrap gap-1'>
              <span>{leadDetails?.addressLine},</span>
              <span>{leadDetails?.addressCity},</span>
              <span>{leadDetails?.addressState} -</span>
              <span>{leadDetails?.addressPincode},</span>
              <span>{leadDetails?.addressCountry}</span>
            </div>


          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Lead Created At</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.createdAt}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[30%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Lead Updated At</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.updatedAt}</div>
          </div>

        </div>
      </div>

      {/* Loan Details */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-end'>
            <div className='text-lg font-semibold text-blue-600'>Loan Details</div>
            {leadDetails.status !== "DISBURSED" && (
              <HasPermission permission={userPermissions.LEADS.UPDATE_LEAD_STATUS} >
                <div onClick={() => setIsLoanDetailsModalOpen(true)} className='flex items-center gap-x-1.5 py-1 px-3 rounded-lg bg-gray-100 border border-gray-300 cursor-pointer'>
                  <Icon icon="lets-icons:edit-fill" width="16" height="16" />
                  <span className='text-xs font-semibold text-[#232323]'>Update</span>
                </div>
              </HasPermission>
            )
            }
          </div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Loan Type</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.loanType && (
                <span className='bg-green-500 rounded-sm text-sm text-white py-1 px-2'>{normalizeSentence(leadDetails?.loanType.toUpperCase())}</span>
              )}
            </div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Loan Purpose</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.loanPurpose}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Requested Loan Amount</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.requestedLoanAmount
                ? `₹ ${Number(leadDetails.requestedLoanAmount).toLocaleString('en-IN')}`
                : '-'}
            </div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Tenure (Months)</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.tenureInMonths}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Loan Account Number</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.loanAccountNumber ?? '-'}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Disbursed Loan Amount</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.disbursedLoanAmount
                ? `₹ ${Number(leadDetails.disbursedLoanAmount).toLocaleString('en-IN')}`
                : '-'}
            </div>
          </div>

        </div>
      </div>

      {/* Employment Details */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold text-blue-600'>Employment Details</div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Employment Type</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{normalizeSentence(leadDetails?.employmentType)}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Designation</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.employmentDesignation}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Net Monthly Income</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.netMonthlyIncome
                ? `₹ ${Number(leadDetails.netMonthlyIncome).toLocaleString('en-IN')}`
                : '-'}
            </div>
          </div>

        </div>
      </div>

      {/* Bureau Details */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold text-blue-600'>Bureau Details</div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Status</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.status && (
                <span className='bg-green-600 rounded-sm text-sm text-white py-1 px-2'>{normalizeSentence(leadDetails?.status)}</span>
              )}
            </div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Is NTC</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>
              {leadDetails?.isNtc
                ? <span className='bg-blue-500 rounded-sm text-sm text-white py-1 px-2'>Yes</span>
                : <span className='bg-gray-400 rounded-sm text-sm text-white py-1 px-2'>No</span>
              }
            </div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Bureau Score</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.bureauScore}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>FOIR</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.foir || 0}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Active Loans</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.activeLoans}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>DPD 30</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.dpd30}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>DPD 60</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.dpd60}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>DPD 90</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.dpd90}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Last 7 Days Enquiries</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.last7DaysEnquiries}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Last 30 Days Enquiries</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.last30DaysEnquiries}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Last 60 Days Enquiries</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.last60DaysEnquiries || 0}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Bureau Last Updated</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.bureauLastUpdated}</div>
          </div>

        </div>
      </div>

      {/* Source Details */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-end'>
            <div className='text-lg font-semibold text-blue-600'>Source Details</div>
          </div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source Channel</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceChannel}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source Sub Channel</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceSubChannel}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source ID</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceId ?? '-'}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source Name</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceName ?? '-'}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source Email</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceEmail ?? '-'}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>Source Mobile</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.sourceMobile ?? '-'}</div>
          </div>
        </div>
      </div>

      {/* UTM Details */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold text-blue-600'>UTM Details</div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className='w-full sm:w-[50%] space-y-2 sm:space-y-4'>
          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>UTM Source</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.utmSource}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>UTM Medium</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.utmMedium}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>UTM Campaign</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.utmCampaign}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>UTM Term</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.utmTerm ?? '-'}</div>
          </div>

          <div className='flex'>
            <div className='w-full sm:w-[70%] flex justify-between text-xs sm:text-sm text-gray-500'>
              <label>UTM Content</label>
              <span className='text-(--primary) font-bold pr-1'>:</span>
            </div>
            <div className='w-full px-2 sm:px-4 text-xs sm:text-base'>{leadDetails?.utmContent ?? '-'}</div>
          </div>
        </div>
      </div>

      {/* Remark */}
      <div className='bg-white border border-gray-200 rounded-2xl px-7 py-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-end'>
            <div className='text-lg font-semibold text-blue-600'>Remark</div>
            {leadDetails.status !== "DISBURSED" &&
              <HasPermission permission={userPermissions.LEADS.UPDATE_LEAD_STATUS} >
                <div onClick={() => setIsRemarkModalOpen(true)} className='flex items-center gap-x-1.5 py-1 px-3 rounded-lg bg-gray-100 border border-gray-300 cursor-pointer'>
                  <Icon icon="lets-icons:edit-fill" width="16" height="16" />
                  <span className='text-xs font-semibold text-[#232323]'>Update</span>
                </div>
              </HasPermission>
            }
          </div>
          <hr className="border-gray-200 p-2" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">

          {/* Notes */}
          <div className="w-full sm:w-1/2">
            <label className="text-xs sm:text-sm text-gray-500 mb-1 block">
              Notes
            </label>
            <div className="border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-base text-gray-800 min-h-25">
              {leadDetails?.notes ? leadDetails.notes : "NA"}
            </div>
          </div>

          {/* Comments */}
          <div className="w-full sm:w-1/2">
            <label className="text-xs sm:text-sm text-gray-500 mb-1 block">
              Comments
            </label>
            <div className="border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-base text-gray-800 min-h-25">
              {leadDetails?.comments ? leadDetails.comments : "NA"}
            </div>
          </div>

        </div>
      </div>

      {
        isLoanDetailsModalOpen && (
          <UpdateLoanDetailsModal
            loanDetails={{
              loanAccountNumber: leadDetails?.loanAccountNumber,
              disbursedLoanAmount: leadDetails?.disbursedLoanAmount,
            }}
            refetch={refetch}
            onClose={() => setIsLoanDetailsModalOpen(false)} />
        )
      }
      {
        isRemarkModalOpen && (
          <UpdateRemarkDetailsModal
            remarkDetails={{
              notes: leadDetails?.notes,
              comments: leadDetails?.comments
            }}
            refetch={refetch}
            onClose={() => setIsRemarkModalOpen(false)} />
        )
      }
    </div>
  );
};

export default LeadOverview;