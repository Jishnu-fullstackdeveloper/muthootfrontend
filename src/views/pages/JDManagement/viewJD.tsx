'use client'
import React, { useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Box, Typography, CircularProgress, Alert, Card, Grid, Divider } from '@mui/material'

import { Tree, TreeNode } from 'react-organizational-chart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJdById } from '@/redux/jdManagemenet/jdManagemnetSlice'

const JobRoleDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const { selectedJd, isSelectedJdLoading, selectedJdSuccess, selectedJdFailure, selectedJdFailureMessage } =
    useAppSelector(state => state.jdManagementReducer)

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchJdById(id))
    }
  }, [id, dispatch])

  if (isSelectedJdLoading) return <CircularProgress />
  if (selectedJdFailure) return <Alert severity='error'>{selectedJdFailureMessage}</Alert>
  if (!selectedJdSuccess || !selectedJd) return <Alert severity='info'>No job role data found.</Alert>

  const renderNode = node => (
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
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            fontSize: '14px',
            display: 'inline-block'
          }}
        >
          {node.name}
        </Box>
      }
    >
      {node.children && node.children.map(child => renderNode(child))}
    </TreeNode>
  )

  return (
    <Box>
     

      <Card sx={{ mb: 4, p: 3, overflow: 'auto' }}>
         <Typography variant='h5' gutterBottom>
        Organisational Chart
      </Typography>
        {selectedJd.details.organizationChart ? (
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  fontSize: '14px',
                  display: 'inline-block'
                }}
              >
                {selectedJd.details.organizationChart.name}
              </Box>
            }
          >
            {selectedJd.details.organizationChart.children.map(child => renderNode(child))}
          </Tree>
        ) : (
          <Typography variant='body2'>No organizational chart available.</Typography>
        )}
      </Card>

      <Grid container spacing={2}>
        {/* Left column */}
        <Grid item xs={12} md={6} >
          <Grid container spacing={4} direction='column'>
            <Grid item>
              {/* <Card sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
                <Typography variant='subtitle1' gutterBottom>
                  Role Summary
                </Typography>
                <Typography variant='body2'></Typography>
              </Card> */}

              <Card
                sx={{
                  p: 3,
                  borderRadius: 2
                }}
              >
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Role Summary
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '14px' ,padding:'5px'}}>
                  {selectedJd.details.roleSummary || 'N/A'}
                </Typography>
              </Card>
            </Grid>

            <Grid item sx={{ mb: 2 }}>
              <Card sx={{ p: 3, borderRadius: 2, }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Responsibilities
                </Typography>
                {selectedJd.details.keyResponsibilities?.map((kr, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '12px' }}>{kr.title}</Typography>
                    <Box
                      sx={{ fontSize: '14px', fontWeight: 500, color: 'black' }}
                      dangerouslySetInnerHTML={{ __html: kr.description }}
                    />
                  </Box>
                ))}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Challenges
                </Typography>
                {selectedJd.details.keyChallenges ? (
                  <Box
                    sx={{ color: 'text.secondary', fontSize: '14px' }}
                    dangerouslySetInnerHTML={{ __html: selectedJd.details.keyChallenges }}
                  />
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Interactions
                </Typography>

                {selectedJd.details.keyInteractions?.length > 0 ? (
                  selectedJd.details.keyInteractions.map((interaction, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      {interaction.internalStakeholders ? (
                        <Box
                          sx={{ fontSize: '14px' }}
                          dangerouslySetInnerHTML={{
                            __html: `<strong>Internal Stakeholders:</strong> ${interaction.internalStakeholders}`
                          }}
                        />
                      ) : (
                        <Typography variant='body2'>
                          <strong>Internal Stakeholders:</strong> N/A
                        </Typography>
                      )}

                      {interaction.externalStakeholders ? (
                        <Box
                          sx={{ fontSize: '14px' }}
                          dangerouslySetInnerHTML={{
                            __html: `<strong>External Stakeholders:</strong> ${interaction.externalStakeholders}`
                          }}
                        />
                      ) : (
                        <Typography variant='body2'>
                          <strong>External Stakeholders:</strong> N/A
                        </Typography>
                      )}

                      {index < selectedJd.details.keyInteractions.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))
                ) : (
                  <Typography variant='body2'>N/A</Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4} direction='column'>
            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Role Details
                </Typography>
                <Grid container spacing={2}>
                  {/* Grid items stay the same */}
                  {[
                    { label: 'Role Title', value: selectedJd.details.roleSpecification[0]?.roleTitle },
                    {
                      label: 'Employee Interviewed',
                      value: selectedJd.details.roleSpecification[0]?.employeeInterviewed
                    },
                    { label: 'Reports to', value: selectedJd.details.roleSpecification[0]?.reportsTo },
                    { label: 'Written by', value: selectedJd.details.roleSpecification[0]?.writtenBy },
                    { label: 'Approved By', value: selectedJd.details.roleSpecification[0]?.approvedBySuperior },
                    {
                      label: 'Date',
                      value: selectedJd.details.roleSpecification[0]?.dateWritten
                        ? new Date(selectedJd.details.roleSpecification[0].dateWritten).toLocaleDateString()
                        : 'N/A'
                    }
                  ].map((field, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>{field.label}</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'black' }}>
                        {field.value || 'N/A'}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Educational & Experience
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {selectedJd.details.educationAndExperience[0]?.minimumQualification ? (
                    <Box>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Minimum Qualification</Typography>
                      <Typography sx={{ fontWeight: 500, color: 'black', fontSize: '14px' }}>
                        {selectedJd.details.educationAndExperience[0].minimumQualification}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant='body2'>N/A</Typography>
                  )}
                </Typography>

                {selectedJd.details.educationAndExperience[0]?.experienceDescription ? (
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Nature of Experience</Typography>

                    <Box
                      sx={{ fontSize: '14px', mt: 1 }}
                      dangerouslySetInnerHTML={{
                        __html: selectedJd.details.educationAndExperience[0].experienceDescription
                      }}
                    />
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    <strong>Nature of Experience:</strong> N/A
                  </Typography>
                )}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black', mb: 2 }}>
                  Key Role Dimensions
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Portfolio Size</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedJd.details.keyRoleDimensions[0]?.portfolioSize || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Geographical Coverage</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedJd.details.keyRoleDimensions[0]?.geographicalCoverage || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Branches Team Size</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedJd.details.keyRoleDimensions[0]?.teamSize || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Total Team Size</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedJd.details.keyRoleDimensions[0]?.totalTeamSize || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Skills & Attributes
                </Typography>
                {selectedJd.details.skillsAndAttributesDetails?.map((skill, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant='body2' sx={{color:'black', marginBottom: '6px'}}>
                      <strong>Factor:</strong> {skill.factor}
                    </Typography>
                    <Typography variant='body2' sx={{color:'black' ,marginBottom: '6px'}}>
                      <strong>Competencies:</strong> {skill.competency?.map(c => c.value).join(', ')}
                    </Typography>
                    <Typography variant='body2' sx={{color:'black', marginBottom: '6px'}}>
                      <strong>Definitions:</strong> {skill.definition?.map(d => d.value).join(', ')}
                    </Typography>
                    <Typography variant='body2' sx={{color:'black', marginBottom: '10px'}}>
                      <strong>Behavioral Attributes:</strong>{' '}
                      {skill.behavioural_attributes?.map(b => b.value).join(', ')}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default JobRoleDetails
