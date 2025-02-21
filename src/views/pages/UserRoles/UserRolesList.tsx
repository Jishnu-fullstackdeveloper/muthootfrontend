'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Typography, IconButton, InputAdornment, Box, Card, CardContent, Grid, Button } from '@mui/material'

import DynamicTextField from '@/components/TextField/dynamicTextField'

function UserRolesAndPermisstionList() {
  const [tableData, setTableData] = useState<any[]>([
    {
      id: 1,
      role: 'HR',
      department: 'IT',
      category: 'ABC',
      band: 'ABCD'
    },
    {
      id: 2,
      role: 'Manager',
      department: 'IT',
      category: 'ABC',
      band: 'ABCD'
    },
    {
      id: 3,
      role: 'Super Admin',
      department: 'IT',
      category: 'ABC',
      band: 'ABCD'
    },
    {
      id: 4,
      role: 'Admin',
      department: 'IT',
      category: 'ABC',
      band: 'ABCD'
    }
  ])

  const [searchText, setSearchText] = useState('')

  const router = useRouter()

  const handleAddUser = () => {
    router.push('/user-role/add/add-role')
  }

  const handleView = (id: number) => {
    router.push(`/user-role/view/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/user-role/edit/${id}`)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()

    setSearchText(value)

    const filteredData = tableData.filter(
      item =>
        item.role.toLowerCase().includes(value) ||
        item.department.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.band.toLowerCase().includes(value)
    )

    setTableData(filteredData)

    return filteredData
  }

  // const handlePageChange = (newPage: number) => {
  //   setPagination(prev => {
  //     const updatedPagination = { ...prev, pageIndex: newPage }
  //     console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
  //     console.log('Page Size:', updatedPagination.pageSize) // Log pageSize
  //     return updatedPagination
  //   })
  // }

  // const handleRowsPerPageChange = (newPageSize: number) => {
  //   const updatedPagination = { pageIndex: 0, pageSize: newPageSize }
  //   console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
  //   console.log('Page Size:', updatedPagination.pageSize) // Log pageSize
  //   setPagination(updatedPagination)
  // }

  return (
    <div>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DynamicTextField
                id='searchId'
                label='Search'
                variant='outlined'
                onChange={handleSearch}
                value={searchText}
                placeholder='Search...'
                size='small'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                      <i className='tabler-search text-xxl' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Button variant='contained' onClick={handleAddUser} startIcon={<i className='tabler-plus' />} size='medium'>
              Add User
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        {tableData.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              onClick={() => handleView(item.id)}
              sx={{
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '1px solid #ddd',
                position: 'relative'
              }} // For positioning buttons at the top-right corner
              className='transition transform hover:-translate-y-1'
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    paddingBottom: '20px'
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 'calc(100% - 100px)'
                    }}
                  >
                    {item.role}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Edit Button */}
                    <IconButton
                      onClick={(e: any) => {
                        e.stopPropagation()
                        handleEdit(item.id)
                      }}
                      sx={{
                        padding: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        '&:hover': { backgroundColor: 'transparent' }
                      }}
                    >
                      <i className='tabler-edit' />
                    </IconButton>

                    {/* Delete Button */}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default UserRolesAndPermisstionList
