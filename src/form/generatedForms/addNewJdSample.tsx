'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, MenuItem, Typography, Box, Tooltip, IconButton, Card, StepConnector, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ReactQuill from 'react-quill'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { ArrowBack } from '@mui/icons-material'
import {
  getJDManagementAddFormValues,
  removeJDManagementAddFormValues,
  setJDManagementAddFormValues
} from '@/utils/functions'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import ReactFlow, { Background, NodeProps, Handle, Position, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import OrgChartCanvas from './addOrganizationChart'

type Props = {
  mode: any
  id: any
}

const steps = [
  'Organization Chart', // Added as the first step
  'Job Roles',
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
  employeeInterviewed: Yup.string().required('Role Title is required'),
  reportsTo: Yup.string().required('Reporting To is required'),
  companyName: Yup.string().required('Company Name is required'),
  functionOrDepartment: Yup.string().required('Function/Department is required'),
  writtenBy: Yup.string().required('Written By is required'),
  approvedByJobholder: Yup.string().required('Approved By is required'),
  approvedByImmediateSuperior: Yup.string().required('Approved By is required'),
  date: Yup.string().required('Approved By is required'),
  roleSummary: Yup.string().required('Role Summary is required'),
  keyResponsibilities: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required')
      })
    )
    .min(1, 'At least one responsibility must be added'),
  keyChallenges: Yup.string().required('Key Challenges is required'),
  keyDecisionsTaken: Yup.string().required('Key Decisions Taken is required'),
  internalStakeholders: Yup.string().required('Internal Stakeholders is required'),
  externalStakeholders: Yup.string().required('External Stakeholders is required'),
  skillsAndAttributesType: Yup.string().required('Skills and Attributes Type is required'),
  skillsAndAttributesDetails: Yup.array()
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
    .test('validate-details', 'At least one section is required', function (value) {
      const { skillsAndAttributesType } = this.parent
      if (skillsAndAttributesType !== 'description_only') {
        return Array.isArray(value) && value.length > 0
      }
      return true
    }),
  minimumQualification: Yup.string().required('Minimum Qualification is required'),
  experienceDescription: Yup.string().required('Experience Description is required'),
  portfolioSize: Yup.string().required('Portfolio Size is required'),
  geographicalCoverage: Yup.string().required('Geographical Coverage is required'),
  teamSize: Yup.number().typeError('Team Size must be a number').required('Team Size is required'),
  totalTeamSize: Yup.number().typeError('Total Team Size must be a number').required('Total Team Size is required')
})

// Custom Node Component for displaying charts in read-only mode
function CustomNode({ data, selected }: NodeProps) {
  const shape = data.shape || 'rectangle'
  const base = 'p-2 text-sm text-center shadow border'

  const shapeStyles: Record<string, string> = {
    rectangle: 'rounded bg-white w-32 h-16',
    circle: 'rounded-full bg-blue-100 w-20 h-20 flex items-center justify-center',
    diamond: 'w-20 h-20 bg-green-100 rotate-45 flex items-center justify-center'
  }

  return (
    <div
      className={`${base} ${shapeStyles[shape]} ${selected ? 'ring-2 ring-blue-400' : ''}`}
      style={{ transform: shape === 'diamond' ? 'rotate(-45deg)' : 'none' }}
    >
      <Handle type='target' position={Position.Top} />
      <div style={{ transform: shape === 'diamond' ? 'rotate(45deg)' : 'none' }}>
        <span className='font-medium'>{data.label || 'No Role'}</span>
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

const AddNewJdSample: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()
  const [activeStep, setActiveStep] = React.useState(0)
  const [openOrgChart, setOpenOrgChart] = useState(false)
  const [organizationChart, setOrganizationChart] = useState<any | null>(null) // Changed to store a single chart
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false) // Changed to a boolean

  const formikValuesFromCache = getJDManagementAddFormValues()

  const AddNewJDFormik: any = useFormik({
    initialValues:
      formikValuesFromCache && mode === 'add'
        ? formikValuesFromCache
        : {
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
            skillsAndAttributesDetails: [
              {
                factor: '',
                competency: [{ value: '' }],
                definition: [{ value: '' }],
                behavioural_attributes: [{ value: '' }]
              }
            ],
            minimumQualification: '',
            experienceDescription: '',
            portfolioSize: '',
            geographicalCoverage: '',
            teamSize: '',
            totalTeamSize: ''
          },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  useEffect(() => {
    console.log(id)
    let completedSteps = 0

    // Step 0: Organization Chart
    if (organizationChart) {
      completedSteps = 1
    }
    // Step 1: Description (previously step 0)
    if (
      completedSteps >= 1 &&
      AddNewJDFormik.values.roleTitle &&
      AddNewJDFormik.values.reportingTo &&
      AddNewJDFormik.values.companyName &&
      AddNewJDFormik.values.functionOrDepartment &&
      AddNewJDFormik.values.writtenBy
    ) {
      completedSteps = 2
    }
    // Step 2: Summary (previously step 1)
    if (completedSteps >= 2 && AddNewJDFormik.values.roleSummary) {
      completedSteps = 3
    }
    // Step 3: Responsibilities (previously step 2)
    if (completedSteps >= 3 && AddNewJDFormik.values.keyResponsibilities.some((d: any) => d.title && d.description)) {
      completedSteps = 4
    }
    // Step 4: Challenges (previously step 3)
    if (completedSteps >= 4 && AddNewJDFormik.values.keyChallenges) {
      completedSteps = 5
    }
    // Step 5: Decisions (previously step 4)
    if (completedSteps >= 5 && AddNewJDFormik.values.keyDecisions) {
      completedSteps = 6
    }
    // Step 6: Interactions (previously step 5)
    if (
      completedSteps >= 6 &&
      AddNewJDFormik.values.internalStakeholders &&
      AddNewJDFormik.values.externalStakeholders
    ) {
      completedSteps = 7
    }
    // Step 7: Role Dimensions (previously step 6)
    if (
      completedSteps >= 7 &&
      AddNewJDFormik.values.portfolioSize &&
      AddNewJDFormik.values.geographicalCoverage &&
      AddNewJDFormik.values.teamSize &&
      AddNewJDFormik.values.totalTeamSize
    ) {
      completedSteps = 8
    }
    // Step 8: Skills (previously step 7)
    if (
      completedSteps >= 8 &&
      AddNewJDFormik.values.skillsAndAttributesType === 'in_detail' &&
      Array.isArray(AddNewJDFormik.values.skillsAndAttributesDetails) &&
      AddNewJDFormik.values.skillsAndAttributesDetails.every(
        (item: any) =>
          item.factor &&
          Array.isArray(item.competency) &&
          item.competency.every((comp: any) => comp.value) &&
          Array.isArray(item.definition) &&
          item.definition.every((def: any) => def.value) &&
          Array.isArray(item.behavioural_attributes) &&
          item.behavioural_attributes.every((attr: any) => attr.value)
      )
    ) {
      completedSteps = 9
    }
    // Step 9: Requirements (previously step 8)
    if (
      completedSteps >= 9 &&
      AddNewJDFormik.values.minimumQualification &&
      AddNewJDFormik.values.experienceDescription
    ) {
      completedSteps = 10
    }

    setActiveStep(completedSteps)
    setJDManagementAddFormValues(AddNewJDFormik.values)
  }, [AddNewJDFormik.values, organizationChart])

  const isEmptyContent = (value: any): boolean => {
    return value === '' || value === '<p><br></p>' || value.replace(/<\/?[^>]*>/g, '').trim() === ''
  }

  const handleResetForm = () => {
    setActiveStep(0)
    setOrganizationChart(null) // Reset the chart
    setIsChartVisible(false) // Hide the chart
    removeJDManagementAddFormValues()
    AddNewJDFormik.resetForm({
      values: {
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
        skillsAndAttributesDetails: [
          {
            factor: '',
            competency: [{ value: '' }],
            definition: [{ value: '' }],
            behavioural_attributes: [{ value: '' }]
          }
        ],
        minimumQualification: '',
        experienceDescription: '',
        portfolioSize: '',
        geographicalCoverage: '',
        teamSize: '',
        totalTeamSize: ''
      }
    })
  }

  const handleAddOrganization = () => {
    setOpenOrgChart(true)
  }

  const handleSaveOrgChart = (chartData: any) => {
    setOrganizationChart(chartData) // Store the single chart
    setOpenOrgChart(false)
  }

  const toggleChartVisibility = () => {
    setIsChartVisible(prev => !prev)
  }

  return (
    <>
      <Card
        sx={{
          mb: 4,
          pt: 3,
          pb: 3,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white'
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
          {steps.map((label, index) => (
            <Step key={label} index={index}>
              <StepLabel sx={{ cursor: 'pointer' }}>
                <Typography>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>
      <div className='custom-scrollbar'>
        {openOrgChart ? (
          <OrgChartCanvas onSave={handleSaveOrgChart} initialChart={organizationChart} />
        ) : (
          <form onSubmit={AddNewJDFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              {mode === 'add' ? 'Add Job Description' : 'Edit JD'}
            </h1>

            {/* Organization Chart Section */}
            <h3>Organization Chart</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <div className='flex justify-between items-center mb-4'>
                <Typography variant='h6'>Organization Chart</Typography>
                <DynamicButton
                  type='button'
                  variant='contained'
                  onClick={handleAddOrganization}
                  className='bg-blue-600 text-white hover:bg-blue-700'
                >
                  {organizationChart ? 'Edit Organization Chart' : 'Add Organization Chart'}
                </DynamicButton>
              </div>
              {organizationChart ? (
                <div className='p-4 border border-gray-200 rounded-lg'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <Typography>Nodes: {organizationChart.nodes.length}</Typography>
                    </div>
                    <div className='space-x-2'>
                      <DynamicButton type='button' variant='outlined' onClick={toggleChartVisibility}>
                        {isChartVisible ? 'Hide Chart' : 'Show Chart'}
                      </DynamicButton>
                    </div>
                  </div>
                  {isChartVisible && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-hidden'>
                      <ReactFlowProvider>
                        <div style={{ height: '400px', width: '100%' }}>
                          <ReactFlow
                            nodes={organizationChart.nodes}
                            edges={organizationChart.edges}
                            nodeTypes={nodeTypes}
                            fitView
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={false}
                            panOnDrag={true}
                            zoomOnScroll={false}
                            zoomOnPinch={false}
                            zoomOnDoubleClick={false}
                          >
                            <Background />
                          </ReactFlow>
                        </div>
                      </ReactFlowProvider>
                    </div>
                  )}
                </div>
              ) : (
                <Typography>No organization chart added yet.</Typography>
              )}
            </fieldset>

            {/* Role Specification */}
            <h3>Job Roles</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <div className='grid grid-cols-2 gap-4'>
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
                    error={AddNewJDFormik.touched.roleTitle && Boolean(AddNewJDFormik.errors.roleTitle)}
                    helperText={AddNewJDFormik.touched.roleTitle && AddNewJDFormik.errors.roleTitle}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='reportingTo' className='block text-sm font-medium text-gray-700'>
                    Reporting To *
                  </label>
                  <DynamicSelect
                    id='reportingTo'
                    name='reportingTo'
                    value={AddNewJDFormik.values.reportingTo}
                    onChange={AddNewJDFormik.handleChange}
                    error={AddNewJDFormik.touched.reportingTo && Boolean(AddNewJDFormik.errors.reportingTo)}
                    helperText={AddNewJDFormik.touched.reportingTo && AddNewJDFormik.errors.reportingTo}
                  >
                    <MenuItem value='arun'>Arun PG</MenuItem>
                    <MenuItem value='jeevan'>Jeevan Jose</MenuItem>
                    <MenuItem value='vinduja'>Vinduja</MenuItem>
                  </DynamicSelect>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <DynamicSelect
                    id='companyName'
                    name='companyName'
                    value={AddNewJDFormik.values.companyName}
                    onChange={AddNewJDFormik.handleChange}
                    error={AddNewJDFormik.touched.companyName && Boolean(AddNewJDFormik.errors.companyName)}
                    helperText={AddNewJDFormik.touched.companyName && AddNewJDFormik.errors.companyName}
                  >
                    <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                    <MenuItem value='muthoot_finance'>Muthoot Finance</MenuItem>
                  </DynamicSelect>
                </FormControl>
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
                    error={
                      AddNewJDFormik.touched.functionOrDepartment && Boolean(AddNewJDFormik.errors.functionOrDepartment)
                    }
                    helperText={
                      AddNewJDFormik.touched.functionOrDepartment && AddNewJDFormik.errors.functionOrDepartment
                    }
                  />
                </FormControl>
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
                    error={AddNewJDFormik.touched.writtenBy && Boolean(AddNewJDFormik.errors.writtenBy)}
                    helperText={AddNewJDFormik.touched.writtenBy && AddNewJDFormik.errors.writtenBy}
                  />
                </FormControl>
              </div>
            </fieldset>

            {/* Role Summary */}
            <h3>Role Summary</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <div className=''>
                <FormControl fullWidth>
                  <ReactQuill
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={AddNewJDFormik.values.roleSummary}
                    onChange={(value: any) => {
                      if (isEmptyContent(value)) {
                        AddNewJDFormik.setFieldValue('roleSummary', '')
                      } else {
                        AddNewJDFormik.setFieldValue('roleSummary', value)
                      }
                    }}
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['clean']
                        ]
                      }
                    }}
                  />
                  <Box sx={{ mt: 1 }}>
                    {AddNewJDFormik.touched.roleSummary && AddNewJDFormik.errors.roleSummary && (
                      <div style={{ color: 'red', marginTop: '8px' }}>{AddNewJDFormik.errors.roleSummary}</div>
                    )}
                  </Box>
                </FormControl>
              </div>
            </fieldset>

            {/* Key Responsibilities */}
            <h3>Key Responsibilities</h3>
            <fieldset className='border border-gray-300 rounded-lg p-8 mb-8 shadow-sm bg-white mt-2'>
              <div className='space-y-6'>
                {AddNewJDFormik.values.keyResponsibilities &&
                  Array.isArray(AddNewJDFormik.values.keyResponsibilities) &&
                  AddNewJDFormik.values.keyResponsibilities.map((item: any, index: number) => (
                    <div key={index} className='p-4 border border-gray-200 rounded-lg shadow-sm'>
                      <div className=''>
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
                            value={item.title}
                            onChange={AddNewJDFormik.handleChange}
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
                        <FormControl fullWidth>
                          <label
                            htmlFor={`keyResponsibilities[${index}].description`}
                            className='block text-sm font-medium text-gray-700'
                          >
                            Description *
                          </label>
                          <ReactQuill
                            id={`keyResponsibilities[${index}].description`}
                            style={{ height: '40vh', paddingBottom: 50 }}
                            value={item.description || ''}
                            onChange={(value: any) => {
                              if (isEmptyContent(value)) {
                                AddNewJDFormik.setFieldValue(`keyResponsibilities[${index}].description`, '')
                              } else {
                                AddNewJDFormik.setFieldValue(`keyResponsibilities[${index}].description`, value)
                              }
                            }}
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
                                  ['clean']
                                ]
                              }
                            }}
                          />
                          {AddNewJDFormik.touched.keyResponsibilities?.[index]?.description &&
                            AddNewJDFormik.errors.keyResponsibilities?.[index]?.description && (
                              <div style={{ color: 'red', marginTop: '8px' }}>
                                {AddNewJDFormik.errors.keyResponsibilities[index].description}
                              </div>
                            )}
                        </FormControl>
                      </div>
                      <div className='mt-4 flex justify-end'>
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
                    className='bg-blue-600 text-white hover:bg-blue-700'
                    children='Add More'
                  />
                </div>
              </div>
            </fieldset>

            <h3>Key Challenges</h3>
            <fieldset className='border border-gray-300 rounded pl-8 pr-8 mb-6 mt-2'>
              <div className='grid grid-cols-1 gap-4'>
                {true && (
                  <FormControl fullWidth margin='normal'>
                    <ReactQuill
                      id='keyChallenges'
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={AddNewJDFormik.values.keyChallenges}
                      onChange={(value: any) => {
                        if (isEmptyContent(value)) {
                          AddNewJDFormik.setFieldValue('keyChallenges', '')
                        } else {
                          AddNewJDFormik.setFieldValue('keyChallenges', value)
                        }
                      }}
                      modules={{
                        toolbar: {
                          container: [
                            [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                          ]
                        }
                      }}
                    />
                    {AddNewJDFormik.touched.keyChallenges && AddNewJDFormik.errors.keyChallenges && (
                      <div style={{ color: 'red', marginTop: '8px' }}>{AddNewJDFormik.errors.keyChallenges}</div>
                    )}
                  </FormControl>
                )}
              </div>
            </fieldset>

            <h3>Key Decisions Taken</h3>
            <fieldset className='border border-gray-300 rounded pl-8 pr-8 mb-6 mt-2'>
              <div className='grid grid-cols-1 gap-4'>
                {true && (
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='keyDecisions' className='block text-sm font-medium text-gray-700'>
                      Key Decisions Taken *
                    </label>
                    <ReactQuill
                      id='keyDecisions'
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={AddNewJDFormik.values.keyDecisions}
                      onChange={(value: any) => {
                        if (isEmptyContent(value)) {
                          AddNewJDFormik.setFieldValue('keyDecisions', '')
                        } else {
                          AddNewJDFormik.setFieldValue('keyDecisions', value)
                        }
                      }}
                      modules={{
                        toolbar: {
                          container: [
                            [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                          ]
                        }
                      }}
                    />
                    {AddNewJDFormik.touched.keyDecisions && AddNewJDFormik.errors.keyDecisions && (
                      <div style={{ color: 'red', marginTop: '8px' }}>{AddNewJDFormik.errors.keyDecisions}</div>
                    )}
                  </FormControl>
                )}
              </div>
            </fieldset>

            <h3>Key Interactions</h3>
            <fieldset className='border border-gray-300 rounded pl-8 pr-8 mt-2 mb-6'>
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
                      error={
                        AddNewJDFormik.touched.internalStakeholders &&
                        Boolean(AddNewJDFormik.errors.internalStakeholders)
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
                      error={
                        AddNewJDFormik.touched.externalStakeholders &&
                        Boolean(AddNewJDFormik.errors.externalStakeholders)
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
            <fieldset className='border border-gray-300 rounded pl-8 pr-8 mb-6 mt-2'>
              <div className='grid grid-cols-2 gap-4'>
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
                    helperText={AddNewJDFormik.touched.portfolioSize && AddNewJDFormik.errors.portfolioSize}
                  />
                </FormControl>
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
                    }
                  />
                </FormControl>
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
                    helperText={AddNewJDFormik.touched.teamSize && AddNewJDFormik.errors.teamSize}
                  />
                </FormControl>
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
                    helperText={AddNewJDFormik.touched.totalTeamSize && AddNewJDFormik.errors.totalTeamSize}
                  />
                </FormControl>
              </div>
            </fieldset>

            <h3>Key Skills and Behavioural Attributes</h3>
            <Box sx={{ width: '50%', mb: 5 }}>
              <FormControl fullWidth margin='normal'>
                {/* Placeholder for skillsAndAttributesType select if needed */}
              </FormControl>
            </Box>

            <fieldset className='border border-gray-300 rounded-lg p-8 mb-8 shadow-sm bg-white mt-2'>
              {AddNewJDFormik.values.skillsAndAttributesType === 'description_only' ? (
                <></>
              ) : (
                <div className='space-y-6'>
                  {AddNewJDFormik.values.skillsAndAttributesDetails?.map((item: any, sectionIndex: number) => (
                    <div key={sectionIndex} className='p-4 border border-gray-200 rounded-lg shadow-sm'>
                      <div className='flex justify-between items-center mb-4'>
                        <div className='flex-grow'>
                          <h4 className='text-lg font-semibold text-gray-700'>Factor/Category *</h4>
                          <DynamicTextField
                            id={`skillsAndAttributesDetails[${sectionIndex}].factor`}
                            name={`skillsAndAttributesDetails[${sectionIndex}].factor`}
                            value={item.factor || ''}
                            onChange={AddNewJDFormik.handleChange}
                            placeholder='Enter Factor or Category'
                            error={
                              AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.factor &&
                              Boolean(AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.factor)
                            }
                            helperText={
                              AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.factor &&
                              AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.factor
                            }
                            className='w-full'
                          />
                        </div>
                        <Tooltip title='Delete Section' placement='top'>
                          <IconButton
                            color='secondary'
                            aria-label='delete'
                            component='span'
                            disabled={AddNewJDFormik.values.skillsAndAttributesDetails.length === 1}
                            onClick={() => {
                              const updatedSections = AddNewJDFormik.values.skillsAndAttributesDetails.filter(
                                (_: any, i: number) => i !== sectionIndex
                              )
                              AddNewJDFormik.setFieldValue('skillsAndAttributesDetails', updatedSections)
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <div className='flex-grow'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Competencies</label>
                          <div className='space-y-1'>
                            {item.competency.map((competencyItem: any, competencyIndex: number) => (
                              <div key={competencyIndex} className='flex items-center space-x-4'>
                                <DynamicTextField
                                  id={`skillsAndAttributesDetails[${sectionIndex}].competency[${competencyIndex}].value`}
                                  name={`skillsAndAttributesDetails[${sectionIndex}].competency[${competencyIndex}].value`}
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
                                        `skillsAndAttributesDetails[${sectionIndex}].competency`,
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
                                          `skillsAndAttributesDetails[${sectionIndex}].competency`,
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
                        <div className='flex-grow'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Definitions</label>
                          {item.definition.map((definitionItem: any, definitionIndex: number) => (
                            <div key={definitionIndex} className='flex items-center space-x-3'>
                              <DynamicTextField
                                id={`skillsAndAttributesDetails[${sectionIndex}].definition[${definitionIndex}].value`}
                                name={`skillsAndAttributesDetails[${sectionIndex}].definition[${definitionIndex}].value`}
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
                                      `skillsAndAttributesDetails[${sectionIndex}].definition`,
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
                                        `skillsAndAttributesDetails[${sectionIndex}].definition`,
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
                        </div>
                        <div className='flex-grow'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Behavioural Attributes</label>
                          {item.behavioural_attributes.map((attrItem: any, attrIndex: number) => (
                            <div key={attrIndex} className='flex items-center space-x-4'>
                              <DynamicTextField
                                id={`skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
                                name={`skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
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
                                      `skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes`,
                                      updatedAttributes
                                    )
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {attrIndex === item.behavioural_attributes.length - 1 && (
                                <Tooltip title='Add Attribute'>
                                  <IconButton
                                    color='primary'
                                    onClick={() => {
                                      const newAttribute = { value: '' }
                                      const updatedAttributes = [...item.behavioural_attributes, newAttribute]
                                      AddNewJDFormik.setFieldValue(
                                        `skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes`,
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
                        </div>
                      </Box>
                    </div>
                  ))}
                  <div className='flex justify-end'>
                    <DynamicButton
                      type='button'
                      variant='contained'
                      onClick={() =>
                        AddNewJDFormik.setFieldValue('skillsAndAttributesDetails', [
                          ...AddNewJDFormik.values.skillsAndAttributesDetails,
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
            <fieldset className='border border-gray-300 rounded pl-8 pr-8 mb-6 mt-2'>
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
                      error={
                        AddNewJDFormik.touched.minimumQualification &&
                        Boolean(AddNewJDFormik.errors.minimumQualification)
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

            <div className='flex justify-between space-x-4'>
              <Box>
                <Button startIcon={<ArrowBack />} variant='text' onClick={() => router.push('/jd-management')}>
                  Back to JD List
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 5 }}>
                <DynamicButton type='button' variant='outlined' className='' onClick={handleResetForm}>
                  Reset Form
                </DynamicButton>
                <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
                  {mode === 'add' ? 'Create Request' : 'Update Request'}
                </DynamicButton>
              </Box>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default AddNewJdSample
