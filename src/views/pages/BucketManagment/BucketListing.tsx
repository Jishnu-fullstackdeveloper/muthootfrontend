'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import { Box, Tooltip, IconButton, InputAdornment, Button, Grid, Card, CardContent, CardActions } from '@mui/material'
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

  const router = useRouter()

  const buckets = [
    {
      id: 1,
      name: 'Bucket 1',
      designation: [
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 }
      ],
      turnover_limit: 2,
      turnover_id: 1122
    },
    {
      id: 2,
      name: 'Bucket 2',
      designation: [
        { designationName: 'Marketing Lead', count: 5 },
        { designationName: 'Sales Manager', count: 4 }
      ],
      turnover_limit: 3,
      turnover_id: 1133
    },
    {
      id: 3,
      name: 'Bucket 3',
      designation: [
        { designationName: 'Tech Lead', count: 7 },
        { designationName: 'Software Engineer', count: 8 }
      ],
      turnover_limit: 5,
      turnover_id: 1144
    }
  ]

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

  return (
    <div>
      {/* Card 1 - Search and Add Button */}
      <Box
        sx={{
          padding: 3,
          marginBottom: 3, // Added margin for separation
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
              onClick={() => router.push(`bucket-management/add/new-bucket`)}
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
      <Box
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {/* <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {viewMode === 'list' ? 'List View' : 'Grid View'}
        </Typography> */}

        {/* Render List View or Grid View */}
        <CardActions>
          {viewMode === 'list' ? (
            <Box sx={{ marginTop: 2 }}>
              {buckets
                .filter(bucket => bucket.name.toLowerCase().includes(search.toLowerCase()))
                .map(bucket => (
                  <Box
                    key={bucket.id}
                    sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}
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
                  </Box>
                ))}
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
              {buckets
                .filter(bucket => bucket.name.toLowerCase().includes(search.toLowerCase()))
                .map(bucket => (
                  <Grid item xs={12} sm={6} md={4} key={bucket.id}>
                    <Card sx={{ padding: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </CardActions>
      </Box>
    </div>
  )
}

export default BucketListing
