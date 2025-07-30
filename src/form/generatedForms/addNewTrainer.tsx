'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { FormControl, TextField, Grid, Autocomplete, CircularProgress, Typography, Box } from '@mui/material'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { fetchTrainerLanguages, fetchTrainingTypes, createTrainer } from '@/redux/TrainerManagement/TrainerManagementSlice'

// Define interfaces for Autocomplete options
interface Option {
  label: string
  value: string
}

const AddNewTrainer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { status, error, trainerLanguages, trainingTypes } = useAppSelector(state => state.TrainerManagementReducer)

  // State for form fields
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [trainerStatus, setTrainerStatus] = useState<Option | null>(null)
  const [language, setLanguage] = useState<Option[]>([])
  const [trainingType, setTrainingType] = useState<Option | null>(null)

  // State for createTrainer API
  const [createStatus, setCreateStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle')
  const [createError, setCreateError] = useState<string | null>(null)

  // Fetch languages and training types on component mount
  useEffect(() => {
    dispatch(fetchTrainerLanguages())
    dispatch(fetchTrainingTypes())
  }, [dispatch])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateStatus('loading')
    setCreateError(null)

    const trainerData = {
      empCode: '', // Default value, as no form field exists
      firstName,
      lastName,
      email,
      phone,
      status: trainerStatus?.value.toLowerCase() || '', // Convert to lowercase for backend
      count: 0, // Default value, as no form field exists
      languages: language.map(opt => parseInt(opt.value)) // Convert language IDs to numbers
    }

    try {
      await dispatch(createTrainer(trainerData)).unwrap()
      setCreateStatus('succeeded')

      // Redirect to Trainer dashboard on success
      router.push('/trainer-dashboard')
    } catch (err) {
      setCreateStatus('failed')
      setCreateError((err as string) || 'Failed to create trainer')
    }
  }

  const statusOptions: Option[] = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ]

  // Transform trainerLanguages to Option[] for the Language dropdown
  // Map name to label and languageId to value, filtering duplicates by languageId
  const languageOptions: Option[] = trainerLanguages
    .filter((tl, index, self) => index === self.findIndex(t => t.languageId === tl.languageId))
    .map(tl => ({
      label: tl.name,
      value: tl.languageId.toString()
    }))

  // Transform trainingTypes to Option[] for the Training Type dropdown
  // Map name to label and id to value, filtering duplicates by id
  const trainingTypeOptions: Option[] = trainingTypes
    .filter((tt, index, self) => index === self.findIndex(t => t.id === tt.id))
    .map(tt => ({
      label: tt.name,
      value: tt.id.toString()
    }))

  return (
    <form className='p-6 bg-white shadow-md rounded' onSubmit={handleSubmit}>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>Add New Trainer</h1>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && (
        <Typography color='error' sx={{ mb: 2 }}>
          Error: {error || 'Failed to fetch data'}
        </Typography>
      )}
      {createStatus === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {createStatus === 'failed' && (
        <Typography color='error' sx={{ mb: 2 }}>
          Error: {createError || 'Failed to create trainer'}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField label='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Last Name'
              value={lastName}
              onChange={e => {
                console.log('last name', e.target.value)
                setLastName(e.target.value)
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField label='Email' value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField label='Phone' value={phone} onChange={e => setPhone(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={(option: Option) => option.label}
              value={trainerStatus}
              onChange={(_, value) => {
                console.log('status', value)
                setTrainerStatus(value)
              }}
              renderInput={params => <TextField {...params} label='Status' />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              multiple
              options={languageOptions}
              getOptionLabel={(option: Option) => option.label}
              value={language}
              onChange={(_, value) => {
                console.log('language', value)
                setLanguage(value)
              }}
              renderInput={params => <TextField {...params} label='Language' />}
              disabled={status === 'loading' || status === 'failed' || languageOptions.length === 0}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <Autocomplete
              options={trainingTypeOptions}
              getOptionLabel={(option: Option) => option.label}
              value={trainingType}
              onChange={(_, value) => {
                console.log('training type', value)
                setTrainingType(value)
              }}
              renderInput={params => <TextField {...params} label='Training Type' />}
              disabled={status === 'loading' || status === 'failed' || trainingTypeOptions.length === 0}
            />
          </FormControl>
        </Grid>
      </Grid>
      <div className='flex justify-end gap-2 mt-4 '>
        <DynamicButton
          type='button'
          variant='outlined'
          className='border-[#0095DA] text-[#0095DA]'
          onClick={() => {
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setTrainerStatus(null)
            setLanguage([])
            setTrainingType(null)
            setCreateStatus('idle')
            setCreateError(null)
          }}
        >
          Cancel
        </DynamicButton>
        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500'
          disabled={
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !trainerStatus ||
            !language ||
            !trainingType ||
            createStatus === 'loading'
          }
        >
          Add Trainer
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddNewTrainer
