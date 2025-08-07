'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'

import { useAppDispatch } from '@/lib/hooks'
import { deleteCollegeDrive } from '@/redux/CampusManagement/campusDriveSlice'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog' // Adjust path as needed

interface CampusDriveGridViewProps {
  drives: {
    id: string
    job_role: string
    drive_date: string
    expected_candidates: number
    status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled' // Updated to match CampusDrive
    college: string
    college_coordinator: string
    invite_status: 'Pending' | 'Sent' | 'Failed'
    response_status: 'Not Responded' | 'Interested' | 'Not Interested'
    spoc_notified_at: string
    remarks: string
  }[]
}

const CampusDriveGridView = ({ drives }: CampusDriveGridViewProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [openModal, setOpenModal] = useState(false)
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null)

  const handleDelete = async (id?: string | number) => {
    if (!id) return

    try {
      await dispatch(deleteCollegeDrive(id as string)).unwrap()
      toast.success('College Drive deleted successfully.')
      setOpenModal(false)
      setSelectedDriveId(null)
    } catch (error: any) {
      toast.error(error || 'Failed to delete college drive')
    }
  }

  return (
    <Box className='py-2'>
      <Box className='grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2'>
        {drives.map(drive => (
          <Box key={drive.id} className='xs:12 sm:6 md:4'>
            <Box className="p-3 gap-[16px] w-full bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif] h-full">
              <Box className='flex flex-col gap-2 h-full'>
                <Box className='flex justify-between items-center p-[0_0_10px] gap-2 border-b border-[#eee]'>
                  <Box className='flex flex-row items-center p-0 gap-2 h-[48px]'>
                    <Box className='flex justify-center items-center w-[38px] h-[38px] bg-[#F2F3FF] rounded-full'>
                      <WorkOutlineIcon className='w-6 h-6' />
                    </Box>
                    <Box className=''>
                      <Typography className="font-['Public_Sans',_Roboto,_sans-serif] whitespace-nowrap font-bold text-[12px] leading-[19px] text-[#23262F]">
                        {drive.job_role}
                      </Typography>
                      <Typography variant='body1'>
                        <strong>{drive.college}</strong>
                      </Typography>
                    </Box>
                  </Box>
                  <Box className='flex items-center'>
                    <Tooltip title='Edit Drive'>
                      <IconButton
                        onClick={() => {
                          router.push(`/hiring-management/campus-management/campus-drive/edit/detail?id=${drive.id}`)
                        }}
                        aria-label={`Edit ${drive.job_role}`}
                        sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete Drive'>
                      <IconButton
                        onClick={() => {
                          setSelectedDriveId(drive.id)
                          setOpenModal(true)
                        }}
                        aria-label={`Delete ${drive.job_role}`}
                        sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Drive Date
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {new Date(drive.drive_date).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      College
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {drive.college}
                    </Typography>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      College Coordinator
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {drive.college_coordinator}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      Expected Candidates
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {drive.expected_candidates}
                    </Typography>
                  </Box>
                </Box>
                <button
                  className="flex justify-center items-center p-[5px_10px] bg-white cursor-pointer border border-[#0096DA] rounded-[8px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]"
                  onClick={() => router.push(`/hiring-management/campus-management/campus-drive/view/${drive.id}`)}
                  aria-label={`View details for ${drive.job_role}`}
                >
                  View Details
                </button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDelete}
        id={selectedDriveId}
        title='Confirm Delete'
        description='Are you sure you want to delete this campus drive? This action cannot be undone.'
      />
    </Box>
  )
}

export default CampusDriveGridView
