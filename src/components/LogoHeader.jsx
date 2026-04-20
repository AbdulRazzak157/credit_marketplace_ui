import React from 'react'
import assets from '../constants/assets.constant'

const LogoHeader = () => {
  return (
    <div>
        <img
            src={assets.picLogo}
            alt="payinstacard-logo"
            className='w-50 object-cover' 
        />
    </div>
  )
}

export default LogoHeader