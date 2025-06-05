export interface DataUpload {
  id: string
  processData: {
    originalname: string
    type: string
    size: number
  }
  queueType: string
  processStatus: string
  errorDetails: string | null
  createdAt: string
}

export interface DataUploadState {
  uploads: DataUpload[]
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  categories: string[]
  categoriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  uploadError: string | null
  categoriesError: string | null
  page: number
}

export interface DataUploadTableRow {
  slno: number
  id: string
  fileName: string
  fileType: string
  fileSize: number
  time: string
  uploadDate: string
  status: string
  remarks: string[]
}
