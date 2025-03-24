'use client'
import React, { useState, useEffect } from 'react'

import type { TextFieldProps } from '@mui/material'
import { Card, InputAdornment } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import EmployeeTable from './EmployeeTableList'

const EmployeeListingPage = () => {
  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              value=''
              onChange={() => {}}
              placeholder='Search by Name or Employee Code...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </div>
      </Card>
      {/* <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
        Employee List
      </Typography> */}
      <EmployeeTable />
    </>
  )
}

export default EmployeeListingPage
