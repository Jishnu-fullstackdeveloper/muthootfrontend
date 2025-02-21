import React from 'react'

import ManualRequestGeneratedForm from '@/form/generatedForms/addNewRequest'

type Props = {
  mode: string
  id: string
}

const AddNewRequest: React.FC<Props> = ({ mode, id }) => {
  return (
    <>
      <ManualRequestGeneratedForm />
    </>
  )
}

export default AddNewRequest
