'use client'
import * as React from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

interface AccordionItemProps {
  id: string
  title: string
  content: React.ReactNode
  renderActions?: () => React.ReactNode
  defaultExpanded?: boolean
  disabled?: boolean
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  content,
  renderActions,
  defaultExpanded = false,
  disabled = false
}) => (
  <Accordion key={id} defaultExpanded={defaultExpanded} disabled={disabled}>
    <AccordionSummary
      aria-controls={`${id}-content`}
      id={`${id}-header`}
      sx={{
        fontWeight: 'bold'
      }}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails>{content}</AccordionDetails>
    {renderActions && <AccordionActions>{renderActions()}</AccordionActions>}
  </Accordion>
)

interface DynamicAccordionProps {
  children: React.ReactNode
}

const DynamicAccordion: React.FC<DynamicAccordionProps> = ({ children }) => {
  return <div>{children}</div>
}

export { DynamicAccordion, AccordionItem }
