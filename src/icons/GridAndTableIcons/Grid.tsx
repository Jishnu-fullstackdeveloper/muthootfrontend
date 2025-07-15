import React from 'react'

const GridIcon = ({ className, width = '16', height = '10' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 16 10'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <rect width='4' height='4' rx='1' />
      <rect x='5.5' width='4' height='4' rx='1' />
      <rect x='11' width='4' height='4' rx='1' />
      <rect y='6' width='4' height='4' rx='1' />
      <rect x='5.5' y='6' width='4' height='4' rx='1' />
      <rect x='11' y='6' width='4' height='4' rx='1' />
    </svg>
  )
}

export default GridIcon
