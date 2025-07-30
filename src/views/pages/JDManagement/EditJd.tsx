'use client'

import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

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

import OrgChartCanvas from '@/form/generatedForms/addOrganizationChart'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchSkills, fetchDesignation, fetchJdById, updateJd } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

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
  noticePeriod: any
  salaryRange: any
}

// interface XFactor {
//   vacancyXFactor: string
//   resignedXFactor: string
// }
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
  ageLimit: string
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

interface JobDescription {
  jobRoleId: string
  approvalStatus: string
  details: {
    roleSpecification: RoleSpecification

    // xFactor?: XFactor
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
}

const initialFormData: JobDescription = {
  jobRoleId: '',
  approvalStatus: '',
  details: {
    roleSpecification: {
      jobRole: '',
      jobRoleType: '',
      jobType: '',
      companyName: '',
      noticePeriod: 0,
      salaryRange: ''
    },

    // xFactor: { vacancyXFactor: '', resignedXFactor: '' },
    jdType: '',
    roleSummary: '',

    keyResponsibilities: [{ title: '', description: '' }],
    keyChallenges: '',
    keyDecisions: '',
    keyInteractions: [{ internalStakeholders: '', externalStakeholders: '' }],
    keyRoleDimensions: [{ portfolioSize: '', geographicalCoverage: '', teamSize: '', totalTeamSize: '' }],
    skills: [],
    educationAndExperience: [{ ageLimit: '', minimumQualification: '', experienceDescription: { min: '', max: '' } }],
    organizationChart: { id: 'root', name: '', parentId: null, children: [], isJobRole: true },
    interviewLevels: { numberOfLevels: '', levels: [] }
  }
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

export default function EditJDForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const jobId = Array.isArray(id) ? id[0] : id
  const [formData, setFormData] = useState<JobDescription>(initialFormData)
  const [isShowOrgChart, setIsShowOrgChart] = useState(false)
  const [savedOrgChart, setSavedOrgChart] = useState<{ nodes: NodeData[] } | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [limit] = useState(10)
  const [page] = useState(1)

  const {
    skillsData,
    designationData,
    isSelectedJdLoading,
    selectedJdSuccess,
    selectedJdFailure,
    selectedJdFailureMessage,
    selectedJd
  } = useAppSelector(state => state.jdManagementReducer)

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

  useEffect(() => {
    if (jobId && typeof jobId === 'string') {
      dispatch(fetchJdById(jobId))
    }
  }, [jobId, dispatch])

  useEffect(() => {
    if (selectedJdSuccess && selectedJd) {
      const normalizeOrgChart = (chart: any): OrganizationChart => ({
        id: String(chart.id || 'root'),
        name: chart.name || '',
        parentId: chart.parentId !== null ? String(chart.parentId) : null,
        children: Array.isArray(chart.children) ? chart.children.map((child: any) => normalizeOrgChart(child)) : [],
        isJobRole: chart.isJobRole || chart.name === selectedJd.details.roleSpecification.jobRole
      })

      const organizationChart = selectedJd.details?.organizationChart
        ? normalizeOrgChart(selectedJd.details.organizationChart)
        : initialFormData.details.organizationChart

      const newFormData = {
        jobRoleId: jobId,
        approvalStatus: selectedJd.approvalStatus || '',
        details: {
          roleSpecification: {
            jobRole: selectedJd.details?.roleSpecification.jobRole || '',
            jobType: selectedJd.details?.roleSpecification.jobType || '',
            jobRoleType: selectedJd.details?.roleSpecification.jobRoleType || '',
            companyName: selectedJd.details?.roleSpecification.companyName || '',
            noticePeriod: selectedJd.details?.roleSpecification.noticePeriod || '',
            salaryRange: selectedJd.details?.roleSpecification.salaryRange || ''
          },
          jdType: selectedJd.details?.jdType || '',
          roleSummary: selectedJd.details?.roleSummary || '',
          keyResponsibilities: selectedJd.details?.keyResponsibilities || initialFormData.details.keyResponsibilities,
          keyChallenges: selectedJd.details?.keyChallenges || '',
          keyDecisions: selectedJd.details?.keyDecisions || '',
          keyInteractions: selectedJd.details?.keyInteractions || initialFormData.details.keyInteractions,
          keyRoleDimensions: selectedJd.details?.keyRoleDimensions || initialFormData.details.keyRoleDimensions,
          skills: selectedJd.details?.skills || initialFormData.details.skills,
          educationAndExperience:
            Array.isArray(selectedJd.details?.educationAndExperience) &&
            selectedJd.details.educationAndExperience.length > 0
              ? selectedJd.details.educationAndExperience.map(item => ({
                  ageLimit: String(item.ageLimit ?? ''),
                  minimumQualification: item.minimumQualification || '',
                  experienceDescription: {
                    min: String(item.experienceDescription?.min || ''),
                    max: String(item.experienceDescription?.max || '')
                  }
                }))
              : initialFormData.details.educationAndExperience,
          organizationChart,
          interviewLevels: selectedJd.details?.interviewLevels || initialFormData.details.interviewLevels
        }
      }

      setFormData(newFormData)
      setSavedOrgChart({ nodes: [organizationChart] })
      updateActiveStep(newFormData.details)
    }
  }, [selectedJd, selectedJdSuccess, jobId])
  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
    dispatch(fetchSkills(params))
  }, [dispatch, limit, page])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | any,
    section: keyof JobDescription['details'],
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

        newData.details.interviewLevels = {
          ...newData.details.interviewLevels,
          numberOfLevels: value,
          levels: Array.from({ length: numLevels }, (_, i) => ({
            level: (i + 1).toString(),
            designation: newData.details.interviewLevels.levels[i]?.designation || ''
          }))
        }
      } else if (section === 'interviewLevels' && index !== undefined && subField === 'designation') {
        newData.details.interviewLevels = {
          ...newData.details.interviewLevels,
          levels: newData.details.interviewLevels.levels.map((item: any, i: number) =>
            i === index ? { ...item, designation: value } : item
          )
        }
      } else if (section === 'skills' && Array.isArray(value)) {
        newData.details.skills = value
      } else if (
        section === 'educationAndExperience' &&
        index !== undefined &&
        subField?.includes('experienceDescription')
      ) {
        const [, field] = subField.split('.')

        newData.details.educationAndExperience[index].experienceDescription = {
          ...newData.details.educationAndExperience[index].experienceDescription,
          [field]: value
        }
      } else if (section === 'roleSpecification' && subField) {
        if (subField === 'noticePeriod' || subField === 'xFactor') {
          newData.details.roleSpecification[subField] = value // Store as string
        } else {
          newData.details.roleSpecification[subField] = value
        }

        if (subField === 'jobRole') {
          // Update only the job role node's name in savedOrgChart and formData.organizationChart
          if (savedOrgChart) {
            const updatedNodes = updateJobRoleNode(savedOrgChart.nodes, value || '')

            setSavedOrgChart({ nodes: updatedNodes })
            const updatedOrgChart = updateJobRoleNode([newData.details.organizationChart], value || '')[0]

            newData.details.organizationChart = updatedOrgChart
          } else {
            newData.details.organizationChart = {
              ...newData.details.organizationChart,
              name: value || '',
              isJobRole: true
            }
            setSavedOrgChart({
              nodes: [{ id: 'root', name: value || '', parentId: null, children: [], isJobRole: true }]
            })
          }
        }
      } else if (index !== undefined && subField) {
        if (section === 'educationAndExperience' && subField === 'ageLimit') {
          newData.details.educationAndExperience[index] = {
            ...newData.details.educationAndExperience[index],
            [subField]: value // Store as string
          }
        } else if (section === 'keyResponsibilities' || section === 'keyInteractions') {
          newData.details[section] = newData.details[section].map((item: any, i: number) =>
            i === index ? { ...item, [subField]: value } : item
          )
        } else {
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
      const newData = { ...prev }

      if (section === 'keyResponsibilities') {
        newData.details.keyResponsibilities = [...newData.details.keyResponsibilities, { title: '', description: '' }]
      } else if (section === 'keyInteractions') {
        newData.details.keyInteractions = [
          ...newData.details.keyInteractions,
          { internalStakeholders: '', externalStakeholders: '' }
        ]
      } else if (section === 'educationAndExperience') {
        newData.details.educationAndExperience = [
          ...newData.details.educationAndExperience,
          {
            ageLimit: '',
            minimumQualification: '',
            experienceDescription: { min: '', max: '' }
          }
        ]
      } else if (section === 'interviewLevels') {
        const newLevel = {
          level: String(newData.details.interviewLevels.levels.length + 1),
          designation: ''
        }

        newData.details.interviewLevels = {
          ...newData.details.interviewLevels,
          levels: [...newData.details.interviewLevels.levels, newLevel],
          numberOfLevels: String(newData.details.interviewLevels.levels.length + 1)
        }
      }

      updateActiveStep(newData.details)

      return newData
    })
  }

  const cancelOrgChart = () => {
    console.log('Cancel org chart')
    setIsShowOrgChart(false)
  }

  const handleOrgChartSave = (chartData: { nodes: NodeData[] }) => {
    console.log('handleOrgChartSave triggered, received chartData:', JSON.stringify(chartData, null, 2))

    if (!chartData.nodes.length) {
      console.error('No nodes provided in chart data')
      alert('Cannot save: No nodes provided')

      return
    }

    const topNode = chartData.nodes.find(node => !node.parentId)

    if (!topNode) {
      console.error('Topmost node not found in chart data')
      alert('Cannot save: Topmost node not found')

      return
    }

    const jobRoleNode = findNode(chartData.nodes, chartData.nodes.find(n => n.isJobRole)?.id || 'root')

    if (!jobRoleNode) {
      console.error('Job role node not found in chart data')
      alert('Cannot save: Job role node not found')

      return
    }

    const updatedNodes = chartData.nodes.map(node =>
      node.id === jobRoleNode.id
        ? { ...node, name: formData.details.roleSpecification.jobRole || node.name || 'Untitled Role' }
        : node
    )

    const organizationChart: OrganizationChart = {
      id: String(topNode.id),
      name: topNode.name || 'Untitled Role',
      parentId: null,
      children: topNode.children,
      isJobRole: topNode.isJobRole || false
    }

    console.log('Setting savedOrgChart:', JSON.stringify({ nodes: updatedNodes }, null, 2))
    setSavedOrgChart({ nodes: updatedNodes })
    console.log('Updating formData.organizationChart:', JSON.stringify(organizationChart, null, 2))
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        organizationChart
      }
    }))
    updateActiveStep({ ...formData.details, organizationChart })
    setIsShowOrgChart(false)
    console.log(
      'Updated Form Data with Organization Chart:',
      JSON.stringify({ ...formData, organizationChart }, null, 2)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting Form Data:', JSON.stringify(formData, null, 2))

    try {
      const updateNodeName = (node: NodeData): NodeData => {
        if (node.isJobRole) {
          return { ...node, name: formData.details.roleSpecification.jobRole || node.name || 'Untitled Role' }
        }

        return { ...node, children: node.children.map(updateNodeName) }
      }

      const updatedOrgChart = {
        ...formData.details.organizationChart,
        children: formData.details.organizationChart.children.map(updateNodeName)
      }

      const transformedOrgChart = stripIsJobRole(updatedOrgChart)

      const transformedFormData = {
        id: jobId,
        params: {
          ...formData,
          details: {
            ...formData.details,
            skills: formData.details.skills,
            organizationChart: transformedOrgChart
          }
        }
      }

      console.log('Transformed Form Data for Submission:', JSON.stringify(transformedFormData, null, 2))
      const result = await dispatch(updateJd(transformedFormData)).unwrap()

      router.back()
      console.log('Job Description Updated:', result)
    } catch (error) {
      console.error('Failed to update job description:', error)
      alert('Failed to update job description: ' + (error.message || 'Unknown error'))
    }
  }

  const updateActiveStep = (data: JobDescription['details']) => {
    let completedSteps = 0

    if (
      data.roleSpecification.jobRole &&
      data.roleSpecification.jobRoleType &&
      data.roleSpecification.jobType &&
      data.roleSpecification.companyName &&
      data.roleSpecification.noticePeriod &&
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
      data.keyRoleDimensions[0]?.portfolioSize &&
      data.keyRoleDimensions[0]?.geographicalCoverage &&
      data.keyRoleDimensions[0]?.teamSize &&
      data.keyRoleDimensions[0]?.totalTeamSize
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

  const handleDeleteItem = (section: keyof JobDescription['details'], index: number) => {
    setFormData(prev => {
      const newData = { ...prev }

      if (section === 'keyResponsibilities') {
        newData.details[section] = newData.details[section].filter((_: any, i: number) => i !== index)
      } else if (section === 'interviewLevels') {
        const updatedLevels = newData.details.interviewLevels.levels
          .filter((_: any, i: number) => i !== index)
          .map((level: InterviewLevel, i: number) => ({
            ...level,
            level: String(i + 1) // Reassign level numbers sequentially
          }))

        newData.details.interviewLevels = {
          ...newData.details.interviewLevels,
          levels: updatedLevels,
          numberOfLevels: String(updatedLevels.length) // Set to the new length
        }
      }

      updateActiveStep(newData.details)

      return newData
    })
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
        {Array.isArray(selectedJdFailureMessage)
          ? selectedJdFailureMessage.join(', ')
          : selectedJdFailureMessage || 'Failed to fetch job description'}
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

  return (
    <>
      <Card sx={{ mb: 4, pt: 3, pb: 3, position: 'sticky', top: 'inherit', zIndex: 10, backgroundColor: 'white' }}>
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
          <h1 className='text-2xl font-bold mb-6'>Edit Job Description</h1>
          {isSelectedJdLoading && (
            <Alert severity='info' className='mb-4'>
              Loading job description...
            </Alert>
          )}
          {selectedJdSuccess && (
            <Alert severity='success' className='mb-4'>
              Job description loaded successfully!
            </Alert>
          )}
          {selectedJdFailure && (
            <Alert severity='error' className='mb-4'>
              {Array.isArray(selectedJdFailureMessage)
                ? selectedJdFailureMessage.join(', ')
                : selectedJdFailureMessage || 'Failed to fetch job description'}
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
                    value={formData.details.roleSpecification.jobRole || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', undefined, 'jobRole')}
                    className='border p-2 rounded w-full'
                  />
                </FormControl>

                <FormControl fullWidth margin='normal'>
                  <label htmlFor='jobType' className='block text-sm font-medium text-gray-700'>
                    Job Role Type *
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.details.roleSpecification.jobRoleType || ''}
                      onChange={e => handleInputChange(e.target.value, 'roleSpecification', undefined, 'jobRoleType')}
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
                    value={formData.details.roleSpecification.jobType || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', undefined, 'jobType')}
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
                    value={formData.details.roleSpecification.noticePeriod || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', undefined, 'noticePeriod')}
                    className='border p-2 rounded w-full mb-2'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='xFactor' className='block text-sm font-medium text-gray-700'>
                    salary Range *
                  </label>
                  <DynamicTextField
                    type='text'
                    placeholder='salaryRange'
                    value={formData.details.roleSpecification.salaryRange || ''}
                    onChange={e => handleInputChange(e, 'roleSpecification', undefined, 'salaryRange')}
                    className='border p-2 rounded w-full mb-2'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                  />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                    Company Name *
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.details.roleSpecification.companyName || ''}
                      onChange={e => handleInputChange(e.target.value, 'roleSpecification', undefined, 'companyName')}
                    >
                      <MenuItem value='muthoot_finCorp'>Muthoot FinCorp</MenuItem>
                      <MenuItem value='muthoot_pappachan'>Muthoot Pappachan</MenuItem>
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
                  {isChartVisible && (
                    <div className='mt-4 border border-gray-300 rounded-lg overflow-auto p-4'>
                      <Tree
                        children
                        lineWidth={'2px'}
                        lineColor={'#1976d2'}
                        lineBorderRadius={'8px'}
                        label={<Box>{renderOrgChart(formData.details.organizationChart)}</Box>}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Jd Type</h2>
             
               <FormControl fullWidth margin='normal'>
                  <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
                   Jd Type*
                  </label>
                  <Box className='p-3 rounded w-full mb-2'>
                    <DynamicSelect
                      value={formData.details.jdType || ''}
                      onChange={e => handleInputChange(e.target.value,'jdType')}
                    >
                      <MenuItem value='lateral'>Lateral</MenuItem>
                      <MenuItem value='campus'>Campus</MenuItem>
                    </DynamicSelect>
                  </Box>
                </FormControl>
            </div>

            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Role Summary</h2>
              <FormControl fullWidth>
                <TextField
                  label='Role Summary'
                  multiline
                  minRows={6}
                  value={formData.details.roleSummary}
                  onChange={e => handleInputChange(e.target.value, 'roleSummary')}
                  variant='outlined'
                />
              </FormControl>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Responsibilities</h2>
              {formData.details.keyResponsibilities.map((item, index) => (
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
                            container: [
                              ['bold', 'italic', 'underline'],
                              [{ list: 'ordered' }, { list: 'bullet' }]
                            ]
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
              <fieldset className='border border-gray-300 rounded p-5 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyChallenges'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.details.keyChallenges}
                    onChange={value => handleInputChange(value, 'keyChallenges')}
                    modules={{
                      toolbar: {
                        container: [
                          ['bold', 'italic', 'underline'], // ✅ Text formatting
                          [{ list: 'ordered' }, { list: 'bullet' }] // ✅ Lists
                        ]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>

            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Decisions Taken</h2>
              <fieldset className='border border-gray-300 rounded p-5 mb-6 mt-2'>
                <FormControl fullWidth margin='normal'>
                  <ReactQuill
                    id='keyDecisions'
                    style={{ height: '40vh', paddingBottom: 50 }}
                    value={formData.details.keyDecisions}
                    onChange={value => handleInputChange(value, 'keyDecisions')}
                    modules={{
                      toolbar: {
                        container: [
                          ['bold', 'italic', 'underline'], // ✅ Text formatting
                          [{ list: 'ordered' }, { list: 'bullet' }] // ✅ Lists
                        ]
                      }
                    }}
                  />
                </FormControl>
              </fieldset>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Key Interactions</h2>
              <fieldset className='border border-gray-300 rounded p-6 mt-2 mb-6'>
                {formData.details.keyInteractions.map((item, index) => (
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
                            container: [
                              ['bold', 'italic', 'underline'], // ✅ Text formatting
                              [{ list: 'ordered' }, { list: 'bullet' }] // ✅ Lists
                            ]
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
                            container: [
                              ['bold', 'italic', 'underline'], // ✅ Text formatting
                              [{ list: 'ordered' }, { list: 'bullet' }] // ✅ Lists
                            ]
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
              <fieldset className='border border-gray-300 rounded p-5 mb-6 mt-2'>
                <div className='grid grid-cols-2 gap-4'>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='portfolioSize' className='block text-sm font-medium text-gray-700'>
                      Portfolio Size *
                    </label>
                    <DynamicTextField
                      type='text'
                      value={formData.details.keyRoleDimensions[0]?.portfolioSize || ''}
                      onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'portfolioSize')}
                      className='border p-2 rounded w-full'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label htmlFor='geographicalCoverage' className='block text-sm font-medium text-gray-700'>
                      Geographical Coverage *
                    </label>
                    <DynamicTextField
                      value={formData.details.keyRoleDimensions[0]?.geographicalCoverage || ''}
                      onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'geographicalCoverage')}
                      className='border p-2 rounded w-full'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label className='block text-sm font-medium text-gray-700'>Team Size *</label>
                    <DynamicTextField
                      value={formData.details.keyRoleDimensions[0]?.teamSize || ''}
                      onChange={e => handleInputChange(e, 'keyRoleDimensions', 0, 'teamSize')}
                      className='border p-2 rounded w-full'
                    />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <label className='block text-sm font-medium text-gray-700'>Total Team Size *</label>
                    <DynamicTextField
                      value={formData.details.keyRoleDimensions[0]?.totalTeamSize || ''}
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
                  options={skillsData || []}
                  getOptionLabel={(option: { name: string }) => option.name || ''}
                  value={(formData.details.skills || []).map(skill => ({ name: skill }))}
                  onChange={(event, newValue) => {
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
                />
              </FormControl>
            </div>
            <div className='border p-4 rounded'>
              <h2 className='text-lg font-semibold mb-2'>Educational and Experience Requirements</h2>
              {formData.details.educationAndExperience.map((item, index) => (
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
                  {/* <Button
                    type='button'
                    onClick={() => handleDeleteItem('educationAndExperience', index)}
                    className='px-4 py-2 text-gray-500 rounded hover:bg-gray-300 hover:text-black flex items-center'
                  >
                    <DeleteIcon />
                  </Button> */}
                </div>
              ))}
              {/* <Button
                type='button'
                onClick={() => handleAddItem('educationAndExperience')}
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Add Education and Experience
              </Button> */}
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
                  value={formData.details.interviewLevels.numberOfLevels}
                  onChange={e => handleInputChange(e.target.value, 'interviewLevels', undefined, 'numberOfLevels')}
                  className='border p-2 rounded w-full mb-2'
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </FormControl>
              {formData.details.interviewLevels.levels.map((level, index) => (
                <FormControl fullWidth margin='normal' key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='body2' sx={{ minWidth: 80 }}>
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
              {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type='button'
                  onClick={() => handleAddItem('interviewLevels')}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  <AddIcon />
                </Button>
              </Box> */}
            </div>
            <div className='flex justify-end'>
              <Button
                sx={{ border: '1px solid #1976d2', color: '#1976d2' }}
                type='submit'
                disabled={isSelectedJdLoading || activeStep < steps.length}
                className={`px-4 py-2 rounded transition ${
                  isSelectedJdLoading || activeStep < steps.length
                    ? 'border border-gray-400 text-gray-400 cursor-not-allowed'
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {isSelectedJdLoading ? 'Submitting...' : 'Update JD'}
              </Button>
            </div>

            {isShowOrgChart && (
              <Grid container spacing={1} className=''>
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
                                      name: formData.details.roleSpecification.jobRole || node.name || 'Untitled Role'
                                    }
                                  : node
                              )
                            }
                          : {
                              nodes: [
                                {
                                  id: 'root',
                                  name: formData.details.roleSpecification.jobRole || 'Untitled Role',
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
