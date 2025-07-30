'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import ReactQuill from 'react-quill'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Autocomplete
} from '@mui/material'
import { Tree, TreeNode } from 'react-organizational-chart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'

import OrgChartCanvas from './addOrganizationChart'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchSkills, fetchDesignation, addNewJd } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

// Interfaces remain the same
interface NodeData {
  id: string
  name: string
  parentId: string | null
  children: NodeData[]
  isJobRole?: boolean
}

interface RoleSpecification {
  jobRole: string
  jobRoleType: string
  jobType: string
  companyName: string
  noticePeriod?: number
  salaryRange?: string
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

interface ExperienceDescription {
  min: string
  max: string
}

interface EducationAndExperience {
  ageLimit: number
  minimumQualification: string
  experienceDescription: ExperienceDescription
}

interface InterviewLevel {
  level: string
  designation: string
}

interface InterviewLevels {
  numberOfLevels: string
  levels: InterviewLevel[]
}

interface OrganizationChart {
  id: string
  name: string
  parentId: string | null
  children: NodeData[]
  isJobRole?: boolean
}

interface Skill {
  name: string
}

interface JobDescription {
  roleSpecification: RoleSpecification
  jdType: string
  roleSummary: string
  keyResponsibilities: KeyResponsibility[]
  keyChallenges: string
  keyDecisions: string
  keyInteractions: KeyInteraction[]
  keyRoleDimensions: KeyRoleDimension[]
  skills: string[]
  educationAndExperience: EducationAndExperience[]
  organizationChart: OrganizationChart
  interviewLevels: InterviewLevels
}

const initialFormData: JobDescription = {
  roleSpecification: {
    jobRole: '',
    jobRoleType: '',
    jobType: '',
    companyName: '',
    noticePeriod: undefined, // Changed to undefined to align with optional type
    salaryRange: ''
  },
  jdType: '',
  roleSummary: '',
  keyResponsibilities: [{ title: '', description: '' }],
  keyChallenges: '',
  keyDecisions: '',
  keyInteractions: [{ internalStakeholders: '', externalStakeholders: '' }],
  keyRoleDimensions: [{ portfolioSize: '', geographicalCoverage: '', teamSize: '', totalTeamSize: '' }],
  skills: [],
  educationAndExperience: [{ ageLimit: 0, minimumQualification: '', experienceDescription: { min: '', max: '' } }],
  organizationChart: { id: 'root', name: '', parentId: null, children: [], isJobRole: true },
  interviewLevels: { numberOfLevels: '', levels: [] }
}

// Function to strip isJobRole and ensure id/parentId are strings
const stripIsJobRole = (node: NodeData): Omit<NodeData, 'isJobRole'> => ({
  id: String(node.id),
  name: node.name,
  parentId: node.parentId !== null ? String(node.parentId) : null,
  children: node.children.map(stripIsJobRole)
})

const renderOrgChart = (node: OrganizationChart) => (
  <TreeNode
    key={node.id}
    label={
      <Box
        sx={{
          border: node.isJobRole ? '2px solid #1976d2' : '1px solid #1976d2',
          borderRadius: '8px',
          px: 2,
          py: 1,
          backgroundColor: '#fff',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
          fontSize: '14px',
          display: 'inline-block'
        }}
      >
        {node.name || 'Untitled Role'}
      </Box>
    }
  >
    {node.children?.map(child => renderOrgChart(child))}
  </TreeNode>
)

// Function to update the job role node in a node tree
const updateJobRoleNode = (nodes: NodeData[], newJobRole: string): NodeData[] => {
  return nodes.map(node => {
    if (node.isJobRole) {
      return { ...node, name: newJobRole }
    }

    return { ...node, children: updateJobRoleNode(node.children, newJobRole) }
  })
}

export default function CreateJDForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [formData, setFormData] = useState<JobDescription>(initialFormData)
  const [isShowOrgChart, setIsShowOrgChart] = useState(false)
  const [savedOrgChart, setSavedOrgChart] = useState<{ nodes: NodeData[] } | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [limit] = useState(10)
  const [page] = useState(1)

  const { skillsData, designationData, isAddJdLoading, addJdSuccess, addJdFailure, addJdFailureMessage } =
    useAppSelector(state => state.jdManagementReducer)

  const steps = [
    'Role Specification',
    'Organization Chart',
    'JD Type',
    'Role Summary',
    'Responsibilities',
    'Challenges',
    'Decisions Taken',
    'Interactions',
    'Role Dimensions',
    'Skills',
    'Educational & Experience',
    'Interview Levels'
  ]

  const findNode = (nodes: NodeData[], id: string): NodeData | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = findNode(node.children, id)

      if (found) return found
    }

    return undefined
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | any,
    section: keyof JobDescription,
    index?: number,
    subField?: string
  ) => {
    setFormData(prev => {
      const newData = { ...prev }
      let value: any

      if (typeof e === 'string') {
        value = e
      } else if (e && 'target' in e) {
        value = e.target.value
      } else {
        value = e
      }

      // Ensure noticePeriod is an integer
      if (section === 'roleSpecification' && subField === 'noticePeriod') {
        value = value ? parseInt(value, 10) : undefined
        if (isNaN(value)) value = undefined
      }

      if (section === 'interviewLevels' && subField === 'numberOfLevels') {
        const numLevels = parseInt(value, 10) || 0

        newData.interviewLevels.numberOfLevels = value
        newData.interviewLevels.levels = Array.from({ length: numLevels }, (_, i) => ({
          level: (i + 1).toString(),
          designation: newData.interviewLevels.levels[i]?.designation || ''
        }))
      } else if (section === 'interviewLevels' && index !== undefined && subField === 'designation') {
        newData.interviewLevels.levels[index].designation = value
      } else if (section === 'skills' && Array.isArray(value)) {
        newData.skills = value
      } else if (
        section === 'educationAndExperience' &&
        index !== undefined &&
        subField?.includes('experienceDescription')
      ) {
        const [, field] = subField.split('.')

        ;(newData.educationAndExperience[index].experienceDescription as any)[field] = value
      } else if (section === 'roleSpecification' && subField) {
        ;(newData.roleSpecification as any)[subField] = value

        if (subField === 'jobRole') {
          if (savedOrgChart) {
            const updatedNodes = updateJobRoleNode(savedOrgChart.nodes, value || '')

            setSavedOrgChart({ nodes: updatedNodes })
            const updatedOrgChart = updateJobRoleNode([newData.organizationChart], value || '')[0]

            newData.organizationChart = updatedOrgChart
          } else {
            newData.organizationChart = {
              ...newData.organizationChart,
              name: value || '',
              isJobRole: true
            }
            setSavedOrgChart({
              nodes: [{ id: 'root', name: value || '', parentId: null, children: [], isJobRole: true }]
            })
          }
        }
      } else if (index !== undefined && subField) {
        ;(newData[section] as any)[index][subField] = value
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
      }

      updateActiveStep(newData)

      return newData
    })
  }

  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
    dispatch(fetchSkills(params))
  }, [dispatch, limit, page])

  const cancelOrgChart = () => {
    setIsShowOrgChart(false)
  }

  const handleOrgChartSave = (chartData: { nodes: NodeData[] }) => {
    if (!chartData.nodes.length) {
      alert('Cannot save: No nodes provided')

      return
    }

    const topNode = chartData.nodes.find(node => !node.parentId)

    if (!topNode) {
      alert('Cannot save: Topmost node not found')

      return
    }

    const jobRoleNode = findNode(chartData.nodes, chartData.nodes.find(n => n.isJobRole)?.id || 'root')

    if (!jobRoleNode) {
      alert('Cannot save: Job role node not found')

      return
    }

    const updatedNodes = chartData.nodes.map(node =>
      node.id === jobRoleNode.id
        ? { ...node, name: formData.roleSpecification.jobRole || node.name || 'Untitled Role' }
        : node
    )

    const organizationChart: OrganizationChart = {
      id: String(topNode.id),
      name: topNode.name || 'Untitled Role',
      parentId: null,
      children: topNode.children,
      isJobRole: topNode.isJobRole || false
    }

    setSavedOrgChart({ nodes: updatedNodes })
    setFormData(prev => ({
      ...prev,
      organizationChart
    }))
    updateActiveStep({ ...formData, organizationChart })
    setIsShowOrgChart(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updateNodeName = (node: NodeData): NodeData => {
        if (node.isJobRole) {
          return { ...node, name: formData.roleSpecification.jobRole || node.name || 'Untitled Role' }
        }

        return {
          ...node,
          children: node.children.map(updateNodeName)
        }
      }

      const updatedOrgChart = {
        ...formData.organizationChart,
        children: formData.organizationChart.children.map(updateNodeName)
      }

      const transformedOrgChart = stripIsJobRole(updatedOrgChart)

      const transformedFormData = {
        ...formData,
        skills: formData.skills,
        organizationChart: transformedOrgChart
      }

      await dispatch(addNewJd(transformedFormData)).unwrap()

      setFormData(initialFormData)
      setSavedOrgChart(null)
      setActiveStep(0)
      router.back()
    } catch (error) {
      console.error('Failed to create job description:', error)
      alert('Failed to create job description: ' + (error.message || addJdFailureMessage || 'Unknown error'))
    }
  }

  const updateActiveStep = (data: JobDescription) => {
    let completedSteps = 0

    if (
      data.roleSpecification.jobRole &&
      data.roleSpecification.jobRoleType &&
      data.roleSpecification.jobType &&
      data.roleSpecification.companyName &&
      data.roleSpecification.noticePeriod !== undefined &&
      data.roleSpecification.salaryRange
    ) {
      completedSteps = 1
    }

    if (completedSteps >= 1 && savedOrgChart) {
      completedSteps = 2
    }

    if (completedSteps >= 2 && data.jdType) {
      completedSteps = 3
    }

    if (completedSteps >= 3 && data.roleSummary) {
      completedSteps = 4
    }

    if (completedSteps >= 4 && data.keyResponsibilities.some(r => r.title && r.description)) {
      completedSteps = 5
    }

    if (completedSteps >= 5 && data.keyChallenges) {
      completedSteps = 6
    }

    if (completedSteps >= 6 && data.keyDecisions) {
      completedSteps = 7
    }

    if (completedSteps >= 7 && data.keyInteractions.some(i => i.internalStakeholders && i.externalStakeholders)) {
      completedSteps = 8
    }

    if (
      completedSteps >= 8 &&
      data.keyRoleDimensions[0].portfolioSize &&
      data.keyRoleDimensions[0].geographicalCoverage &&
      data.keyRoleDimensions[0].teamSize &&
      data.keyRoleDimensions[0].totalTeamSize
    ) {
      completedSteps = 9
    }

    if (completedSteps >= 9 && data.skills.length > 0) {
      completedSteps = 10
    }

    if (
      completedSteps >= 10 &&
      data.educationAndExperience.some(
        e => e.ageLimit && e.minimumQualification && e.experienceDescription.min && e.experienceDescription.max
      )
    ) {
      completedSteps = 11
    }

    if (
      completedSteps >= 11 &&
      data.interviewLevels.numberOfLevels &&
      parseInt(data.interviewLevels.numberOfLevels) > 0 &&
      data.interviewLevels.levels.every(l => l.designation)
    ) {
      completedSteps = 12
    }

    setActiveStep(completedSteps)
  }

  const countNodes = (chart: OrganizationChart): number => {
    let count = 1

    if (chart.children) {
      chart.children.forEach(child => {
        count += countNodes(child)
      })
    }

    return count
  }

  const handleDeleteItem = (section: keyof JobDescription, index: number) => {
    setFormData(prev => {
      const newData = { ...prev }

      if (section === 'keyResponsibilities' || section === 'keyInteractions' || section === 'educationAndExperience') {
        newData[section] = (newData[section] as any).filter((_: any, i: number) => i !== index)
      } else if (section === 'interviewLevels') {
        newData.interviewLevels = {
          ...newData.interviewLevels,
          levels: newData.interviewLevels.levels
            .filter((_: any, i: number) => i !== index)
            .map((level: InterviewLevel, i: number) => ({
              ...level,
              level: String(i + 1)
            })),
          numberOfLevels: String(newData.interviewLevels.levels.length - 1)
        }
      }

      updateActiveStep(newData)

      return newData
    })
  }

  return (
    <>
      <Card sx={{ mb: 4, pt: 3, pb: 3, position: 'sticky', top: 70, zIndex: 10, backgroundColor: 'white' }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
          {steps.map(label => (
            <Step key={label}>
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
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Role Specification</h2>
              <div className='grid grid-cols-2 gap-4'>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='jobRole' className='block text-sm font-medium text-gray-700'>
                    Job Role *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Role Title'
                    value={formData.roleSpecification.jobRole || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'jobRole')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='jobRoleType' className='block text-sm font-medium text-gray-700'>
                    Job Role Type *
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.roleSpecification.jobRoleType}
                      onChange={e => handleInputChange(e.target.value, 'roleSpecification', 0, 'jobRoleType')}
                    >
                      <MenuItem value='branch'>BRANCH</MenuItem>
                      <MenuItem value='cluster'>CLUSTER</MenuItem>
                      <MenuItem value='area'>AREA</MenuItem>
                      <MenuItem value='region'>REGION</MenuItem>
                      <MenuItem value='zone'>ZONE</MenuItem>
                      <MenuItem value='territory'>TERRITORY</MenuItem>
                      <MenuItem value='corporate'>CORPORATE</MenuItem>
                    </DynamicSelect>
                  </Box>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='jobType' className='block text-sm font-medium text-gray-700'>
                    Job Type *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Job Type'
                    value={formData.roleSpecification.jobType || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'jobType')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='noticePeriod' className='block text-sm font-medium text-gray-700'>
                    Notice Period (days) *
                  </label>
                  <DynamicTextField
                    type='number'
                    placeholder='Notice Period'
                    value={formData.roleSpecification.noticePeriod || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'noticePeriod')}
                    className='border p-2 rounded w-full mb-2'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='salaryRange' className='block text-sm font-medium text-gray-700'>
                    Salary Range *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Salary Range'
                    value={formData.roleSpecification.salaryRange || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'salaryRange')}
                    className='border p-2 rounded w-full mb-2'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.roleSpecification.companyName}
                      onChange={e => handleInputChange(e.target.value, 'roleSpecification', 0, 'companyName')}
                    >
                      <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                      <MenuItem value='muthoot_finance'>Muthoot Finance</MenuItem>
                    </DynamicSelect>
                  </Box>
                </FormControl>
              </div>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Organization Chart</h2>
              <div className='flex justify-between items-center mb-4'>
                <Typography variant='h6'>Organization Chart</Typography>
                <Button
                  type='button'
                  onClick={() => setIsShowOrgChart(true)}
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
                  {isChartVisible && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-auto p-4'>
                      <Tree
                        children
                        lineWidth={'2px'}
                        lineColor={'#1976d2'}
                        lineBorderRadius={'8px'}
                        label={<Box>{renderOrgChart(formData.organizationChart)}</Box>}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='border p-4 rounded'>
              <FormControl fullWidth margin='normal'>
                <label htmlFor='jdType' className='block text-sm font-medium text-gray-700'>
                  JD Type *
                </label>
                <Box className='p-3 rounded w-full mb-2'>
                  <DynamicSelect value={formData.jdType} onChange={e => handleInputChange(e.target.value, 'jdType')}>
                    <MenuItem value='lateral'>Lateral</MenuItem>
                    <MenuItem value='campus'>Campus</MenuItem>
                  </DynamicSelect>
                </Box>
              </FormControl>
            </div>
            {/* The rest of the form remains unchanged */}
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
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Responsibilities</h2>
              {formData.keyResponsibilities.map((item, index) => (
                <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box className='flex items-center justify-between w-full'>
                      <span className='text-base font-medium'>{item.title || `Responsibility ${index + 1}`}</span>
                      <Button
                        type='button'
                        onClick={() => handleDeleteItem('keyResponsibilities', index)}
                        className='ml-4 px-2 py-1 text-gray-500 rounded hover:bg-gray-300 hover:text-black flex items-center'
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
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
                        onChange={value => handleInputChange(value, 'keyResponsibilities', index, 'description')}
                        modules={{
                          toolbar: {
                            container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                          }
                        }}
                      />
                    </FormControl>
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
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Challenges</h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyChallenges'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.keyChallenges}
                    onChange={value => handleInputChange(value, 'keyChallenges')}
                    modules={{
                      toolbar: {
                        container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Decisions Taken</h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyDecisions'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.keyDecisions}
                    onChange={value => handleInputChange(value, 'keyDecisions')}
                    modules={{
                      toolbar: {
                        container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>
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
                        onChange={value => handleInputChange(value, 'keyInteractions', index, 'internalStakeholders')}
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
                        onChange={value => handleInputChange(value, 'keyInteractions', index, 'externalStakeholders')}
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
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Role Dimensions</h2>
              <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
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
              </fieldset>
            </div>
            <Card sx={{ p: 4, borderRadius: '14px', mb: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
                Skills
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Typography
                  component='label'
                  htmlFor='skills'
                  sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary', mb: 1 }}
                >
                  Select Skills *
                </Typography>
                <Autocomplete
                  multiple
                  options={skillsData || []}
                  getOptionLabel={(option: Skill) => option.name || ''}
                  value={(formData.skills || []).map(
                    skill => skillsData?.find(s => s.name === skill) || { id: '', name: skill }
                  )}
                  onChange={(event, newValue: Skill[]) => {
                    handleInputChange(
                      newValue.map(skill => skill.name),
                      'skills'
                    )
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={skillsData ? 'Choose skills...' : 'Loading skills...'}
                      variant='outlined'
                    />
                  )}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </FormControl>
            </Card>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Educational and Experience Requirements</h2>
              {formData.educationAndExperience.map((item, index) => (
                <div key={index} className='mb-2'>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='ageLimit' className='block text-sm font-medium text-gray-700'>
                      Age Limit *
                    </label>
                    <DynamicTextField
                      type='number'
                      placeholder='Age Limit'
                      value={item.ageLimit}
                      onChange={e => handleInputChange(e, 'educationAndExperience', 0, 'ageLimit')}
                      className='border p-2 rounded w-full mb-2'
                      InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                  </FormControl>
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
                    <label htmlFor={`min-${index}`} className='block text-sm font-medium text-gray-700'>
                      Min Experience *
                    </label>
                    <DynamicTextField
                      type='number'
                      placeholder='Min Experience'
                      value={item.experienceDescription.min}
                      onChange={e => handleInputChange(e, 'educationAndExperience', index, 'experienceDescription.min')}
                      className='border p-2 rounded w-full mb-2'
                      InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor={`max-${index}`} className='block text-sm font-medium text-gray-700'>
                      Max Experience *
                    </label>
                    <DynamicTextField
                      type='number'
                      placeholder='Max Experience'
                      value={item.experienceDescription.max}
                      onChange={e => handleInputChange(e, 'educationAndExperience', index, 'experienceDescription.max')}
                      className='border p-2 rounded w-full mb-2'
                      InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                  </FormControl>
                </div>
              ))}
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Interview Levels</h2>
              <FormControl fullWidth margin='normal'>
                <label htmlFor='numberOfLevels' className='block text-sm font-medium text-gray-700'>
                  Number of Interview Levels *
                </label>
                <DynamicTextField
                  type='number'
                  placeholder='Number of Levels'
                  value={formData.interviewLevels.numberOfLevels}
                  onChange={e => handleInputChange(e.target.value, 'interviewLevels', undefined, 'numberOfLevels')}
                  className='border p-2 rounded w-full mb-2'
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </FormControl>
              {formData.interviewLevels.levels.map((level, index) => (
                <FormControl fullWidth margin='normal' key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='body2' sx={{ minWidth: '50px' }}>
                      Level {level.level}:
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Autocomplete
                        options={designationData || []}
                        getOptionLabel={option => option.name || ''}
                        value={designationData?.find(d => d.name === level.designation) || null}
                        onChange={(event, newValue) =>
                          handleInputChange(newValue ? newValue.name : '', 'interviewLevels', index, 'designation')
                        }
                        sx={{ flexGrow: 1 }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={`Designation for Level ${level.level}`}
                            variant='outlined'
                            placeholder={designationData ? 'Select designation' : 'Loading designations...'}
                          />
                        )}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        type='button'
                        onClick={() => handleDeleteItem('interviewLevels', index)}
                        sx={{
                          minWidth: 0,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          color: '#555',
                          '&:hover': {
                            backgroundColor: '#d3d3d3',
                            color: '#000'
                          }
                        }}
                      >
                        <DeleteIcon fontSize='small' />
                      </Button>
                    </Box>
                  </Box>
                </FormControl>
              ))}
            </div>
            <div className='flex justify-end'>
              <Button
                sx={{ border: '1px solid #1976d2', color: '#1976d2' }}
                type='submit'
                disabled={isAddJdLoading || activeStep < steps.length}
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

            {isShowOrgChart && (
              <Grid container spacing={3} className=''>
                <Box className='fixed inset-0 bg-white z-20 ml-[243px] flex items-center justify-center'>
                  <Box className='w-full pt-[150px]'>
                    <OrgChartCanvas
                      onSave={handleOrgChartSave}
                      initialChart={
                        savedOrgChart
                          ? {
                              nodes: savedOrgChart.nodes.map(node =>
                                node.isJobRole
                                  ? {
                                      ...node,
                                      name: formData.roleSpecification.jobRole || node.name || 'Untitled Role'
                                    }
                                  : node
                              )
                            }
                          : {
                              nodes: [
                                {
                                  id: 'root',
                                  name: formData.roleSpecification.jobRole || 'Untitled Role',
                                  parentId: null,
                                  children: [],
                                  isJobRole: true
                                }
                              ]
                            }
                      }
                      onCancel={cancelOrgChart}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </form>
        </div>
      </Card>
    </>
  )
}
