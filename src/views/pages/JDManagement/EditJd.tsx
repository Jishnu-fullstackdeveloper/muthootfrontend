'use client'

import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { ReactFlowProvider } from '@reactflow/core'
import ReactQuill from 'react-quill'
import 'reactflow/dist/style.css'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

import { Tree, TreeNode } from 'react-organizational-chart'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import type { OrganizationChart, Node, Edge } from './types'
import OrgChartCanvas from '@/form/generatedForms/addOrganizationChart'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchJobRole,
  fetchDesignation,
  fetchDepartment,
  fetchJdById,
  updateJd
} from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

// Define roles array to match addOrganizationChart.tsx
const roles = ['CEO', 'CTO', 'CFO', 'Manager', 'Engineer', 'HR']

// Define nodeTypes for ReactFlow

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
  jobRoleId: string
  approvalStatus: string
  details: {
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
  meta?: object | null
}

const initialFormData: JobDescription = {
  jobRoleId: '',
  approvalStatus: '',
  details: {
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
  },
  meta: null
}

// Utility function for deep copying objects
const deepCopy = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy)
  }

  const copy: any = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key])
    }
  }

  return copy
}

export default function EditJDForm() {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const jobId = Array.isArray(id) ? id[0] : id // Handle array case

  const [formData, setFormData] = useState<JobDescription>(initialFormData)
  const [showOrgChart, setShowOrgChart] = useState(false)
  const [savedOrgChart, setSavedOrgChart] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [limit] = useState(10)
  const [page] = useState(1)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [usedRoles, setUsedRoles] = useState<string[]>([])

  const {
    jobRoleData,
    designationData,
    departmentData,
    isSelectedJdLoading,
    selectedJdSuccess,
    selectedJdFailure,
    selectedJdFailureMessage,
    selectedJd
  } = useAppSelector(state => state.jdManagementReducer)

  // Add this function at the top of your component, outside the return statement
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

  console.log('Job Role Data:', jobRoleData)
  console.log('Designation Data:', designationData)
  console.log('Department Data:', departmentData)
  console.log('Selected JD:', selectedJd)

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

  // Fetch job description by ID
  useEffect(() => {
    if (jobId && typeof jobId === 'string') {
      console.log('Fetching JD by ID:', jobId)
      dispatch(fetchJdById(jobId))
    } else {
      setUpdateError('Invalid ID format. Please provide a valid UUID.')
    }
  }, [jobId, dispatch])

  // Populate form data when job description is fetched
  useEffect(() => {
    if (selectedJdSuccess && selectedJd) {
      // Create a deep copy of selectedJd to ensure mutability
      const copiedJd = deepCopy(selectedJd)

      setFormData({
        jobRoleId: jobId,
        approvalStatus: copiedJd.approvalStatus || '',
        details: {
          roleSpecification: copiedJd.details?.roleSpecification || initialFormData.details.roleSpecification,
          roleSummary: copiedJd.details?.roleSummary || '',
          keyResponsibilities: copiedJd.details?.keyResponsibilities || initialFormData.details.keyResponsibilities,
          keyChallenges: copiedJd.details?.keyChallenges || '',
          keyDecisions: copiedJd.details?.keyDecisions || '',
          keyInteractions: copiedJd.details?.keyInteractions || initialFormData.details.keyInteractions,
          keyRoleDimensions: copiedJd.details?.keyRoleDimensions || initialFormData.details.keyRoleDimensions,
          skillsAndAttributesType: copiedJd.details?.skillsAndAttributesType || '',
          skillsAndAttributesDetails:
            copiedJd.details?.skillsAndAttributesDetails || initialFormData.details.skillsAndAttributesDetails,
          educationAndExperience:
            copiedJd.details?.educationAndExperience || initialFormData.details.educationAndExperience,
          organizationChart: copiedJd.details?.organizationChart || initialFormData.details.organizationChart
        },
        meta: copiedJd.meta || null
      })

      // Convert organizationChart to ReactFlow nodes and edges
      if (copiedJd.details?.organizationChart) {
        const nodes = convertToReactFlowNodes(copiedJd.details.organizationChart)
        const edges = convertToReactFlowEdges(copiedJd.details.organizationChart)

        setSavedOrgChart({ nodes, edges })

        // Update usedRoles based on the loaded chart
        setUsedRoles(nodes.map(node => node.data.label).filter(label => label))
      }

      // Update active step based on fetched data
      updateActiveStep({
        roleSpecification: copiedJd.details?.roleSpecification || initialFormData.details.roleSpecification,
        roleSummary: copiedJd.details?.roleSummary || '',
        keyResponsibilities: copiedJd.details?.keyResponsibilities || initialFormData.details.keyResponsibilities,
        keyChallenges: copiedJd.details?.keyChallenges || '',
        keyDecisions: copiedJd.details?.keyDecisions || '',
        keyInteractions: copiedJd.details?.keyInteractions || initialFormData.details.keyInteractions,
        keyRoleDimensions: copiedJd.details?.keyRoleDimensions || initialFormData.details.keyRoleDimensions,
        skillsAndAttributesType: copiedJd.details?.skillsAndAttributesType || '',
        skillsAndAttributesDetails:
          copiedJd.details?.skillsAndAttributesDetails || initialFormData.details.skillsAndAttributesDetails,
        educationAndExperience:
          copiedJd.details?.educationAndExperience || initialFormData.details.educationAndExperience,
        organizationChart: copiedJd.details?.organizationChart || initialFormData.details.organizationChart
      })
    }
  }, [selectedJd, selectedJdSuccess, jobId])

  // Fetch dropdown data
  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
    dispatch(fetchJobRole(params))
    dispatch(fetchDepartment(params))
  }, [dispatch, limit, page])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    section: keyof JobDescription['details'],
    index?: number,
    subField?: string,
    subArray?: string,
    subArrayIndex?: number
  ) => {
    setFormData(prev => {
      const newData = deepCopy(prev)
      const value = typeof e === 'string' ? e : e.target.value

      if (index !== undefined && subField) {
        if (subArray && subArrayIndex !== undefined) {
          // Update sub-array (e.g., competency, definition, behavioural_attributes)
          newData.details[section][index][subArray][subArrayIndex] = { value }
        } else {
          // Update object field (e.g., title, description)
          newData.details[section][index] = {
            ...newData.details[section][index],
            [subField]: value
          }
        }
      } else {
        newData.details[section] = value
      }

      updateActiveStep(newData.details)

      return newData
    })
  }

  const handleAddItem = (section: keyof JobDescription['details']) => {
    setFormData(prev => {
      const newData = deepCopy(prev)

      if (section === 'keyResponsibilities') {
        newData.details.keyResponsibilities.push({ title: '', description: '' })
      } else if (section === 'keyInteractions') {
        newData.details.keyInteractions.push({ internalStakeholders: '', externalStakeholders: '' })
      } else if (section === 'skillsAndAttributesDetails') {
        newData.details.skillsAndAttributesDetails.push({
          factor: '',
          competency: [{ value: '' }],
          definition: [{ value: '' }],
          behavioural_attributes: [{ value: '' }]
        })
      } else if (section === 'educationAndExperience') {
        newData.details.educationAndExperience.push({ minimumQualification: '', experienceDescription: '' })
      }

      updateActiveStep(newData.details)

      return newData
    })
  }

  const handleAddSubItem = (section: keyof JobDescription['details'], index: number, subArray: string) => {
    setFormData(prev => {
      const newData = deepCopy(prev)

      if (section === 'skillsAndAttributesDetails' && subArray === 'competency') {
        newData.details.skillsAndAttributesDetails[index].competency.push({ value: '' })
        newData.details.skillsAndAttributesDetails[index].definition.push({ value: '' })
        newData.details.skillsAndAttributesDetails[index].behavioural_attributes.push({ value: '' })
      }

      updateActiveStep(newData.details)

      return newData
    })
  }

  const updateNodeLabel = (id: string, newLabel: string) => {
    setUsedRoles(prev => {
      const newUsed = [...prev]
      const prevLabel = savedOrgChart?.nodes.find(n => n.id === id)?.data.label

      if (prevLabel) newUsed.splice(newUsed.indexOf(prevLabel), 1)
      if (newLabel && !newUsed.includes(newLabel)) newUsed.push(newLabel)

      return newUsed
    })

    setSavedOrgChart(prev => {
      if (!prev) return prev

      return {
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                  usedRoles
                }
              }
            : node
        )
      }
    })
  }

  const handleOrgChartSave = (chartData: { nodes: Node[]; edges: Edge[] }) => {
    setSavedOrgChart(chartData)
    setShowOrgChart(false)

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

    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parentId)
    const organizationChart = rootNodes.length === 1 ? rootNodes[0] : { id: 'root', name: 'Root', children: rootNodes }

    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, organizationChart }
    }))
    setUsedRoles(chartData.nodes.map(node => node.data.label).filter(label => label))
    updateActiveStep({ ...formData.details, organizationChart })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateSuccess(false)
    setUpdateError('')

    if (!jobId) {
      setUpdateError('Invalid ID. Please provide a valid UUID.')

      return
    }

    console.log('Payload being sent:', JSON.stringify({ id: jobId, params: formData }, null, 2))

    try {
      // Ensure parentId is always present (even if empty string)
      const orgChartWithParentId = {
        ...formData.details.organizationChart,
        parentId: formData.details.organizationChart.parentId ?? ''
      }

      const payload = {
        id: jobId,
        params: {
          ...formData,
          details: {
            ...formData.details,
            organizationChart: {
              organizationChart: orgChartWithParentId
            }
          }
        }
      }

      await dispatch(updateJd(payload)).unwrap()
      setUpdateSuccess(true)
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update job description')
    }
  }

  const updateActiveStep = (data: JobDescription['details']) => {
    let completedSteps = 0

    if (savedOrgChart) {
      completedSteps = 1
    }

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

    if (
      completedSteps >= 9 &&
      data.educationAndExperience.some(e => e.minimumQualification && e.experienceDescription)
    ) {
      completedSteps = 10
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

  const convertToReactFlowNodes = (chart: OrganizationChart, parentX = 0, parentY = 0, level = 0): Node[] => {
    const nodes: Node[] = []
    const xOffset = 200
    const yOffset = 100

    nodes.push({
      id: chart.id,
      type: 'custom',
      data: {
        label: chart.name,
        shape: 'rectangle', // Default shape, can be customized
        options: roles,
        usedRoles,
        onChange: updateNodeLabel
      },
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

  const convertToReactFlowEdges = (chart: OrganizationChart): Edge[] => {
    const edges: Edge[] = []

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

  if (isSelectedJdLoading) {
    return (
      <Alert severity='info' className='m-4'>
        Loading job description...
      </Alert>
    )
  }

  if (selectedJdFailure) {
    return (
      <Alert severity='error' className='m-4'>
        {selectedJdFailureMessage || 'Failed to fetch job description'}
      </Alert>
    )
  }

  if (!selectedJdSuccess || !selectedJd) {
    return (
      <Alert severity='info' className='m-4'>
        No job description data found.
      </Alert>
    )
  }

  const handleDeleteItem = (section: keyof JobDescription['details'], index: number) => {
    setFormData(prev => {
      const newData = deepCopy(prev)

      newData.details[section] = newData.details[section].filter((_, i) => i !== index)
      updateActiveStep(newData.details)

      return newData
    })
  }

  const handleDeleteSubItem = (section: keyof JobDescription['details'], parentIndex: number, subIndex: number) => {
    setFormData(prev => {
      const newData = deepCopy(prev)
      const parentArray = [...newData.details[section]]
      const subFields = ['competency', 'definition', 'behavioural_attributes']

      subFields.forEach(subField => {
        if (parentArray[parentIndex][subField]) {
          parentArray[parentIndex][subField] = parentArray[parentIndex][subField].filter((_, idx) => idx !== subIndex)
        }
      })

      newData.details[section] = parentArray
      updateActiveStep(newData.details)

      return newData
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
        <ReactFlowProvider>
          <div className='p-6'>
            <h1 className='text-2xl font-bold mb-6'>Edit Job Description</h1>
            {updateSuccess && (
              <Alert severity='success' className='mb-4'>
                Job description updated successfully!
              </Alert>
            )}
            {updateError && (
              <Alert severity='error' className='mb-4'>
                {updateError}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className='space-y-6 mt-6'>
              {/* Job Role ID and Approval Status */}
              <div className='border p-4 rounded'>
                <h2 className='text-lg font-semibold mb-2'>Job Details</h2>
                <div className='grid grid-cols-2 gap-4'>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='jobRoleId' className='block text-sm font-medium text-gray-700'>
                      Job Role ID *
                    </label>
                    <TextField value={formData.jobRoleId} disabled className='border p-2 rounded w-full' />
                  </FormControl>
                  {/* <FormControl fullWidth margin='normal'>
                    <label htmlFor='approvalStatus' className='block text-sm font-medium text-gray-700'>
                      Approval Status *
                    </label>
                    <DynamicSelect
                      value={formData.approvalStatus}
                      onChange={e => handleInputChange(e, 'approvalStatus')}
                    >
                      <MenuItem value='PENDING'>Pending</MenuItem>
                      <MenuItem value='APPROVED'>Approved</MenuItem>
                      <MenuItem value='REJECTED'>Rejected</MenuItem>
                    </DynamicSelect>
                  </FormControl> */}
                </div>
              </div>
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
                      <Typography>Nodes: {countNodes(formData.details.organizationChart)}</Typography>
                      <Button
                        type='button'
                        variant='outlined'
                        onClick={() => setIsChartVisible(prev => !prev)}
                        className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
                      >
                        {isChartVisible ? 'Hide Chart' : 'Show Chart'}
                      </Button>
                    </div>
                    {isChartVisible &&
                      formData.details.organizationChart &&
                      formData.details.organizationChart.name && (
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
                                {formData.details.organizationChart.name}
                              </Box>
                            }
                          >
                            {formData.details.organizationChart.children?.map(child => renderOrgChartNode(child))}
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
                      value={formData.details.roleSpecification[0].roleTitle || ''}
                      onChange={(event, newValue) =>
                        handleInputChange(newValue || '', 'roleSpecification', 0, 'roleTitle')
                      }
                      renderInput={params => (
                        <TextField {...params} label='Role Title' placeholder='Select Role Title' />
                      )}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='employeeInterviewed' className='block text-sm font-medium text-gray-700'>
                      Employee Interviewed *
                    </label>
                    <DynamicTextField
                      placeholder='Employee Interviewed'
                      value={formData.details.roleSpecification[0].employeeInterviewed}
                      onChange={e => handleInputChange(e, 'roleSpecification', 0, 'employeeInterviewed')}
                      className='border p-2 rounded w-full'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label className='block text-sm font-medium text-gray-700'>Reporting To *</label>
                    <Autocomplete
                      options={designationData?.map(designation => designation.name || '')}
                      value={formData.details.roleSpecification[0].reportsTo || ''}
                      onChange={(event, newValue) =>
                        handleInputChange(newValue || '', 'roleSpecification', 0, 'reportsTo')
                      }
                      renderInput={params => (
                        <TextField {...params} label='Reports To' placeholder='Select Reports To' />
                      )}
                      fullWidth
                      freeSolo
                      disableClearable={false}
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                      Company Name *
                    </label>
                    <DynamicSelect
                      value={formData.details.roleSpecification[0].companyName}
                      onChange={e => handleInputChange(e.target.value, 'roleSpecification', 0, 'companyName')}
                    >
                      <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                      <MenuItem value='muthoot_finance'>Muthoot Finance</MenuItem>
                    </DynamicSelect>
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='functionOrDepartment' className='block text-sm font-medium text-gray-700'>
                      Function/Department *
                    </label>
                    <Autocomplete
                      options={departmentData?.map(department => department.name || '')}
                      value={formData.details.roleSpecification[0].functionOrDepartment || ''}
                      onChange={(event, newValue) =>
                        handleInputChange(newValue || '', 'roleSpecification', 0, 'functionOrDepartment')
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Function/Department'
                          placeholder='Select Function or Department'
                        />
                      )}
                      fullWidth
                      freeSolo
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='writtenBy' className='block text-sm font-medium text-gray-700'>
                      Written By *
                    </label>
                    <DynamicTextField
                      type='text'
                      placeholder='Written By'
                      value={formData.details.roleSpecification[0].writtenBy}
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
                      value={formData.details.roleSpecification[0].approvedByJobholder}
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
                      value={formData.details.roleSpecification[0].approvedBySuperior}
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
                      value={formData.details.roleSpecification[0].dateWritten}
                      onChange={e => handleInputChange(e, 'roleSpecification', 0, 'dateWritten')}
                      className='border p-2 rounded w-full'
                    />
                  </FormControl>
                </div>
              </div>
              {/* Role Summary */}
              <div className='border p-4 rounded'>
                <h2 className='text-lg font-semibold mb-2'>Role Summary</h2>
                <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                  <FormControl fullWidth>
                    <ReactQuill
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={formData.details.roleSummary}
                      onChange={e => handleInputChange(e, 'roleSummary')}
                      modules={{
                        toolbar: {
                          container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                        }
                      }}
                    />
                  </FormControl>
                </fieldset>
              </div>
              {/* Key Responsibilities */}
              {/* Key Responsibilities */}
              <div className='border p-4 rounded'>
                <h2 className='text-lg font-semibold mb-2'>Key Responsibilities</h2>
                {formData.details.keyResponsibilities.map((item, index) => (
                  <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className='font-medium'>{item.title || `Responsibility ${index + 1}`}</Typography>
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
                          onChange={e => handleInputChange(e, 'keyResponsibilities', index, 'description')}
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
                      value={formData.details.keyChallenges}
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
                <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='keyDecisions' className='block text-sm font-medium text-gray-700'>
                      Key Decisions Taken *
                    </label>
                    <ReactQuill
                      id='keyDecisions'
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={formData.details.keyDecisions}
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
                  {formData.details.keyInteractions.map((item, index) => (
                    <div key={index} className='grid grid-cols-2 gap-4 mb-8'>
                      <FormControl fullWidth margin='normal'>
                        <label
                          htmlFor={`keyInteractions[${index}].internalStakeholders`}
                          className='block text-sm font-medium text-gray-700 mb-2'
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
                          className='block text-sm font-medium text-gray-700 mb-2'
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

              {/* Key Role Dimensions */}
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
                        value={formData.details.keyRoleDimensions[0].portfolioSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'portfolioSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label htmlFor='geographicalCoverage' className='block text-sm font-medium text-gray-700'>
                        Geographical Coverage *
                      </label>
                      <DynamicTextField
                        value={formData.details.keyRoleDimensions[0].geographicalCoverage}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'geographicalCoverage')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label className='block text-sm font-medium text-gray-700'>Team Size *</label>
                      <DynamicTextField
                        value={formData.details.keyRoleDimensions[0].teamSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'teamSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <label className='block text-sm font-medium text-gray-700'>Total Team Size *</label>
                      <DynamicTextField
                        value={formData.details.keyRoleDimensions[0].totalTeamSize}
                        onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'totalTeamSize')}
                        className='border p-2 rounded w-full'
                      />
                    </FormControl>
                  </div>
                </fieldset>
              </div>
              {/* Skills and Attributes */}

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
                    value={formData.details.skillsAndAttributesType}
                    onChange={e => handleInputChange(e, 'skillsAndAttributesType')}
                    className='border p-2 rounded w-full mb-2'
                  />
                </FormControl>
                {formData.details.skillsAndAttributesDetails.map((item, index) => (
                  <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <span className='text-base font-medium'>{item.factor || `Factor #${index + 1}`}</span>
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
                {formData.details.educationAndExperience.map((item, index) => (
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
                        style={{ height: '40vh', marginBottom: '1rem' }}
                        value={item.experienceDescription}
                        onChange={e => handleInputChange(e, 'educationAndExperience', index, 'experienceDescription')}
                        modules={{
                          toolbar: {
                            container: [[{ list: 'ordered' }, { list: 'bullet' }]]
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                ))}
              </div>
              {/* Submit Button */}

              <div className='flex justify-end'>
                <Button
                  sx={{ border: '1px solid #e0e0e0', padding: '16px' }}
                  type='submit'
                  disabled={isSelectedJdLoading || activeStep < steps.length}
                  className={`px-4 py-2 rounded transition
      ${
        isSelectedJdLoading || activeStep < steps.length
          ? 'border border-gray-400 text-gray-400 cursor-not-allowed'
          : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
      }`}
                >
                  {isSelectedJdLoading ? 'Submitting...' : 'Update Job Description'}
                </Button>
              </div>
            </form>
            {/* Organization Chart Modal */}
            {showOrgChart && (
              <div className='fixed inset-0 bg-white z-header flex items-center justify-center'>
                <div className='w-full ml-[230px]'>
                  <OrgChartCanvas onSave={handleOrgChartSave} initialChart={savedOrgChart} />
                </div>
              </div>
            )}
          </div>
        </ReactFlowProvider>
      </Card>
    </>
  )
}
