'use client'

import React, { useState } from 'react'

import { FormControl, TextField, Grid, Autocomplete } from '@mui/material'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch } from '@/lib/hooks'
import { createTrainer } from '@/redux/TrainerManagement/TrainerManagementSlice'

// Define interfaces for Autocomplete options
interface Option {
  label: string
  value: string
  id?: number // Added for language IDs
}

const AddNewTrainer = () => {
  const dispatch = useAppDispatch()

  // State for form fields
  const [empCode, setEmpCode] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [status, setStatus] = useState<Option | null>(null)
  const [language, setLanguage] = useState<Option[]>([])
  const [trainingType, setTrainingType] = useState<Option | null>(null)
  const [count, setCount] = useState<string>('0') // Added for count
  const [isLoading, setIsLoading] = useState<boolean>(false) // Added for loading state

  const statusOptions: Option[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ]

  const languageOptions: Option[] = [
    { label: 'English', value: 'english', id: 1 },
    { label: 'Hindi', value: 'hindi', id: 2 },
    { label: 'Malayalam', value: 'malayalam', id: 3 },
    { label: 'Tamil', value: 'tamil', id: 4 },
    { label: 'Kannada', value: 'kannada', id: 5 },
    { label: 'Telugu', value: 'telugu', id: 6 },
    { label: 'Marathi', value: 'marathi', id: 7 },
    { label: 'Bengali', value: 'bengali', id: 8 },
    { label: 'Korean', value: 'korean', id: 9 },
    { label: 'Japanese', value: 'japanese', id: 10 }
  ]

  const trainingTypeOptions: Option[] = [
    { label: 'Mentor Branch', value: 'mentor_branch' },
    { label: 'Gurukul', value: 'gurukul' },
    { label: 'Classroom', value: 'classroom' },
    { label: 'Online', value: 'online' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const trainerData = {
        empCode,
        firstName,
        lastName,
        email,
        phone,
        status: status?.value || '',
        count: parseInt(count, 10) || 0,
        languages: language.map(l => l.id!),
        trainingType: trainingType?.value || '' // Included for consistency
      }

      const result = await dispatch(createTrainer(trainerData)).unwrap()

      console.log('Trainer created successfully:', result)

      // Reset form on success
      setEmpCode('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setStatus(null)
      setLanguage([])
      setTrainingType(null)
      setCount('0')
      alert('Trainer added successfully!')
    } catch (error) {
      console.error('Failed to create trainer:', error)
      alert('Failed to add trainer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className='p-6 bg-white shadow-md rounded' onSubmit={handleSubmit}>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>Add New Trainer</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField label='Employee Code' value={empCode} onChange={e => setEmpCode(e.target.value)} />
          </FormControl>
        </Grid>
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
              value={status}
              onChange={(_, value) => {
                console.log('status', value)
                setStatus(value)
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
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Sessions Completed'
              type='number'
              value={count}
              onChange={e => setCount(e.target.value)}
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
            setEmpCode('')
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setStatus(null)
            setLanguage([])
            setTrainingType(null)
            setCount('0')
          }}
        >
          Cancel
        </DynamicButton>
        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500'
          disabled={!empCode || !firstName || !lastName || !email || !phone || !status || !language.length || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Trainer'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddNewTrainer
