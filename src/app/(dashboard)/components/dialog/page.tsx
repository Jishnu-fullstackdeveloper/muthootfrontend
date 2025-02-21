'use client'

import React, { useState } from 'react'

import { Button } from '@mui/material'

import DynamicDialog from '@/components/Dialog/dynamicDialog'

function Page() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const dialogTitles = "Use Google's location service?"

  const dialogDescription =
    'Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.'

  const dialogActions = (
    <>
      <Button onClick={handleClose}>Disagree</Button>
      <Button onClick={handleClose} autoFocus>
        Agree
      </Button>
    </>
  )

  return (
    <div>
      <DynamicDialog
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        dialogTitle={dialogTitles}
        dialogDescription={dialogDescription}
        dialogActions={dialogActions}
      />
    </div>
  )
}

export default Page
