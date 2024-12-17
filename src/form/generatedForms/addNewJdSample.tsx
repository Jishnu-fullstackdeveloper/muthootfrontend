'use client'
import React, { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FormControl,
  MenuItem,
  FormControlLabel,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Card,
  StepButton,
  Button,
  StepConnector
} from '@mui/material'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'
import dynamic from 'next/dynamic'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ReactQuill from 'react-quill'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
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

const steps = [
  'Description',
  'Summary',
  'Responsibilities',
  'Challenges',
  'Decisions',
  'Interactions',
  'Role Dimensions',
  'Skills',
  'Requirements'
]

const validationSchema = Yup.object().shape({
  roleTitle: Yup.string().required('Role Title is required'),
  reportingTo: Yup.string().required('Reporting To is required'),
  companyName: Yup.string().required('Company Name is required'),
  functionOrDepartment: Yup.string().required('Function/Department is required'),
  writtenBy: Yup.string().required('Written By is required'),
  roleSummary: Yup.string().required('Role Summary is required'),
  keyResponsibilities: Yup.string().required('Key Responsibilities is required'),
  keyChallenges: Yup.string().required('Key Challenges is required'),
  keyDecisions: Yup.string().required('Key Decisions Taken is required'),
  internalStakeholders: Yup.string().required('Internal Stakeholders is required'),
  externalStakeholders: Yup.string().required('External Stakeholders is required'),
  skillsAndAttributes: Yup.array()
    .of(
      Yup.object().shape({
        competency: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Competency is required') }))
          .min(1, 'At least one Competency is required'),
        definition: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Definition is required') }))
          .min(1, 'At least one Definition is required'),
        behaviouralAttributes: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Behavioural Attribute is required') }))
          .min(1, 'At least one Behavioural Attribute is required')
      })
    )
    .min(1, 'At least one section is required'),
  minimumQualification: Yup.string().required('Minimum Qualification is required'),
  experienceDescription: Yup.string().required('Experience Description is required')
})

const AddNewJdSample: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()
  const [activeStep, setActiveStep] = React.useState(0)

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleScroll = (event: any) => {
    const scrollTop = event.target.scrollTop // Current scroll position

    console.log('Scroll Position:', scrollTop)

    // Perform actions at specific heights
    if (scrollTop < 490) {
      setActiveStep(0)
      console.log('Scroll is between 100 and 200')
      // Action for height range 100-200
    } else if (scrollTop > 490 && scrollTop <= 897) {
      setActiveStep(1)
      console.log('Scroll is between 100 and 200')
      // Action for height range 100-200
    } else if (scrollTop > 897 && scrollTop < 1585) {
      setActiveStep(2)
      console.log('Scroll is between 100 and 200')
      // Action for height range 100-200
    } else if (scrollTop > 1585 && scrollTop < 2021) {
      console.log('Scroll is between 200 and 300')
      setActiveStep(3)
      // Action for height range 200-300
    } else if (scrollTop > 2021 && scrollTop < 2481) {
      console.log('Scroll is above 300')
      setActiveStep(4)
      // Action for height above 300
    } else if (scrollTop > 2481 && scrollTop < 2746) {
      console.log('Scroll is above 300')
      setActiveStep(5)
      // Action for height above 300
    } else if (scrollTop > 2746 && scrollTop < 3073) {
      console.log('Scroll is above 300')
      setActiveStep(6)
      // Action for height above 300
    } else if (scrollTop > 3073 && scrollTop < 3548) {
      console.log('Scroll is above 300')
      setActiveStep(7)
      // Action for height above 300
    } else if (scrollTop > 3548) {
      console.log('Scroll is above 300')
      setActiveStep(8)
      // Action for height above 300
    }
  }

  const AddNewJDFormik: any = useFormik({
    initialValues: {
      roleTitle: '',
      reportingTo: '',
      companyName: '',
      functionOrDepartment: '',
      writtenBy: '',
      roleSummary: '',
      keyResponsibilities: [{ title: '', description: '' }],
      keyChallenges: '',
      keyDecisions: '',
      internalStakeholders: '',
      externalStakeholders: '',
      skillsAndAttributesType: 'description_only',
      skillsAndAttributes: [
        { competency: [{ value: '' }], definition: [{ value: '' }], behavioural_attributes: [{ value: '' }] }
      ],
      minimumQualification: '',
      experienceDescription: '',
      portfolioSize: '',
      geographicalCoverage: '',
      teamSize: '',
      totalTeamSize: ''
    },
    // validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  return (
    <>
      <Card
        sx={{
          mb: 4,
          pt: 3,
          pb: 3,
          position: 'sticky',
          top: 70, // Sticks the card at the top of the viewport
          zIndex: 10, // Ensures it stays above other elements
          backgroundColor: 'white',
          height: 'auto' // Automatically adjusts height based on content
          // paddingBottom: 2 // Adds some space at the bottom
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                <Typography>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Reset Filters */}
      </Card>
      <div
        onScroll={handleScroll}
        style={{
          height: '530px',
          // height: 'auto',
          overflowY: 'scroll'
          // border: '1px solid black',
          // padding: '10px'
        }}
        className='custom-scrollbar'
      >
        <form onSubmit={AddNewJDFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            {mode === 'add' ? 'Add Job Description' : 'Edit JD'}
          </h1>

          <h3>Job Roles</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6 mt-2'>
            {/* <legend className='text-lg font-semibold text-gray-700'>Job Roles</legend> */}
            <div className='grid grid-cols-2 gap-4'>
              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='roleTitle' className='block text-sm font-medium text-gray-700'>
                    Role Title *
                  </label>
                  <DynamicTextField
                    id='roleTitle'
                    name='roleTitle'
                    type='text'
                    value={AddNewJDFormik.values.roleTitle}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('roleTitle', true)}
                    error={AddNewJDFormik.touched.roleTitle && Boolean(AddNewJDFormik.errors.roleTitle)}
                    helperText={
                      AddNewJDFormik.touched.roleTitle && AddNewJDFormik.errors.roleTitle
                        ? AddNewJDFormik.errors.roleTitle
                        : undefined
                    }
                  />
                </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='reportingTo' className='block text-sm font-medium text-gray-700'>
                    Reporting To *
                  </label>
                  <DynamicSelect
                    id='reportingTo'
                    name='reportingTo'
                    value={AddNewJDFormik.values.reportingTo}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('reportingTo', true)}
                    error={AddNewJDFormik.touched.reportingTo && Boolean(AddNewJDFormik.errors.reportingTo)}
                    helperText={
                      AddNewJDFormik.touched.reportingTo && AddNewJDFormik.errors.reportingTo
                        ? AddNewJDFormik.errors.reportingTo
                        : ''
                    }
                  >
                    <MenuItem value='arun'>Arun PG</MenuItem>
                    <MenuItem value='jeevan'>Jeevan Jose</MenuItem>
                    <MenuItem value='varun'>Varun V </MenuItem>
                  </DynamicSelect>
                </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='reportingTo' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <DynamicSelect
                    id='companyName'
                    name='companyName'
                    value={AddNewJDFormik.values.companyName}
                    onChange={AddNewJDFormik.handleChange}
                    onFocus={() => AddNewJDFormik.setFieldTouched('companyName', true)}
                    helperText={
                      AddNewJDFormik.touched.companyName && AddNewJDFormik.errors.companyName
                        ? AddNewJDFormik.errors.companyName
                        : undefined
                    }
                    error={AddNewJDFormik.touched.companyName && Boolean(AddNewJDFormik.errors.companyName)}
                  >
                    <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                    <MenuItem value='muthoot_finance'>Muthoot Finance</MenuItem>
                  </DynamicSelect>
                </FormControl>

                // <FormControl fullWidth margin='normal'>
                //   <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                //     Company Name *
                //   </label>
                //   <DynamicTextField
                //     id='companyName'
                //     name='companyName'
                //     type='text'
                //     value={AddNewJDFormik.values.companyName}
                //     onChange={AddNewJDFormik.handleChange}
                //     // onFocus={() => AddNewJDFormik.setFieldTouched('companyName', true)}
                //     error={AddNewJDFormik.touched.companyName && Boolean(AddNewJDFormik.errors.companyName)}
                // helperText={
                //   AddNewJDFormik.touched.companyName && AddNewJDFormik.errors.companyName
                //     ? AddNewJDFormik.errors.companyName
                //     : undefined
                // }
                //   />
                // </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='functionOrDepartment' className='block text-sm font-medium text-gray-700'>
                    Function/Department *
                  </label>
                  <DynamicTextField
                    id='functionOrDepartment'
                    name='functionOrDepartment'
                    type='text'
                    value={AddNewJDFormik.values.functionOrDepartment}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('functionOrDepartment', true)}
                    error={
                      AddNewJDFormik.touched.functionOrDepartment && Boolean(AddNewJDFormik.errors.functionOrDepartment)
                    }
                    helperText={
                      AddNewJDFormik.touched.functionOrDepartment && AddNewJDFormik.errors.functionOrDepartment
                        ? AddNewJDFormik.errors.functionOrDepartment
                        : undefined
                    }
                  />
                </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='writtenBy' className='block text-sm font-medium text-gray-700'>
                    Written By *
                  </label>
                  <DynamicTextField
                    id='writtenBy'
                    name='writtenBy'
                    type='text'
                    value={AddNewJDFormik.values.writtenBy}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('writtenBy', true)}
                    error={AddNewJDFormik.touched.writtenBy && Boolean(AddNewJDFormik.errors.writtenBy)}
                    helperText={
                      AddNewJDFormik.touched.writtenBy && AddNewJDFormik.errors.writtenBy
                        ? AddNewJDFormik.errors.writtenBy
                        : undefined
                    }
                  />
                </FormControl>
              )}
            </div>
          </fieldset>

          <h3>Role Summary</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6  mt-2'>
            <div className=''>
              <FormControl fullWidth>
                {/* <DynamicTextField
              id='roleSummary'
              multiline
              rows={4}
              name='roleSummary'
              value={AddNewJDFormik.values.roleSummary}
              onChange={AddNewJDFormik.handleChange}
              // onFocus={() => AddNewJDFormik.setFieldTouched('roleSummary', true)}
              error={AddNewJDFormik.touched.roleSummary && Boolean(AddNewJDFormik.errors.roleSummary)}
              helperText={
                AddNewJDFormik.touched.roleSummary && AddNewJDFormik.errors.roleSummary
                  ? AddNewJDFormik.errors.roleSummary
                  : undefined
              }
            /> */}

                <ReactQuill
                  // name='roleSummary'
                  style={{ height: '40vh', paddingBottom: 50 }}
                  value={AddNewJDFormik.values.roleSummary}
                  onChange={(value: any) => {
                    AddNewJDFormik.setFieldValue('roleSummary', value)
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image', 'video'],
                        ['clean']
                      ]
                    }
                  }}
                />
              </FormControl>
            </div>
          </fieldset>

          <h3>Key Responsibilities</h3>
          <fieldset className='border border-gray-300 rounded-lg p-6 mb-8 shadow-sm bg-white  mt-2'>
            {/* <legend className='text-xl font-semibold text-gray-800 mb-4'>Key Responsibilities</legend> */}
            <div className='space-y-6'>
              {AddNewJDFormik.values.keyResponsibilities &&
                Array.isArray(AddNewJDFormik.values.keyResponsibilities) &&
                AddNewJDFormik.values.keyResponsibilities.map((item: any, index: number) => (
                  <div key={index} className='p-4 border border-gray-200 rounded-lg shadow-sm'>
                    {/* grid grid-cols-1 md:grid-cols-2 gap-6 */}
                    <div className=''>
                      {/* Title Field */}
                      <FormControl fullWidth className='mb-4'>
                        <label
                          htmlFor={`keyResponsibilities[${index}].title`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Title *
                        </label>
                        <DynamicTextField
                          id={`keyResponsibilities[${index}].title`}
                          name={`keyResponsibilities[${index}].title`}
                          type='text'
                          value={item.title || ''}
                          onChange={AddNewJDFormik.handleChange}
                          // onFocus={() => AddNewJDFormik.setFieldTouched(`keyResponsibilities[${index}].title`, true)}
                          error={
                            AddNewJDFormik.touched.keyResponsibilities?.[index]?.title &&
                            Boolean(AddNewJDFormik.errors.keyResponsibilities?.[index]?.title)
                          }
                          helperText={
                            AddNewJDFormik.touched.keyResponsibilities?.[index]?.title &&
                            AddNewJDFormik.errors.keyResponsibilities?.[index]?.title
                          }
                        />
                      </FormControl>

                      {/* Description Field */}
                      <FormControl fullWidth>
                        <label
                          htmlFor={`keyResponsibilities[${index}].description`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Description *
                        </label>
                        {/* <DynamicTextField
                      id={`keyResponsibilities[${index}].description`}
                      name={`keyResponsibilities[${index}].description`}
                      multiline
                      rows={4}
                      value={item.description || ''}
                      onChange={AddNewJDFormik.handleChange}
                      // onFocus={() => AddNewJDFormik.setFieldTouched(`keyResponsibilities[${index}].description`, true)}
                      error={
                        AddNewJDFormik.touched.keyResponsibilities?.[index]?.description &&
                        Boolean(AddNewJDFormik.errors.keyResponsibilities?.[index]?.description)
                      }
                      helperText={
                        AddNewJDFormik.touched.keyResponsibilities?.[index]?.description &&
                        AddNewJDFormik.errors.keyResponsibilities?.[index]?.description
                      }
                    /> */}
                        <ReactQuill
                          id={`keyResponsibilities[${index}].description`}
                          // name={`keyResponsibilities[${index}].description`}
                          style={{ height: '40vh', paddingBottom: 50 }}
                          value={item.description || ''}
                          onChange={AddNewJDFormik.handleChange}
                          modules={{
                            toolbar: {
                              container: [
                                [
                                  { header: '1' },
                                  { header: '2' },
                                  { header: [3, 4, 5, 6] },
                                  { font: ['Jost', 'Poppins'] }
                                ],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image', 'video'],
                                ['clean']
                              ]
                            }
                          }}
                        />
                      </FormControl>
                    </div>

                    <div className='mt-4 flex justify-end'>
                      {/* <DynamicButton
                    type='button'
                    variant='outlined'
                    onClick={() =>
                      AddNewJDFormik.setFieldValue(
                        'keyResponsibilities',
                        AddNewJDFormik.values.keyResponsibilities.filter((_: any, i: number) => i !== index)
                      )
                    }
                    label='Remove'
                    className='text-red-600 border-red-500 hover:bg-red-50'
                    children='Remove'
                  /> */}

                      <Tooltip title='Delete Section' placement='top'>
                        <IconButton
                          color='secondary'
                          aria-label='delete'
                          component='span'
                          disabled={AddNewJDFormik.values.keyResponsibilities.length === 1}
                          onClick={() =>
                            AddNewJDFormik.setFieldValue(
                              'keyResponsibilities',
                              AddNewJDFormik.values.keyResponsibilities.filter((_: any, i: number) => i !== index)
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              <div className='flex justify-end'>
                <DynamicButton
                  type='button'
                  variant='contained'
                  onClick={() =>
                    AddNewJDFormik.setFieldValue('keyResponsibilities', [
                      ...(AddNewJDFormik.values.keyResponsibilities || []),
                      { title: '', description: '' }
                    ])
                  }
                  label='Add More'
                  className='bg-blue-600 text-white hover:bg-blue-700'
                  children='Add More'
                />
              </div>
            </div>
          </fieldset>

          <h3>Key Challenges</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6  mt-2'>
            {/* <legend className='text-lg font-semibold text-gray-700'>Key Challenges</legend> */}
            <div className='grid grid-cols-1 gap-4'>
              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='keyChallenges' className='block text-sm font-medium text-gray-700'>
                    Challenges *
                  </label>
                  {/* <DynamicTextField
                id='keyChallenges'
                multiline
                rows={4}
                name='keyChallenges'
                value={AddNewJDFormik.values.keyChallenges}
                onChange={AddNewJDFormik.handleChange}
                // onFocus={() => AddNewJDFormik.setFieldTouched('keyChallenges', true)}
                error={AddNewJDFormik.touched.keyChallenges && Boolean(AddNewJDFormik.errors.keyChallenges)}
                helperText={
                  AddNewJDFormik.touched.keyChallenges && AddNewJDFormik.errors.keyChallenges
                    ? AddNewJDFormik.errors.keyChallenges
                    : undefined
                }
              /> */}

                  <ReactQuill
                    id='keyChallenges'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    // name='keyChallenges'
                    value={AddNewJDFormik.values.keyChallenges}
                    onChange={AddNewJDFormik.handleChange}
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ]
                      }
                    }}
                  />
                </FormControl>
              )}
            </div>
          </fieldset>

          <h3>Key Decisions Taken</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6  mt-2'>
            {/* <legend className='text-lg font-semibold text-gray-700'>Key Decisions Taken</legend> */}
            <div className='grid grid-cols-1 gap-4'>
              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='keyDecisions' className='block text-sm font-medium text-gray-700'>
                    Key Decisions Taken *
                  </label>
                  {/* <DynamicTextField
                id='keyDecisions'
                multiline
                rows={4}
                name='keyDecisions'
                value={AddNewJDFormik.values.keyDecisions}
                onChange={AddNewJDFormik.handleChange}
                // onFocus={() => AddNewJDFormik.setFieldTouched('keyDecisions', true)}
                error={AddNewJDFormik.touched.keyDecisions && Boolean(AddNewJDFormik.errors.keyDecisions)}
                helperText={
                  AddNewJDFormik.touched.keyDecisions && AddNewJDFormik.errors.keyDecisions
                    ? AddNewJDFormik.errors.keyDecisions
                    : undefined
                }
              /> */}

                  <ReactQuill
                    id='keyDecisions'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    // name='keyDecisions'
                    value={AddNewJDFormik.values.keyDecisions}
                    onChange={AddNewJDFormik.handleChange}
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ]
                      }
                    }}
                  />
                </FormControl>
              )}
            </div>
          </fieldset>

          <h3>Key Interactions</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6  mt-2'>
            {/* <legend className='text-lg font-semibold text-gray-700'>Key Interactions</legend> */}
            <div className='grid grid-cols-2 gap-4'>
              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='internalStakeholders' className='block text-sm font-medium text-gray-700'>
                    Internal Stakeholders *
                  </label>
                  <DynamicTextField
                    id='internalStakeholders'
                    multiline
                    rows={4}
                    name='internalStakeholders'
                    value={AddNewJDFormik.values.internalStakeholders}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('internalStakeholders', true)}
                    error={
                      AddNewJDFormik.touched.internalStakeholders && Boolean(AddNewJDFormik.errors.internalStakeholders)
                    }
                    helperText={
                      AddNewJDFormik.touched.internalStakeholders && AddNewJDFormik.errors.internalStakeholders
                        ? AddNewJDFormik.errors.internalStakeholders
                        : undefined
                    }
                  />
                </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='externalStakeholders' className='block text-sm font-medium text-gray-700'>
                    External Stakeholders *
                  </label>
                  <DynamicTextField
                    id='externalStakeholders'
                    multiline
                    rows={4}
                    name='externalStakeholders'
                    value={AddNewJDFormik.values.externalStakeholders}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('externalStakeholders', true)}
                    error={
                      AddNewJDFormik.touched.externalStakeholders && Boolean(AddNewJDFormik.errors.externalStakeholders)
                    }
                    helperText={
                      AddNewJDFormik.touched.externalStakeholders && AddNewJDFormik.errors.externalStakeholders
                        ? AddNewJDFormik.errors.externalStakeholders
                        : undefined
                    }
                  />
                </FormControl>
              )}
            </div>
          </fieldset>

          <h3>Key Role Dimensions</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6 mt-2'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Portfolio Size */}
              <FormControl fullWidth margin='normal'>
                <label htmlFor='portfolioSize' className='block text-sm font-medium text-gray-700'>
                  Portfolio Size *
                </label>
                <DynamicTextField
                  id='portfolioSize'
                  name='portfolioSize'
                  type='text'
                  value={AddNewJDFormik.values.portfolioSize}
                  onChange={AddNewJDFormik.handleChange}
                  error={AddNewJDFormik.touched.portfolioSize && Boolean(AddNewJDFormik.errors.portfolioSize)}
                  helperText={
                    AddNewJDFormik.touched.portfolioSize && AddNewJDFormik.errors.portfolioSize
                      ? AddNewJDFormik.errors.portfolioSize
                      : undefined
                  }
                />
              </FormControl>

              {/* Geographical Coverage */}
              <FormControl fullWidth margin='normal'>
                <label htmlFor='geographicalCoverage' className='block text-sm font-medium text-gray-700'>
                  Geographical Coverage *
                </label>
                <DynamicTextField
                  id='geographicalCoverage'
                  name='geographicalCoverage'
                  type='text'
                  value={AddNewJDFormik.values.geographicalCoverage}
                  onChange={AddNewJDFormik.handleChange}
                  error={
                    AddNewJDFormik.touched.geographicalCoverage && Boolean(AddNewJDFormik.errors.geographicalCoverage)
                  }
                  helperText={
                    AddNewJDFormik.touched.geographicalCoverage && AddNewJDFormik.errors.geographicalCoverage
                      ? AddNewJDFormik.errors.geographicalCoverage
                      : undefined
                  }
                />
              </FormControl>

              {/* Team Size */}
              <FormControl fullWidth margin='normal'>
                <label htmlFor='teamSize' className='block text-sm font-medium text-gray-700'>
                  Team Size *
                </label>
                <DynamicTextField
                  id='teamSize'
                  name='teamSize'
                  type='text'
                  value={AddNewJDFormik.values.teamSize}
                  onChange={AddNewJDFormik.handleChange}
                  error={AddNewJDFormik.touched.teamSize && Boolean(AddNewJDFormik.errors.teamSize)}
                  helperText={
                    AddNewJDFormik.touched.teamSize && AddNewJDFormik.errors.teamSize
                      ? AddNewJDFormik.errors.teamSize
                      : undefined
                  }
                />
              </FormControl>

              {/* Total Team Size */}
              <FormControl fullWidth margin='normal'>
                <label htmlFor='totalTeamSize' className='block text-sm font-medium text-gray-700'>
                  Total Team Size *
                </label>
                <DynamicTextField
                  id='totalTeamSize'
                  name='totalTeamSize'
                  type='text'
                  value={AddNewJDFormik.values.totalTeamSize}
                  onChange={AddNewJDFormik.handleChange}
                  error={AddNewJDFormik.touched.totalTeamSize && Boolean(AddNewJDFormik.errors.totalTeamSize)}
                  helperText={
                    AddNewJDFormik.touched.totalTeamSize && AddNewJDFormik.errors.totalTeamSize
                      ? AddNewJDFormik.errors.totalTeamSize
                      : undefined
                  }
                />
              </FormControl>
            </div>
          </fieldset>

          <h3>Key Skills and Behavioural Attributes</h3>
          <Box sx={{ width: '50%', mb: 5 }}>
            <FormControl fullWidth margin='normal'>
              <label htmlFor='reportingTo' className='block text-sm font-medium text-gray-700'>
                Select type
              </label>
              <DynamicSelect
                id='skillsAndAttributesType'
                name='skillsAndAttributesType'
                value={AddNewJDFormik.values.skillsAndAttributesType}
                onChange={AddNewJDFormik.handleChange}
                // onFocus={() => AddNewJDFormik.setFieldTouched('reportingTo', true)}
                error={
                  AddNewJDFormik.touched.skillsAndAttributesType &&
                  Boolean(AddNewJDFormik.errors.skillsAndAttributesType)
                }
                helperText={
                  AddNewJDFormik.touched.skillsAndAttributesType && AddNewJDFormik.errors.skillsAndAttributesType
                    ? AddNewJDFormik.errors.skillsAndAttributesType
                    : ''
                }
              >
                <MenuItem value='description_only'>Add Description Only</MenuItem>
                <MenuItem value='in_detail'>Add in Detail</MenuItem>
              </DynamicSelect>
            </FormControl>
          </Box>

          <fieldset className='border border-gray-300 rounded-lg p-6 mb-8 shadow-sm bg-white  mt-2'>
            {AddNewJDFormik.values.skillsAndAttributesType === 'description_only' ? (
              <ReactQuill
                id='keyDecisions'
                style={{ height: '40vh', paddingBottom: 50 }}
                // name='keyDecisions'
                value={AddNewJDFormik.values.keyDecisions}
                onChange={AddNewJDFormik.handleChange}
                modules={{
                  toolbar: {
                    container: [
                      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                      [{ size: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }
                }}
              />
            ) : (
              <div className='space-y-6'>
                {AddNewJDFormik.values.skillsAndAttributes?.map((item: any, sectionIndex: number) => (
                  <div key={sectionIndex} className='p-4 border border-gray-200 rounded-lg shadow-sm'>
                    {/* Section Header */}
                    <div className='flex justify-between items-center mb-4'>
                      <div className='flex-grow'>
                        <h4 className='text-lg font-semibold text-gray-700'>Factor/Category *</h4>
                        <DynamicTextField
                          id={`skillsAndAttributes[${sectionIndex}].factor`}
                          name={`skillsAndAttributes[${sectionIndex}].factor`}
                          value={item.factor || ''}
                          onChange={AddNewJDFormik.handleChange}
                          placeholder='Enter Factor or Category'
                          error={
                            AddNewJDFormik.touched.skillsAndAttributes?.[sectionIndex]?.factor &&
                            Boolean(AddNewJDFormik.errors.skillsAndAttributes?.[sectionIndex]?.factor)
                          }
                          helperText={
                            AddNewJDFormik.touched.skillsAndAttributes?.[sectionIndex]?.factor &&
                            AddNewJDFormik.errors.skillsAndAttributes?.[sectionIndex]?.factor
                          }
                          className='w-full'
                        />
                      </div>
                      <Tooltip title='Delete Section' placement='top'>
                        <IconButton
                          color='secondary'
                          aria-label='delete'
                          component='span'
                          disabled={AddNewJDFormik.values.skillsAndAttributes.length === 1}
                          onClick={() => {
                            const updatedSections = AddNewJDFormik.values.skillsAndAttributes.filter(
                              (_: any, i: number) => i !== sectionIndex
                            )
                            AddNewJDFormik.setFieldValue('skillsAndAttributes', updatedSections)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {/* Section Body */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {/* Competency List */}
                      <div className='flex-grow'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Competencies</label>
                        <div className='space-y-1'>
                          {item.competency.map((competencyItem: any, competencyIndex: number) => (
                            <div key={competencyIndex} className='flex items-center space-x-4'>
                              <DynamicTextField
                                id={`skillsAndAttributes[${sectionIndex}].competency[${competencyIndex}].value`}
                                name={`skillsAndAttributes[${sectionIndex}].competency[${competencyIndex}].value`}
                                value={competencyItem.value}
                                onChange={AddNewJDFormik.handleChange}
                                placeholder='Enter Competency'
                                className='flex-1'
                              />
                              <Tooltip title='Delete Competency'>
                                <IconButton
                                  color='secondary'
                                  onClick={() => {
                                    const updatedCompetency = item.competency.filter(
                                      (_: any, i: number) => i !== competencyIndex
                                    )
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributes[${sectionIndex}].competency`,
                                      updatedCompetency
                                    )
                                  }}
                                  disabled={item.competency.length === 1}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {competencyIndex === item.competency.length - 1 && (
                                <Tooltip title='Add Competency'>
                                  <IconButton
                                    color='primary'
                                    onClick={() => {
                                      const newCompetency = { value: '' }
                                      const updatedCompetency = [...item.competency, newCompetency]
                                      AddNewJDFormik.setFieldValue(
                                        `skillsAndAttributes[${sectionIndex}].competency`,
                                        updatedCompetency
                                      )
                                    }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Definitions */}
                      <div className='flex-grow'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Definitions</label>
                        {item.definition.map((definitionItem: any, definitionIndex: number) => (
                          <div key={definitionIndex} className='flex items-center space-x-3'>
                            <DynamicTextField
                              id={`skillsAndAttributes[${sectionIndex}].definition[${definitionIndex}].value`}
                              name={`skillsAndAttributes[${sectionIndex}].definition[${definitionIndex}].value`}
                              value={definitionItem.value}
                              onChange={AddNewJDFormik.handleChange}
                              placeholder='Enter Definition'
                              className='flex-1'
                            />
                            <Tooltip title='Delete item' placement='top'>
                              <IconButton
                                color='secondary'
                                aria-label='delete'
                                component='span'
                                disabled={item.definition.length === 1}
                                onClick={() => {
                                  const updatedDefinition = item.definition.filter(
                                    (_: any, i: number) => i !== definitionIndex
                                  )
                                  AddNewJDFormik.setFieldValue(
                                    `skillsAndAttributes[${sectionIndex}].definition`,
                                    updatedDefinition
                                  )
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            {definitionIndex === item.definition.length - 1 && (
                              <Tooltip title='Add Definition'>
                                <IconButton
                                  color='primary'
                                  onClick={() => {
                                    const newDefinition = { value: '' }
                                    const updatedDefinition = [...item.definition, newDefinition]
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributes[${sectionIndex}].definition`,
                                      updatedDefinition
                                    )
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        ))}
                        {/* <DynamicButton
                     type='button'
                     variant='contained'
                     onClick={() => {
                       const newDefinition = { value: '' }
                       const updatedDefinition = [...item.definition, newDefinition]
                       AddNewJDFormik.setFieldValue(
                         `skillsAndAttributes[${sectionIndex}].definition`,
                         updatedDefinition
                       )
                     }}
                     className='mt-2'
                   >
                     Add Definition
                   </DynamicButton> */}
                      </div>

                      {/* Behavioural Attributes */}
                      <div className='flex-grow'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Behavioural Attributes</label>
                        {item.behavioural_attributes.map((attrItem: any, attrIndex: number) => (
                          <div key={attrIndex} className='flex items-center space-x-4'>
                            <DynamicTextField
                              id={`skillsAndAttributes[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
                              name={`skillsAndAttributes[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
                              value={attrItem.value}
                              onChange={AddNewJDFormik.handleChange}
                              placeholder='Enter Attribute'
                              className='flex-1'
                            />
                            <Tooltip title='Delete item' placement='top'>
                              <IconButton
                                color='secondary'
                                aria-label='delete'
                                component='span'
                                disabled={item.behavioural_attributes.length === 1}
                                onClick={() => {
                                  const updatedAttributes = item.behavioural_attributes.filter(
                                    (_: any, i: number) => i !== attrIndex
                                  )
                                  AddNewJDFormik.setFieldValue(
                                    `skillsAndAttributes[${sectionIndex}].behavioural_attributes`,
                                    updatedAttributes
                                  )
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            {attrIndex === item.behavioural_attributes.length - 1 && (
                              <Tooltip title=' Add Attribute'>
                                <IconButton
                                  color='primary'
                                  onClick={() => {
                                    const newAttribute = { value: '' }
                                    const updatedAttributes = [...item.behavioural_attributes, newAttribute]
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributes[${sectionIndex}].behavioural_attributes`,
                                      updatedAttributes
                                    )
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        ))}

                        {/* <DynamicButton
                     type='button'
                     variant='contained'
                     onClick={() => {
                       const newAttribute = { value: '' }
                       const updatedAttributes = [...item.behavioural_attributes, newAttribute]
                       AddNewJDFormik.setFieldValue(
                         `skillsAndAttributes[${sectionIndex}].behavioural_attributes`,
                         updatedAttributes
                       )
                     }}
                     className='mt-2'
                   >
                     Add Attribute
                   </DynamicButton> */}
                      </div>
                    </Box>
                  </div>
                ))}

                {/* Add New Section */}
                <div className='flex justify-end'>
                  <DynamicButton
                    type='button'
                    variant='contained'
                    onClick={() =>
                      AddNewJDFormik.setFieldValue('skillsAndAttributes', [
                        ...AddNewJDFormik.values.skillsAndAttributes,
                        {
                          factor: '',
                          competency: [{ value: '' }],
                          definition: [{ value: '' }],
                          behavioural_attributes: [{ value: '' }]
                        }
                      ])
                    }
                    className='bg-green-600 text-white hover:bg-green-700'
                  >
                    Add Section
                  </DynamicButton>
                </div>
              </div>
            )}
          </fieldset>

          <h3>Educational and Experience Requirements</h3>
          <fieldset className='border border-gray-300 rounded p-4 mb-6  mt-2'>
            {/* <legend className='text-lg font-semibold text-gray-700'>Educational and Experience Requirements</legend> */}
            <div className=''>
              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='minimumQualification' className='block text-sm font-medium text-gray-700'>
                    Minimum Qualification *
                  </label>
                  <DynamicTextField
                    id='minimumQualification'
                    name='minimumQualification'
                    type='text'
                    value={AddNewJDFormik.values.minimumQualification}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('minimumQualification', true)}
                    error={
                      AddNewJDFormik.touched.minimumQualification && Boolean(AddNewJDFormik.errors.minimumQualification)
                    }
                    helperText={
                      AddNewJDFormik.touched.minimumQualification && AddNewJDFormik.errors.minimumQualification
                        ? AddNewJDFormik.errors.minimumQualification
                        : undefined
                    }
                  />
                </FormControl>
              )}

              {true && (
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='experienceDescription' className='block text-sm font-medium text-gray-700'>
                    Experience Description *
                  </label>
                  <DynamicTextField
                    id='experienceDescription'
                    multiline
                    rows={4}
                    name='experienceDescription'
                    value={AddNewJDFormik.values.experienceDescription}
                    onChange={AddNewJDFormik.handleChange}
                    // onFocus={() => AddNewJDFormik.setFieldTouched('experienceDescription', true)}
                    error={
                      AddNewJDFormik.touched.experienceDescription &&
                      Boolean(AddNewJDFormik.errors.experienceDescription)
                    }
                    helperText={
                      AddNewJDFormik.touched.experienceDescription && AddNewJDFormik.errors.experienceDescription
                        ? AddNewJDFormik.errors.experienceDescription
                        : undefined
                    }
                  />
                </FormControl>
              )}
            </div>
          </fieldset>

          <div className='flex justify-end space-x-4'>
            <DynamicButton
              type='button'
              variant='contained'
              className='bg-blue-500 text-white hover:bg-blue-700'
              onClick={() => router.push('/jd-management')}
            >
              Cancel
            </DynamicButton>

            <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
              {mode === 'add' ? 'Add' : 'Update'}
            </DynamicButton>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddNewJdSample
