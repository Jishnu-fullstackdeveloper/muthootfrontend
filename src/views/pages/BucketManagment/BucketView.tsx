'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import { Box, Card, CardContent, Button, Divider } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

type Props = {
  mode: any
  id: any
}

const BucketView: React.FC<Props> = ({ mode, id }) => {
  const [bucket, setBucket] = useState<any>(null)
  const router = useRouter()

  // The mock bucket data you have in the listing
  const buckets = [
    {
      id: 1,
      name: 'Bucket 1',
      designation: [
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 },
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 },
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 }
      ],

      turnover_code: 'TURNCODE1122',
      note: 'This is a large note with details for Bucket 1. It provides extensive details and specific information about this bucket.This is a large note with details for Bucket 1. It provides extensive details and specific information about this bucket.This is a large note with details for Bucket 1. It provides extensive details and specific information about this bucket.'
    },
    {
      id: 2,
      name: 'Bucket 2',
      designation: [
        { designationName: 'Marketing Lead', count: 5 },
        { designationName: 'Sales Manager', count: 4 }
      ],

      turnover_code: 'TURNCODE1133',
      note: 'Bucket 2 has various designations, and the note here is large, detailing more information about the overall functioning of this bucket.'
    },
    {
      id: 3,
      name: 'Bucket 3',
      designation: [
        { designationName: 'Tech Lead', count: 7 },
        { designationName: 'Software Engineer', count: 8 }
      ],

      turnover_code: 'TURNCODE1144',
      note: 'This is a large note for Bucket 3 that gives additional context about the workings of this bucket and all its operations.'
    }
  ]

  // Simulate loading the bucket details based on `id`
  useEffect(() => {
    if (id) {
      const selectedBucket = buckets.find(bucket => bucket.id === parseInt(id as string))
      setBucket(selectedBucket)
    }
  }, [id])

  if (!bucket) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Bucket Name */}
          <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            {bucket.name}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          {/* Turnover Code */}
          <Typography variant='h6' sx={{ color: 'text.secondary', marginTop: 2 }}>
            Turnover Code: <strong>{bucket.turnover_code}</strong>
          </Typography>

          {/* Designations */}
          <Typography variant='h6' sx={{ color: 'text.secondary', marginTop: 2 }}>
            Designations:
            <ul>
              {bucket.designation.map((designation: any, index: number) => (
                <li key={index} style={{ marginBottom: 5 }}>
                  <strong>{designation.designationName}:</strong> {designation.count}
                </li>
              ))}
            </ul>
          </Typography>

          {/* Large Note Section */}
          <Box sx={{ marginTop: 3, padding: 5, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
            <Typography variant='body1' sx={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: 1 }}>
              Note:
            </Typography>
            <Typography variant='body2' sx={{ fontSize: '1rem', color: 'text.secondary' }}>
              {bucket.note}
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ marginTop: 3, marginLeft: 5, marginBottom: 10 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>

      {/* Go Back Button */}
    </Box>
  )
}

export default BucketView
