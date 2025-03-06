'use client'

import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Typography from '@mui/material/Typography'
import {
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

type Props = {
  mode: any
  id: any
}

const BucketView: React.FC<Props> = ({ id }) => {
  const [bucketDetails, setBucketDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const turnoverCode = searchParams.get('turnoverCode')
  const notes = searchParams.get('notes')
  const positionCategories = searchParams.get('positionCategories')

  const router = useRouter()
  
  const [bucketId, setBucketId] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Decode and parse `positionCategories`
  let decodedPositionCategories: any[] = []

  if (positionCategories) {
    try {
      decodedPositionCategories = JSON.parse(decodeURIComponent(positionCategories))
    } catch (error) {
      console.error('Failed to parse positionCategories:', error)
    }
  }

  const handleEditBucket = (id: number) => {
    router.push(`/bucket-management/edit/${id}`)
  }

  const handleDeleteBucket = (id: string) => {
    setBucketId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = id => {
    // useDispatch(deleteBucket(id))
    console.log(id)
    setShowDeleteModal(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  useEffect(() => {
    if (searchParams) {
      // const parsedDesignation = designation ? JSON.parse(designation as string) : {}
      setBucketDetails({
        turnoverCode,
        name,
        positionCategories,
        notes
      })
      setLoading(false)
    }
  }, [turnoverCode])

  if (loading) {
    return (
      <div data-testid='loading-indicator'>
        <CircularProgress />
      </div>
    )
  }

  if (!bucketDetails) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box className='flex justify-between'>
            {/* Bucket Name */}
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {name?.toLocaleUpperCase() || ''}
              </Typography>
            </Box>
            <Box>
              <Button
                data-testid='edit-button'
                variant='outlined'
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleEditBucket(id)
                }}
                sx={{
                  minWidth: 'auto',
                  padding: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <i className='tabler-edit' style={{ color: '#808080', fontSize: '24px' }} />
              </Button>
              <Button
                data-testid='delete-button'
                variant='outlined'
                color='error'
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleDeleteBucket(id)
                }}
                sx={{
                  minWidth: 'auto',
                  padding: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <i className='tabler-trash' style={{ color: '#808080', fontSize: '24px' }} />
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />
          {/* Turnover Code */}
          <Typography variant='h6' sx={{ color: 'text.secondary', marginTop: 2 }}>
            Turnover Code: <strong>{turnoverCode}</strong>
          </Typography>

          {/* Designations */}
          <Typography variant='h6' sx={{ color: 'text.secondary', marginTop: 2 }}>
            Designations:
          </Typography>
          <ul>
            {decodedPositionCategories.map((category, index) => (
              <li key={index}>
                <strong>{category.designationName}:</strong> {category.count} : {category.grade}
              </li>
            ))}
          </ul>

          <Box sx={{ marginTop: 3, padding: 5, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
            <Typography variant='body1' sx={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: 1 }}>
              Note:
            </Typography>
            <Typography variant='body2' sx={{ fontSize: '1rem', color: 'text.secondary' }}>
              {notes}
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ marginTop: 3, marginLeft: 5, marginBottom: 10 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>

      <Dialog open={showDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid='cancel-delete-button' onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button data-testid='confirm-delete-button' onClick={() => handleDeleteConfirm(bucketId)} color='error'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BucketView
