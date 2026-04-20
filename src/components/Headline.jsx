import React from 'react'

const Headline = ({ title }) => {
  return (
    <h1 className='text-2xl font-semibold text-(--primary)'>{title}</h1>
  );
}

export default Headline