'use client'

import React from 'react' // { useState }

import { useRouter } from 'next/navigation'

import BusinessIcon from '@/icons/BusinessIcon'

interface JobPosting {
  id: string
  designation: string
  jobRole: string
  location: string
  status: 'Pending' | 'Posted' | 'Closed'
  openings: number
  jobGrade: string
  postedDate: string
  department?: string
  manager?: string
  employeeCategory?: string
  branch?: string
  attachments?: string[]
  businessUnit?: string
  branchBusiness?: string
  zone?: string
  area?: string
  state?: string
  band?: string
  date?: string
}

interface JobPostGridProps {
  data: JobPosting[]
  loading: boolean
  page: number
  totalCount: number
  onLoadMore: (newPage: number) => void
}

const JobPostGrid = ({ data, loading }: JobPostGridProps) => {
  const router = useRouter()

  const handleNavigate = (jobId: string) => {
    router.push(`/hiring-management/job-posting/view/details?jobId=${jobId}`)
  }

  const statusColors: Record<string, string> = {
    Pending: '#ED960B',
    CREATED: '#1E90FF',
    Closed: '#FF4500',
    Posted: '#90EE90'
  }

  return (
    <div className='py-2'>
      <div className='grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2'>
        {data.map(job => (
          <div key={job.id} className='xs:12 sm:6 md:4'>
            <div className=" p-2 gap-[16px] w-full  bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif] h-full">
              <div className='flex flex-col gap-2 h-full'>
                <div className='flex justify-between items-center p-[0_0_10px] gap-2 border-b border-[#eee] '>
                  <div className='flex flex-row items-center p-0 gap-2  h-[48px]'>
                    <div className='flex justify-center items-center w-[38px] h-[38px] bg-[#F2F3FF] rounded-full'>
                      <BusinessIcon className='w-4 h-4' />
                    </div>
                    <div className=''>
                      <div className="font-['Public_Sans',_Roboto,_sans-serif] whitespace-nowrap font-bold text-[12px] leading-[19px] text-[#23262F]">
                        {job.designation}
                      </div>
                      {/* <div className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[16px] text-[#23262F] w-[111px]">
                        Internal job posting
                      </div> */}
                      <div
                        className="flex justify-center items-center p-[2px_40px] w-2/4  bg-[rgba(237,159,11,0.2)] border border-[#eee] rounded-[6px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[12px] leading-[14px] uppercase"
                        style={{ color: statusColors[job.status] || '#000' }}
                      >
                        {job.status}
                      </div>
                    </div>
                  </div>
                  {/* <div
                    className="flex justify-center items-center p-[2px_10px]  bg-[rgba(237,159,11,0.2)] border border-[#eee] rounded-[6px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[12px] leading-[14px] uppercase"
                    style={{ color: statusColors[job.status] || '#000' }}
                  >
                    {job.status}
                  </div> */}
                </div>
                <div className='flex flex-row items-center p-0 gap-0  h-[48px]'>
                  <div className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Band
                    </div>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {job.band}
                    </div>
                  </div>
                  <div className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Posted
                    </div>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {new Date(job.date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </div>
                  </div>
                </div>
                <div className='flex flex-row items-center p-0 gap-0  h-[48px]'>
                  <div className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Openings
                    </div>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {job.openings}
                    </div>
                  </div>
                  <div className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Area
                    </div>
                    <div className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {job.location}
                    </div>
                  </div>
                </div>
                <button
                  className="flex justify-center items-center p-[5px_10px] bg-white cursor-pointer   border border-[#0096DA] rounded-[8px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]"
                  onClick={() => handleNavigate(job.id)}
                  aria-label={`View details for ${job.designation}`}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className='flex justify-center p-5'>
          <div className='circular-progress' />
        </div>
      )}
    </div>
  )
}

export default JobPostGrid
