'use client'

import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card
} from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import ModifiedDynamicTable from '@/components/Modifiedtable/modifiedDynamicTable'
import { fetchApprovalMatrices, deleteApprovalMatrix } from '@/redux/approvalMatrixSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

const ApprovalSettings = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  // Pagination states
  const [page] = useState(1)
  const [limit] = useState(10)

  // Redux state
  const { approvalMatrixData, status, error } = useAppSelector(state => state.approvalMatrixReducer)

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Fetch data on page/limit change
  useEffect(() => {
    dispatch(fetchApprovalMatrices({ page, limit }))
  }, [dispatch, page, limit])

  // Log data for debugging
  useEffect(() => {
    console.log('Approval Matrix Data:', approvalMatrixData)
    console.log(searchParams.get('id'))
  }, [approvalMatrixData, searchParams])

  const handleEdit = (rowData: any) => {
    const queryParams = new URLSearchParams({
      id: rowData.id,
      approvalType: rowData.name,
      numberOfLevels: rowData.configurations.length.toString(),
      approvalBy: JSON.stringify(
        rowData.configurations.map((config: any) => ({
          id: config.designationId,
          name: config.designationName // Ensure name is included
        }))
      )
    }).toString()

    router.push(`/approval-matrix/edit/edit-approval?${queryParams}`)
  }

  // Handle dialog open
  const handleOpenDialog = (id: string) => {
    setSelectedId(id)
    setOpenDialog(true)
  }

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedId(null)
  }

  // Handle delete
  const handleDelete = async () => {
    if (selectedId) {
      const resultAction = await dispatch(deleteApprovalMatrix(selectedId))

      if (deleteApprovalMatrix.fulfilled.match(resultAction)) {
        dispatch(fetchApprovalMatrices({ page, limit }))
      }

      setOpenDialog(false)
      setSelectedId(null)
    }
  }

  // Columns for the table
  const columns: ColumnDef<any>[] = [
    //{ accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'branchId', header: 'Branch ID' },
    { accessorKey: 'category.name', header: 'Category' }, // Added Category Name
    {
      accessorKey: 'configurations',
      header: 'Approval Levels',
      cell: ({ row }) =>
        row.original.configurations
          .map((config: any) => `Level ${config.approvalSequenceLevel}: Designation ${config.designationId}`)
          .join(', ')
    },
    {
      header: 'Actions',
      cell: info => (
        <div>
          <IconButton aria-label='edit' sx={{ fontSize: 18 }} onClick={() => handleEdit(info.row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete' sx={{ fontSize: 18 }} onClick={() => handleOpenDialog(info.row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <Box>
      <Card
        className='flex justify-between  w-full'
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          padding: 5
        }}
      >
        <Typography variant='h4'>Approval Matrix</Typography>
        <Button
          variant='contained'
          onClick={() => router.push(`/approval-matrix/add/new-approval?categoryId=${searchParams.get('id')}`)}
        >
          <AddIcon sx={{ mr: 1, width: 17 }} /> New Approval
        </Button>
      </Card>

      <Box className='mt-2'>
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography>Error: {JSON.stringify(error) || 'An unknown error occurred'}</Typography>}
        {status === 'succeeded' && <ModifiedDynamicTable columns={columns} data={approvalMatrixData || []} />}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this approval matrix?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalSettings
