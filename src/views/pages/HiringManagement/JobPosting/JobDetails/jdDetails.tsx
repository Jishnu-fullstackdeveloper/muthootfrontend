'use client'

import React from 'react'


import {
  Box,
  Card,
  Typography,
  Grid,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
  Table
} from '@mui/material'

const ViewJD: React.FC = () => {
  const keyResponsibilities = [
    {
      title: 'Operational Governance',
      description: ['Cascade and communicate branch-wise targets to the team, create daily/weekly/monthly targets.']
    },
    {
      title: 'Business Development',
      description: [
        'Leverage market and customer insights to support product strategy, market opportunities, and potential new branch locations within the assigned area.'
      ]
    }
  ]

  const keyInteractions = [
    {
      type: 'Internal Stakeholders',
      description: [
        'RM: For review of operational performance and approvals.',
        'SULB: For credit checks, collections, and disbursements.',
        'Internal Team: Branch Manager for operational matters, guidance, and support.'
      ]
    },
    {
      type: 'External Stakeholders',
      description: ['Key customers and relationships.', 'Regulatory bodies for compliance-related matters.']
    }
  ]

  const keySkillsAndAttributes = [
    {
      factor: 'Technical Expertise',
      competencies: ['Java', 'Spring Boot', 'API Integration'],
      definitions: ['Java development', 'Backend design'],
      behavioralAttributes: ['Adaptability', 'Problem-solving']
    },
    {
      factor: 'Communication Skills',
      competencies: ['Stakeholder Engagement'],
      definitions: ['Effective communication with clients'],
      behavioralAttributes: ['Team leadership', 'Cross-functional collaboration']
    }
  ]

  const keyRoleDimentions = [
    {
      portfolioSize: '100+',
      geographicalCoverage: '10-14',
      branchesTeamSize: '12-15',
      totalTeamSize: '40-50'
    }
  ]

  const chartData = {
    title: 'CEO',
    children: [
      {
        title: 'CTO',
        children: [{ title: 'Lead Developer' }, { title: 'QA Manager' }]
      },
      {
        title: 'CFO',
        children: [{ title: 'Finance Manager' }, { title: 'Accountant' }]
      }
    ]
  }

  const renderNode = (node: any) => (
    <Box sx={{ textAlign: 'center', position: 'relative', mb: 6 }}>
      {/* Parent Node */}
      <Box
        sx={{
          width: 160,
          height: 50,
          backgroundColor: '#2196F3',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          margin: '0 auto'
        }}
      >
        {node.title}
      </Box>

      {/* Render children recursively */}
      {node.children && (
        <Box sx={{ position: 'relative' }}>
          {/* Vertical Line */}
          <Box
            sx={{
              position: 'absolute',
              top: -16,
              left: '50%',
              width: 2,
              height: 62,
              backgroundColor: '#3f51b5',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Children Container */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 4 }}>
            {node.children.map((child: any, index: number) => (
              <Box key={index} sx={{ position: 'relative', textAlign: 'center' }}>
                {/* Horizontal Line */}
                {node.children.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 46,
                      left: index === 0 ? '50%' : '-50%',
                      width: node.children.length > 1 ? '100%' : '0',
                      height: 2,
                      backgroundColor: '#3f51b5',
                      transform: index === 0 ? 'translateX(-50%)' : 'translateX(50%)'
                    }}
                  />
                )}

                {/* Render Child Node */}
                <Box sx={{ mt: 5, zIndex: 100 }}>{renderNode(child)}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )

  return (
    <Box >
    

      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: '#f5f5f5',
          p: 3,
          borderRadius: 1,
          boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          ASST. BRANCH MANAGER
        </Typography>
      </Box>

      {/* Organizational Chart */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 2, pl: 2, pt: 2 }}>
          Organizational Chart
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{renderNode(chartData)}</Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side Content */}
        <Grid item xs={12} md={8}>
          {/* Role Summary */}
          <Card
            variant='outlined'
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Role Summary
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Proven hands-on experience in leadership and full-stack development within a corporate setting. Candidates
              should demonstrate strong decision-making and communication skills, with proven expertise in technical
              design and agile project delivery.
            </Typography>
          </Card>

          {/* Key Responsibilities */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Responsibilities
            </Typography>
            {keyResponsibilities.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TableContainer sx={{ maxHeight: 'none', overflow: 'hidden' }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none', verticalAlign: 'top', width: '30%', pr: 2 }}>
                          <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#444' }}>
                            {item.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', verticalAlign: 'top', width: '70%' }}>
                          {item.description.map((desc, idx) => {
                            const words = desc.split(' ')
                            const lines = []
                            let currentLine = ''

                            words.forEach((word, i) => {
                              if ((currentLine + word).split(' ').length > 10 || i === words.length - 1) {
                                lines.push(currentLine.trim())
                                currentLine = word + ' '
                              } else {
                                currentLine += word + ' '
                              }
                            })

                            return lines.map((line, lineIdx) => (
                              <Typography key={`${idx}-${lineIdx}`} variant='body2' sx={{ color: '#666', mb: 1 }}>
                                {line}
                              </Typography>
                            ))
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Card>

          {/* Key Challenges */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Challenges
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Adapting to evolving market trends, driving technical innovation while maintaining compliance, and
              ensuring cross-functional collaboration with varying business unit objectives.
            </Typography>
          </Card>

          {/* Key Interactions */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Interactions
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {keyInteractions.map((interaction, index) => (
                <Box key={index} sx={{ width: '48%', p: index === 0 ? '0 1% 0 0' : '0 0 0 1%' }}>
                  <Typography
                    variant='body2'
                    sx={{ color: '#444', mb: 2, backgroundColor: '#f5f5f5', p: '6px 10px', borderRadius: '4px' }}
                  >
                    <strong>{interaction.type}</strong>
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#666', pl: 2 }}>
                    {interaction.description.map((item, idx) => (
                      <span key={idx}>
                        {item.trim()}
                        <br />
                        <br />
                      </span>
                    ))}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Education & Experience */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Educational & Experience
            </Typography>
            <Typography sx={{ color: '#555', mb: 1 }}>
              <strong>Minimum Qualification:</strong> Bachelor’s Degree in Computer Science/Related Fields
            </Typography>
            <Typography sx={{ color: '#555' }}>
              <strong>Nature of Experience:</strong> 5+ years of experience in software development, with at least 2
              years in a leadership role.
            </Typography>
          </Card>
        </Grid>

        {/* Right Side Content */}
        <Grid item xs={12} md={4}>
          {/* Company & Reporting Details */}
          <Card
            variant='outlined'
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Role Details
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Role Title:</strong> ABC Developer
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Employee Interviewed:</strong> ABC Ltd.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Reports To:</strong> Regional Manager
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Company Name:</strong> ABC Ltd.
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Function/Department:</strong> Branch Business
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Written By:</strong> Korn Ferry
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Approved By (Jobholder):</strong> HR Department
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Approved By (Immediate Superior):</strong> HR Department
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Date (Written On):</strong> 10-01-2023
            </Typography>
          </Card>

          {/* Skills & Attributes */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Skills & Attributes
            </Typography>
            {keySkillsAndAttributes.map((section, index) => (
              <Box key={index} sx={{ mb: 3, borderBottom: '1px solid #ddd', pb: 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1, color: '#444' }}>
                  Factor/Category: {section.factor}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Competencies:</strong> {section.competencies.join(', ')}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Definitions:</strong> {section.definitions.join(', ')}
                </Typography>
                <Typography variant='body2' sx={{ color: '#666' }}>
                  <strong>Behavioral Attributes:</strong> {section.behavioralAttributes.join(', ')}
                </Typography>
              </Box>
            ))}
          </Card>

          {/* Key Role Dimensions */}
          <Card variant='outlined' sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Role Dimensions
            </Typography>
            {keyRoleDimentions.map((dimentions, index) => (
              <Box key={index}>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Portfolio Size:</strong> {dimentions.portfolioSize}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Geographical Coverage:</strong> {dimentions.geographicalCoverage}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Branches Team Size:</strong> {dimentions.branchesTeamSize}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
                  <strong>Total Team Size:</strong> {dimentions.totalTeamSize}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ViewJD
