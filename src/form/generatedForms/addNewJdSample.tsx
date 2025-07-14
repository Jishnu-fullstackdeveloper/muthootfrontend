'use client'

import React, { useEffect, useState } from 'react'

// import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow'

import ReactQuill from 'react-quill'

import 'reactflow/dist/style.css'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'

import { Tree, TreeNode } from 'react-organizational-chart'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import type { OrganizationChart, Node, Edge } from './types'

import OrgChartCanvas from './addOrganizationChart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { fetchJobRole, fetchDesignation, fetchDepartment, addNewJd } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

const renderOrgChartNode = node => (
  <TreeNode
    key={node.id}
    label={
      <Box
        sx={{
          border: '1px solid #1976d2',
          borderRadius: '8px',
          px: 2,
          py: 1,
          backgroundColor: '#fff',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
          fontSize: '14px',
          display: 'inline-block'
        }}
      >
        {node.name}
      </Box>
    }
  >
    {node.children && node.children.map(child => renderOrgChartNode(child))}
  </TreeNode>
)

interface RoleSpecification {
  roleTitle: string
  employeeInterviewed: string
  reportsTo: string
  companyName: string
  functionOrDepartment: string
  writtenBy: string
  approvedByJobholder: string
  approvedBySuperior: string
  dateWritten: string
}

interface KeyResponsibility {
  title: string
  description: string
}

interface KeyInteraction {
  internalStakeholders: string
  externalStakeholders: string
}

interface KeyRoleDimension {
  portfolioSize: string
  geographicalCoverage: string
  teamSize: string
  totalTeamSize: string
}

interface SkillAndAttribute {
  factor: string
  competency: { value: string }[]
  definition: { value: string }[]
  behavioural_attributes: { value: string }[]
}

interface EducationAndExperience {
  minimumQualification: string
  experienceDescription: string
}

interface JobDescription {
  roleSpecification: RoleSpecification[]
  roleSummary: string
  keyResponsibilities: KeyResponsibility[]
  keyChallenges: string
  keyDecisions: string
  keyInteractions: KeyInteraction[]
  keyRoleDimensions: KeyRoleDimension[]
  skillsAndAttributesType: string
  skillsAndAttributesDetails: SkillAndAttribute[]
  educationAndExperience: EducationAndExperience[]
  organizationChart: OrganizationChart
}

const initialFormData: JobDescription = {
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
  skillsAndAttributesType: '',
  skillsAndAttributesDetails: [
    {
      factor: '',
      competency: [{ value: '' }],
      definition: [{ value: '' }],
      behavioural_attributes: [{ value: '' }]
    }
  ],
  educationAndExperience: [{ minimumQualification: '', experienceDescription: '' }],
  organizationChart: { id: '', name: '', parentId: '', children: [] }
}

export default function CreateJDForm() {
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState<JobDescription>(initialFormData)
  const [showOrgChart, setShowOrgChart] = useState(false)
  const [savedOrgChart, setSavedOrgChart] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [limit] = useState(10) // Define limit for pagination
  const [page] = useState(1)

  const {
    jobRoleData,
    designationData,
    departmentData,
    isAddJdLoading,
    addJdSuccess,
    addJdFailure,
    addJdFailureMessage
  } = useAppSelector(state => state.jdManagementReducer)

  console.log('Job Role Data:', jobRoleData)
  console.log('Designation Data:', designationData)
  console.log('Department Data:', departmentData)

  const steps = [
    'Organization Chart',
    'Role Specification',
    'Role Summary',
    'Key Responsibilities',
    'Key Challenges',
    'Key Decisions Taken',
    'Key Interactions',
    'Key Role Dimensions',
    'Key Skills and Behavioural Attributes',
    'Educational and Experience Requirements'
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    section: keyof JobDescription,
    index?: number,
    subField?: string,
    subArray?: string,
    subArrayIndex?: number
  ) => {
    setFormData(prev => {
      const newData = { ...prev }

      const value = typeof e === 'string' ? e : e.target.value

      if (index !== undefined && subField) {
        if (subArray && subArrayIndex !== undefined) {
          ;(newData[section] as any)[index][subArray][subArrayIndex].value = value
        } else {
          ;(newData[section] as any)[index][subField] = value
        }
      } else {
        ;(newData[section] as any) = value
      }

      updateActiveStep(newData)

      return newData
    })
  }

  const handleAddItem = (section: keyof JobDescription) => {
    setFormData(prev => {
      const newData = { ...prev }

      if (section === 'keyResponsibilities') {
        newData.keyResponsibilities.push({ title: '', description: '' })
      } else if (section === 'skillsAndAttributesDetails') {
        newData.skillsAndAttributesDetails.push({
          factor: '',
          competency: [{ value: '' }],
          definition: [{ value: '' }],
          behavioural_attributes: [{ value: '' }]
        })
      } else if (section === 'educationAndExperience') {
        newData.educationAndExperience.push({ minimumQualification: '', experienceDescription: '' })
      }

      updateActiveStep(newData)

      return newData
    })
  }

  const handleAddSubItem = (section: keyof JobDescription, index: number, subArray: string) => {
    setFormData(prev => {
      const newData = { ...prev }

      if (section === 'skillsAndAttributesDetails' && subArray === 'competency') {
        ;(newData[section] as any)[index]['competency'].push({ value: '' }, { value: '' })
        ;(newData[section] as any)[index]['definition'].push({ value: '' }, { value: '' })
        ;(newData[section] as any)[index]['behavioural_attributes'].push({ value: '' }, { value: '' })
      }

      updateActiveStep(newData)

      return newData
    })
  }

  interface FetchParams {
    limit: number
    page: number
  }

  useEffect(() => {
    const params: FetchParams = {
      limit,
      page
    }

    // Dispatch fetchJobRole action to get job roles
    dispatch(fetchDesignation(params))
    dispatch(fetchJobRole(params))

    dispatch(fetchDepartment(params))
  }, [dispatch, limit, page])

  const handleOrgChartSave = (chartData: { nodes: Node[]; edges: Edge[] }) => {
    setSavedOrgChart(chartData)
    setShowOrgChart(false)

    // Transform flat nodes and edges into hierarchical structure
    const nodeMap = new Map()

    chartData.nodes.forEach(node => {
      nodeMap.set(node.id, { id: node.id, name: node.data.label, children: [], parentId: null })
    })

    chartData.edges.forEach(edge => {
      const child = nodeMap.get(edge.target)

      if (child) {
        child.parentId = edge.source
        const parent = nodeMap.get(edge.source)

        if (parent) {
          parent.children.push(child)
        }
      }
    })

    // Find root nodes (nodes with no parent)
    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parentId)
    const organizationChart = rootNodes.length === 1 ? rootNodes[0] : { id: 'root', name: 'Root', children: rootNodes }

    // Update formData with the new organizationChart structure
    setFormData(prev => ({
      ...prev,
      organizationChart
    }))
    updateActiveStep({ ...formData, organizationChart })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Dispatch the addNewJd action with the form data
      const result = await dispatch(addNewJd(formData)).unwrap()

      console.log('Job Description Created:', result)

      // Optionally reset the form on success
      setFormData(initialFormData)
      setSavedOrgChart(null)
      setActiveStep(0)
    } catch (error) {
      console.error('Failed to create job description:', error)
    }

    console.log('Form Data Submitted:', { ...formData, organizationChart: formData.organizationChart })
  }

  const updateActiveStep = (data: JobDescription) => {
    let completedSteps = 0

    // Step 1: Organization Chart is complete if savedOrgChart exists
    if (savedOrgChart) {
      completedSteps = 1
    }

    // Step 2: Role Specification is complete if all required fields are filled
    if (
      completedSteps >= 1 &&
      data.roleSpecification[0].roleTitle &&
      data.roleSpecification[0].reportsTo &&
      data.roleSpecification[0].companyName &&
      data.roleSpecification[0].functionOrDepartment &&
      data.roleSpecification[0].writtenBy &&
      data.roleSpecification[0].approvedByJobholder &&
      data.roleSpecification[0].approvedBySuperior &&
      data.roleSpecification[0].dateWritten
    ) {
      completedSteps = 2
    }

    // Step 3: Role Summary is complete if it has content
    if (completedSteps >= 2 && data.roleSummary) {
      completedSteps = 3
    }

    // Step 4: Key Responsibilities is complete if at least one has title and description
    if (completedSteps >= 3 && data.keyResponsibilities.some(r => r.title && r.description)) {
      completedSteps = 4
    }

    // Step 5: Key Challenges is complete if it has content
    if (completedSteps >= 4 && data.keyChallenges) {
      completedSteps = 5
    }

    // Step 6: Key Decisions is complete if it has content
    if (completedSteps >= 5 && data.keyDecisions) {
      completedSteps = 6
    }

    // Step 7: Key Interactions is complete if at least one has both stakeholders
    if (completedSteps >= 6 && data.keyInteractions.some(i => i.internalStakeholders && i.externalStakeholders)) {
      completedSteps = 7
    }

    // Step 8: Key Role Dimensions is complete if all fields are filled
    if (
      completedSteps >= 7 &&
      data.keyRoleDimensions[0].portfolioSize &&
      data.keyRoleDimensions[0].geographicalCoverage &&
      data.keyRoleDimensions[0].teamSize &&
      data.keyRoleDimensions[0].totalTeamSize
    ) {
      completedSteps = 8
    }

    // Step 9: Skills and Attributes is complete if type and at least one detail is filled
    if (
      completedSteps >= 8 &&
      data.skillsAndAttributesType &&
      data.skillsAndAttributesDetails.some(
        s =>
          s.factor &&
          s.competency.some(c => c.value) &&
          s.definition.some(d => d.value) &&
          s.behavioural_attributes.some(b => b.value)
      )
    ) {
      completedSteps = 9
    }

    // Step 10: Education and Experience is complete if at least one has both fields
    if (
      completedSteps >= 9 &&
      data.educationAndExperience.some(e => e.minimumQualification && e.experienceDescription)
    ) {
      completedSteps = 10
    }

    setActiveStep(completedSteps)
  }

  // Helper function to count nodes
  const countNodes = chart => {
    let count = 1

    if (chart.children) {
      chart.children.forEach(child => {
        count += countNodes(child)
      })
    }

    return count
  }



 
  const handleDeleteItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const handleDeleteSubItem = (section, parentIndex, subIndex) => {
    setFormData(prev => {
      const updated = { ...prev }

      // Make a shallow copy of the parent array
      const parentArray = [...updated[section]]

      // Figure out which sub-field we’re deleting from
      // In your structure, the competencies are in `competency`, `definition`, `behavioural_attributes`
      const subFields = ['competency', 'definition', 'behavioural_attributes']

      subFields.forEach(subField => {
        if (parentArray[parentIndex][subField]) {
          parentArray[parentIndex][subField] = parentArray[parentIndex][subField].filter((_, idx) => idx !== subIndex)
        }
      })

      updated[section] = parentArray

      return updated
    })
  }

  return (
    <>
      <Card sx={{ mb: 4, pt: 3, pb: 3, position: 'sticky', top: 70, zIndex: 10, backgroundColor: 'white' }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
          {steps.map((label, index) => (
            <Step key={label} index={index}>
              <StepLabel sx={{ cursor: 'pointer' }}>
                <span>{label}</span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>
      <Card>
        <div className='p-6'>
          <h1 className='text-2xl font-bold mb-6'>Add Job Description</h1>
          {isAddJdLoading && (
            <Alert severity='info' className='mb-4'>
              Submitting job description...
            </Alert>
          )}
          {addJdSuccess && (
            <Alert severity='success' className='mb-4'>
              Job description created successfully!
            </Alert>
          )}
          {addJdFailure && (
            <Alert severity='error' className='mb-4'>
              {Array.isArray(addJdFailureMessage)
                ? addJdFailureMessage.join(', ')
                : addJdFailureMessage || 'Failed to create job description'}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className='space-y-6 mt-6'>
            {/* Organization Chart */}
            {/* Organization Chart */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Organization Chart</h2>
              <div className='flex justify-between items-center mb-4'>
                <Typography variant='h6'>Organization Chart</Typography>
                <Button
                  type='button'
                  onClick={() => setShowOrgChart(true)}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  {savedOrgChart ? 'Edit Organization Chart' : 'Create Organization Chart'}
                </Button>
              </div>

              {savedOrgChart && (
                <div className='p-4 border border-gray-200 rounded-lg'>
                  <div className='flex justify-between items-center'>
                    <Typography>Nodes: {countNodes(formData.organizationChart)}</Typography>
                    <Button
                      type='button'
                      variant='outlined'
                      onClick={() => setIsChartVisible(prev => !prev)}
                      className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
                    >
                      {isChartVisible ? 'Hide Chart' : 'Show Chart'}
                    </Button>
                  </div>

                  {isChartVisible && formData.organizationChart && formData.organizationChart.name && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-auto p-4'>
                      <Tree
                        lineWidth={'2px'}
                        lineColor={'#1976d2'}
                        lineBorderRadius={'8px'}
                        label={
                          <Box
                            sx={{
                              border: '1px solid #1976d2',
                              borderRadius: '8px',
                              px: 2,
                              py: 1,
                              backgroundColor: '#fff',
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                              fontSize: '14px',
                              display: 'inline-block'
                            }}
                          >
                            {formData.organizationChart.name}
                          </Box>
                        }
                      >
                        {formData.organizationChart.children?.map(child => renderOrgChartNode(child))}
                      </Tree>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role Specification */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Role Specification</h2>
              <div className='grid grid-cols-2 gap-4'>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='roleTitle' className='block text-sm font-medium text-gray-700'>
                    Role Title *
                  </label>
                  <Autocomplete
                    options={jobRoleData.map(jobRole => jobRole.name || '')}
                    value={formData.roleSpecification[0].roleTitle || ''}
                    onChange={(event, newValue) =>
                      handleInputChange({ target: { value: newValue || '' } }, 'roleSpecification', 0, 'roleTitle')
                    }
                    renderInput={params => <TextField {...params} placeholder='Select Role Title' />}
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth margin='normal'>
                  <label htmlFor='employeeInterviewed' className='block text-sm font-medium text-gray-700'>
                    Employee Interviewed *
                  </label>
                  <DynamicTextField
                    placeholder='Employee Interviewed'
                    value={formData.roleSpecification[0].employeeInterviewed}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'employeeInterviewed')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label className='block text-sm font-medium text-gray-700'>Reporting To *</label>
                  <Autocomplete
                    options={designationData?.map(designation => designation.name || '')}
                    value={formData.roleSpecification[0].reportsTo || ''}
                    onChange={(event, newValue) =>
                      handleInputChange({ target: { value: newValue || '' } }, 'roleSpecification', 0, 'reportsTo')
                    }
                    renderInput={params => <TextField {...params} placeholder='Select Reports To' />}
                    fullWidth
                    freeSolo // allow custom text entry too (optional)
                    disableClearable={false} // allows clearing if needed
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <DynamicSelect
                    value={formData.roleSpecification[0].companyName}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'companyName')}
                  >
                    <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                    <MenuItem value='muthoot_finance'>Muthoot Finance</MenuItem>
                  </DynamicSelect>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='employeeInterviewed' className='block text-sm font-medium text-gray-700'>
                    Employee Interviewed *
                  </label>
                  <Autocomplete
                    options={departmentData?.map(department => department.name || '')}
                    value={formData.roleSpecification[0].functionOrDepartment || ''}
                    onChange={(event, newValue) =>
                      handleInputChange(
                        { target: { value: newValue || '' } },
                        'roleSpecification',
                        0,
                        'functionOrDepartment'
                      )
                    }
                    renderInput={params => <TextField {...params} placeholder='Select Function or Department' />}
                    fullWidth
                    freeSolo // allows typing custom department
                  />
                </FormControl>

                <FormControl fullWidth margin='normal'>
                  <label htmlFor='writtenBy' className='block text-sm font-medium text-gray-700'>
                    Written By *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Written By'
                    value={formData.roleSpecification[0].writtenBy}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'writtenBy')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='approvedByJobholder' className='block text-sm font-medium text-gray-700'>
                    Approved By (Jobholder) *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Approved By Jobholder'
                    value={formData.roleSpecification[0].approvedByJobholder}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'approvedByJobholder')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='approvedBySuperior' className='block text-sm font-medium text-gray-700'>
                    Approved By (Immediate Superior) *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Approved By Superior'
                    value={formData.roleSpecification[0].approvedBySuperior}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'approvedBySuperior')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='dateWritten' className='block text-sm font-medium text-gray-700'>
                    Date (Written On) *
                  </label>
                  <DynamicTextField
                    type='date'
                    placeholder='Date Written'
                    value={formData.roleSpecification[0].dateWritten}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'dateWritten')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
              </div>
            </div>

            {/* Role Summary */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Role Summary</h2>

              <FormControl fullWidth>
                <TextField
                  label='Role Summary'
                  multiline
                  minRows={6}
                  value={formData.roleSummary}
                  onChange={e => handleInputChange(e.target.value, 'roleSummary')}
                  variant='outlined'
                />
              </FormControl>
            </div>

            {/* Key Responsibilities */}

            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Responsibilities</h2>

              {formData.keyResponsibilities.map((item, index) => (
                <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className='text-base font-medium'>{item.title || `Responsibility ${index + 1}`}</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700'>Title *</label>
                      <DynamicTextField
                        type='text'
                        placeholder='Title'
                        value={item.title}
                        onChange={e => handleInputChange(e, 'keyResponsibilities', index, 'title')}
                        className='border p-2 rounded w-full mb-2'
                      />
                    </FormControl>

                    <FormControl fullWidth>
                      <label className='block text-sm font-medium text-gray-700'>Description *</label>
                      <ReactQuill
                        id={`keyResponsibilities[${index}].description`}
                        style={{ height: '40vh', paddingBottom: 50 }}
                        value={item.description}
                        onChange={value =>
                          handleInputChange({ target: { value } }, 'keyResponsibilities', index, 'description')
                        }
                        modules={{
                          toolbar: {
                            container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                          }
                        }}
                      />
                    </FormControl>

                    <Button
                      type='button'
                      onClick={() => handleDeleteItem('keyResponsibilities', index)}
                      className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                    >
                      Delete
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button
                type='button'
                onClick={() => handleAddItem('keyResponsibilities')}
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Add Responsibility
              </Button>
            </div>

            {/* Key Challenges */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Challenges</h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyChallenges'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.keyChallenges}
                    onChange={e => handleInputChange(e, 'keyChallenges')}
                    modules={{
                      toolbar: {
                        container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>

            {/* Key Decisions Taken */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Decisions Taken </h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyDecisions'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.keyDecisions}
                    onChange={e => handleInputChange(e, 'keyDecisions')}
                    modules={{
                      toolbar: {
                        container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>

            {/* Key Interactions */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Interactions</h2>
              <fieldset className='border border-gray-300 rounded p-8 mt-2 mb-6'>
                {formData.keyInteractions.map((item, index) => (
                  <div key={index} className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`keyInteractions[${index}].internalStakeholders`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Internal Stakeholders *
                      </label>
                      <ReactQuill
                        id={`keyInteractions[${index}].internalStakeholders`}
                        style={{ height: '40vh', marginBottom: '1rem' }}
                        value={item.internalStakeholders}
                        onChange={value =>
                          handleInputChange({ target: { value } }, 'keyInteractions', index, 'internalStakeholders')
                        }
                        modules={{
                          toolbar: {
                            container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl fullWidth margin='normal'>
                      <label
                        htmlFor={`keyInteractions[${index}].externalStakeholders`}
                        className='block text-sm font-medium text-gray-700'
                      >
                        External Stakeholders *
                      </label>
                      <ReactQuill
                        id={`keyInteractions[${index}].externalStakeholders`}
                        style={{ height: '40vh', marginBottom: '1rem' }}
                        value={item.externalStakeholders}
                        onChange={value =>
                          handleInputChange({ target: { value } }, 'keyInteractions', index, 'externalStakeholders')
                        }
                        modules={{
                          toolbar: {
                            container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                ))}
              </fieldset>
            </div>

            {/* Key Role Dimensions */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Role Dimensions</h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='portfolioSize' className='block text-sm font-medium text-gray-700'>
                        Portfolio Size *
                      </label>
                      <DynamicTextField
                        type='text'
                        value={formData.keyRoleDimensions[0].portfolioSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'portfolioSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='geographicalCoverage' className='block text-sm font-medium text-gray-700'>
                        Geographical Coverage *
                      </label>
                      <DynamicTextField
                        value={formData.keyRoleDimensions[0].geographicalCoverage}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'geographicalCoverage')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label className='block text-sm font-medium text-gray-700'>Team Size *</label>
                      <DynamicTextField
                        value={formData.keyRoleDimensions[0].teamSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'teamSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label className='block text-sm font-medium text-gray-700'>Total Team Size *</label>
                      <DynamicTextField
                        value={formData.keyRoleDimensions[0].totalTeamSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'totalTeamSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                  </div>
                </>
              </fieldset>
            </div>

            {/* Skills and Attributes */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Skills and Behavioural Attributes</h2>

              <FormControl fullWidth margin='normal'>
                <label htmlFor='skillsAndAttributesType' className='block text-sm font-medium text-gray-700'>
                  Skills and Attributes Type *
                </label>
                <DynamicTextField
                  type='text'
                  placeholder='Skills and Attributes Type'
                  value={formData.skillsAndAttributesType}
                  onChange={e => handleInputChange(e, 'skillsAndAttributesType')}
                  className='border p-2 rounded w-full mb-2'
                />
              </FormControl>

              {formData.skillsAndAttributesDetails.map((item, index) => (
                <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className='text-base font-medium'>Factor #{index + 1}</span>
                  </AccordionSummary>

                  <AccordionDetails>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor={`factor-${index}`} className='block text-sm font-medium text-gray-700'>
                        Factor *
                      </label>
                      <DynamicTextField
                        type='text'
                        placeholder='Factor'
                        value={item.factor}
                        onChange={e => handleInputChange(e, 'skillsAndAttributesDetails', index, 'factor')}
                        className='border p-2 rounded w-full mb-2'
                      />
                    </FormControl>

                    <h3 className='text-sm font-medium mb-2'>Competency, Definition, and Behavioural Attributes</h3>

                    {item.competency.map((comp, compIndex) => (
                      <Accordion key={compIndex} defaultExpanded sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <span className='text-sm font-medium'>Competency #{compIndex + 1}</span>
                        </AccordionSummary>

                        <AccordionDetails>
                          <FormControl fullWidth margin='normal'>
                            <label
                              htmlFor={`competency-${index}-${compIndex}`}
                              className='block text-sm font-medium text-gray-700'
                            >
                              Competency *
                            </label>
                            <DynamicTextField
                              type='text'
                              placeholder='Competency'
                              value={comp.value}
                              onChange={e =>
                                handleInputChange(
                                  e,
                                  'skillsAndAttributesDetails',
                                  index,
                                  'competency',
                                  'competency',
                                  compIndex
                                )
                              }
                              className='border p-2 rounded w-full mb-2'
                            />
                          </FormControl>

                          <FormControl fullWidth margin='normal'>
                            <label
                              htmlFor={`definition-${index}-${compIndex}`}
                              className='block text-sm font-medium text-gray-700'
                            >
                              Definition *
                            </label>
                            <DynamicTextField
                              type='text'
                              placeholder='Definition'
                              value={item.definition[compIndex]?.value || ''}
                              onChange={e =>
                                handleInputChange(
                                  e,
                                  'skillsAndAttributesDetails',
                                  index,
                                  'definition',
                                  'definition',
                                  compIndex
                                )
                              }
                              className='border p-2 rounded w-full mb-2'
                            />
                          </FormControl>

                          <FormControl fullWidth margin='normal'>
                            <label
                              htmlFor={`behavioural_attributes-${index}-${compIndex}`}
                              className='block text-sm font-medium text-gray-700'
                            >
                              Behavioural Attribute *
                            </label>
                            <DynamicTextField
                              type='text'
                              placeholder='Behavioural Attribute'
                              value={item.behavioural_attributes[compIndex]?.value || ''}
                              onChange={e =>
                                handleInputChange(
                                  e,
                                  'skillsAndAttributesDetails',
                                  index,
                                  'behavioural_attributes',
                                  'behavioural_attributes',
                                  compIndex
                                )
                              }
                              className='border p-2 rounded w-full mb-2'
                            />
                          </FormControl>

                          <Button
                            type='button'
                            onClick={() => handleDeleteSubItem('skillsAndAttributesDetails', index, compIndex)}
                            className='mt-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700'
                          >
                            Delete Competency
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    ))}

                    <Button
                      type='button'
                      onClick={() => handleAddSubItem('skillsAndAttributesDetails', index, 'competency')}
                      className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    >
                      Add Competency
                    </Button>

                    <Button
                      type='button'
                      onClick={() => handleDeleteItem('skillsAndAttributesDetails', index)}
                      className='ml-4 mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                    >
                      Delete Factor
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button
                type='button'
                onClick={() => handleAddItem('skillsAndAttributesDetails')}
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Add Skill/Attribute
              </Button>
            </div>

            {/* Education and Experience */}
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Educational and Experience Requirements</h2>
              {formData.educationAndExperience.map((item, index) => (
                <div key={index} className='mb-2'>
                  <FormControl fullWidth margin='normal'>
                    <label
                      htmlFor={`minimumQualification-${index}`}
                      className='block text-sm font-medium text-gray-700'
                    >
                      Minimum Qualification *
                    </label>
                    <DynamicTextField
                      type='text'
                      placeholder='Minimum Qualification'
                      value={item.minimumQualification}
                      onChange={e => handleInputChange(e, 'educationAndExperience', index, 'minimumQualification')}
                      className='border p-2 rounded w-full mb-2'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label
                      htmlFor={`experienceDescription-${index}`}
                      className='block text-sm font-medium text-gray-700'
                    >
                      Experience Description *
                    </label>
                    <ReactQuill
                      id={`experienceDescription-${index}`}
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={item.experienceDescription}
                      onChange={e => handleInputChange(e, 'educationAndExperience', index, 'experienceDescription')}
                      modules={{
                        toolbar: {
                          container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                        }
                      }}
                      placeholder='Experience Description'
                    />
                  </FormControl>
                </div>
              ))}
              <Button
                type='button'
                onClick={() => handleAddItem('educationAndExperience')}
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Add Education/Experience
              </Button>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <Button sx={{ border: '1px solid #1976d2', color: '#1976d2' }}
                type='submit'
                disabled={isAddJdLoading || activeStep < steps.length} // Disable if loading or form incomplete
                className={`px-4 py-2 rounded transition
    ${
      isAddJdLoading || activeStep < steps.length
        ? 'border border-gray-400 text-gray-400 cursor-not-allowed'
        : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
    }`}
              >
                {isAddJdLoading ? 'Submitting...' : 'Add JD'}
              </Button>
            </div>
          </form>

          {/* Organization Chart Modal */}
          {showOrgChart && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <div className='bg-white p-4 rounded w-full h-full'>
                {/* <Button
                    onClick={() => setShowOrgChart(false)}
                    className='mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                  >
                    Close
                  </Button> */}
                <OrgChartCanvas onSave={handleOrgChartSave} initialChart={savedOrgChart} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
