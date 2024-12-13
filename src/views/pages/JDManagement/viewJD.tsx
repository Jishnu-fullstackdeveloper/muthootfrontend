import React from 'react'
import { Box, Card, Divider, Link, Typography, Grid } from '@mui/material'

// Types for dynamic data rendering

type Props = {
  mode: any
  id: any
}

const viewJD: React.FC<Props> = ({ mode, id }) => {
  let keyResponsibilities = [
    { title: 'Lead development', description: 'Manage the end-to-end product development lifecycle' },
    { title: 'Review processes', description: 'Ensure team compliance with coding best practices' }
  ]

  let keyInteractions = [
    { type: 'Internal Stakeholders', description: 'Coordination with product and design teams' },
    { type: 'External Stakeholders', description: 'Client discussions and feedback loops' }
  ]

  let keySkillsAndAttributes = [
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

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          mb: 4
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          ASST. BRANCH MANAGER
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side Content */}
        <Grid item xs={8}>
          {/* Role Summary */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Role Summary
            </Typography>
            <Typography>
              Proven hands-on experience in leadership and full-stack development within a corporate setting. Candidates
              should demonstrate strong decision-making and communication skills, with proven expertise in technical
              design and agile project delivery.
            </Typography>
          </Card>

          {/* Key Responsibilities */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Key Responsibilities
            </Typography>
            {keyResponsibilities.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Typography variant='body2'>{item.description}</Typography>
              </Box>
            ))}
          </Card>

          {/* Key Challenges */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Key Challenges
            </Typography>
            <Typography>
              Adapting to evolving market trends, driving technical innovation while maintaining compliance, and
              ensuring cross-functional collaboration with varying business unit objectives.
            </Typography>
          </Card>

          {/* Key Interactions */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Key Interactions
            </Typography>
            {keyInteractions.map((interaction, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant='body2'>
                  <strong>{interaction.type}:</strong> {interaction.description}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Right Side Content */}
        <Grid item xs={4}>
          {/* Company & Reporting Details */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Role Details
            </Typography>
            <Typography>
              <strong>Company Name:</strong> ABC Ltd.
            </Typography>
            <Typography>
              <strong>Reporting To:</strong> John Doe
            </Typography>
            <Typography>
              <strong>Function/Department:</strong> Research & Development
            </Typography>
            <Typography>
              <strong>Written By:</strong> HR Department
            </Typography>
          </Card>

          {/* Skills & Attributes */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Key Skills & Attributes
            </Typography>
            {keySkillsAndAttributes.map((section, index) => (
              <Box key={index} sx={{ mb: 3, borderBottom: '1px solid #ddd', pb: 2 }}>
                {/* Separate each mapping item distinctly */}
                <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Factor/Category: {section.factor}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  <strong>Competencies:</strong> {section.competencies.join(', ')}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  <strong>Definitions:</strong> {section.definitions.join(', ')}
                </Typography>
                <Typography variant='body2'>
                  <strong>Behavioral Attributes:</strong> {section.behavioralAttributes.join(', ')}
                </Typography>
              </Box>
            ))}
          </Card>

          {/* Education & Experience */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Educational & Experience Description
            </Typography>
            <Typography>
              Bachelor’s Degree in Computer Science/Related Fields with 5+ years of relevant experience in leadership
              and technical expertise areas.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default viewJD
