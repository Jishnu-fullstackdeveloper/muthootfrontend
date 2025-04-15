export type Section = {
  designationName: { id: string; name: string } | null // Updated id to string to match API
  grade: { id: string; name: string } | null // Updated id to string to match API
}

export type ApprovalMatrixFormValues = {
  id: string
  approvalCategory: string
  numberOfLevels: number
  description: string
  sections: Section[]
  draggingIndex: number | null
}
