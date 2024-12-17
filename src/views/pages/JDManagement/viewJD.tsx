import React from 'react'
import { Box, Card, Divider, Link, Typography, Grid } from '@mui/material'

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
          mb: 4,
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          ASST. BRANCH MANAGER
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Left Side Content */}
        <Grid item xs={8}>
          {/* Role Summary */}
          <Card
            variant='outlined'
            sx={{
              mb: 3,
              padding: 3,
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
          <Card variant='outlined' sx={{ mb: 3, padding: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Responsibilities
            </Typography>
            {keyResponsibilities.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#444' }}>
                  {item.title}
                </Typography>
                <Typography variant='body2' sx={{ color: '#666' }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Card>

          {/* Key Challenges */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Challenges
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Adapting to evolving market trends, driving technical innovation while maintaining compliance, and
              ensuring cross-functional collaboration with varying business unit objectives.
            </Typography>
          </Card>

          {/* Key Interactions */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Key Interactions
            </Typography>
            {keyInteractions.map((interaction, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant='body2' sx={{ color: '#444' }}>
                  <strong>{interaction.type}:</strong> {interaction.description}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Right Side Content */}
        <Grid item xs={4}>
          {/* Company & Reporting Details */}
          <Card
            variant='outlined'
            sx={{
              mb: 3,
              padding: 3,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
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
          <Card variant='outlined' sx={{ mb: 3, padding: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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

          {/* Education & Experience */}
          <Card variant='outlined' sx={{ mb: 3, padding: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
              Educational & Experience Description
            </Typography>
            <Typography sx={{ color: '#555' }}>
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
