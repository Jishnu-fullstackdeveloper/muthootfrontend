'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { TextFieldProps } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import { useRouter } from 'next/navigation'
import DynamicTable from '@/components/Table/dynamicTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const BucketListing = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false) // State to handle modal visibility
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null) // Store the bucket ID to delete

  const router = useRouter()

  const buckets = [
    {
      id: 1,
      name: 'Bucket 1',
      designation: [
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 }
      ],
      turnover_code: 'Abc12',
      turnover_id: 1122,
      note: 'This bucket is intended to cover roles related to the administrative and human resources sectors. It has a relatively low turnover limit due to the specialized nature of these positions.'
    },
    {
      id: 2,
      name: 'Bucket 2',
      designation: [
        { designationName: 'Marketing Lead', count: 5 },
        { designationName: 'Sales Manager', count: 4 },
      ],
      turnover_code: 'Abc12',
      turnover_id: 1133,
      note: 'This bucket is focused on roles that drive growth and revenue generation for the organization. Marketing and sales are critical to the company’s success, requiring a higher turnover capacity to adapt to changing market dynamics. The Marketing Lead and Sales Manager positions in this bucket are vital for executing campaigns, improving customer acquisition strategies, and expanding the brand’s reach. As these roles require both creativity and leadership skills, they often face higher turnover, and the organization needs to ensure timely replacements to keep up with business objectives.'
    },
    {
      id: 3,
      name: 'Bucket 3',
      designation: [
        { designationName: 'Tech Lead', count: 7 },
        { designationName: 'Software Engineer', count: 8 },
      ],
      turnover_code: 'Abc82',
      turnover_id: 1144,
      note: 'This bucket caters to the technical teams of the organization, including software engineers and tech leads. These positions are crucial for the development, maintenance, and innovation of the company’s products and services. Due to the fast-paced and highly competitive nature of the tech industry, turnover in these roles tends to be higher, making it essential to have a higher turnover limit for quick replacements. The roles in this bucket require technical expertise and are key in driving the company’s technological advancements, which is why they are critical for the organization’s long-term success.'
    }
  ]
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
            {row.original.turnover_code}
          </Typography>
        )
      }),
      columnHelper.accessor('turnover_id', {
        header: 'Turnover ID',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.turnover_id}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'Designations',
        cell: ({ row }) => (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {row.original.designation.map((designation: any, index: number) => (
              <li key={index}>
                <Typography color='text.secondary'>
                  {designation.designationName}: {designation.count}
                </Typography>
              </li>
            ))}
          </ul>
        )
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <Typography>
            <Button
              variant='outlined'
              onClick={(e: any) => {
                e.stopPropagation()
                handleEdit(row.original.id)
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
              <i className='tabler-edit' style={{ color: '#808080', fontSize: '24px' }} />
            </Button>

            <Button
              variant='outlined'
              color='error'
              onClick={(e: any) => {
                e.stopPropagation()
                handleDeleteClick(row.original.id)
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
            <Button
              variant='outlined'
              color='success'
              onClick={() => router.push(`/bucket-management/view/${row.original.id}`)}
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
            </Button>
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

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const handleAddClick = () => {
    router.push('/bucket-management/add/new-bucket')
  }

  const handleEdit = (id: number) => {
    router.push(`/bucket-management/edit/${id}`)
  }

  const handleDeleteClick = (id: number) => {
    setSelectedBucketId(id)
    setOpenModal(true) // Open the modal when delete is clicked
  }

  const handleDeleteConfirm = () => {
    if (selectedBucketId) {
      console.log(`Deleting bucket with ID: ${selectedBucketId}`)
      // Perform your actual delete operation here, e.g., API call to delete the bucket
    }
    setOpenModal(false) // Close the modal after confirmation
    setSelectedBucketId(null) // Reset the selected bucket ID
  }

  const handleDeleteCancel = () => {
    setOpenModal(false) // Close the modal without deleting
    setSelectedBucketId(null) // Reset the selected bucket ID
  }

  return (
    <div>
      {/* Card 1 - Search and Add Button */}
      <Box
        sx={{
          padding: 3,
          marginBottom: 3,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          }
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
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: '#333',
              letterSpacing: 1
            }}
          >
            Bucket List
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
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
              label='Search Designation'
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
              onClick={handleAddClick}
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
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
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

      {/* Card 2 - List View */}
      <CardActions>
        {viewMode === 'list' ? (
          <Box sx={{ marginTop: 2, width: '100%' }}>
          {buckets
            .filter(bucket => bucket.name.toLowerCase().includes(search.toLowerCase()))
            .map(bucket => (
              <Box 
                key={bucket.id} 
                sx={{
                  marginBottom: 2, 
                  padding: 2, 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: 2,
                  border: '1px solid #ddd', // Border added here
                  width: '100%' // Ensure full width
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  {bucket.name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Turnover Limit: {bucket.turnover_limit}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Designations:
                  <ul>
                    {bucket.designation.map((designation, index) => (
                      <li key={index}>
                        {designation.designationName}: {designation.count}
                      </li>
                    ))}
                  </ul>
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                  <Button variant='outlined' onClick={() => handleEdit(bucket.id)} sx={{ marginRight: 1 }}>
                    <i className='tabler-edit' />
                  </Button>
                  <Button variant='outlined' color='error' onClick={() => handleDeleteClick(bucket.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
        
        ) : (
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {buckets
              .filter((buc: any) => buc.name.toLowerCase().includes(search.toLowerCase()))
              .map((bucket: any) => (
                <Grid item xs={12} sm={6} md={4} key={bucket.id}>
                  <Card
                    sx={{ padding: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer' ,border: '1px solid #ddd'}}
                    className='transition transform hover:-translate-y-1'
                    onClick={() => router.push(`/bucket-management/view/${bucket.id}`)}
                  >
                    <CardContent>
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        {bucket.name}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        Turnover Limit: {bucket.turnover_limit}
                      </Typography>
                      <div>
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          Designations:
                        </Typography>
                        <ul>
                          {bucket.designation.map((designation: any, index: number) => (
                            <li key={index}>
                              {designation.designationName}: {designation.count}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button
                        variant='outlined'
                        onClick={(e: any) => {
                          e.stopPropagation()
                          handleEdit(bucket.id)
                        }}
                        sx={{ marginRight: 1 }}
                      >
                        <i className='tabler-edit' />
                      </Button>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={(e: any) => {
                          e.stopPropagation()
                          handleDeleteClick(bucket.id)
                        }}
                      >
                        <i className='tabler-trash' />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </CardActions>

      {/* Delete Confirmation Modal */}
      <Dialog open={openModal} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this bucket?</DialogTitle>
        <DialogContent>Deleting a bucket is permanent and cannot be undone. Please confirm your action.</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='secondary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BucketListing
