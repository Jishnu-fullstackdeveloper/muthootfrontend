import React from 'react'
import DynamicCard from '@/components/Card/dynamicCard'
import { Divider, Stack, Typography } from '@mui/material'

function Page() {
  return (
    <div>
      <DynamicCard
        cardHeader={
          <>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography variant='h5'>Lizard</Typography>
            </Stack>
            <Divider />
          </>
        }
        cardBody={
          <>
            <Typography variant='body1'>
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
              continents except Antarctica.
            </Typography>
          </>
        }
        sx={{ base: { width: '50%' } }}
      />
    </div>
  )
}

export default Page
