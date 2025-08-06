'use client'
import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Tooltip, Modal, Button, DialogActions } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'

import DynamicTable from '@/components/Table/dynamicTable'
import { deleteCollegeCoordinator } from '@/redux/CampusManagement/collegeAndSpocSlice'
import { useAppDispatch } from '@/lib/hooks'

interface College {
  coordinatorId: string
  collegeCode: string
  collegeName: string
  universityAffiliation: string
  collegeType: string
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
  spoc_name: string
  spoc_designation: string
  spoc_email: string
  spoc_alt_email: string
  spoc_mobile: string
  spoc_alt_phone: string
  spoc_linkedin: string
  spoc_whatsapp: string
  last_visited_date: string
  last_engagement_type: string
  last_feedback: string
  preferred_drive_months: string[]
  remarks: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

interface CollegeTableViewProps {
  colleges: College[]
  totalCount: number
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
}

// ConfirmModal Component
type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (id?: string | number) => void
  title?: string
  description?: string
  id?: string | number
}

const ConfirmModal = ({ open, onClose, onConfirm, title, description, id }: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm(id)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: '400px',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2
          }}
        >
          <i
            className='tabler-exclamation-circle'
            style={{
              fontSize: '100px',
              color: 'red'
            }}
          ></i>
        </Box>

        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant='h5' gutterBottom>
            {title || 'Are you sure?'}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            {description || "Do you really want to delete this data? This process can't be undone."}
          </Typography>
        </Box>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            sx={{
              padding: 1.5,
              marginX: 2,
              backgroundColor: '#757575',
              color: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#ffcccc',
                color: 'darkred'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            sx={{
              padding: 1.5,
              marginX: 2,
              backgroundColor: '#e53935',
              color: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#ffcccc',
                color: 'darkred'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  )
}

const CollegeTableView = ({ colleges, totalCount, page, setPage, limit, setLimit }: CollegeTableViewProps) => {
  const columnHelper = createColumnHelper<College>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [openModal, setOpenModal] = useState(false)
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string | null>(null)

  const tableData = useMemo(() => {
    return {
      data: colleges,
      totalCount
    }
  }, [colleges, totalCount])

  const handleOpenModal = (coordinatorId: string) => {
    setSelectedCoordinatorId(coordinatorId)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedCoordinatorId(null)
  }

  const handleConfirmDelete = async (id?: string | number) => {
    if (id) {
      try {
        await dispatch(deleteCollegeCoordinator(id as string)).unwrap()
        toast.success('College Coordinator deleted successfully.')
      } catch (error: any) {
        toast.error(error || 'Failed to delete college coordinator')
      }
    }

    handleCloseModal()
  }

  const columns = useMemo<ColumnDef<College, any>[]>(
    () => [
      columnHelper.accessor('college_code', {
        header: 'COLLEGE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.collegeCode}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.collegeName}</Typography>
      }),
      columnHelper.accessor('university_affiliation', {
        header: 'UNIVERSITY AFFILIATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.universityAffiliation}</Typography>
      }),
      columnHelper.accessor('college_type', {
        header: 'COLLEGE TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.collegeType}</Typography>
      }),
      columnHelper.accessor('location', {
        header: 'LOCATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.location}</Typography>
      }),
      columnHelper.accessor('district', {
        header: 'DISTRICT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.district}</Typography>
      }),
      columnHelper.display({
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => (
          <Box className='flex items-center gap-1'>
            <Tooltip title='View College'>
              <IconButton
                onClick={() => router.push(`/hiring-management/campus-management/college/view/${row.original.id}`)}
                aria-label={`View ${row.original.name}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <VisibilityIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit College'>
              <IconButton
                onClick={() =>
                  router.push(
                    `/hiring-management/campus-management/college/edit/detail?coordinatorId=${row.original.coordinatorId}&collegeId=${row.original.id}`
                  )
                }
                aria-label={`Edit ${row.original.name}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete College'>
              <IconButton
                onClick={() => handleOpenModal(row.original.coordinatorId)}
                aria-label={`Delete ${row.original.name}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }),
      columnHelper.accessor('pin_code', {
        header: 'PIN CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.pin_code}</Typography>
      }),
      columnHelper.accessor('full_address', {
        header: 'FULL ADDRESS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.full_address}</Typography>
      }),
      columnHelper.accessor('website_url', {
        header: 'WEBSITE URL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.website_url}</Typography>
      }),
      columnHelper.accessor('spoc_name', {
        header: 'SPOC NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_name}</Typography>
      }),
      columnHelper.accessor('spoc_designation', {
        header: 'SPOC DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_designation}</Typography>
      }),
      columnHelper.accessor('spoc_email', {
        header: 'SPOC EMAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_email}</Typography>
      }),
      columnHelper.accessor('spoc_alt_email', {
        header: 'SPOC ALT EMAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_alt_email}</Typography>
      }),
      columnHelper.accessor('spoc_mobile', {
        header: 'SPOC MOBILE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_mobile}</Typography>
      }),
      columnHelper.accessor('spoc_alt_phone', {
        header: 'SPOC ALT PHONE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_alt_phone}</Typography>
      }),
      columnHelper.accessor('spoc_linkedin', {
        header: 'SPOC LINKEDIN',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_linkedin}</Typography>
      }),
      columnHelper.accessor('spoc_whatsapp', {
        header: 'SPOC WHATSAPP',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_whatsapp}</Typography>
      }),
      columnHelper.accessor('last_visited_date', {
        header: 'LAST VISITED DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {new Date(row.original.last_visited_date).toLocaleDateString('en-IN')}
          </Typography>
        )
      }),
      columnHelper.accessor('last_engagement_type', {
        header: 'LAST ENGAGEMENT TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.last_engagement_type}</Typography>
      }),
      columnHelper.accessor('last_feedback', {
        header: 'LAST FEEDBACK',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.last_feedback}</Typography>
      }),
      columnHelper.accessor('preferred_drive_months', {
        header: 'PREFERRED DRIVE MONTHS',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.preferred_drive_months.join(', ')}</Typography>
        )
      }),
      columnHelper.accessor('remarks', {
        header: 'REMARKS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.remarks}</Typography>
      }),
      columnHelper.accessor('created_by', {
        header: 'CREATED BY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.created_by}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'CREATED AT',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.created_at).toLocaleString('en-IN')}</Typography>
        )
      }),
      columnHelper.accessor('updated_by', {
        header: 'UPDATED BY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.updated_by}</Typography>
      }),
      columnHelper.accessor('updated_at', {
        header: 'UPDATED AT',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.updated_at).toLocaleString('en-IN')}</Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <Typography
            color='text.primary'
            sx={{
              color:
                row.original.status === 'Active'
                  ? '#90EE90'
                  : row.original.status === 'Inactive'
                    ? '#ED960B'
                    : '#FF4500'
            }}
          >
            {row.original.status}
          </Typography>
        )
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {colleges.length === 0 ? (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No colleges found
          </Typography>
        </Box>
      ) : (
        <>
          <DynamicTable
            columns={columns}
            data={tableData.data}
            totalCount={tableData.totalCount}
            pagination={{ pageIndex: page - 1, pageSize: limit }}
            onPageChange={setPage}
            onRowsPerPageChange={setLimit}
            tableName='College & SPOC Table List'
            sorting={undefined}
            onSortingChange={undefined}
            initialState={undefined}
          />
          <ConfirmModal
            open={openModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            title='Confirm Deletion'
            description={`Are you sure you want to delete the coordinator for ${colleges.find(college => college.coordinatorId === selectedCoordinatorId)?.collegeName || 'this college'}? This process can't be undone.`}
            id={selectedCoordinatorId}
          />
        </>
      )}
    </Box>
  )
}

export default CollegeTableView
