'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { Box, Typography, Chip, CircularProgress } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDataUploads } from '@/redux/DataUpload/dataUploadSlice'
import type { DataUploadTableRow } from '@/types/dataUpload'

const DataUploadTableList = () => {
  const columnHelper = createColumnHelper<DataUploadTableRow>()
  const dispatch = useAppDispatch()
  const { uploads, totalCount, status, error } = useAppSelector(state => state.dataUploadReducer)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Fetch data uploads on mount and when pagination changes
  useEffect(() => {
    dispatch(
      fetchDataUploads({
        page: pagination?.pageIndex + 1, // API uses 1-based indexing
        limit: pagination?.pageSize,
        search: ''
      })
    )
  }, [dispatch, pagination?.pageIndex, pagination?.pageSize])

  // Map API data to table format
  const tableData = useMemo(() => {
    const mappedData = uploads?.map((upload, index) => ({
      slno: index + 1 + pagination?.pageIndex * pagination?.pageSize, // Serial number based on index and page
      id: upload?.id,
      fileName: upload?.processData?.originalname || '-',
      fileType: upload?.processData?.type || '-',
      fileSize: upload?.processData?.size,
      time: upload?.createdAt ? new Date(upload.createdAt).toLocaleString() : '-',
      status: upload?.processStatus || '-',
      remarks: upload?.errorDetails
        ? [upload?.errorDetails]
        : upload?.processStatus === 'COMPLETED'
          ? ['Processed successfully']
          : ['-'] // Default remarks based on status
    }))

    return {
      data: mappedData,
      totalCount: totalCount
    }
  }, [uploads, totalCount, pagination.pageIndex, pagination.pageSize])

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

  const columns = useMemo<ColumnDef<DataUploadTableRow, any>[]>(
    () => [
      columnHelper.accessor('slno', {
        header: 'SLNO',
        cell: ({ row }) => <Typography color='text.primary'>{row?.original?.slno}</Typography>
      }),
      columnHelper.accessor('fileName', {
        header: 'FILE NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row?.original?.fileName}</Typography>
      }),
      columnHelper.accessor('fileType', {
        header: 'TYPE/CATEGORY',
        cell: ({ row }) => <Typography color='text.primary'>{row?.original?.fileType}</Typography>
      }),
      columnHelper.accessor('fileSize', {
        header: 'FILE SIZE',
        cell: ({ row }) => <Typography color='text.primary'>{row?.original?.fileSize}</Typography>
      }),
      columnHelper.accessor('time', {
        header: 'TIME',
        cell: ({ row }) => <Typography color='text.primary'>{row?.original?.time}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => {
          const status = row?.original?.status
          let color: 'success' | 'error' | 'warning' = 'warning' // Default to yellow (warning)

          if (status === 'COMPLETED')
            color = 'success' // Green
          else if (status === 'FAILED') color = 'error' // Red

          return <Chip variant='tonal' size='small' label={status} color={color} sx={{ borderRadius: 1 }} />
        }
      })

      // columnHelper.accessor('remarks', {
      //   header: 'REMARKS',
      //   cell: ({ row }) => (
      //     <Box
      //       sx={{
      //         height: Array.isArray(row.original.remarks) && row.original.remarks.length > 4 ? '60px' : 'auto', // Fixed height for scrolling only when > 2 remarks
      //         overflow: 'hidden', // Prevent outer overflow
      //         width: '100%', // Ensure the column width is contained
      //         display: 'flex',
      //         flexDirection: 'column'
      //       }}
      //     >
      //       <Box
      //         component='ul'
      //         sx={{
      //           principled: 0,
      //           listStyle: 'none',
      //           flexGrow: 1,
      //           ...(Array.isArray(row.original.remarks) &&
      //             row.original.remarks.length > 4 && {
      //               maxHeight: '60px', // Match the outer Box height
      //               overflowY: 'auto', // Enable scrollbar
      //               // Thin scrollbar for Firefox
      //               scrollbarWidth: 'thin',

      //               // Thin scrollbar for WebKit browsers (Chrome, Safari)
      //               '&::-webkit-scrollbar': {
      //                 width: '0.5px' // Thin scrollbar width
      //               },
      //               '&::-webkit-scrollbar-thumb': {
      //                 backgroundColor: 'rgba(0, 0, 0, 0.3)', // Subtle color for the thumb
      //                 borderRadius: '0.25px' // Rounded edges
      //               },
      //               '&::-webkit-scrollbar-track': {
      //                 backgroundColor: 'transparent' // Transparent track
      //               }
      //             })
      //         }}
      //       >
      //         {Array.isArray(row.original.remarks) ? (
      //           row.original.remarks.map((remark: string, index: number) => (
      //             <Typography key={index} component='li' color='text.primary' sx={{ marginLeft: '1.5rem' }}>
      //               • {remark}
      //             </Typography>
      //           ))
      //         ) : (
      //           <Typography component='li' color='text.primary' sx={{ marginLeft: '1.5rem' }}>
      //             • {row.original.remarks}
      //           </Typography>
      //         )}
      //       </Box>
      //     </Box>
      //   )
      // })
    ],
    [columnHelper]
  )

  return (
    <>
      {status === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && <Typography align='center'>No data found</Typography>}
      {status === 'succeeded' && (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Data Upload Listing'
        />
      )}
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
