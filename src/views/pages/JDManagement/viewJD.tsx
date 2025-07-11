'use client'
import React, { useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Box, Typography, CircularProgress, Alert } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJdById } from '@/redux/jdManagemenet/jdManagemnetSlice'

const JobRoleDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const { selectedJd, isSelectedJdLoading, selectedJdSuccess, selectedJdFailure, selectedJdFailureMessage } =
    useAppSelector(state => state.jdManagementReducer)

  console.log('Job Role ID from useParams:', id)

  useEffect(() => {
    console.log(fetchJdById, 'fetchJd dispatched with ID:', id)

    if (id && typeof id === 'string') {
      console.log('Dispatching fetchJdById with ID:', id)
      dispatch(fetchJdById(id))
    }
  }, [id, dispatch])

  console.log('Selected JD:', selectedJd)

  if (isSelectedJdLoading) {
    return <CircularProgress />
  }

  if (selectedJdFailure) {
    return <Alert severity='error'>{selectedJdFailureMessage}</Alert>
  }

  if (!selectedJdSuccess || !selectedJd) {
    return <Alert severity='info'>No job role data found.</Alert>
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4'>Job Role Details</Typography>
      <Typography variant='body1'>
        <strong>ID:</strong> {selectedJd.id}
      </Typography>
      <Typography variant='body1'>
        <strong>Job Role ID:</strong> {selectedJd.jobRoleId}
      </Typography>
      <Typography variant='body1'>
        <strong>Title:</strong> {selectedJd.details.roleSpecification[0]?.roleTitle || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Company:</strong> {selectedJd.details.roleSpecification[0]?.companyName || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Department:</strong> {selectedJd.details.roleSpecification[0]?.functionOrDepartment || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Approval Status:</strong> {selectedJd.approvalStatus}
      </Typography>
      <Typography variant='body1'>
        <strong>Created At:</strong> {new Date(selectedJd.createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant='body1'>
        <strong>Role Summary:</strong> {selectedJd.details.roleSummary || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Key Decisions:</strong> {selectedJd.details.keyDecisions || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Key Challenges:</strong> {selectedJd.details.keyChallenges || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>External Stakeholders:</strong> {selectedJd.details.keyInteractions[0]?.externalStakeholders || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Internal Stakeholders:</strong> {selectedJd.details.keyInteractions[0]?.internalStakeholders || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Team Size:</strong> {selectedJd.details.keyRoleDimensions[0]?.teamSize || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Portfolio Size:</strong> {selectedJd.details.keyRoleDimensions[0]?.portfolioSize || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Total Team Size:</strong> {selectedJd.details.keyRoleDimensions[0]?.totalTeamSize || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Geographical Coverage:</strong> {selectedJd.details.keyRoleDimensions[0]?.geographicalCoverage || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Organization Chart Name:</strong> {selectedJd.details.organizationChart?.name || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Reports To:</strong> {selectedJd.details.roleSpecification[0]?.reportsTo || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Written By:</strong> {selectedJd.details.roleSpecification[0]?.writtenBy || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Date Written:</strong>{' '}
        {selectedJd.details.roleSpecification[0]?.dateWritten
          ? new Date(selectedJd.details.roleSpecification[0].dateWritten).toLocaleDateString()
          : 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Approved By Superior:</strong> {selectedJd.details.roleSpecification[0]?.approvedBySuperior || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Approved By Jobholder:</strong> {selectedJd.details.roleSpecification[0]?.approvedByJobholder || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Employee Interviewed:</strong> {selectedJd.details.roleSpecification[0]?.employeeInterviewed || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Key Responsibilities:</strong> {selectedJd.details.keyResponsibilities[0]?.title || 'N/A'} -{' '}
        {selectedJd.details.keyResponsibilities[0]?.description || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Minimum Qualification:</strong>{' '}
        {selectedJd.details.educationAndExperience[0]?.minimumQualification || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Experience Description:</strong>{' '}
        {selectedJd.details.educationAndExperience[0]?.experienceDescription || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Skills and Attributes Type:</strong> {selectedJd.details.skillsAndAttributesType || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Skills Factor:</strong> {selectedJd.details.skillsAndAttributesDetails[0]?.factor || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Competency:</strong> {selectedJd.details.skillsAndAttributesDetails[0]?.competency[0]?.value || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Definition:</strong> {selectedJd.details.skillsAndAttributesDetails[0]?.definition[0]?.value || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Behavioural Attributes:</strong>{' '}
        {selectedJd.details.skillsAndAttributesDetails[0]?.behavioural_attributes[0]?.value || 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Updated At:</strong> {new Date(selectedJd.updatedAt).toLocaleDateString()}
      </Typography>
      <Typography variant='body1'>
        <strong>Deleted At:</strong>{' '}
        {selectedJd.deletedAt ? new Date(selectedJd.deletedAt).toLocaleDateString() : 'N/A'}
      </Typography>
      <Typography variant='body1'>
        <strong>Deleted By:</strong> {selectedJd.deletedBy || 'N/A'}
      </Typography>
    </Box>
  )
}

export default JobRoleDetails
