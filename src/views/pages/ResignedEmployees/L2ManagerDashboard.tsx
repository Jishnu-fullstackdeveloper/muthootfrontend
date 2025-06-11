'use client'
import React, { useMemo, useState } from 'react'

import {
  Box,
  Card,
  Typography,
  Grid,
  Drawer,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PaidIcon from '@mui/icons-material/Paid'
import RepeatIcon from '@mui/icons-material/Repeat'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const L2ManagerDashboard = () => {
  const statusColors: Record<string, string> = {
    Completed: '#059669',
    Pending: '#D97706',
    Overdue: '#dd171a',
    Rejected: '#2a66ad'
  }

  // Demo static approval data
  const approvals = useMemo(
    () => [
      {
        id: 1,
        title: 'Total Gaps',
        icon: <LibraryAddCheckIcon color='success' />,
        status: 'Completed',
        note: 'Available Count 5'
      },
      {
        id: 2,
        title: 'Additional Budget Count',
        icon: <PaidIcon color='warning' />,
        status: 'Pending',
        note: 'Available Count 3'
      },
      {
        id: 3,
        title: 'Transfer Request Count',
        icon: <RepeatIcon color='error' />,
        status: 'Overdue',
        note: 'Available Count 1'
      },
      {
        id: 4,
        title: 'Temporary Branch In Charge',
        icon: <HourglassTopIcon color='primary' />,
        status: 'Rejected',
        note: 'Available Count 1'
      }
    ],
    []
  )

  // Updated sample data for drawer content with multiple designations per branch
  const approvalDetails = useMemo(
    () => ({
      1: [
        {
          branch: 'Branch A',
          designations: [
            { name: 'Manager', vacancy: 2, extraCount: 1 },
            { name: 'Supervisor', vacancy: 1, extraCount: 0 }
          ]
        },
        {
          branch: 'Branch B',
          designations: [
            { name: 'Analyst', vacancy: 1, extraCount: 0 },
            { name: 'Clerk', vacancy: 1, extraCount: 1 }
          ]
        }
      ],
      2: [
        {
          branch: 'Branch C',
          designations: [{ name: 'Accountant', vacancy: 1, extraCount: 2 }]
        },
        {
          branch: 'Branch D',
          designations: [
            { name: 'Clerk', vacancy: 1, extraCount: 1 },
            { name: 'Assistant', vacancy: 1, extraCount: 0 }
          ]
        }
      ],
      3: [
        {
          branch: 'Branch E',
          designations: [{ name: 'Officer', vacancy: 1, extraCount: 0 }]
        }
      ],
      4: [
        {
          branch: 'Branch F',
          designations: [{ name: 'Interim Manager', vacancy: 1, extraCount: 0 }]
        }
      ]
    }),
    []
  )

  // State for drawer
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null)

  // Handle card click
  const handleCardClick = (id: number) => {
    setSelectedApproval(id)
    setOpenDrawer(true)
  }

  // Close drawer
  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setSelectedApproval(null)
  }

  return (
    <>
      <Grid container spacing={3} sx={{ marginBottom: 2 }}>
        {approvals.map(approval => (
          <Grid item xs={12} sm={6} md={3} key={approval.id}>
            <Card
              onClick={() => handleCardClick(approval.id)}
              sx={{
                cursor: 'pointer',
                padding: 3,
                boxShadow: 'none',
                borderBottom: `5px solid ${statusColors[approval.status] || 'inherit'}`
              }}
            >
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Box>
                  <Typography variant='h6' sx={{ fontSize: '13px' }}>
                    {approval.title}
                  </Typography>
                  <Typography color='text.secondary'>{approval.note}</Typography>
                </Box>
                {approval.icon}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Right-side Drawer */}
      <Drawer
        anchor='right'
        open={openDrawer}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            padding: 3,
            backgroundColor: '#f9fafb',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h5' sx={{ fontWeight: 600, color: '#1f2937' }}>
            Details
          </Typography>
          <IconButton onClick={handleCloseDrawer} sx={{ color: '#4b5563' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2, borderColor: '#e5e7eb' }} />
        <Box>
          {selectedApproval &&
            approvalDetails[selectedApproval]?.map((branch, index) => (
              <Accordion
                key={index}
                defaultExpanded={index === 0}
                sx={{
                  mb: 1,
                  borderRadius: '8px',
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#4b5563' }} />}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    '& .MuiAccordionSummary-content': { alignItems: 'center' }
                  }}
                >
                  <Typography variant='subtitle1' sx={{ fontWeight: 500, color: '#1f2937' }}>
                    {branch.branch}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#f1f5f9', padding: 2 }}>
                  <List dense>
                    {branch.designations.map((designation, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Typography variant='body2' sx={{ fontWeight: 500, color: '#374151' }}>
                              {designation.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant='body2' color='text.secondary'>
                                Vacancy: {designation.vacancy}
                              </Typography>
                              <Typography variant='body2' color='text.secondary'>
                                Extra Count: {designation.extraCount}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          {selectedApproval && approvalDetails[selectedApproval]?.length === 0 && (
            <Typography sx={{ color: '#6b7280', textAlign: 'center', mt: 2 }}>No details available.</Typography>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default L2ManagerDashboard
