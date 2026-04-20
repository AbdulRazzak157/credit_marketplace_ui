import React from 'react'
import Select from 'react-select';
import { quickActionOptions } from '../constants/quickActions';
import { useLocation, useNavigate } from 'react-router-dom';

const QuickActions = () => {

    const { pathname } = useLocation();

      const navigate = useNavigate();

    const routeMatches = quickActionOptions?.find((item) => item?.to === pathname);

    const handleQuickActionChange = (option) => {
        navigate(option?.to, { state: { from: "navigationFromHeader" } });
    };

    return (
        <>
            <Select
                // styles={""}
                placeholder="Quick Actions"
                options={quickActionOptions}
                className='w-67.5'
                value={routeMatches || ""}
                onChange={handleQuickActionChange}
            >
            </Select>
        </>
    )
}

export default QuickActions