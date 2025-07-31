import React from 'react'

import { Box, Card, Typography, List, ListItem, ListItemText, Chip } from '@mui/material'

interface BucketManagementOverviewProps {
  branchData: any // Adjust type based on branchData structure
  branchBucket: any
}

const BucketManagementOverview: React.FC<BucketManagementOverviewProps> = ({ branchData }) => {
  return (
    <Card sx={{ backgroundColor: '#FFFFFF', p: 3 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32' }}>
        Budget Management Overview
      </Typography>
      <Card sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* <Typography variant='subtitle2' sx={{ fontWeight: '500', color: '#333' }}>
            Bucket Name: <strong>{branchData?.branchBucket?.name || 'N/A'}</strong>
          </Typography> */}
          <Typography variant='subtitle2' sx={{ fontWeight: '500', color: '#333' }}>
            Bucket Name:{' '}
            <Chip
              label={branchData?.branchBucket?.name || 'N/A'}
              size='small'
              sx={{
                fontWeight: 'medium',
                mb: 0.5,
                borderRadius: 2,
                backgroundColor:
                  branchData?.branchBucket?.name === 'Diamond'
                    ? '#B9F6CA'
                    : branchData?.branchBucket?.name === 'Platinum'
                      ? '#E5E4E2'
                      : branchData?.branchBucket?.name === 'Gold'
                        ? '#FFD700'
                        : branchData?.branchBucket?.name === 'Silver'
                          ? '#C0C0C0'
                          : branchData?.branchBucket?.name === 'Bronze'
                            ? '#CD7F32'
                            : '#B0BEC5', // Default grey for 'N/A' or unknown values
                color:
                  branchData?.branchBucket?.name === 'Gold' || branchData?.branchBucket?.name === 'Diamond'
                    ? '#000' // Black text for lighter backgrounds (Gold, Diamond)
                    : '#FFF' // White text for darker backgrounds (Platinum, Silver, Bronze, default)
              }}
            />
          </Typography>
          {/* <Typography variant='body1' sx={{ fontWeight: '500', color: '#333' }}>
            <strong>Total Position Categories:</strong>{' '}
            {branchData.branchBucket?.positionCategories.reduce((sum, category) => sum + category.count, 0) || 0}
          </Typography> */}

          {/* Position Categories List */}
          <Box sx={{ mt: 1 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: '600', mb: 1, color: '#1976d2' }}>
              Position Categories
            </Typography>
            <List sx={{ p: 0, backgroundColor: '#fff', borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              {branchData.branchBucket?.positionCategories.map((category, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom:
                      index < (branchData.branchBucket?.positionCategories.length || 0) - 1 ? '1px solid #eee' : 'none',
                    py: 1.5,
                    '&:hover': { backgroundColor: '#f5f5f5', transition: 'background-color 0.3s ease' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <ListItemText
                      primary={
                        <Typography variant='body2' sx={{ fontWeight: '500', color: '#444' }}>
                          {category.jobRole}
                        </Typography>
                      }

                      // secondary={
                      //   <Typography variant='caption' sx={{ color: '#666' }}>
                      //     Grade: {category.grade}
                      //   </Typography>
                      // }
                    />
                    <Chip
                      label={category.count}
                      color='primary'
                      size='small'
                      sx={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontWeight: '600',
                        borderRadius: 1,
                        height: 24,
                        '&:hover': { backgroundColor: '#1565c0' }
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            {(!branchData.branchBucket?.positionCategories ||
              branchData.branchBucket.positionCategories.length === 0) && (
              <Typography variant='body2' sx={{ textAlign: 'center', color: '#777', p: 2 }}>
                No position categories available.
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Card>
  )
}

export default BucketManagementOverview
