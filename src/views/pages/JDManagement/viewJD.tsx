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

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

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
          Organizational Chart
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
        <Grid item xs={12} md={6}>
          <Grid container spacing={4} direction='column'>
            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Role Summary
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '14px', padding: '5px' }}>
                  {selectedJd.details.roleSummary || 'N/A'}
                </Typography>
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Skills
                </Typography>
                {selectedJd.details.skills?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    {selectedJd.details.skills.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: '#E3F2FD',
                          color: '#1976D2',
                          px: 3,
                          py: 1,
                          borderRadius: '5px',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>

            <Grid item sx={{ mb: 2 }}>
              <Card sx={{ p: 5, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Responsibilities
                </Typography>
                {selectedJd.details.keyResponsibilities?.length > 0 ? (
                  selectedJd.details.keyResponsibilities.map((kr, index) => (
                    <Box key={index} sx={{ mb: 2, mt: 2 }}>
                      <Typography
                        sx={{ fontSize: '15px', backgroundColor: '#f5f5f5', px: 3, py: 1, borderRadius: '5px' }}
                      >
                        {kr.title || 'N/A'}
                      </Typography>
                      <Box
                        sx={{ fontSize: '14px', fontWeight: 500, color: 'black',paddingLeft:5,mt:2 }}
                        dangerouslySetInnerHTML={{ __html: kr.description || 'N/A' }}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Interactions
                </Typography>
                {selectedJd.details.keyInteractions?.length > 0 ? (
                  selectedJd.details.keyInteractions.map((interaction, index) => (
                    <Box key={index} sx={{ mb: 2 ,mt:3 }}>
                      <Grid container spacing={4}>
                        {/* Internal Stakeholders */}
                        <Grid item xs={12} sm={6}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              backgroundColor: '#DCDCDC',
                              px: 2,
                              py: 1,
                              borderRadius: '5px',
                              fontWeight: 500
                            }}
                          >
                            Internal Stakeholders
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            {interaction.internalStakeholders ? (
                              <Typography
                                sx={{ fontSize: '12px', color: 'text.primary' ,paddingLeft:10}}
                                component='div'
                                dangerouslySetInnerHTML={{ __html: interaction.internalStakeholders }}
                              />
                            ) : (
                              <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                            )}
                          </Box>
                        </Grid>

                        {/* External Stakeholders */}
                        <Grid item xs={12} sm={6}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              backgroundColor: '#DCDCDC',
                              px: 2,
                              py: 1,
                              borderRadius: '5px',
                              fontWeight: 500
                            }}
                          >
                            External Stakeholders
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            {interaction.externalStakeholders ? (
                              <Typography
                                sx={{ fontSize: '12px', color: 'text.primary',paddingLeft:10 }}
                                component='div'
                                dangerouslySetInnerHTML={{ __html: interaction.externalStakeholders }}
                              />
                            ) : (
                              <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      {index < selectedJd.details.keyInteractions.length - 1 && <Divider sx={{ my: 3 }} />}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4} direction='column'>
            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2, minHeight: '150px' }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Role Specification
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Job Role', value: toTitleCase(selectedJd.details.roleSpecification?.jobRole || 'N/A') },
                    { label: 'Job Type', value: toTitleCase(selectedJd.details.roleSpecification?.jobType || 'N/A') },
                    {
                      label: 'Company Name',
                      value: toTitleCase(
                        (selectedJd.details.roleSpecification?.companyName || 'N/A').replace(/_/g, ' ')
                      )
                    },
                    {
                      label: 'Notice Period',
                      value: selectedJd.details.roleSpecification?.noticePeriod
                        ? `${selectedJd.details.roleSpecification.noticePeriod} months`
                        : 'N/A'
                    },
                    { label: 'X Factor', value: selectedJd.details.roleSpecification?.xFactor || 'N/A' }
                  ].map((field, index) => (
                    <Grid item xs={4} key={index}>
                      <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>{field.label}</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'black' }}>{field.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2, minHeight: '150px' }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Educational & Experience
                </Typography>
                {selectedJd.details.educationAndExperience?.length > 0 ? (
                  selectedJd.details.educationAndExperience.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Experience</Typography>
                          <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'black' }}>
                            {edu.experienceDescription
                              ? `${edu.experienceDescription.min || 'N/A'} - ${edu.experienceDescription.max || 'N/A'} years`
                              : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Age Limit</Typography>
                          <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'black' }}>
                            {edu.ageLimit || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                            Minimum Qualification
                          </Typography>
                          <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'black' }}>
                            {toTitleCase(edu.minimumQualification || 'N/A')}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2, minHeight: '150x' }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Interview Levels
                </Typography>
                {selectedJd.details.interviewLevels?.levels?.length > 0 ? (
                  <Box>
                    <Typography sx={{ fontSize: '14px', color: 'black', }}>Number of Levels : {selectedJd.details.interviewLevels?.numberOfLevels || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mb: 2 }}>
                      
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedJd.details.interviewLevels.levels.map((level, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: '14px', color: 'black' }}>
                              <strong
                                style={{
                                  backgroundColor: '#E0F7FA',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}
                              >
                                Level {level.level}:
                              </strong>{' '}
                              {toTitleCase(level.designation || 'N/A')}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>
            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2, minHeight: '150px' }}>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
                  Key Role Dimensions
                </Typography>
                {selectedJd.details.keyRoleDimensions?.length > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Portfolio Size</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black' }}>
                        {selectedJd.details.keyRoleDimensions[0]?.portfolioSize || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Geographical Coverage</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black' }}>
                        {selectedJd.details.keyRoleDimensions[0]?.geographicalCoverage || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Team Size</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black' }}>
                        {selectedJd.details.keyRoleDimensions[0]?.teamSize || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Total Team Size</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black' }}>
                        {selectedJd.details.keyRoleDimensions[0]?.totalTeamSize || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>N/A</Typography>
                )}
              </Card>
            </Grid>

            <Grid item>
              <Card sx={{ p: 5, borderRadius: 2 }}>
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
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default JobRoleDetails
