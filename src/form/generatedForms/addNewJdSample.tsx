'use client'

import React, { useEffect, useState } from 'react'

import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow'

import ReactQuill from 'react-quill'

import 'reactflow/dist/style.css'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import { Alert, Autocomplete, Box, Button, Card, FormControl, MenuItem, TextField, Typography } from '@mui/material'

import type { OrganizationChart, Node, Edge } from './types'

import OrgChartCanvas, { CustomNode } from './addOrganizationChart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { fetchJobRole, fetchDesignation, fetchDepartment, addNewJd } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'

// Define nodeTypes for ReactFlow
const nodeTypes = { custom: CustomNode }

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
      } else if (section === 'keyInteractions') {
        newData.keyInteractions.push({ internalStakeholders: '', externalStakeholders: '' })
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

      // Add the requested sub-item
      ;(newData[section] as any)[index][subArray].push({ value: '' })

      // If adding a competency, also add a definition and a behavioural attribute
      if (section === 'skillsAndAttributesDetails' && subArray === 'competency') {
        ;(newData[section] as any)[index]['definition'].push({ value: '' })
        ;(newData[section] as any)[index]['behavioural_attributes'].push({ value: '' })
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
    dispatch(fetchJobRole(params))
    dispatch(fetchDesignation(params))
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

  // Helper function to convert to React Flow nodes
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

  // Helper function to convert to React Flow edges
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
                    {isChartVisible && (
                      <div className='mt-4 border border-gray-300 rounded-lg overflow-hidden'>
                        <ReactFlow
                          nodes={convertToReactFlowNodes(formData.organizationChart)}
                          edges={convertToReactFlowEdges(formData.organizationChart)}
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
                      options={jobRoleData.map(job => job.name || '')}
                      value={formData.roleSpecification[0].roleTitle || ''}
                      onChange={(event, newValue) =>
                        handleInputChange({ target: { value: newValue || '' } }, 'roleSpecification', 0, 'roleTitle')
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
                      renderInput={params => (
                        <TextField {...params} label='Reports To' placeholder='Select Reports To' />
                      )}
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
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Function/Department'
                          placeholder='Select Function or Department'
                        />
                      )}
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
                <fieldset className='border border-gray-300 rounded p-8 mb-6 mt-2'>
                  <FormControl fullWidth>
                    <ReactQuill
                      style={{ height: '40vh', paddingBottom: 50 }}
                      value={formData.roleSummary}
                      onChange={e => handleInputChange(e, 'roleSummary')}
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
                  </FormControl>
                </fieldset>
              </div>

              {/* Key Responsibilities */}
              <div className='border p-4 rounded'>
                <h2 className='text-lg font-semibold mb-2'>Key Responsibilities</h2>
                {formData.keyResponsibilities.map((item, index) => (
                  <div key={index} className='mb-2'>
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
                    </FormControl>
                  </div>
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
                          container: [
                            [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: ['Jost', 'Poppins'] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                          ]
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
                      value={formData.keyDecisions}
                      onChange={e => handleInputChange(e, 'keyDecisions')}
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
                  </FormControl>
                </fieldset>
              </div>

              {/* Key Interactions */}
              <div className='border p-4 rounded'>
                <h2 className='text-lg font-semibold mb-2'>Key Interactions</h2>
                <fieldset className='border border-gray-300 rounded p-8 mt-2 mb-6'>
                  {formData.keyInteractions.map((item, index) => (
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
                            onChange={e => handleInputChange(e, 'keyInteractions', index, 'internalStakeholders')}
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
                            onChange={e => handleInputChange(e, 'keyInteractions', index, 'externalStakeholders')}
                          />
                        </FormControl>
                      </div>
                    </>
                  ))}
                </fieldset>
                <Button
                  type='button'
                  onClick={() => handleAddItem('keyInteractions')}
                  className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Add Interaction
                </Button>
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
                  <div key={index} className='mb-4'>
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
                    <div>
                      <h3 className='text-sm font-medium'>Competency</h3>
                      {item.competency.map((comp, compIndex) => (
                        <FormControl fullWidth margin='normal' key={compIndex}>
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
                      ))}
                      <Button
                        type='button'
                        onClick={() => handleAddSubItem('skillsAndAttributesDetails', index, 'competency')}
                        className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                      >
                        Add Competency
                      </Button>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium'>Definition</h3>
                      {item.definition.map((def, defIndex) => (
                        <FormControl fullWidth margin='normal' key={defIndex}>
                          <label
                            htmlFor={`definition-${index}-${defIndex}`}
                            className='block text-sm font-medium text-gray-700'
                          >
                            Definition *
                          </label>
                          <DynamicTextField
                            type='text'
                            placeholder='Definition'
                            value={def.value}
                            onChange={e =>
                              handleInputChange(
                                e,
                                'skillsAndAttributesDetails',
                                index,
                                'definition',
                                'definition',
                                defIndex
                              )
                            }
                            className='border p-2 rounded w-full mb-2'
                          />
                        </FormControl>
                      ))}
                      <Button
                        type='button'
                        onClick={() => handleAddSubItem('skillsAndAttributesDetails', index, 'definition')}
                        className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                      >
                        Add Definition
                      </Button>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium'>Behavioural Attributes</h3>
                      {item.behavioural_attributes.map((attr, attrIndex) => (
                        <FormControl fullWidth margin='normal' key={attrIndex}>
                          <label
                            htmlFor={`behavioural_attributes-${index}-${attrIndex}`}
                            className='block text-sm font-medium text-gray-700'
                          >
                            Behavioural Attribute *
                          </label>
                          <DynamicTextField
                            type='text'
                            placeholder='Behavioural Attribute'
                            value={attr.value}
                            onChange={e =>
                              handleInputChange(
                                e,
                                'skillsAndAttributesDetails',
                                index,
                                'behavioural_attributes',
                                'behavioural_attributes',
                                attrIndex
                              )
                            }
                            className='border p-2 rounded w-full mb-2'
                          />
                        </FormControl>
                      ))}
                      <Button
                        type='button'
                        onClick={() => handleAddSubItem('skillsAndAttributesDetails', index, 'behavioural_attributes')}
                        className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                      >
                        Add Behavioural Attribute
                      </Button>
                    </div>
                  </div>
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
                      <DynamicTextField
                        multiline
                        rows={4}
                        placeholder='Experience Description'
                        value={item.experienceDescription}
                        onChange={e => handleInputChange(e, 'educationAndExperience', index, 'experienceDescription')}
                        className='border p-2 rounded w-full'
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
              <Button
                type='submit'
                disabled={isAddJdLoading || activeStep < steps.length} // Disable if loading or form incomplete
                className={`px-4 py-2 rounded ${
                  isAddJdLoading || activeStep < steps.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isAddJdLoading ? 'Submitting...' : 'Submit Job Description'}
              </Button>
            </form>

            {/* Organization Chart Modal */}
            {showOrgChart && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <div className='bg-white p-4 rounded w-full h-full'>
                  <Button
                    onClick={() => setShowOrgChart(false)}
                    className='mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                  >
                    Close
                  </Button>
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
