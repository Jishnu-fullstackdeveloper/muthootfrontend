
import AddNewRequestGeneratedForm from '@/form/generatedForms/addNewRequest'
import React from 'react'

type Props = {
    mode: string
    id: string
  }

const AddNewRequest: React.FC<Props> = ({ mode, id }) => {
  return (
    <>
      <AddNewRequestGeneratedForm />
    </>
  )
}

export default AddNewRequest

