import React, { useState } from 'react'
import { BureauTab } from './BureauTab'
import { useParams } from 'react-router-dom'

const LeadBureau = () => {
    const { id } = useParams();
    const [isBureauFetched, setIsBureauFetched] = useState(true);




    return (
        <div>
            {
                isBureauFetched ? (
                    <BureauTab
                        bureau={{
                            score: 740,
                            fetchedAt: "18 Feb 2026, 09:00 pm",
                            scoreBand: "Good",        // "Excellent" | "Good" | "Fair" | "Poor"
                            eligibleLenders: "5 of 5",
                            reportValidDays: 30,
                        }}
                    //   onRefresh={() => callRefreshBureauApi(leadId)}
                    />
                ) : (
                    <BureauTab
                        bureau={null}
                    //   onFetch={() => callFetchBureauApi(leadId)}
                    />
                )
            }

        </div>
    )
}

export default LeadBureau