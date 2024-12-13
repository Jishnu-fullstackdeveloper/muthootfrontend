'use client'
import { DynamicAccordion, AccordionItem } from '@/components/Accordion/dynamicAccordion'
import React from 'react'
import Button from '@mui/material/Button'

const Page: React.FC = () => {
  return (
    <div>
      <DynamicAccordion>
        <AccordionItem
          id='panel1'
          title='Accordion 1'
          content={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
          defaultExpanded
        />
        <AccordionItem
          id='panel2'
          title='Accordion 2'
          content={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
          renderActions={() => (
            <>
              <Button>Cancel</Button>
              <Button>Agree</Button>
            </>
          )}
        />
        <AccordionItem
          id='panel3'
          title='Accordion 3'
          content={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
          disabled
        />
        <AccordionItem
          id='panel4'
          title='Accordion 4'
          content={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
        />
      </DynamicAccordion>
    </div>
  )
}

export default Page
