'use client'
import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, MenuItem, FormControlLabel } from '@mui/material'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'
import type { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  // data: any
  // setData: Dispatch<SetStateAction<any>>
  // open: boolean
  // handleClose: () => void
  // selectedUser: any
  // setMode: Dispatch<SetStateAction<any>>
  mode: any
  id: any
}

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required('Job Title is required'),
  jobDescription: Yup.string().required('Job Description is required'),
  experience: Yup.string().required('Experience (in years) is required'),
  jobPlacement: Yup.string().required('Job Placement is required'),
  jobType: Yup.string().required('Job Type is required'),
  jobRole: Yup.string().required('Job Role is required'),
  salaryRange: Yup.string().required('Salary Range is required'),
  dutiesResponsibilities: Yup.array()
    .of(
      Yup.object().shape({
        responsibility: Yup.string().required('Responsibility is required')
      })
    )
    .min(1, 'At least one responsibility is required')
})

const GeneratedForm: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()
  const addJDFormik: any = useFormik({
    initialValues: {
      jobTitle: '',
      jobDescription: '',
      experience: '',
      jobPlacement: '',
      jobType: '',
      jobRole: '',
      salaryRange: '',
      dutiesResponsibilities: [{ responsibility: '' }]
    },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  return (
    <form onSubmit={addJDFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'add' ? 'Add New JD' : 'Edit JD'}</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-addJDFormikbold text-gray-700'>JD Details</legend>
        {true && (
          <FormControl fullWidth margin='normal'>
            <label htmlFor='jobTitle' className='block text-sm font-medium text-gray-700'>
              Job Title *
            </label>
            <DynamicTextField
              id='jobTitle'
              name='jobTitle'
              type='text'
              value={addJDFormik.values.jobTitle}
              onChange={addJDFormik.handleChange}
              onFocus={() => addJDFormik.setFieldTouched('jobTitle', true)}
              error={addJDFormik.touched.jobTitle && Boolean(addJDFormik.errors.jobTitle)}
              helperText={
                addJDFormik.touched.jobTitle && addJDFormik.errors.jobTitle ? addJDFormik.errors.jobTitle : undefined
              }
            />
          </FormControl>
        )}

        {true && (
          <FormControl fullWidth margin='normal'>
            <label htmlFor='jobDescription' className='block text-sm font-medium text-gray-700'>
              Job Description *
            </label>
            <DynamicTextField
              id='jobDescription'
              multiline
              rows={4}
              name='jobDescription'
              value={addJDFormik.values.jobDescription}
              onChange={addJDFormik.handleChange}
              onFocus={() => addJDFormik.setFieldTouched('jobDescription', true)}
              error={addJDFormik.touched.jobDescription && Boolean(addJDFormik.errors.jobDescription)}
              helperText={
                addJDFormik.touched.jobDescription && addJDFormik.errors.jobDescription
                  ? addJDFormik.errors.jobDescription
                  : undefined
              }
            />
          </FormControl>
        )}

        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='experience' className='block text-sm font-medium text-gray-700'>
                Experience (in years) *
              </label>
              <DynamicTextField
                id='experience'
                name='experience'
                type='number'
                value={addJDFormik.values.experience}
                onChange={addJDFormik.handleChange}
                onFocus={() => addJDFormik.setFieldTouched('experience', true)}
                error={addJDFormik.touched.experience && Boolean(addJDFormik.errors.experience)}
                helperText={
                  addJDFormik.touched.experience && addJDFormik.errors.experience
                    ? addJDFormik.errors.experience
                    : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='jobPlacement' className='block text-sm font-medium text-gray-700'>
                Job Placement *
              </label>
              <DynamicSelect
                id='jobPlacement'
                name='jobPlacement'
                value={addJDFormik.values.jobPlacement}
                onChange={addJDFormik.handleChange}
                onFocus={() => addJDFormik.setFieldTouched('jobPlacement', true)}
                error={addJDFormik.touched.jobPlacement && Boolean(addJDFormik.errors.jobPlacement)}
                helperText={
                  addJDFormik.touched.jobPlacement && addJDFormik.errors.jobPlacement
                    ? addJDFormik.errors.jobPlacement
                    : ''
                }
              >
                <MenuItem value='On-site'>On-site</MenuItem>
                <MenuItem value='Remote'>Remote</MenuItem>
                <MenuItem value='Hybrid'>Hybrid</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='jobType' className='block text-sm font-medium text-gray-700'>
                Job Type *
              </label>
              <DynamicSelect
                id='jobType'
                name='jobType'
                value={addJDFormik.values.jobType}
                onChange={addJDFormik.handleChange}
                onFocus={() => addJDFormik.setFieldTouched('jobType', true)}
                error={addJDFormik.touched.jobType && Boolean(addJDFormik.errors.jobType)}
                helperText={addJDFormik.touched.jobType && addJDFormik.errors.jobType ? addJDFormik.errors.jobType : ''}
              >
                <MenuItem value='Full Time'>Full Time</MenuItem>
                <MenuItem value='Part Time'>Part Time</MenuItem>
                <MenuItem value='Contract'>Contract</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='jobRole' className='block text-sm font-medium text-gray-700'>
                Job Role *
              </label>
              <DynamicSelect
                id='jobRole'
                name='jobRole'
                value={addJDFormik.values.jobRole}
                onChange={addJDFormik.handleChange}
                onFocus={() => addJDFormik.setFieldTouched('jobRole', true)}
                error={addJDFormik.touched.jobRole && Boolean(addJDFormik.errors.jobRole)}
                helperText={addJDFormik.touched.jobRole && addJDFormik.errors.jobRole ? addJDFormik.errors.jobRole : ''}
              >
                <MenuItem value='Research & Development'>Research & Development</MenuItem>
                <MenuItem value='Engineering'>Engineering</MenuItem>
                <MenuItem value='Marketing'>Marketing</MenuItem>
                <MenuItem value='Sales'>Sales</MenuItem>
                <MenuItem value='Human Resources'>Human Resources</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='salaryRange' className='block text-sm font-medium text-gray-700'>
                Salary Range *
              </label>
              <DynamicTextField
                id='salaryRange'
                name='salaryRange'
                type='text'
                value={addJDFormik.values.salaryRange}
                onChange={addJDFormik.handleChange}
                onFocus={() => addJDFormik.setFieldTouched('salaryRange', true)}
                error={addJDFormik.touched.salaryRange && Boolean(addJDFormik.errors.salaryRange)}
                helperText={
                  addJDFormik.touched.salaryRange && addJDFormik.errors.salaryRange
                    ? addJDFormik.errors.salaryRange
                    : undefined
                }
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-addJDFormikbold text-gray-700'>Duties and Responsibilities</legend>
        <div className=''>
          {true && (
            <div>
              <h4 className='text-lg font-semibold text-gray-700 mb-2'>Duties and Responsibilities</h4>
              {addJDFormik.values.dutiesResponsibilities &&
                Array.isArray(addJDFormik.values.dutiesResponsibilities) &&
                addJDFormik.values.dutiesResponsibilities.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: '16px',
                      gap: '16px'
                    }}
                  >
                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`dutiesResponsibilities[${index}].heading`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Responsibility Heading *
                      </label>
                      <DynamicTextField
                        id={`dutiesResponsibilities[${index}].heading`}
                        name={`dutiesResponsibilities[${index}].heading`}
                        type='text'
                        value={item.heading || ''}
                        onChange={addJDFormik.handleChange}
                        onFocus={() => addJDFormik.setFieldTouched(`dutiesResponsibilities[${index}].heading`, true)}
                        error={
                          addJDFormik.touched.dutiesResponsibilities?.[index]?.heading &&
                          Boolean(addJDFormik.errors.dutiesResponsibilities?.[index]?.heading)
                        }
                        helperText={
                          addJDFormik.touched.dutiesResponsibilities?.[index]?.heading &&
                          addJDFormik.errors.dutiesResponsibilities?.[index]?.heading
                        }
                      />
                    </FormControl>

                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`dutiesResponsibilities[${index}].description`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Responsibility Description *
                      </label>
                      <DynamicTextField
                        id={`dutiesResponsibilities[${index}].description`}
                        name={`dutiesResponsibilities[${index}].description`}
                        multiline
                        rows={3}
                        value={item.description || ''}
                        onChange={addJDFormik.handleChange}
                        onFocus={() =>
                          addJDFormik.setFieldTouched(`dutiesResponsibilities[${index}].description`, true)
                        }
                        error={
                          addJDFormik.touched.dutiesResponsibilities?.[index]?.description &&
                          Boolean(addJDFormik.errors.dutiesResponsibilities?.[index]?.description)
                        }
                        helperText={
                          addJDFormik.touched.dutiesResponsibilities?.[index]?.description &&
                          addJDFormik.errors.dutiesResponsibilities?.[index]?.description
                        }
                      />
                    </FormControl>
                    {index !== 0 && (
                      <DynamicButton
                        children='Remove'
                        type='button'
                        variant='outlined'
                        onClick={() =>
                          addJDFormik.setFieldValue(
                            'dutiesResponsibilities',
                            addJDFormik.values.dutiesResponsibilities.filter((_: any, i: number) => i !== index)
                          )
                        }
                        label='Remove'
                      />
                    )}
                  </div>
                ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '20px'
                }}
              >
                <DynamicButton
                  children='Add More'
                  type='button'
                  variant='contained'
                  onClick={() =>
                    addJDFormik.setFieldValue('dutiesResponsibilities', [
                      ...(addJDFormik.values.dutiesResponsibilities || []),
                      { heading: '', description: '' }
                    ])
                  }
                  label='Add More'
                />
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          onClick={() => router.back()}
        >
          Back
        </DynamicButton>

        {/* <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save Draft
        </DynamicButton> */}

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          {mode === 'add' ? 'Add' : 'Update'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default GeneratedForm
