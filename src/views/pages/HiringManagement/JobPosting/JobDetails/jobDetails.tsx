import { useState } from 'react'

import CandidateListing from './candidateListing'

import JdDetails from './jdDetails'

import VacancyDetails from './vaccancyDetails'

export default function Home() {
  const [activeTab, setActiveTab] = useState('Employee Details')

  return (
    <div className='p-4 border rounded-lg shadow-md'>
      {/* Tab Navigation */}
      <div className='flex border-b'>

      <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Vacancy Details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Vacancy Details')}
        >
          Vacancy Details
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Jd Details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Jd Details')}
        >
          Jd Details
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Candidate Listing' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Candidate Listing')}
        >
          Candidate Listing
        </button>

      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Candidate Listing' && <CandidateListing />}
         {activeTab === 'Jd Details' && <JdDetails />}
        {activeTab === 'Vacancy Details' && <VacancyDetails />}
      </div>
    </div>
  )
}

// import { useState } from 'react'

// import Accordion from '@mui/material/Accordion'
// import AccordionSummary from '@mui/material/AccordionSummary'
// import AccordionDetails from '@mui/material/AccordionDetails'
// import Typography from '@mui/material/Typography'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// import CandidateListing from './candidateListing'
// import JdDetails from './jdDetails'
// import VacancyDetails from './vaccancyDetails'

// export default function Home() {
//   const [expanded, setExpanded] = useState('panel1')

//   const handleChange = panel => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false)
//   }

//   return (
//     <div className='p-4 border rounded-lg shadow-md'>
//       <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1bh-content' id='panel1bh-header'>
//           <Typography>Vacancy Details</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <VacancyDetails />
//         </AccordionDetails>
//       </Accordion>

//       <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2bh-content' id='panel2bh-header'>
//           <Typography>Jd Details</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <JdDetails />
//         </AccordionDetails>
//       </Accordion>

//       <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3bh-content' id='panel3bh-header'>
//           <Typography>Candidate Listing</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <CandidateListing />
//         </AccordionDetails>
//       </Accordion>
//     </div>
//   )
// }
