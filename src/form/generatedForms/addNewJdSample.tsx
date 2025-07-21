'use client'

import React, { useEffect, useState } from 'react'

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
import { fetchJobRole, fetchDesignation, fetchDepartment, addNewJd } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

interface NodeData {
  id: string
  name: string
  parentId: string | null
  children: NodeData[]
  nodes?: NodeData[]
}

interface RoleSpecification {
  roleTitle: string
  companyName: string
  noticePeriod?: number
  xFactor?: number
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

// interface Skills {
//   name: string
// }

interface EducationAndExperience {
  ageLimit: number
  minimumQualification: string
  experienceDescription: string
}

interface InterviewLevel {
  level: number
  designation: string
}

interface InterviewLevels {
  numberOfLevels: number
  levels: InterviewLevel[]
}

interface OrganizationChart {
  id: string
  name: string
  parentId: string | null
  children: NodeData[]
  nodes?: NodeData[]
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

  // skills: Skills[]
  skills: string[]
  educationAndExperience: EducationAndExperience[]
  organizationChart: OrganizationChart
  interviewLevels: InterviewLevels
}

const skillsList = [
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Leadership',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Decision Making',
  'Creativity',
  'Conflict Resolution',
  'Attention to Detail',
  'Emotional Intelligence',
  'Negotiation',
  'Strategic Thinking',
  'Collaboration',
  'Technical Expertise',
  'Presentation Skills',
  'Stress Management',
  'Customer Focus',
  'Self-Motivation'
]

const initialFormData: JobDescription = {
  roleSpecification: [
    {
      roleTitle: '',
      companyName: '',
      noticePeriod: 0,
      xFactor: 0
    }
  ],
  roleSummary: '',
  keyResponsibilities: [{ title: '', description: '' }],
  keyChallenges: '',
  keyDecisions: '',
  keyInteractions: [{ internalStakeholders: '', externalStakeholders: '' }],
  keyRoleDimensions: [{ portfolioSize: '', geographicalCoverage: '', teamSize: '', totalTeamSize: '' }],

  // skillsAndAttributesType: '',
  skills: [],

  educationAndExperience: [{ ageLimit: 0, minimumQualification: '', experienceDescription: '' }],
  organizationChart: { id: '', name: '', parentId: null, children: [] },
  interviewLevels: { numberOfLevels: 0, levels: [] }
}

const renderOrgChartNode = (node: OrganizationChart) => (
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

export default function CreateJDForm() {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<JobDescription>(initialFormData)
  const [isShowOrgChart, setIsShowOrgChart] = useState(false)
  const [savedOrgChart, setSavedOrgChart] = useState<{ nodes: NodeData[] } | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const [limit] = useState(10)
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
    'Role Specification',
    'Organization Chart',
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

      if (section === 'interviewLevels' && subField === 'numberOfLevels') {
        const numLevels = parseInt(value, 10) || 0

        newData.interviewLevels.numberOfLevels = numLevels
        newData.interviewLevels.levels = Array.from({ length: numLevels }, (_, i) => ({
          level: i + 1,
          designation: newData.interviewLevels.levels[i]?.designation || ''
        }))
      } else if (section === 'interviewLevels' && index !== undefined && subField === 'designation') {
        newData.interviewLevels.levels[index].designation = value
      } else if (section === 'skills' && Array.isArray(value)) {
        newData.skills = value

        // newData.skills = value.map((name: string) => ({ name }))
      } else if (index !== undefined && subField) {
        ;(newData[section] as any)[index][subField] = value

        // If roleTitle changes, update the organization chart's root node
        if (section === 'roleSpecification' && subField === 'roleTitle') {
          const newRootNode: NodeData = {
            id: '1',
            name: value,
            parentId: null,
            children: savedOrgChart?.nodes.find(n => n.id === '1')?.children || []
          }

          setSavedOrgChart({
            nodes: savedOrgChart ? [newRootNode, ...savedOrgChart.nodes.filter(n => n.id !== '1')] : [newRootNode]
          })
          newData.organizationChart = {
            id: '1',
            name: value,
            parentId: null,
            children: savedOrgChart?.nodes.find(n => n.id === '1')?.children || [],
            nodes: savedOrgChart ? [newRootNode, ...savedOrgChart.nodes.filter(n => n.id !== '1')] : [newRootNode]
          }
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
      } else if (section === 'educationAndExperience') {
        newData.educationAndExperience.push({ ageLimit: 0, minimumQualification: '', experienceDescription: '' })
      }

      updateActiveStep(newData)

      return newData
    })
  }

  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
    dispatch(fetchJobRole(params))
    dispatch(fetchDepartment(params))
  }, [dispatch, limit, page])

  const cancelOrgChart = () => {
    setIsShowOrgChart(false)
  }

  const handleOrgChartSave = (chartData: { nodes: NodeData[] }) => {
    if (!chartData.nodes.length) {
      console.error('No nodes provided in chart data')

      return
    }

    setSavedOrgChart(chartData)
    setIsShowOrgChart(false)

    console.log('Saved Organization Chart:', chartData)

    const nodeMap = new Map<string, OrganizationChart>()

    chartData.nodes.forEach(node => {
      nodeMap.set(node.id, { id: node.id, name: node.name, children: [], parentId: node.parentId })
    })

    chartData.nodes.forEach(node => {
      node.children.forEach(child => {
        const childNode = nodeMap.get(child.id)

        if (childNode) {
          childNode.parentId = node.id
          const parent = nodeMap.get(node.id)

          if (parent) {
            parent.children.push(childNode)
          }
        }
      })
    })

    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parentId)

    const organizationChart: OrganizationChart =
      rootNodes.length === 1
        ? { ...rootNodes[0], nodes: chartData.nodes }
        : { id: 'root', name: 'Root', children: rootNodes, parentId: null, nodes: chartData.nodes }

    setFormData(prev => ({
      ...prev,
      organizationChart
    }))
    updateActiveStep({ ...formData, organizationChart })
    console.log('Updated Form Data with Organization Chart:', { ...formData, organizationChart })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting Form Data:', JSON.stringify(formData, null, 2))

    try {
      const transformedFormData = {
        ...formData,
        skills: formData.skills.map(name => ({ name })),
        organizationChart: {
          ...formData.organizationChart,
          nodes: formData.organizationChart.nodes?.map(node => ({
            id: node.id,
            name: node.name, // Changed from designation to name
            children: node.children
          }))
        }
      }

      const result = await dispatch(addNewJd(transformedFormData)).unwrap()

      console.log('Job Description Created:', result)
      setFormData(initialFormData)
      setSavedOrgChart(null)
      setActiveStep(0)
    } catch (error) {
      console.error('Failed to create job description:', error)
    }
  }

  const updateActiveStep = (data: JobDescription) => {
    let completedSteps = 0

    if (
      data.roleSpecification[0].roleTitle &&
      data.roleSpecification[0].companyName &&
      data.roleSpecification[0].noticePeriod &&
      data.roleSpecification[0].xFactor
    ) {
      completedSteps = 1
    }

    if (completedSteps >= 1 && savedOrgChart) {
      completedSteps = 2
    }

    if (completedSteps >= 2 && data.roleSummary) {
      completedSteps = 3
    }

    if (completedSteps >= 3 && data.keyResponsibilities.some(r => r.title && r.description)) {
      completedSteps = 4
    }

    if (completedSteps >= 4 && data.keyChallenges) {
      completedSteps = 5
    }

    if (completedSteps >= 5 && data.keyDecisions) {
      completedSteps = 6
    }

    if (completedSteps >= 6 && data.keyInteractions.some(i => i.internalStakeholders && i.externalStakeholders)) {
      completedSteps = 7
    }

    if (
      completedSteps >= 7 &&
      data.keyRoleDimensions[0].portfolioSize &&
      data.keyRoleDimensions[0].geographicalCoverage &&
      data.keyRoleDimensions[0].teamSize &&
      data.keyRoleDimensions[0].totalTeamSize
    ) {
      completedSteps = 8
    }

    if (completedSteps >= 8 && data.skills.length > 0) {
      completedSteps = 9
    }

    if (
      completedSteps >= 9 &&
      data.educationAndExperience.some(e => e.ageLimit && e.minimumQualification && e.experienceDescription)
    ) {
      completedSteps = 10
    }

    if (
      completedSteps >= 10 &&
      data.interviewLevels.numberOfLevels > 0 &&
      data.interviewLevels.levels.every(l => l.designation)
    ) {
      completedSteps = 11
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
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? prev[section].filter((_, i) => i !== index) : prev[section]
    }))
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
                  <label htmlFor='roleTitle' className='block text-sm font-medium text-gray-700'>
                    Role Title *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='Role Title'
                    value={formData.roleSpecification[0].roleTitle || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'roleTitle')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='noticePeriod' className='block text-sm font-medium text-gray-700'>
                    Notice Period *
                  </label>
                  <DynamicTextField
                    type='number'
                    placeholder='Notice Period'
                    value={formData.roleSpecification[0].noticePeriod || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'noticePeriod')}
                    className='border p-2 rounded w-full mb-2'
                    inputProps={{ min: 0, step: 1 }}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='xFactor' className='block text-sm font-medium text-gray-700'>
                    X Factor *
                  </label>
                  <DynamicTextField
                    type='number'
                    placeholder='X Factor'
                    value={formData.roleSpecification[0].xFactor || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', 0, 'xFactor')}
                    className='border p-2 rounded w-full mb-2'
                    inputProps={{ min: 0, step: 1 }}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.roleSpecification[0].companyName}
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
                  {isChartVisible && formData.organizationChart && formData.organizationChart.name && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-auto p-4'>
                      <Tree
                        lineWidth={'2px'}
                        lineColor={'#1976d2'}
                        lineBorderRadius={'8px'}
                        label={<Box>{formData.organizationChart.nodes?.map(child => renderOrgChartNode(child))}</Box>}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Other form sections remain unchanged */}
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
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Decisions Taken</h2>
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
            <div className='border p-4 rounded'>
              <Typography variant='h6' className='mb-2 font-semibold'>
                Skills
              </Typography>
              <FormControl fullWidth margin='normal'>
                <label htmlFor='skills' className='block text-sm font-medium text-gray-700 mb-1'>
                  Select Skills *
                </label>
                <Autocomplete
                  multiple
                  options={skillsList}
                  value={formData.skills}
                  onChange={(event, newValue) => {
                    handleInputChange(newValue, 'skills')
                  }}
                  renderInput={params => <TextField {...params} placeholder='Choose skills...' variant='outlined' />}
                />
              </FormControl>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Educational and Experience Requirements</h2>
              {formData.educationAndExperience.map((item, index) => (
                <div key={index} className='mb-2'>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor={`ageLimit-${index}`} className='block text-sm font-medium text-gray-700'>
                      Age Limit *
                    </label>
                    <DynamicTextField
                      type='number'
                      placeholder='Age Limit'
                      value={item.ageLimit}
                      onChange={e => handleInputChange(e, 'educationAndExperience', index, 'ageLimit')}
                      className='border p-2 rounded w-full mb-2'
                      inputProps={{ min: 0, step: 1 }}
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
                  inputProps={{ min: 0, step: 1 }}
                />
              </FormControl>
              {formData.interviewLevels.levels.map((level, index) => (
                <FormControl fullWidth margin='normal' key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='body2' sx={{ minWidth: '50px' }}>
                      Level {index + 1}:
                    </Typography>
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
                          label={`Designation for Level ${index + 1}`}
                          variant='outlined'
                          placeholder={designationData ? 'Select designation' : 'Loading designations...'}
                        />
                      )}
                      disabled={!designationData || designationData.length === 0}
                    />
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
                        savedOrgChart || {
                          nodes: [
                            {
                              id: '1',
                              name: formData.roleSpecification[0].roleTitle || '',
                              parentId: null,
                              children: []
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
