'use client'
import React, { useState, useMemo } from 'react'

import { Box, Typography, Chip } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

const DataUploadTableList = () => {
  const columnHelper = createColumnHelper<any>()

  // Mock data for the table
  const mockDataUploads = [
    {
      id: '1',
      fileName: 'Budget_Report.pdf',
      fileType: 'PDF',
      category: 'Employee data',
      time: '2023-10-01 10:00',
      status: 'Success',
      remarks: [
        'Processed without issues',
        'Verified',
        'Validated data',
        'No major issues are found',
        'Non AD users are not included',
        'Employee codes are proper'
      ]
    },
    {
      id: '2',
      fileName: 'Branch_Expansion_Data.csv',
      fileType: 'CSV',
      category: 'Resignation data',
      time: '2023-10-02 14:30',
      status: 'Success',
      remarks: ['Completed successfully', 'Data validated']
    },
    {
      id: '3',
      fileName: 'Employee_Records.xlsx',
      fileType: 'Excel',
      category: 'Employee data',
      time: '2023-10-03 09:15',
      status: 'Failed',
      remarks: ['Invalid file format', 'Corrupted data', 'Error', 'Lack of datas', 'File error']
    },
    {
      id: '4',
      fileName: 'Resignation_data.doc',
      fileType: 'Word',
      category: 'Employee data',
      time: '2023-10-04 16:45',
      status: 'Pending',
      remarks: ['Awaiting review', 'Pending approval']
    },
    {
      id: '5',
      fileName: 'Budget_2024.pdf',
      fileType: 'PDF',
      category: 'Resignation data',
      time: '2023-10-05 11:20',
      status: 'Pending',
      remarks: ['Under processing', 'In queue']
    }
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Map mock data to table format
  const tableData = useMemo(() => {
    const mappedData = mockDataUploads.map((upload, index) => ({
      slno: index + 1, // Serial number based on index
      id: upload.id,
      fileName: upload.fileName || '-',
      fileType: upload.fileType || '-',
      category: upload.category || '-',
      time: upload.time || '-',
      status: upload.status || '-',
      remarks: upload.remarks || ['-'] // Ensure remarks is an array, default to ['-']
    }))

    return {
      data: mappedData,
      totalCount: mockDataUploads.length
    }
  }, [])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  // const handleDeleteClick = (id: string | number) => {
  //   setUploadIdToDelete(id)
  //   setDeleteModalOpen(true)
  // }

  // const handleDeleteConfirm = async (id?: string | number) => {
  //   if (id && typeof id === 'string') {
  //     try {
  //       await dispatch(deleteUpload(id)).unwrap()
  //       console.log('Deleted upload with ID:', id)
  //     } catch (err) {
  //       console.error('Delete failed:', err)
  //     }
  //   }

  //   setDeleteModalOpen(false)
  //   setUploadIdToDelete(null)
  // }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('slno', {
        header: 'SLNO',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.slno}</Typography>
      }),
      columnHelper.accessor('fileName', {
        header: 'FILE NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fileName}</Typography>
      }),
      columnHelper.accessor('fileType', {
        header: 'FILE TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fileType}</Typography>
      }),
      columnHelper.accessor('category', {
        header: 'CATEGORY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.category}</Typography>
      }),
      columnHelper.accessor('time', {
        header: 'TIME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.time}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => {
          const status = row.original.status
          let color: 'success' | 'error' | 'warning' = 'warning' // Default to yellow (warning)

          if (status === 'Success')
            color = 'success' // Green
          else if (status === 'Failed') color = 'error' // Red

          return (
            <Chip size='small' variant='tonal' label={status} color={color} sx={{ fontWeight: 500, color: '#fff' }} />
          )
        }
      }),
      columnHelper.accessor('remarks', {
        header: 'REMARKS',
        cell: ({ row }) => (
          <Box
            sx={{
              height: Array.isArray(row.original.remarks) && row.original.remarks.length > 4 ? '60px' : 'auto', // Fixed height for scrolling only when > 2 remarks
              overflow: 'hidden', // Prevent outer overflow
              width: '100%', // Ensure the column width is contained
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              component='ul'
              sx={{
                principled: 0,
                listStyle: 'none',
                flexGrow: 1,
                ...(Array.isArray(row.original.remarks) &&
                  row.original.remarks.length > 4 && {
                    maxHeight: '60px', // Match the outer Box height
                    overflowY: 'auto', // Enable scrollbar
                    // Thin scrollbar for Firefox
                    scrollbarWidth: 'thin',

                    // Thin scrollbar for WebKit browsers (Chrome, Safari)
                    '&::-webkit-scrollbar': {
                      width: '0.5px' // Thin scrollbar width
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Subtle color for the thumb
                      borderRadius: '0.25px' // Rounded edges
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'transparent' // Transparent track
                    }
                  })
              }}
            >
              {Array.isArray(row.original.remarks) ? (
                row.original.remarks.map((remark: string, index: number) => (
                  <Typography key={index} component='li' color='text.primary' sx={{ marginLeft: '1.5rem' }}>
                    • {remark}
                  </Typography>
                ))
              ) : (
                <Typography component='li' color='text.primary' sx={{ marginLeft: '1.5rem' }}>
                  • {row.original.remarks}
                </Typography>
              )}
            </Box>
          </Box>
        )
      })
    ],
    [columnHelper]
  )

  return (
    <>
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Data Upload Listing'
      />
      {/* <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={uploadIdToDelete}
      /> */}
    </>
  )
}

export default DataUploadTableList
