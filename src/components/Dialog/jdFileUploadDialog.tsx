import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

type FileUploadDialogProps = {
  open: boolean
  onClose: () => void
  onUpload: (data: {
    file: File | null
    jobRole: string | null
    experience: string
    jobType: string
    education: string
    salaryRange: string
    skills: string
  }) => void
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ open, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobRole, setJobRole] = useState<string | null>(null)
  const [experience, setExperience] = useState('')
  const [jobType, setJobType] = useState('')
  const [education, setEducation] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [skills, setSkills] = useState('')

  // Sample autocomplete options for Job Role
  const jobRoleOptions = ['Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer']

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = () => {
    onUpload({
      file: selectedFile,
      jobRole,
      experience,
      jobType,
      education,
      salaryRange,
      skills
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Upload JD File</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={jobRoleOptions}
            value={jobRole}
            onChange={(event, newValue) => setJobRole(newValue)}
            renderInput={params => <TextField {...params} label='Job Role' />}
          />
          <TextField label='Experience' value={experience} onChange={e => setExperience(e.target.value)} fullWidth />
          <TextField label='Job Type' value={jobType} onChange={e => setJobType(e.target.value)} fullWidth />
          <TextField label='Education' value={education} onChange={e => setEducation(e.target.value)} fullWidth />
          <TextField
            label='Salary Range'
            value={salaryRange}
            onChange={e => setSalaryRange(e.target.value)}
            fullWidth
          />
          <TextField
            label='Skills'
            value={skills}
            onChange={e => setSkills(e.target.value)}
            fullWidth
            placeholder='e.g., JavaScript, Python, React'
          />
        </Box>

        <Typography gutterBottom>Please select a file to upload. The file should be in PDF or DOCX format.</Typography>
        <Box sx={{ mt: 2 }}>
          <input type='file' onChange={handleFileChange} style={{ display: 'none' }} id='file-upload' />
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
