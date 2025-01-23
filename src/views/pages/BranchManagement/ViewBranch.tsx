'use client'

import React, { useState } from 'react'
import { Box, Card, Typography, Divider, Tab, Tabs, Grid, Button } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import WorkIcon from '@mui/icons-material/Work'
import CustomTable from '@/components/Table/CustomTable'
import { useRouter } from 'next/navigation'
import sampleEmployeeData from '@/utils/sampleData/sampleEmployeeData.json'

interface ViewBranchProps {
  mode: string
  id: string
}

const ViewBranch: React.FC<ViewBranchProps> = ({ mode, id }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  // Simulated branch data
  const branchData = {
    id: id,
    name: 'Market Square',
    branchCode: 'B002',
    territory: 'West',
    zonal: 'Zone2',
    region: 'Region2',
    area: 'Area2',
    cluster: 'Cluster2',
    cityClassification: 'Urban',
    state: 'Texas',
    status: 'Inactive',
    turnoverCode: 'B123'
  }

  const bubblePositionData = [
    {
      position: 'Branch Manager',
      actualCount: 2,
      requiredCount: 1,
      employees: [
        { name: 'John Doe', employeeCode: 'EMP001', joiningDate: '2023-01-15' },
        { name: 'Jane Smith', employeeCode: 'EMP002', joiningDate: '2023-02-01' }
      ]
    },
    {
      position: 'Sales Executive',
      actualCount: 3,
      requiredCount: 2,
      employees: [
        { name: 'Mike Johnson', employeeCode: 'EMP003', joiningDate: '2023-03-10' },
        { name: 'Sarah Williams', employeeCode: 'EMP004', joiningDate: '2023-03-15' },
        { name: 'Robert Brown', employeeCode: 'EMP005', joiningDate: '2023-04-01' }
      ]
    }
  ]

  // Sample employee data
  const employeeData: any[] = sampleEmployeeData

  // Employee Table Columns
  const employeeColumns = [
    { header: 'ID', accessorKey: 'employeeCode' },
    { header: 'Name', accessorKey: 'First Name' },
    { header: 'Employment Status', accessorKey: 'Employment Status' },
    { header: 'Email', accessorKey: 'Personal Email Address' },
    { header: 'Designation', accessorKey: 'Title' }
  ]

  // Action buttons for the employee table
  const actionButtons = [
    {
      icon: <i className='tabler-eye' style={{ fontSize: 18 }} />,
      onClick: (rowData: any) => router.push(`/employee-details?employeeId=${rowData.employeeCode}`),
      tooltip: 'View Details'
    }
  ]

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    if (newValue === 2) {
      // router.push('/bucket-management')
      router.push(`/bucket-management/view/${branchData.turnoverCode}`)
    } else if (newValue === 3) {
      router.push(`/vacancy-management/view/${id}`)
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Branch Details */}
      <Card sx={{ padding: 4, marginBottom: 4 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <Typography variant='h5'>Branch Details</Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<ListAltIcon />}
                onClick={() => router.push('/bucket-management')}
                size='small'
              >
                Bucket Management
              </Button>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<WorkIcon />}
                onClick={() => router.push(`/vacancy-management?branchId=${id}`)}
                size='small'
              >
                Vacancy Management
              </Button>
            </Box>
          </Grid> */}
        </Grid>
        <Divider sx={{ marginY: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>ID:</strong> {branchData.id}
            </Typography>
            <Typography variant='body1'>
              <strong>Name:</strong> {branchData.name}
            </Typography>
            <Typography variant='body1'>
              <strong>Branch Code:</strong> {branchData.branchCode}
            </Typography>
            <Typography variant='body1'>
              <strong>Territory:</strong> {branchData.territory}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>Zonal:</strong> {branchData.zonal}
            </Typography>
            <Typography variant='body1'>
              <strong>Region:</strong> {branchData.region}
            </Typography>
            <Typography variant='body1'>
              <strong>Area:</strong> {branchData.area}
            </Typography>
            <Typography variant='body1'>
              <strong>Cluster:</strong> {branchData.cluster}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>City Classification:</strong> {branchData.cityClassification}
            </Typography>
            <Typography variant='body1'>
              <strong>State:</strong> {branchData.state}
            </Typography>
            <Typography variant='body1'>
              <strong>Turnover Code:</strong> {branchData.turnoverCode}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs Section */}
      <Card sx={{ padding: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
          <Tab label='Employee Details' />
          <Tab label='Bubble Position' />
          <Tab label='Bucket Management' />
          <Tab label='Vacancy Management' />
        </Tabs>
        <Divider sx={{ marginY: 3 }} />

        {/* Tab Content */}
        {activeTab === 0 && (
          <CustomTable
            columns={employeeColumns}
            data={employeeData}
            showCheckbox={false}
            actionButtons={actionButtons}
          />
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Bubble Positions Overview
            </Typography>
            {bubblePositionData.map((position: any, index: number) => (
              <Card key={index} sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant='h6' color='primary'>
                        {position.position}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          backgroundColor: '#e3f2fd',
                          padding: '8px 16px',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography>
                          <strong>Required:</strong> {position.requiredCount}
                        </Typography>
                        <Typography>
                          <strong>Actual:</strong> {position.actualCount}
                        </Typography>
                        <Typography color='error'>
                          <strong>Excess:</strong> {position.actualCount - position.requiredCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 2 }}>
                      Assigned Employees:
                    </Typography>
                    <Grid container spacing={2}>
                      {position.employees.map((employee: any, empIndex: number) => (
                        <Grid item xs={12} md={4} key={empIndex}>
                          <Card sx={{ p: 2, backgroundColor: '#ffffff' }}>
                            <Typography variant='subtitle1'>{employee.name}</Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Employee ID: {employee.employeeCode}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Joining Date: {employee.joiningDate}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default ViewBranch
