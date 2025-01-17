
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import { Box, Card, CardContent, Button } from '@mui/material'

type Props = {
    mode: any
    id: any
  }
  
  const BucketView: React.FC<Props> = ({ mode, id }) => {
   
  const [bucket, setBucket] = useState<any>(null)
  const router = useRouter()
//   const { id } = router.query 

  // The mock bucket data you have in the listing
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
    <Box sx={{ padding: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {bucket.name}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', marginTop: 2 }}>
            Turnover Limit: {bucket.turnover_limit}
          </Typography>
          
          <Typography variant="h6" sx={{ color: 'text.secondary', marginTop: 2 }}>
            Designations:
            <ul>
              {bucket.designation.map((designation: any, index: number) => (
                <li key={index}>
                  {designation.designationName}: {designation.count}
                </li>
              ))}
            </ul>
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ marginTop: 3 }}>
        <Button variant="outlined" onClick={() => router.back()}>
          Go Back
        </Button>
      </Box>
    </Box>
  )
}




export default BucketView
