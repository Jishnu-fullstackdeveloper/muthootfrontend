'use client'

import React, { useState } from 'react'

import { FormControl, TextField, Grid, Autocomplete } from '@mui/material'

import DynamicButton from '@/components/Button/dynamicButton'

// Define interfaces for Autocomplete options
interface Option {
  label: string
  value: string
}

const AddNewTrainer = () => {
  // State for form fields
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [status, setStatus] = useState<Option | null>(null)
  const [language, setLanguage] = useState<Option[]>([])
  const [trainingType, setTrainingType] = useState<Option | null>(null)

  const statusOptions: Option[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  const languageOptions: Option[] = [
    { label: 'English', value: 'english' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Malayalam', value: 'malayalam' },
    { label: 'Tamil', value: 'tamil' },
    { label: 'Kannada', value: 'kannada' },
    { label: 'Telugu', value: 'telugu' },
    { label: 'Marathi', value: 'marathi' },
    { label: 'Bengali', value: 'bengali' },
    { label: 'Korean', value: 'korean' },
    { label: 'Japanese', value: 'japanese' }
  ]

  const trainingTypeOptions: Option[] = [
    { label: 'Mentor Branch', value: 'mentor_branch' },
    { label: 'Gurukul', value: 'gurukul' },
    { label: 'Classroom', value: 'classroom' },
    { label: 'Online', value: 'online' }
  ]

  return (
    <form className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>Add New Trainer</h1>
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
            setStatus(null)
            setLanguage([])
            setTrainingType(null)
          }}
        >
          Cancel
        </DynamicButton>
        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500'
          disabled={!firstName || !lastName || !email || !phone || !status || !language || !trainingType}
        >
          Add Trainer
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddNewTrainer
