'use client'

import React, { useState } from 'react'

import { Box, Card, Grid, Typography, Button } from '@mui/material'
import Divider from '@mui/material/Divider'

import LevelsIcon from '@/icons/LevelsIcon'

// Define the type for sampleData
type Bucket = {
  name: string
  positionCategories: { jobRole: string; count: number }[]
  level: string
}

type Props = {
  mode?: any
  id?: string
}

// Sample data
const sampleData: Bucket[] = [
  {
    name: 'Gold',
    positionCategories: [
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 },
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 },
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 },
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 },
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 },
      { jobRole: 'Developer', count: 5 },
      { jobRole: 'Team Lead', count: 2 },
      { jobRole: 'Scrum Member', count: 3 },
      { jobRole: 'Product Owner', count: 1 },
      { jobRole: 'Stakeholder', count: 4 }
    ],
    level: '1'
  }
]

const BucketDetails: React.FC<Props> = () => {
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({})

  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const toggleShowAll = (bucketName: string) => {
    setShowAll(prev => ({
      ...prev,
      [bucketName]: !prev[bucketName]
    }))
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {sampleData.map((bucket, index) => (
          <Grid item xs={12} key={bucket.name || index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'stretch'
              }}
            >
              {/* Left Card */}
              <Card
                sx={{
                  flex: 1,
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  padding: 3,
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Box
                    sx={{
                      backgroundColor: '#F2F3FF',
                      padding: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <LevelsIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: '25px' }}>
                      {bucket.name || 'N/A'}
                    </Typography>
                    <Typography variant='h6' fontWeight={400}>
                      Level {bucket.level}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </Card>

              {/* Right Card */}
              <Card
                sx={{
                  flex: 1,
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  padding: 3,
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='caption' color='text.secondary' fontWeight={500} mb={1}>
                  Position Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {bucket.positionCategories.length > 0 ? (
                    <>
                      {(showAll[bucket.name] ? bucket.positionCategories : bucket.positionCategories.slice(0, 5)).map(
                        (role, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              backgroundColor: '#E8F4FF',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: '8px'
                            }}
                          >
                            <Typography variant='body2' sx={{ color: '#0096DA', fontWeight: 500, fontSize: '13px' }}>
                              {toTitleCase(role.jobRole)} ({role.count})
                            </Typography>
                          </Box>
                        )
                      )}
                      {bucket.positionCategories.length > 5 && (
                        <Button
                          variant='text'
                          onClick={() => toggleShowAll(bucket.name)}
                          sx={{
                            ml: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            backgroundColor: '#E8F4FF',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '8px'
                          }}
                        >
                          {showAll[bucket.name] ? '- Show Less' : '+ Show More'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      N/A
                    </Typography>
                  )}
                </Box>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default BucketDetails
