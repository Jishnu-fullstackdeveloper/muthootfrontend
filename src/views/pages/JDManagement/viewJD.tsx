import React from 'react'
import { Box, Card, Divider, Link, Typography, Grid, Button, Stack } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

type Props = {
  mode: any
  id: any
}

const viewJD: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()
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

  // Recursive function to render the tree
  // const renderNode = (node: any) => (
  //   <Box sx={{ textAlign: 'center', position: 'relative', mb: 6 }}>
  //     {/* Parent Node */}
  //     <Box
  //       sx={{
  //         width: 160,
  //         height: 50,
  //         backgroundColor: '#2196F3',
  //         borderRadius: 8,
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         fontWeight: 'bold',
  //         color: '#fff',
  //         margin: '0 auto'
  //       }}
  //     >
  //       {node.title}
  //     </Box>

  //     {/* Render children recursively */}
  //     {node.children && (
  //       <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
  //         {/* Vertical line connecting parent to the children */}
  //         <Box
  //           sx={{
  //             position: 'absolute',
  //             top: 0,
  //             left: '50%',
  //             width: 2,
  //             height: 30,
  //             backgroundColor: '#3f51b5'
  //           }}
  //         />

  //         {/* Horizontal lines to connect left and right children */}
  //         <Box
  //           sx={{
  //             position: 'absolute',
  //             top: 30,
  //             // left: 0,
  //             width: '20%',
  //             height: 2,
  //             backgroundColor: '#3f51b5'
  //           }}
  //         />
  //         <Box
  //           sx={{
  //             position: 'absolute',
  //             top: 30,
  //             // right: 0,
  //             width: '20%',
  //             height: 2,
  //             backgroundColor: '#3f51b5'
  //           }}
  //         />

  //         {/* Render child nodes */}
  //         <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '50%' }}>
  //           {node.children.map((child: any, index: number) => (
  //             <Box
  //               key={index}
  //               sx={{
  //                 display: 'flex',
  //                 flexDirection: 'column',
  //                 alignItems: 'center',
  //                 position: 'relative'
  //               }}
  //             >
  //               {/* Child Node */}
  //               <Box
  //                 sx={{
  //                   width: 140,
  //                   height: 50,
  //                   marginTop: 2,
  //                   backgroundColor: '#e3f2fd',
  //                   borderRadius: 8,
  //                   display: 'flex',
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                   fontWeight: 'bold',
  //                   color: '#1e88e5'
  //                 }}
  //               >
  //                 {child.title}
  //               </Box>

  //               {/* Recursively render child nodes */}
  //               {child.children && (
  //                 <Box sx={{ mt: 3 }}>
  //                   {child.children.map((subChild: any, subIndex: number) => (
  //                     <Box
  //                       key={subIndex}
  //                       sx={{
  //                         display: 'flex',
  //                         flexDirection: 'row',
  //                         alignItems: 'center',
  //                         position: 'relative'
  //                       }}
  //                     >
  //                       {/* Render sub-child node */}
  //                       <Box
  //                         sx={{
  //                           width: 140,
  //                           height: 50,
  //                           backgroundColor: '#e3f2fd',
  //                           borderRadius: 8,
  //                           display: 'flex',
  //                           alignItems: 'center',
  //                           justifyContent: 'center',
  //                           fontWeight: 'bold',
  //                           color: '#1e88e5'
  //                         }}
  //                       >
  //                         {subChild.title}
  //                       </Box>
  //                     </Box>
  //                   ))}
  //                 </Box>
  //               )}
  //             </Box>
  //           ))}
  //         </Box>
  //       </Box>
  //     )}
  //   </Box>
  // )

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
              backgroundColor: '#3f51b5'
              // transform: 'translateX(-50%)'
            }}
          />

          {/* Children Container */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
            {node.children.map((child: any, index: number) => (
              <Box key={index} sx={{ position: '', textAlign: 'center' }}>
                {/* Horizontal Line */}
                {node.children.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 45,
                      left: '50%',
                      width: index === 0 ? 'calc(50% + 40px)' : '0',
                      height: 2,
                      backgroundColor: '#3f51b5',
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}

                {/* Render Child Node */}
                <Box sx={{ mt: 5, zIndex: 100, marginRight: 10, marginLeft: 10 }}>{renderNode(child)}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={4}>
        <Button startIcon={<ArrowBack />} variant='text' onClick={() => router.push('/jd-management')}>
          Back to JD List
        </Button>
      </Box>
      {/* Header Section */}
      <Box
        sx={{
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

      {/* Oragnizational chart */}

      <Box
        sx={{
          // position: 'sticky',
          top: 0,
          mb: 4,
          backgroundColor: '#fff',
          padding: 2,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 2, pl: 4, pt: 2 }}>
          Organizational Chart
        </Typography>

        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}> */}
        {renderNode(chartData)}
        {/* </Box> */}
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
