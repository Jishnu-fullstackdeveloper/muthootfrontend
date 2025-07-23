'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Grid, Typography, Button, Divider} from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'

import LevelsIcon from '@/icons/LevelsIcon'
import GridIcon from '@/icons/GridAndTableIcons/Grid'
import TableIcon from '@/icons/GridAndTableIcons/TableIcon'
import SearchIcon from '@/icons/SearchIcon'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchBucket } from '@/redux/BucketManagemnet/BucketManagementSlice'
import { ROUTES } from '@/utils/routes'

type Bucket = {
  id: string
  name: string
  positionCategories: { jobRole: string; count: number }[]
  level: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
}

const BucketListing = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { bucketData } = useAppSelector(
    state => state.BucketManagementReducer
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // State to track which cards have "Show More" clicked
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    dispatch(fetchBucket({ page, limit }))
  }, [dispatch, page, limit])



  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const filteredData = useMemo(() => {
    if (!bucketData?.data) return []

    return bucketData.data.filter(bucket => bucket.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [bucketData, searchTerm])

  const columnHelper = createColumnHelper<Bucket>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Bucket',
        cell: ({ row }) => <Typography>{row.original.name || '-'}</Typography>
      }),
      columnHelper.accessor('level', {
        header: 'Level',
        cell: ({ row }) => <Typography>Level {row.original.level || '-'}</Typography>
      }),
      columnHelper.accessor('positionCategories', {
        header: 'Roles',
        cell: ({ row }) =>
          row.original.positionCategories.length > 0 ? (
            <Typography>
              {row.original.positionCategories.map(role => `${toTitleCase(role.jobRole)} (${role.count})`).join(', ')}
            </Typography>
          ) : (
            <Typography>N/A</Typography>
          )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            onClick={() =>
              router.push(
                `${ROUTES.BUCKET_MANAGEMENT.BUCKET_EDIT(row.original.id)}?name=${encodeURIComponent(row.original.name)}&level=${row.original.level}&positionCategories=${encodeURIComponent(JSON.stringify(row.original.positionCategories))}`
              )
            }
            size='small'
            variant='outlined'
          >
            Edit
          </Button>
        )
      })
    ],
    [router, toTitleCase]
  )

  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false)
  //   dispatch(fetchBucketDismiss())
  // }

  // Toggle "Show More" for a specific bucket
  const toggleShowMore = (bucketId: string) => {
    setShowMore(prev => ({ ...prev, [bucketId]: !prev[bucketId] }))
  }

  return (
    <Box>
      <Card sx={{ padding: 2, marginBottom: 3, borderRadius: '14px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 1,
            borderRadius: '12px',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8f9fc',
              borderRadius: '10px',
              padding: '8px 10px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SearchIcon />
            <input
              type='text'
              placeholder='Search buckets by name...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '20px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                flex: 1,
                fontSize: '14px',
                color: '#4b5563'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Button
              variant='contained'
              size='small'
              onClick={() => router.push(ROUTES.BUCKET_MANAGEMENT.BUCKET_ADD)}
              sx={{
                borderRadius: '8px',
                backgroundColor: '#0096DA',
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#007BBD' }
              }}
            >
              Add
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fc', borderRadius: '12px' }}>
              <Box
                sx={{
                  backgroundColor: viewType === 'grid' ? '#0096DA' : 'transparent',
                  color: viewType === 'grid' ? 'white' : '#0096DA',
                  borderRadius: '10px',
                  padding: 3,
                  cursor: 'pointer'
                }}
                onClick={() => setViewType('grid')}
              >
                <GridIcon />
              </Box>
              <Box
                sx={{
                  backgroundColor: viewType === 'table' ? '#0096DA' : 'transparent',
                  color: viewType === 'table' ? 'white' : '#0096DA',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  padding: 2
                }}
                onClick={() => setViewType('table')}
              >
                <TableIcon className='h-5 w-6' />
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {viewType === 'grid' && (
        <Grid container spacing={3}>
          {filteredData?.length > 0 ? (
            filteredData.map((bucket, index) => {
              const isExpanded = showMore[bucket.id]

              const visibleCategories = isExpanded ? bucket.positionCategories : bucket.positionCategories.slice(0, 5)

              const remainingCount = bucket.positionCategories.length - 5

              return (
                <Grid item xs={12} sm={6} md={4} key={bucket.id || index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '14px',
                      padding: 3,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            backgroundColor: '#F2F3FF',
                            padding: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <LevelsIcon />
                        </Box>
                        <Typography variant='h6' fontWeight={600}>
                          {bucket.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Button
                        onClick={() => router.push(`${ROUTES.BUCKET_MANAGEMENT.BUCKET_EDIT(bucket.id)}`)}
                        size='small'
                        variant='outlined'
                      >
                        Edit
                      </Button>
                    </Box>
                    <Divider />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 0.5 }}>
                        Level
                      </Typography>
                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        Level {bucket.level}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 3, flexGrow: 1 }}>
                      <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 1 }}>
                        Position Categories
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {visibleCategories.length > 0 ? (
                          visibleCategories.map((role, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                background: '#E8F4FF',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                fontSize: '13px'
                              }}
                            >
                              <Typography variant='body2' sx={{ color: '#0096DA', fontSize: '14px', fontWeight: 500 }}>
                                {toTitleCase(role.jobRole)} ({role.count})
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant='body2' color='textSecondary'>
                            N/A
                          </Typography>
                        )}
                      </Box>
                      {bucket.positionCategories.length > 5 && !isExpanded && (
                        <Button
                          size='small'
                          onClick={() => toggleShowMore(bucket.id)}
                          sx={{ mt: 1, color: '#0096DA', textTransform: 'none' }}
                        >
                          +{remainingCount} more
                        </Button>
                      )}
                      {isExpanded && (
                        <Button
                          size='small'
                          onClick={() => toggleShowMore(bucket.id)}
                          sx={{ mt: 1, color: '#0096DA', textTransform: 'none' }}
                        >
                          Show less
                        </Button>
                      )}
                    </Box>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => {
                        const queryParams = new URLSearchParams({
                          bucketNames: bucket.name
                        })

                        router.push(`${ROUTES.BUCKET_MANAGEMENT.BUCKET_VIEW}?${queryParams.toString()}`)
                      }}
                      sx={{
                        mt: 2,
                        width: '100%',
                        height: 36,
                        borderRadius: '8px',
                        border: '1px solid #0096DA',
                        backgroundColor: '#FFFFFF',
                        color: '#0096DA',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#D0E4F7', borderColor: '#007BBD' }
                      }}
                    >
                      View Details
                    </Button>
                  </Card>
                </Grid>
              )
            })
          ) : (
            <Typography variant='body1' sx={{ p: 3 }}>
              No buckets found.
            </Typography>
          )}
        </Grid>
      )}

      {viewType === 'table' && (
        <DynamicTable
          tableName='Bucket List'
          columns={columns}
          data={filteredData}
          pagination={{ pageIndex: page - 1, pageSize: limit }}
          page={page}
          limit={limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalCount={bucketData?.totalCount || filteredData.length}
          onPageChange={(newPage: number) => {
            setPage(newPage + 1)
          }}
          onLimitChange={(newLimit: number) => {
            setLimit(newLimit)
            setPage(1)
          }}
          sorting={[]}
          onSortingChange={() => {}}
          initialState={{ pagination: { pageIndex: page - 1, pageSize: limit } }}
        />
      )}

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={bucketSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
          {bucketSuccess
            ? 'Buckets fetched successfully'
            : Array.isArray(bucketFailureMessage)
              ? bucketFailureMessage.join(', ')
              : bucketFailureMessage || 'An error occurred while fetching buckets'}
        </Alert>
      </Snackbar> */}
    </Box>
  )
}

export default BucketListing
