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
import type NodeProps from 'reactflow'
import ReactFlow, { Background, Handle, Position, ReactFlowProvider } from 'reactflow'

import {
  getJDManagementAddFormValues,
  removeJDManagementAddFormValues,
  setJDManagementAddFormValues
} from '@/utils/functions'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import 'reactflow/dist/style.css'
import OrgChartCanvas from './addOrganizationChart'

type Props = {
  mode: 'add' | 'edit'
}

const steps = [
  'Organization Chart',
  'Roles Specification',
  'Role Summary',
  'Key Responsibilities',
  'Key Challenges',
  'Key Decisions',
  'Key Interactions',
  'Key Role Dimensions',
  'Key Skills And Behavioural Attributes',
  'Education and Experience'
]

const validationSchema = Yup.object().shape({
  roleSpecification: Yup.object().shape({
    roleTitle: Yup.string().required('Role Title is required'),
    employeeInterviewed: Yup.string().required('Employee Interviewed is required'),
    reportsTo: Yup.string().required('Reporting To is required'),
    companyName: Yup.string().required('Company Name is required'),
    functionOrDepartment: Yup.string().required('Function/Department is required'),
    writtenBy: Yup.string().required('Written By is required'),
    approvedByJobholder: Yup.string().required('Approved By (Jobholder) is required'),
    approvedBySuperior: Yup.string().required('Approved By (Immediate Superior) is required'),
    dateWritten: Yup.string().required('Date (Written On) is required')
  }),
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
  keyDecisions: Yup.string().required('Key Decisions Taken is required'),
  keyInteractions: Yup.array()
    .of(
      Yup.object().shape({
        internalStakeholders: Yup.string().required('Internal Stakeholders is required'),
        externalStakeholders: Yup.string().required('External Stakeholders is required')
      })
    )
    .min(1, 'At least one interaction must be added'),

  skillsAndAttributesType: Yup.string().required('Skills and Attributes Type is required'),
  skillsAndAttributesDetails: Yup.array()
    .of(
      Yup.object().shape({
        factor: Yup.string().required('Factor is required'),
        competency: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Competency is required') }))
          .min(1, 'At least one Competency is required'),
        definition: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Definition is required') }))
          .min(1, 'At least one Definition is required'),
        behavioural_attributes: Yup.array()
          .of(Yup.object().shape({ value: Yup.string().required('Behavioural Attribute is required') }))
          .min(1, 'At least one Behavioural Attribute is required')
      })
    )
    .test('validate-details', 'At least one section is required', function (value) {
      const { skillsAndAttributesType } = this.parent

      return skillsAndAttributesType !== 'description_only' ? Array.isArray(value) && value.length > 0 : true
    }),

  keyRoleDimensions: Yup.array().of(
    Yup.object().shape({
      portfolioSize: Yup.string().required('Portfolio Size is required'),
      geographicalCoverage: Yup.string().required('Geographical Coverage is required'),
      teamSize: Yup.number().typeError('Team Size must be a number').required('Team Size is required'),
      totalTeamSize: Yup.number().typeError('Total Team Size must be a number').required('Total Team Size is required')
    })
  ),

  educationAndExperience: Yup.array().of(
    Yup.object().shape({
      minimumQualification: Yup.string().required('Minimum Qualification is required'),
      experienceDescription: Yup.string().required('Experience Description is required')
    })
  )
})

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

const AddNewJdSample: React.FC<Props> = ({ mode }) => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [openOrgChart, setOpenOrgChart] = useState(false)
  const [organizationChart, setOrganizationChart] = useState<any | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)

  const formikValuesFromCache = getJDManagementAddFormValues()

  const AddNewJDFormik = useFormik({
    initialValues:
      formikValuesFromCache && mode === 'add'
        ? formikValuesFromCache
        : {
            organizationChart: organizationChart,
            roleSpecification: [
              {
                roleTitle: '',
                employeeInterviewed: '',
                reportsTo: '',
                companyName: '',
                functionOrDepartment: '',
                writtenBy: '',
                approvedByJobholder: '',
                approvedBySuperior: '',
                dateWritten: ''
              }
            ],
            roleSummary: '',
            keyResponsibilities: [{ title: '', description: '' }],
            keyChallenges: '',
            keyDecisions: '',
            keyInteractions: [{ internalStakeholders: '', externalStakeholders: '' }],
            keyRoleDimensions: [{ portfolioSize: '', geographicalCoverage: '', teamSize: '', totalTeamSize: '' }],
            skillsAndAttributesType: 'description_only',
            skillsAndAttributesDetails: [
              {
                factor: '',
                competency: [{ value: '' }],
                definition: [{ value: '' }],
                behavioural_attributes: [{ value: '' }]
              }
            ],
            educationAndExperience: [{ minimumQualification: '', experienceDescription: '' }]
          },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formDataToSave = {
          ...values,
          organizationChart,
          id: Date.now().toString(), // Generate a unique ID
          job_role: values.roleTitle,
          experience: values.experienceDescription,
          job_type: values.functionOrDepartment,
          education: values.minimumQualification,
          salary_range: 'N/A', // Placeholder, adjust as needed
          skills: values.skillsAndAttributesDetails.map((item: any) => item.factor).filter(Boolean)
        }

        // Save to localStorage
        const existingJobs = JSON.parse(localStorage.getItem('jdList') || '[]')

        localStorage.setItem('jdList', JSON.stringify([...existingJobs, formDataToSave]))

        handleResetForm()
        console.log('Form data saved successfully:', formDataToSave)
        console.log('Form data saved successfully:', JSON.stringify(formDataToSave))

        // router.push('/jd-management') // Redirect to JobListing page
      } catch (error) {
        console.error('Error saving form data:', error)
      } finally {
        setSubmitting(false)
      }
    }
  })

  const transformToTree = (nodes, edges) => {
    const nodeMap = new Map()
    const rootNodes = []

    nodes.forEach(node => {
      nodeMap.set(node.id, { id: node.id, name: node.data.label, children: [] })
    })

    edges.forEach(edge => {
      const parent = nodeMap.get(edge.source)
      const child = nodeMap.get(edge.target)

      if (parent && child) {
        child.parentId = parent.id
        parent.children.push(child)
      }
    })

    nodeMap.forEach(node => {
      const hasParent = edges.some(edge => edge.target === node.id)

      if (!hasParent) rootNodes.push(node)
    })

    return rootNodes.length === 1 ? rootNodes[0] : { id: 'root', name: 'Root', children: rootNodes }
  }

  useEffect(() => {
    let completedSteps = 0

    if (organizationChart) completedSteps = 1

    if (
      completedSteps >= 1 &&
      AddNewJDFormik.values.roleSpecification.some(
        (item: any) =>
          item.roleTitle &&
          item.reportsTo &&
          item.companyName &&
          item.functionOrDepartment &&
          item.writtenBy &&
          item.approvedByJobholder &&
          item.approvedBySuperior &&
          item.dateWritten
      )
    ) {
      completedSteps = 2
    }

    if (completedSteps >= 2 && AddNewJDFormik.values.roleSummary) completedSteps = 3
    if (completedSteps >= 3 && AddNewJDFormik.values.keyResponsibilities.some((d: any) => d.title && d.description))
      completedSteps = 4
    if (completedSteps >= 4 && AddNewJDFormik.values.keyChallenges) completedSteps = 5
    if (completedSteps >= 5 && AddNewJDFormik.values.keyDecisions) completedSteps = 6
    if (
      completedSteps >= 6 &&
      AddNewJDFormik.values.keyInteractions.some((d: any) => d.internalStakeholders && d.externalStakeholders)
    )
      completedSteps = 7

    if (
      completedSteps >= 7 &&
      AddNewJDFormik.values.keyRoleDimensions.some(
        (d: any) => d.portfolioSize && d.geographicalCoverage && d.teamSize && d.totalTeamSize
      )
    ) {
      completedSteps = 8
    }

    if (
      completedSteps >= 8 &&
      AddNewJDFormik.values.skillsAndAttributesType === 'in_detail' &&
      Array.isArray(AddNewJDFormik.values.skillsAndAttributesDetails) &&
      AddNewJDFormik.values.skillsAndAttributesDetails.every(
        (item: any) =>
          item.factor &&
          item.competency.every((comp: any) => comp.value) &&
          item.definition.every((def: any) => def.value) &&
          item.behavioural_attributes.every((attr: any) => attr.value)
      )
    ) {
      completedSteps = 9
    }

    if (
      completedSteps >= 9 &&
      AddNewJDFormik.values.educationAndExperience === 'in_detail' &&
      Array.isArray(AddNewJDFormik.values.educationAndExperienceDetails) &&
      AddNewJDFormik.values.educationAndExperienceDetails.every(
        (item: any) => item.minimumQualification && item.experienceDescription
      )
    ) {
      completedSteps = 10
    }

    setActiveStep(completedSteps)
    console.log('AddNewJDFormik.values', JSON.stringify(AddNewJDFormik.values))
    setJDManagementAddFormValues(AddNewJDFormik.values)
  }, [AddNewJDFormik.values, organizationChart])

  const isEmptyContent = (value: any): boolean => {
    return value === '' || value === '<p><br></p>' || value.replace(/<\/?[^>]*>/g, '').trim() === ''
  }

  const handleResetForm = () => {
    setActiveStep(0)
    setOrganizationChart(null)
    setIsChartVisible(false)
    removeJDManagementAddFormValues()
    AddNewJDFormik.resetForm({
      values: {
        organizationChart: null,
        roleSpecification: [
          {
            roleTitle: '',
            employeeInterviewed: '',
            reportsTo: '',
            companyName: '',
            functionOrDepartment: '',
            writtenBy: '',
            approvedByJobholder: '',
            approvedBySuperior: '',
            dateWritten: ''
          }
        ],
        roleSummary: '',
        keyResponsibilities: [{ title: '', description: '' }],
        keyChallenges: '',
        keyDecisions: '',
        keyInteractions: [{ internalStakeholders: '', externalStakeholders: '' }],
        keyRoleDimensions: [{ portfolioSize: '', geographicalCoverage: '', teamSize: '', totalTeamSize: '' }],
        skillsAndAttributesType: 'description_only',
        skillsAndAttributesDetails: [
          {
            factor: '',
            competency: [{ value: '' }],
            definition: [{ value: '' }],
            behavioural_attributes: [{ value: '' }]
          }
        ],
        educationAndExperience: [{ minimumQualification: '', experienceDescription: '' }]
      }
    })
  }

  const handleSaveOrgChart = chartData => {
    const transformedChart = transformToTree(chartData.nodes, chartData.edges)

    setOrganizationChart(transformedChart)
    AddNewJDFormik.values.organizationChart = transformedChart
    setOpenOrgChart(false)
    setIsChartVisible(true)
  }

  const handleAddOrganization = () => {
    setOpenOrgChart(true)
  }

  const toggleChartVisibility = () => {
    setIsChartVisible(prev => !prev)
  }

  return (
    <>
      <Card sx={{ mb: 4, pt: 3, pb: 3, position: 'sticky', top: 70, zIndex: 10, backgroundColor: 'white' }}>
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
                    <Typography>Nodes: {countNodes(organizationChart)}</Typography>
                    <DynamicButton type='button' variant='outlined' onClick={toggleChartVisibility}>
                      {isChartVisible ? 'Hide Chart' : 'Show Chart'}
                    </DynamicButton>
                  </div>
                  {isChartVisible && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-hidden'>
                      <ReactFlowProvider>
                        <div style={{ height: '400px', width: '100%' }}>
                          <ReactFlow
                            nodes={convertToReactFlowNodes(organizationChart)}
                            edges={convertToReactFlowEdges(organizationChart)}
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
            <h3>Role Specification</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              {AddNewJDFormik.values.roleSpecification?.map((item: any, index: number) => (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='roleTitle' className='block text-sm font-medium text-gray-700'>
                        Role Title *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].roleTitle`}
                        name={`roleSpecification[${index}].roleTitle`}
                        type='text'
                        value={item.roleTitle}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.roleTitle &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.roleTitle)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.roleTitle &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.roleTitle
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='employeeInterviewed' className='block text-sm font-medium text-gray-700'>
                        Employee Interviewed *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].employeeInterviewed`}
                        name={`roleSpecification[${index}].employeeInterviewed`}
                        type='text'
                        value={item.employeeInterviewed}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.employeeInterviewed &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.employeeInterviewed)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.employeeInterviewed &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.employeeInterviewed
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='reportsTo' className='block text-sm font-medium text-gray-700'>
                        Reporting To *
                      </label>
                      <DynamicSelect
                        id={`roleSpecification[${index}].reportsTo`}
                        name={`roleSpecification[${index}].reportsTo`}
                        value={item.reportsTo}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.reportsTo &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.reportsTo)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.reportsTo &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.reportsTo
                        }
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
                        id={`roleSpecification[${index}].companyName`}
                        name={`roleSpecification[${index}].companyName`}
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.companyName}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.companyName &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.companyName)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.companyName &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.companyName
                        }
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
                        id={`roleSpecification[${index}].functionOrDepartment`}
                        name={`roleSpecification[${index}].functionOrDepartment`}
                        type='text'
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.functionOrDepartment}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.functionOrDepartment &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.functionOrDepartment)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.functionOrDepartment &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.functionOrDepartment
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='writtenBy' className='block text-sm font-medium text-gray-700'>
                        Written By *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].writtenBy`}
                        name={`roleSpecification[${index}].writtenBy`}
                        type='text'
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.writtenBy}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.writtenBy &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.writtenBy)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.writtenBy &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.writtenBy
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='approvedByJobholder' className='block text-sm font-medium text-gray-700'>
                        Approved By (Jobholder) *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].approvedByJobholder`}
                        name={`roleSpecification[${index}].approvedByJobholder`}
                        type='text'
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.approvedByJobholder}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.approvedByJobholder &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.approvedByJobholder)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.approvedByJobholder &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.approvedByJobholder
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='approvedBySuperior' className='block text-sm font-medium text-gray-700'>
                        Approved By (Immediate Superior) *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].approvedBySuperior`}
                        name={`roleSpecification[${index}].approvedBySuperior`}
                        type='text'
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.approvedBySuperior}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.approvedBySuperior &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.approvedBySuperior)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.approvedBySuperior &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.approvedBySuperior
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='dateWritten' className='block text-sm font-medium text-gray-700'>
                        Date (Written On) *
                      </label>
                      <DynamicTextField
                        id={`roleSpecification[${index}].dateWritten`}
                        name={`roleSpecification[${index}].dateWritten`}
                        type='date'
                        value={AddNewJDFormik.values.roleSpecification?.[index]?.dateWritten}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.dateWritten &&
                          Boolean(AddNewJDFormik.errors.roleSpecification?.[index]?.dateWritten)
                        }
                        helperText={
                          AddNewJDFormik.touched.roleSpecification?.[index]?.dateWritten &&
                          AddNewJDFormik.errors.roleSpecification?.[index]?.dateWritten
                        }
                      />
                    </FormControl>
                  </div>
                </>
              ))}
            </fieldset>

            {/* Role Summary */}
            <h3>Role Summary</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <FormControl fullWidth>
                <ReactQuill
                  style={{ height: '40vh', paddingBottom: 50 }}
                  value={AddNewJDFormik.values.roleSummary}
                  onChange={(value: any) => {
                    AddNewJDFormik.setFieldValue('roleSummary', isEmptyContent(value) ? '' : value)
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
                {AddNewJDFormik.touched.roleSummary && AddNewJDFormik.errors.roleSummary && (
                  <div style={{ color: 'red', marginTop: '8px' }}>{AddNewJDFormik.errors.roleSummary}</div>
                )}
              </FormControl>
            </fieldset>

            {/* Key Responsibilities */}
            <h3>Key Responsibilities</h3>
            <fieldset className='border border-gray-300 rounded-lg p-8 mb-8 shadow-sm bg-white mt-2'>
              <div className='space-y-6'>
                {AddNewJDFormik.values.keyResponsibilities.map((item: any, index: number) => (
                  <div key={index} className='p-4 border border-gray-200 rounded-lg shadow-sm'>
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
                          AddNewJDFormik.setFieldValue(
                            `keyResponsibilities[${index}].description`,
                            isEmptyContent(value) ? '' : value
                          )
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
                    <div className='mt-4 flex justify-end'>
                      <Tooltip title='Delete Section' placement='top'>
                        <IconButton
                          color='secondary'
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
                        ...AddNewJDFormik.values.keyResponsibilities,
                        { title: '', description: '' }
                      ])
                    }
                    className='bg-blue-600 text-white hover:bg-blue-700'
                  >
                    Add More
                  </DynamicButton>
                </div>
              </div>
            </fieldset>

            {/* Key Challenges */}
            <h3>Key Challenges</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <FormControl fullWidth margin='normal'>
                <ReactQuill
                  id='keyChallenges'
                  style={{ height: '40vh', paddingBottom: 50 }}
                  value={AddNewJDFormik.values.keyChallenges}
                  onChange={(value: any) => {
                    AddNewJDFormik.setFieldValue('keyChallenges', isEmptyContent(value) ? '' : value)
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
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
            </fieldset>

            {/* Key Decisions Taken */}
            <h3>Key Decisions Taken</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              <FormControl fullWidth margin='normal'>
                <label htmlFor='keyDecisions' className='block text-sm font-medium text-gray-700'>
                  Key Decisions Taken *
                </label>
                <ReactQuill
                  id='keyDecisions'
                  style={{ height: '40vh', paddingBottom: 50 }}
                  value={AddNewJDFormik.values.keyDecisions}
                  onChange={(value: any) => {
                    AddNewJDFormik.setFieldValue('keyDecisions', isEmptyContent(value) ? '' : value)
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
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
            </fieldset>

            {/* Key Interactions */}
            <h3>Key Interactions</h3>
            <fieldset className='border border-gray-300 rounded p-8 mt-2 mb-6'>
              {AddNewJDFormik.values.keyInteractions.map((item: any, index: number) => (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='internalStakeholders' className='block text-sm font-medium text-gray-700'>
                        Internal Stakeholders *
                      </label>
                      <DynamicTextField
                        id={`keyInteractions[${index}].internalStakeholders`}
                        multiline
                        rows={4}
                        name={`keyInteractions[${index}].internalStakeholders`}
                        value={item.internalStakeholders}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyInteractions?.[index]?.internalStakeholders &&
                          Boolean(AddNewJDFormik.errors.keyInteractions?.[index]?.internalStakeholders)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyInteractions?.[index]?.internalStakeholders &&
                          AddNewJDFormik.errors.keyInteractions?.[index]?.internalStakeholders
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='externalStakeholders' className='block text-sm font-medium text-gray-700'>
                        External Stakeholders *
                      </label>
                      <DynamicTextField
                        id={`keyInteractions[${index}].externalStakeholders`}
                        multiline
                        rows={4}
                        name={`keyInteractions[${index}].externalStakeholders`}
                        value={item.externalStakeholders}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyInteractions?.[index]?.externalStakeholders &&
                          Boolean(AddNewJDFormik.errors.keyInteractions?.[index]?.externalStakeholders)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyInteractions?.[index]?.externalStakeholders &&
                          AddNewJDFormik.errors.keyInteractions?.[index]?.externalStakeholders
                        }
                      />
                    </FormControl>
                  </div>
                </>
              ))}
            </fieldset>

            {/* Key Role Dimensions */}
            <h3>Key Role Dimensions</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              {AddNewJDFormik.values.keyRoleDimensions.map((item: any, index: number) => (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='portfolioSize' className='block text-sm font-medium text-gray-700'>
                        Portfolio Size *
                      </label>

                      <DynamicTextField
                        id={`keyRoleDimensions[${index}].portfolioSize`}
                        name={`keyRoleDimensions[${index}].portfolioSize`}
                        type='text'
                        value={item.portfolioSize}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.portfolioSize &&
                          Boolean(AddNewJDFormik.errors.keyRoleDimensions?.[index]?.portfolioSize)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.portfolioSize &&
                          AddNewJDFormik.errors.keyRoleDimensions?.[index]?.portfolioSize
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='geographicalCoverage' className='block text-sm font-medium text-gray-700'>
                        Geographical Coverage *
                      </label>
                      <DynamicTextField
                        id={`keyRoleDimensions[${index}].geographicalCoverage`}
                        name={`keyRoleDimensions[${index}].geographicalCoverage`}
                        type='text'
                        value={item.geographicalCoverage}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.geographicalCoverage &&
                          Boolean(AddNewJDFormik.errors.keyRoleDimensions?.[index]?.geographicalCoverage)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.geographicalCoverage &&
                          AddNewJDFormik.errors.keyRoleDimensions?.[index]?.geographicalCoverage
                        }
                      />
                    </FormControl>

                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`keyRoleDimensions[${index}].teamSize`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Team Size *
                      </label>
                      <DynamicTextField
                        id={`keyRoleDimensions[${index}].teamSize`}
                        name={`keyRoleDimensions[${index}].teamSize`}
                        type='text'
                        value={item.teamSize}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.teamSize &&
                          Boolean(AddNewJDFormik.errors.keyRoleDimensions?.[index]?.teamSize)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.teamSize &&
                          AddNewJDFormik.errors.keyRoleDimensions?.[index]?.teamSize
                        }
                      />
                    </FormControl>

                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`keyRoleDimensions[${index}].totalTeamSize`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Total Team Size *
                      </label>
                      <DynamicTextField
                        id={`keyRoleDimensions[${index}].totalTeamSize`}
                        name={`keyRoleDimensions[${index}].totalTeamSize`}
                        type='text'
                        value={item.totalTeamSize}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.totalTeamSize &&
                          Boolean(AddNewJDFormik.errors.keyRoleDimensions?.[index]?.totalTeamSize)
                        }
                        helperText={
                          AddNewJDFormik.touched.keyRoleDimensions?.[index]?.totalTeamSize &&
                          AddNewJDFormik.errors.keyRoleDimensions?.[index]?.totalTeamSize
                        }
                      />
                    </FormControl>
                  </div>
                </>
              ))}
            </fieldset>

            {/* Key Skills and Behavioural Attributes */}
            <h3>Key Skills and Behavioural Attributes</h3>
            <Box sx={{ width: '50%', mb: 5 }}>
              <FormControl fullWidth margin='normal'>
                <label htmlFor='skillsAndAttributesType' className='block text-sm font-medium text-gray-700'>
                  Skills and Attributes Type *
                </label>
              </FormControl>
            </Box>

            <fieldset className='border border-gray-300 rounded-lg p-8 mb-8 shadow-sm bg-white mt-2'>
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
                          disabled={AddNewJDFormik.values.skillsAndAttributesDetails.length === 1}
                          onClick={() => {
                            AddNewJDFormik.setFieldValue(
                              'skillsAndAttributesDetails',
                              AddNewJDFormik.values.skillsAndAttributesDetails.filter(
                                (_: any, i: number) => i !== sectionIndex
                              )
                            )
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <div className='flex-grow'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Competencies *</label>
                        <div className='space-y-2'>
                          {item.competency.map((competencyItem: any, competencyIndex: number) => (
                            <div key={competencyIndex} className='flex items-center space-x-2'>
                              <DynamicTextField
                                id={`skillsAndAttributesDetails[${sectionIndex}].competency[${competencyIndex}].value`}
                                name={`skillsAndAttributesDetails[${sectionIndex}].competency[${competencyIndex}].value`}
                                value={competencyItem.value}
                                onChange={AddNewJDFormik.handleChange}
                                placeholder='Enter Competency'
                                error={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.competency?.[
                                    competencyIndex
                                  ]?.value &&
                                  Boolean(
                                    AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.competency?.[
                                      competencyIndex
                                    ]?.value
                                  )
                                }
                                helperText={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.competency?.[
                                    competencyIndex
                                  ]?.value &&
                                  AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.competency?.[
                                    competencyIndex
                                  ]?.value
                                }
                                className='flex-1'
                              />
                              <Tooltip title='Delete Competency' placement='top'>
                                <IconButton
                                  color='secondary'
                                  disabled={item.competency.length === 1}
                                  onClick={() => {
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributesDetails[${sectionIndex}].competency`,
                                      item.competency.filter((_: any, i: number) => i !== competencyIndex)
                                    )
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {competencyIndex === item.competency.length - 1 && (
                                <Tooltip title='Add Competency' placement='top'>
                                  <IconButton
                                    color='primary'
                                    onClick={() => {
                                      AddNewJDFormik.setFieldValue(
                                        `skillsAndAttributesDetails[${sectionIndex}].competency`,
                                        [...item.competency, { value: '' }]
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
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Definitions *</label>
                        <div className='space-y-2'>
                          {item.definition.map((definitionItem: any, definitionIndex: number) => (
                            <div key={definitionIndex} className='flex items-center space-x-2'>
                              <DynamicTextField
                                id={`skillsAndAttributesDetails[${sectionIndex}].definition[${definitionIndex}].value`}
                                name={`skillsAndAttributesDetails[${sectionIndex}].definition[${definitionIndex}].value`}
                                value={definitionItem.value}
                                onChange={AddNewJDFormik.handleChange}
                                placeholder='Enter Definition'
                                error={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.definition?.[
                                    definitionIndex
                                  ]?.value &&
                                  Boolean(
                                    AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.definition?.[
                                      definitionIndex
                                    ]?.value
                                  )
                                }
                                helperText={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]?.definition?.[
                                    definitionIndex
                                  ]?.value &&
                                  AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]?.definition?.[
                                    definitionIndex
                                  ]?.value
                                }
                                className='flex-1'
                              />
                              <Tooltip title='Delete Definition' placement='top'>
                                <IconButton
                                  color='secondary'
                                  disabled={item.definition.length === 1}
                                  onClick={() => {
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributesDetails[${sectionIndex}].definition`,
                                      item.definition.filter((_: any, i: number) => i !== definitionIndex)
                                    )
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {definitionIndex === item.definition.length - 1 && (
                                <Tooltip title='Add Definition' placement='top'>
                                  <IconButton
                                    color='primary'
                                    onClick={() => {
                                      AddNewJDFormik.setFieldValue(
                                        `skillsAndAttributesDetails[${sectionIndex}].definition`,
                                        [...item.definition, { value: '' }]
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
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Behavioural Attributes *</label>
                        <div className='space-y-2'>
                          {item.behavioural_attributes.map((attrItem: any, attrIndex: number) => (
                            <div key={attrIndex} className='flex items-center space-x-2'>
                              <DynamicTextField
                                id={`skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
                                name={`skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes[${attrIndex}].value`}
                                value={attrItem.value}
                                onChange={AddNewJDFormik.handleChange}
                                placeholder='Enter Behavioural Attribute'
                                error={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]
                                    ?.behavioural_attributes?.[attrIndex]?.value &&
                                  Boolean(
                                    AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]
                                      ?.behavioural_attributes?.[attrIndex]?.value
                                  )
                                }
                                helperText={
                                  AddNewJDFormik.touched.skillsAndAttributesDetails?.[sectionIndex]
                                    ?.behavioural_attributes?.[attrIndex]?.value &&
                                  AddNewJDFormik.errors.skillsAndAttributesDetails?.[sectionIndex]
                                    ?.behavioural_attributes?.[attrIndex]?.value
                                }
                                className='flex-1'
                              />
                              <Tooltip title='Delete Attribute' placement='top'>
                                <IconButton
                                  color='secondary'
                                  disabled={item.behavioural_attributes.length === 1}
                                  onClick={() => {
                                    AddNewJDFormik.setFieldValue(
                                      `skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes`,
                                      item.behavioural_attributes.filter((_: any, i: number) => i !== attrIndex)
                                    )
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {attrIndex === item.behavioural_attributes.length - 1 && (
                                <Tooltip title='Add Attribute' placement='top'>
                                  <IconButton
                                    color='primary'
                                    onClick={() => {
                                      AddNewJDFormik.setFieldValue(
                                        `skillsAndAttributesDetails[${sectionIndex}].behavioural_attributes`,
                                        [...item.behavioural_attributes, { value: '' }]
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
            </fieldset>

            {/* Educational and Experience Requirements */}
            <h3>Educational and Experience Requirements</h3>
            <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
              {AddNewJDFormik.values.educationAndExperience.map((item: any, sectionIndex: number) => (
                <>
                  <div>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='minimumQualification' className='block text-sm font-medium text-gray-700'>
                        Minimum Qualification *
                      </label>
                      <DynamicTextField
                        id={`educationAndExperience[${sectionIndex}].minimumQualification`}
                        name={`educationAndExperience[${sectionIndex}].minimumQualification`}
                        type='text'
                        value={item.minimumQualification}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.educationAndExperience?.[sectionIndex]?.minimumQualification &&
                          Boolean(AddNewJDFormik.errors.educationAndExperience?.[sectionIndex]?.minimumQualification)
                        }
                        helperText={
                          AddNewJDFormik.touched.educationAndExperience?.[sectionIndex]?.minimumQualification &&
                          AddNewJDFormik.errors.educationAndExperience?.[sectionIndex]?.minimumQualification
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='experienceDescription' className='block text-sm font-medium text-gray-700'>
                        Experience Description *
                      </label>
                      <DynamicTextField
                        id={`educationAndExperience[${sectionIndex}].experienceDescription`}
                        name={`educationAndExperience[${sectionIndex}].experienceDescription`}
                        type='text'
                        value={item.experienceDescription}
                        onChange={AddNewJDFormik.handleChange}
                        error={
                          AddNewJDFormik.touched.educationAndExperience?.[sectionIndex]?.experienceDescription &&
                          Boolean(AddNewJDFormik.errors.educationAndExperience?.[sectionIndex]?.experienceDescription)
                        }
                        helperText={
                          AddNewJDFormik.touched.educationAndExperience?.[sectionIndex]?.experienceDescription &&
                          AddNewJDFormik.errors.educationAndExperience?.[sectionIndex]?.experienceDescription
                        }
                      />
                    </FormControl>
                  </div>
                </>
              ))}
            </fieldset>

            <div className='flex justify-between space-x-4'>
              <Button startIcon={<ArrowBack />} variant='text' onClick={() => router.push('/jd-management')}>
                Back to JD List
              </Button>
              <Box sx={{ display: 'flex', gap: 5 }}>
                <DynamicButton type='button' variant='outlined' onClick={handleResetForm}>
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

const countNodes = chart => {
  let count = 1

  if (chart.children) {
    chart.children.forEach(child => {
      count += countNodes(child)
    })
  }

  return count
}

const convertToReactFlowNodes = (chart, parentX = 0, parentY = 0, level = 0) => {
  const nodes = []
  const xOffset = 200
  const yOffset = 100

  nodes.push({
    id: chart.id,
    type: 'custom',
    data: { label: chart.name },
    position: { x: parentX, y: parentY }
  })

  if (chart.children) {
    chart.children.forEach((child, index) => {
      const childX = parentX + (index - (chart.children.length - 1) / 2) * xOffset
      const childY = parentY + yOffset * (level + 1)

      nodes.push(...convertToReactFlowNodes(child, childX, childY, level + 1))
    })
  }

  return nodes
}

const convertToReactFlowEdges = chart => {
  const edges = []

  if (chart.children) {
    chart.children.forEach(child => {
      edges.push({
        id: `reactflow__edge-${chart.id}-${child.id}`,
        source: chart.id,
        target: child.id
      })
      edges.push(...convertToReactFlowEdges(child))
    })
  }

  return edges
}

export default AddNewJdSample
