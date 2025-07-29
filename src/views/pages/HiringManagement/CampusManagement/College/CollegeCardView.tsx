'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography } from '@mui/material'

//import BusinessIcon from '@/icons/BusinessIcon'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'

interface CollegeGridViewProps {
  colleges: {
    id: string
    name: string
    college_code: string
    university_affiliation: string
    college_type: string
    location: string
    district: string
    pin_code: string
    full_address: string
    website_url: string
  }[]
}

const CollegeGridView = ({ colleges }: CollegeGridViewProps) => {
  const router = useRouter()

  return (
    <Box className='py-2'>
      <Box className='grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2'>
        {colleges.map(college => (
          <Box key={college.id} className='xs:12 sm:6 md:4'>
            <Box className="p-2 gap-[16px] w-full bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif] h-full">
              <Box className='flex flex-col gap-2 h-full'>
                <Box className='flex justify-between items-center p-[0_0_10px] gap-2 border-b border-[#eee]'>
                  <Box className='flex flex-row items-center p-0 gap-2 h-[48px]'>
                    <Box className='flex justify-center items-center w-[38px] h-[38px] bg-[#F2F3FF] rounded-full'>
                      {/* Placeholder for BusinessIcon; replace with actual icon if needed */}
                      <SchoolOutlinedIcon className='w-6 h-6' />
                    </Box>
                    <Box className=''>
                      <Typography className="font-['Public_Sans',_Roboto,_sans-serif] whitespace-nowrap font-bold text-[12px] leading-[19px] text-[#23262F]">
                        {college.name}
                      </Typography>
                      {/* <Chip
                        label={college.college_code}
                        size='small'
                        variant='outlined'
                        sx={{ fontSize: '10px' }}
                        color='secondary'
                        className="flex justify-center items-center p-[2px_40px] w-2/4 bg-[rgba(237,159,11,0.2)] border border-[#eee] rounded-[6px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[12px] leading-[14px] uppercase"
                      /> */}

                      <Typography variant='body1'>
                        <strong>{college.college_code}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      University Affiliation
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.university_affiliation}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      College Type
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.college_type}
                    </Typography>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Location
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.location}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      District
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.district}
                    </Typography>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Pin Code
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.pin_code}
                    </Typography>
                  </Box>
                  {/* <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Website URL
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.website_url}
                    </Typography>
                  </Box> */}
                </Box>
                {/* <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Full Address
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.full_address}
                    </Typography>
                  </Box>
                </Box> */}
                <button
                  className="flex justify-center items-center p-[5px_10px] bg-white cursor-pointer border border-[#0096DA] rounded-[8px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]"
                  onClick={() => {
                    router.push(`hiring-management/campus-management/college/view/details`)
                  }}
                  aria-label={`View details for ${college.name}`}
                >
                  View Details
                </button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CollegeGridView

// 'use client'
// import React from 'react'

// import { Box, Typography, Chip, Tooltip } from '@mui/material'

// interface CollegeGridViewProps {
//   colleges: {
//     id: string
//     name: string
//     college_code: string
//     university_affiliation: string
//     college_type: string
//     location: string
//     district: string
//     pin_code: string
//     full_address: string
//     website_url: string
//   }[]
// }

// const CollegeGridView = ({ colleges }: CollegeGridViewProps) => {
//   return (
//     <Box className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//       {colleges.map(college => (
//         <Box
//           key={college.id}
//           className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
//           sx={{ cursor: 'pointer', minHeight: '150px' }}
//         >
//           <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
//             <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
//               {college.name}
//             </Typography>
//             <Tooltip title='College Code'>
//               <Chip
//                 label={college.college_code}
//                 size='small'
//                 variant='outlined'
//                 sx={{ fontSize: '10px' }}
//                 color='secondary'
//               />
//             </Tooltip>
//           </Box>
//           <Box className='p-2 border-t'>
//             <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
//               <Tooltip title='University Affiliation'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   University: {college.university_affiliation}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='College Type'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   Type: {college.college_type}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='Location'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   Location: {college.location}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='District'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   District: {college.district}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='Pin Code'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   Pin: {college.pin_code}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='Full Address'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   Address: {college.full_address}
//                 </Typography>
//               </Tooltip>
//               <Tooltip title='Website URL'>
//                 <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   Website: {college.website_url}
//                 </Typography>
//               </Tooltip>
//             </Box>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   )
// }

// export default CollegeGridView
