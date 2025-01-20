import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

type FileUploadDialogProps = {
  open: boolean
  onClose: () => void
  onUpload: (file: File | null) => void
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ open, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = () => {
    onUpload(selectedFile)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Upload JD File</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Please select a file to upload. The file should be in PDF or DOCX format.</Typography>
        <Box sx={{ mt: 2 }}>
          <input
            type='file'
            // accept='.pdf,.docx'
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id='file-upload'
          />
          <label htmlFor='file-upload'>
            <Button variant='outlined' component='span'>
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <Typography sx={{ mt: 1 }}>
              Selected File: <strong>{selectedFile.name}</strong>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleUpload} color='primary' variant='contained' disabled={!selectedFile}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FileUploadDialog
