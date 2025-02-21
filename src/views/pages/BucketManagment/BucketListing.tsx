'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material'
import {
  Box,
  Tooltip,
  IconButton,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination
} from '@mui/material'

import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import type { ColumnDef } from '@tanstack/react-table'

import { createColumnHelper } from '@tanstack/react-table'

import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicTable from '@/components/Table/dynamicTable'

import { deleteBucket, fetchBucketList } from '@/redux/BucketManagementSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

const BucketListing = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const [paginationState, setPaginationState] = useState<any>({
    page: 1,
    limit: 20
  })

  const [bucketId, setBucketId] = useState<any>(null)

  let totalPages: number = 0

  const handlePageChange = (event: any, value: any) => {
    setPaginationState((prev: any) => ({ ...prev, page: value }))
  }

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { bucketListData, deleteBucketListSuccess, updateBucketListSuccess } = useAppSelector(
    (state: any) => state.BucketManagementReducer
  )

  const getBucketListDatas = () => {
    const params = {
      page: paginationState.page,
      limit: paginationState.limit
    }

    dispatch(fetchBucketList(params))
  }

  const columnHelper = createColumnHelper<any>()

  // Define columns using useMemo
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Bucket Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('turnover_code', {
        header: 'Turnover Code',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.turnoverCode}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'Designations',
        cell: ({ row }) => {
          // Limit to first 3 designations
          const visiblePositions = row.original.positionCategories?.slice(0, 3)

          return (
            <>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {visiblePositions?.map((positionCategories: any, index: number) => (
                  <li key={index}>
                    {positionCategories.designationName}: {positionCategories.count}: {positionCategories.grade}
                  </li>
                ))}
              </ul>
              {/* Show remaining positions */}
              {/* {remainingCount > 0 && (
              <div>
               
                +{remainingCount} 
              </div>
            )} */}
            </>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <Typography>
            <Button
              variant='outlined'
              onClick={(e: any) => {
                e.stopPropagation()
                handleEditBucket(row.original.id)
              }}
              sx={{
                minWidth: 'auto',
                padding: 1,
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <i className='tabler-edit' style={{ color: '#808080', fontSize: '24px' }} />
            </Button>

            <Button
              variant='outlined'
              color='error'
              onClick={(e: any) => {
                e.stopPropagation()
                handleDeleteBucket(row.original.id)
              }}
              sx={{
                minWidth: 'auto',
                padding: 1,
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <i className='tabler-trash' style={{ color: '#808080', fontSize: '24px' }} />
            </Button>

            {/* <Button
              variant='outlined'
              color='success'
              onClick={() =>
                router.push(
                  `/bucket-management/view/${original.turnoverCode}?name=${encodeURIComponent(bucket.name)}&turnoverCode=${bucket.turnoverCode}&notes=${encodeURIComponent(bucket.notes)}&positionCategories=${encodeURIComponent(JSON.stringify(bucket.positionCategories))}`
                )
              }
              sx={{
                minWidth: 'auto',
                padding: 1,
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <i className='tabler-eye' style={{ color: '#808080', fontSize: '24px' }} />
            </Button> */}
          </Typography>
        )
      })
    ],
    [columnHelper]
  )

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,

    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} variant='outlined' />
  }

  const sortedBucketData = useMemo(() => {
    if (bucketListData?.data) {
      return [...bucketListData.data].sort((a: any, b: any) => a.name.localeCompare(b.name))
    }

    return []
  }, [bucketListData])

  const handleAddNewBucket = () => {
    router.push('/bucket-management/add/new-bucket')
  }

  const handleEditBucket = (id: number) => {
    router.push(`/bucket-management/edit/${id}`)
  }

  const handleDeleteBucket = (id: string) => {
    setBucketId(id)
    setOpenModal(true)
  }

  const handleDeleteConfirm = (id: any) => {
    dispatch(deleteBucket(id))
    setOpenModal(false)
    getBucketListDatas()
  }

  const handleDeleteCancel = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    getBucketListDatas()
  }, [paginationState, deleteBucketListSuccess, updateBucketListSuccess])

  useEffect(() => {
    if (bucketListData && bucketListData.data) {
      totalPages = Math.ceil(bucketListData.totalCount / paginationState.limit)
    }
  }, [bucketListData])

  return (
    <div>
      <Box
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography component='h1' variant='h4' sx={{ fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>
            Bucket List
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Tooltip title='Click here for help'>
              <IconButton size='small'>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              value={search}
              onChange={(value: any) => setSearch(value)}
              placeholder='Search by List...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='New Bucket'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={handleAddNewBucket}
              children='New Bucket'
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Box>

      {/* Card 2 - List View and table*/}
      <CardActions className='p-0 pt-5'>
        {viewMode === 'table' ? (
          <Box sx={{ width: '100%' }}>
            <DynamicTable columns={columns} data={bucketListData.data} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {sortedBucketData
              ?.filter((bucket: any) => bucket.name.toLowerCase().includes(search.toLowerCase()))
              ?.map((bucket: any) => (
                <Grid item xs={12} sm={6} md={4} key={bucket.id}>
                  <Card
                    onClick={() =>
                    
                      router.push(
                        `/bucket-management/view/${bucket.turnoverCode}?name=${bucket.name}&turnoverCode=${bucket.turnoverCode}&notes=${bucket.notes || ''}&positionCategories=${JSON.stringify(bucket.positionCategories)}`
                      )
                    }
                    sx={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      border: '1px solid #ddd',
                      position: 'relative'
                    }} // For positioning buttons at the top-right corner
                    className='transition transform hover:-translate-y-1'
                  >
                    <CardContent sx={{ height: 300 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          paddingBottom: '20px',
                          borderBottom: '1px solid #ddd'
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#e0f7fa',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '1.2rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 100px)'
                          }}
                        >
                          {bucket.name.toUpperCase()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Edit Button */}
                          <IconButton
                            onClick={(e: any) => {
                              e.stopPropagation()
                              handleEditBucket(bucket.id)
                            }}
                            sx={{
                              minWidth: 'auto',
                              padding: 1,
                              backgroundColor: 'transparent',
                              border: 'none',
                              '&:hover': { backgroundColor: 'transparent' }
                            }}
                          >
                            <i className='tabler-edit' />
                          </IconButton>

                          {/* Delete Button */}
                          <IconButton
                            aria-label='Delete Bucket'
                            onClick={(e: any) => {
                              e.stopPropagation()
                              handleDeleteBucket(bucket.id)
                            }}
                            sx={{
                              minWidth: 'auto',
                              padding: 1,
                              backgroundColor: 'transparent',
                              border: 'none',
                              '&:hover': { backgroundColor: 'transparent' }
                            }}
                          >
                            <i className='tabler-trash' />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant='body2' sx={{ paddingTop: 3, color: 'text.secondary', fontSize: '1rem' }}>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 'bold', display: 'inline', fontSize: '1.1rem' }}
                          component='span'
                        >
                          Turnover code :
                        </Typography>
                        {bucket.turnoverCode}
                      </Typography>

                      <div>
                        <Typography
                          variant='body2'
                          sx={{ color: 'text.secondary', fontSize: '1.1rem', fontWeight: 'bold' }}
                        >
                          Designations:
                        </Typography>

                        <ul
                          style={{
                            backgroundColor: '#f9f9f9',
                            height: '120px',
                            paddingTop: 10,
                            paddingRight: 10,
                            borderRadius: '4px',
                            marginTop: '8px',
                            listStyleType: 'disc',
                            paddingLeft: '30px'
                          }}
                        >
                          {bucket.positionCategories?.slice(0, 3)?.map((positionCategories: any) => (
                            <li key={positionCategories.name}>
                              {positionCategories.designationName}: {positionCategories.count}:{' '}
                              {positionCategories.grade}
                            </li>
                          ))}

                          {bucket.positionCategories?.length > 3 && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginTop: '8px'
                              }}
                            >
                              <i className='tabler-arrow-bar-right' style={{ color: '#808080', fontSize: '24px' }} />
                              <Tooltip title=' More Designations'>
                                <span>+{bucket.positionCategories.length - 3}</span>
                              </Tooltip>
                            </div>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </CardActions>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={openModal}
        onClose={handleDeleteCancel}
        onConfirm={id => handleDeleteConfirm(id)}
        id={bucketId}
        title='Delete Item'
        description='Are you sure you want to delete this item? This action cannot be undone.'
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
          count={totalPages}
          page={paginationState.page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default BucketListing
