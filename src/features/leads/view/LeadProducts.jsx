// import React from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { useParams } from 'react-router-dom'
// import { useAuth } from '../../../context/AuthContext'
// import API_URL from '../../../api/apiConfig'
// import CustomCircleLoader from '../../../shared/CustomCircleLoader'

// const colorPalette = [
//     "bg-blue-500",
//     "bg-green-500",
//     "bg-purple-500",
//     "bg-pink-500",
//     "bg-indigo-500",
//     "bg-yellow-500",
//     "bg-red-500",
// ]

// const getRandomColor = (index) => {
//     return colorPalette[index % colorPalette.length]
// }

// const MatchedProducts = () => {
//     const { leadId } = useParams()
//     const { getAccessToken } = useAuth()

//     const fetchMatchedProducts = async () => {
//         const token = await getAccessToken()

//         const res = await fetch(API_URL.leadManagement.getLeadMatchedProducts(leadId), {
//             headers: { Authorization: `Bearer ${token}` }
//         })

//         if (!res.ok) {
//             const err = await res.json()
//             throw new Error(err.message)
//         }

//         const result = await res.json()
//         return result.response
//     }

//     const { data, isLoading } = useQuery({
//         queryKey: ['matchedProducts', leadId],
//         queryFn: fetchMatchedProducts
//     })

//     const formatAmount = (num) => {
//         if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`
//         if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`
//         return `₹${num}`
//     }

//     const formatRule = (rule) => {
//         return rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
//     }

//     if (isLoading) {
//         return (
//             <div className='flex justify-center items-center h-64'>
//                 <CustomCircleLoader />
//             </div>
//         )
//     }

//     return (
//         <div className="space-y-5">
//             <div className="flex justify-between text-sm text-gray-500">
//                 <span className='text-lg font-semibold text-blue-600'>MATCHED PRODUCTS</span>
//                 <span>{data?.length} lenders</span>
//             </div>

//             {data?.map((lender, index) => (
//                 <div
//                     key={lender.lenderId}
//                     className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
//                 >
//                     {/* LENDER HEADER */}
//                     <div className="flex justify-between items-center p-4 border-b">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-11 h-11 rounded-xl text-white flex items-center justify-center font-bold ${getRandomColor(index)}`}>
//                                 {lender.lenderLegalEntityName?.[0]}
//                             </div>
//                             <div>
//                                 <p className="font-semibold text-gray-800">
//                                     {lender.lenderLegalEntityName}
//                                 </p>
//                                 <p className="text-xs text-gray-400">
//                                     {lender.products.length} products
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="text-green-600 font-semibold text-lg">
//                             {Math.min(...lender.products.map(p => p.lenderProductFixedRateOfInterest))}%
//                             <span className="text-xs text-gray-400 ml-1">from p.a.</span>
//                         </div>
//                     </div>

//                     {/* PRODUCTS */}
//                     {lender.products.map((product) => (
//                         <div
//                             key={product.lenderProductId}
//                             className="p-4 border-b last:border-none hover:bg-gray-50 transition"
//                         >

//                             {/* TITLE */}
//                             <div className="flex justify-between">
//                                 <p className="font-medium text-gray-800">
//                                     {product.lenderProductName}
//                                 </p>
//                                 <p className="font-semibold text-gray-800">
//                                     {product.lenderProductFixedRateOfInterest}%
//                                 </p>
//                             </div>

//                             {/* TAGS */}
//                             <div className="flex gap-2 mt-2 flex-wrap">
//                                 <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
//                                     Unsecured
//                                 </span>
//                                 <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
//                                     Up to {product.policies.maxTenureInMonths}M
//                                 </span>
//                                 <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
//                                     {formatAmount(product.lenderProductMinAmount)} - {formatAmount(product.lenderProductMaxAmount)}
//                                 </span>
//                             </div>

//                             {/* APPROVAL BAR */}
//                             <div className="mt-3">
//                                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                                     <span>Approval probability</span>
//                                     <span className="font-medium text-gray-700">{product.matchingPercentage}%</span>
//                                 </div>
//                                 <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                                     <div
//                                         className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
//                                         style={{ width: `${product.matchingPercentage}%` }}
//                                     />
//                                 </div>
//                             </div>

//                             {/* RULES */}
//                             <div className="flex gap-2 mt-3 flex-wrap text-xs items-center">
//                                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
//                                     {product.matchedRules.length} rules passed
//                                 </span>

//                                 {product.failedRules.length > 0 && (
//                                     <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">
//                                         {product.failedRules.length} failed
//                                     </span>
//                                 )}
//                             </div>

//                             {/* FAILED REASONS */}
//                             {product.failedRules.length > 0 && (
//                                 <div className="mt-2 text-xs text-red-500 flex flex-wrap gap-2">
//                                     {product.failedRules.map((rule, i) => (
//                                         <span
//                                             key={i}
//                                             className="bg-red-50 border border-red-200 px-2 py-1 rounded-md"
//                                         >
//                                             {formatRule(rule)}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* PROCESSING */}
//                             <div className="text-right text-xs text-gray-400 mt-2">
//                                 Processing fee: {product.lenderProductProcessingFeePercentage}%
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default MatchedProducts



import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import API_URL from '../../../api/apiConfig'
import CustomCircleLoader from '../../../shared/CustomCircleLoader'

const colorPalette = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-yellow-500",
  "bg-red-500",
]

const getRandomColor = (index) => {
  return colorPalette[index % colorPalette.length]
}

const MatchedProducts = () => {
  const { leadId } = useParams()
  const { getAccessToken } = useAuth()

  const [openLender, setOpenLender] = useState(null)


  const toggleLender = (id) => {
    setOpenLender(prev => (prev === id ? null : id))
  }

  const fetchMatchedProducts = async () => {
    const token = await getAccessToken()

    const res = await fetch(API_URL.leadManagement.getLeadMatchedProducts(leadId), {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message)
    }

    const result = await res.json()
    return result.response
  }

  const { data, isLoading } = useQuery({
    queryKey: ['matchedProducts', leadId],
    queryFn: fetchMatchedProducts
  })

  const formatAmount = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`
    return `₹${num}`
  }

  const formatRule = (rule) => {
    return rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  // ✅ SORT BY LOWEST ROI
  const sortedData = [...(data || [])].sort((a, b) => {
    const aMin = Math.min(...a.products.map(p => p.lenderProductFixedRateOfInterest))
    const bMin = Math.min(...b.products.map(p => p.lenderProductFixedRateOfInterest))
    return aMin - bMin
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <CustomCircleLoader />
      </div>
    )
  }

  return (
    <div className='space-y-5 bg-white border border-gray-200 rounded-2xl px-7 py-6'>

      {/* HEADER */}
        <h1 className='text-lg font-semibold text-blue-600'>Matched Lenders - {sortedData.length}</h1>
  
      {/* LENDERS */}
      {sortedData.map((lender, index) => {
        const isOpen = openLender === lender.lenderId

        return (
          <div
            key={lender.lenderId}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >

            {/* LENDER HEADER */}
            <div
              onClick={() => toggleLender(lender.lenderId)}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl text-white flex items-center justify-center font-bold ${getRandomColor(index)}`}>
                  {lender.lenderLegalEntityName?.[0]}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {lender.lenderLegalEntityName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lender.products.length} {lender.products.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-green-600 font-semibold text-lg">
                  {Math.min(...lender.products.map(p => p.lenderProductFixedRateOfInterest))}%
                  <span className="text-xs text-gray-400 ml-1"> from p.a.</span>
                </div>

                {/* ARROW */}
                <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </div>

            {/* PRODUCTS (ACCORDION) */}
            {isOpen && (
              <div className="animate-fadeIn">
                {lender.products.map((product) => (
                  <div
                    key={product.lenderProductId}
                    className="p-4 border-b last:border-none hover:bg-gray-100 transition"
                  >

                    {/* TITLE */}
                    <div className="flex justify-between">
                      <p className='text-lg font-semibold text-blue-400'>
                        {product.lenderProductName}
                      </p>
                      <p className="font-semibold text-gray-800">
                        {product.lenderProductFixedRateOfInterest}%
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {product.lenderProductType}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                        Up to {product.policies.maxTenureInMonths}M
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                        {formatAmount(product.lenderProductMinAmount)} - {formatAmount(product.lenderProductMaxAmount)}
                      </span>
                    </div>

                    {/* APPROVAL */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Approval probability</span>
                        <span className="font-medium text-gray-700">
                          {product.matchingPercentage}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-red-400 via-yellow-500 to-green-500 rounded-full"
                          style={{ width: `${product.matchingPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* RULES */}
                    <div className="flex gap-2 mt-3 flex-wrap text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {product.matchedRules.length} rules passed
                      </span>

                      {/* Failed Count */}
                      {product.failedRules.length > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">
                          {product.failedRules.length} failed
                        </span>
                      )}

                       {/* Failed Reasons */}
                      {product.failedRules.map((rule, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded-full"
                        >
                          {formatRule(rule).toLowerCase()}
                        </span>
                      ))}
                    </div>

                    {/* PROCESSING */}
                    <div className="text-right text-xs text-gray-400 mt-2">
                      Processing fee: {product.lenderProductProcessingFeePercentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MatchedProducts