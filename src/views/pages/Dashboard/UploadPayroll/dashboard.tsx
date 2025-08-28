'use client'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPayrollConfigs } from '@/redux/Payroll/payrollSlice'
import { useAppSelector } from '@/lib/hooks'
// import 'src/styles/uploadPayroll.css'

const VisuallyHiddenInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    style={{
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: 1
    }}
    {...props}
  />
)

type IncentiveRow = {
  id: number
  employeeCode: string
  remarks: string
  amount: string
  attachment: File | null
  error?: string
  Iconify?: any
}

type TaskStatus = {
  task_id: string
  status: string
  ready: boolean
  progress: number
  result?: {
    success: boolean
    payroll_input_id: string
    total_rows: number
    unique_employees: number
    total_amount: number
    progress: number
  }
}

const mockFetchMode = (testMode?: 'bulk' | 'manual') => {
  return new Promise<{ mode: 'bulk' | 'manual' }>(resolve => {
    setTimeout(() => {
      const mode = testMode || 'manual'
      resolve({ mode })
    }, 1000)
  })
}

const CircularProgressWithLabel = (props: { value: number } & { size?: number; thickness?: number }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant='determinate'
        value={props.value}
        size={props.size || 80}
        thickness={props.thickness || 4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant='h6'
          component='div'
          sx={{ fontWeight: 'bold' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

const UploadPayrollComponent = () => {
  const dispatch: AppDispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [incentiveType, setIncentiveType] = useState('')
  const [mode, setMode] = useState<'bulk' | 'manual' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<IncentiveRow[]>([
    { id: 1, employeeCode: '', remarks: '', amount: '', attachment: null }
  ])
  const [rowIdCounter, setRowIdCounter] = useState(2)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [openProgressDialog, setOpenProgressDialog] = useState(false)
  const { payrollConfigs } = useAppSelector((state: RootState) => state.payrollSliceReducer)
  const isEmployeeCodeUnique = (employeeCode: string, currentRowId: number) => {
    return !rows.some(row => row.id !== currentRowId && row.employeeCode.trim() === employeeCode.trim())
  }

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1]
    if (lastRow.employeeCode && !isEmployeeCodeUnique(lastRow.employeeCode, lastRow.id)) {
      setRows(prev =>
        prev.map(row => (row.id === lastRow.id ? { ...row, error: 'Employee code must be unique' } : row))
      )
      return
    }

    setRows(prev => [...prev, { id: rowIdCounter, employeeCode: '', remarks: '', amount: '', attachment: null }])
    setRowIdCounter(prev => prev + 1)
  }

  const handleRemoveRow = (id: number) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(row => row.id !== id))
    }
  }

  const handleField =
    (id: number, field: keyof Omit<IncentiveRow, 'id' | 'attachment' | 'error'>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      setRows(prev =>
        prev.map(row => {
          if (row.id === id) {
            if (field === 'employeeCode' && newValue && !isEmployeeCodeUnique(newValue, id)) {
              return { ...row, [field]: newValue, error: 'Employee code must be unique' }
            }
            return { ...row, [field]: newValue, error: undefined }
          }
          return row
        })
      )
    }

  const handleAttach = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setRows(prev => prev.map(row => (row.id === id ? { ...row, attachment: file } : row)))
  }

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
  })

  useEffect(() => {
    mockFetchMode('manual')
      .then(response => {
        setMode(response.mode)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch mode from server')
        setLoading(false)
      })
  }, [])

  const handleSubmit = async () => {
    if (!selectedDate || !incentiveType) {
      setError('Please fill all required fields')
      return
    }

    setIsProcessing(true)
    setError(null)
    setTaskStatus(null)
    setOpenProgressDialog(true)

    try {
      const formData = new FormData()
      formData.append('date', selectedDate.format('YYYY-MM'))
      formData.append('incentive_type', incentiveType)

      if (mode === 'bulk' && file) {
        formData.append('file', file)
      } else {
        rows.forEach((row, index) => {
          formData.append(`entries[${index}][employee_code]`, row.employeeCode)
          formData.append(`entries[${index}][amount]`, row.amount)
          formData.append(`entries[${index}][remarks]`, row.remarks)
          if (row.attachment) {
            formData.append(`entries[${index}][attachment]`, row.attachment)
          }
        })
      }

      const response = await fetch('{{baseURL}}/api/v1/maker/upload-payroll/', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        setTaskId(data.task_id)
      } else {
        throw new Error(data.message || 'Failed to submit payroll')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setIsProcessing(false)
      setOpenProgressDialog(false)
    }
  }
  useEffect(() => {
    dispatch(fetchPayrollConfigs('AP10000117'))
  }, [dispatch])
  useEffect(() => {
    if (!taskId) return

    const checkTaskStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/maker/tasks/${taskId}/status/`)
        const data: TaskStatus = await response.json()
        setTaskStatus(data)

        if (!data.ready) {
          setTimeout(checkTaskStatus, 5000)
        } else {
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Error checking task status:', error)
        setIsProcessing(false)
        setOpenProgressDialog(false)
        setError('Failed to check task status')
      }
    }

    checkTaskStatus()

    return () => {
      setIsProcessing(false)
    }
  }, [taskId])

  const handleCloseProgressDialog = () => {
    setOpenProgressDialog(false)
  }
  console.log(payrollConfigs?.employee_code, 'payrollConfigs')

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color='error'>{error}</Typography>
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={0} sx={{ bgcolor: '#EFF1FF', minHeight: '100vh', width: '100%' }}>
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Stack spacing={1} sx={{ p: 4, gap: '16px', width: '100%' }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1, width: '100%' }}>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  Configuration
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id='incentive-type-label'>Incentive/Deduction Type</InputLabel>
                    <Select
                      labelId='incentive-type-label'
                      value={incentiveType}
                      label='Incentive/Deduction Type'
                      onChange={e => setIncentiveType(e.target.value as string)}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value=''>Select Type</MenuItem>
                      <MenuItem value='Incentive'>Incentive</MenuItem>
                      <MenuItem value='Deduction'>Deduction</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                    Select Month and Year
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <DatePicker
                        label='Month'
                        openTo='month'
                        views={['month']}
                        value={selectedDate}
                        onChange={newValue => setSelectedDate(newValue)}
                        slotProps={{
                          textField: {
                            sx: { width: '100%' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <DatePicker
                        label='Year'
                        openTo='year'
                        views={['year']}
                        value={selectedDate}
                        onChange={newValue => setSelectedDate(newValue)}
                        slotProps={{
                          textField: {
                            sx: { width: '100%' }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 2, boxShadow: 1, p: 2, width: '100%' }}>
              <CardContent>
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Incentive Entries
                  </Typography>
                  <IconButton onClick={handleAddRow} sx={{ p: 0, color: '#0191DA' }}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                {mode === 'bulk' ? (
                  <>
                    {rows.map(row => (
                      <Stack key={row.id} direction='column' spacing={2} mb={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} md={5}>
                            <TextField
                              label='Employee Code'
                              value={row.employeeCode}
                              onChange={handleField(row.id, 'employeeCode')}
                              error={!!row.error}
                              helperText={row.error}
                              sx={{ width: '100%' }}
                              required
                            />
                          </Grid>
                          <Grid item xs={5} md={5}>
                            <TextField
                              label='Amount'
                              value={row.amount}
                              onChange={handleField(row.id, 'amount')}
                              type='number'
                              sx={{ width: '100%' }}
                              inputProps={{ min: 0, step: '0.01' }}
                              required
                            />
                          </Grid>
                          <Grid item xs={2} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              onClick={() => handleRemoveRow(row.id)}
                              sx={{ color: '#0191DA' }}
                              disabled={rows.length <= 1}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: '2px dashed #C4CDD5',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            bgcolor: '#F9FAFB',
                            minHeight: '120px',
                            mb: 2
                          }}
                        >
                          <input {...getInputProps()} />
                          {file ? (
                            <Stack direction='row' alignItems='center' spacing={1}>
                              {/* <Iconify icon='eva:file-fill' width={24} /> */}
                              <RemoveCircleOutlineIcon color='action' sx={{ fontSize: 24 }} />
                              <Typography variant='body1'>{file.name}</Typography>
                              <Typography variant='body2' color='text.secondary'>
                                {`${(file.size / 1024).toFixed(0)}kb`}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography variant='body1' color='text.secondary'>
                              Click to Upload or drag and Drop
                              <br />
                              XLSX file (max. 6Mb)
                            </Typography>
                          )}
                        </Box>
                        <TextField
                          label='Remarks'
                          value={row.remarks}
                          onChange={handleField(row.id, 'remarks')}
                          sx={{ width: '100%' }}
                          required
                        />
                      </Stack>
                    ))}
                  </>
                ) : (
                  <>
                    {rows.map(row => (
                      <Stack key={row.id} direction='column' spacing={2} mb={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} md={5}>
                            <TextField
                              label='Employee Code'
                              value={row.employeeCode}
                              onChange={handleField(row.id, 'employeeCode')}
                              error={!!row.error}
                              helperText={row.error}
                              sx={{ width: '100%' }}
                              required
                            />
                          </Grid>
                          <Grid item xs={5} md={5}>
                            <TextField
                              label='Amount'
                              value={row.amount}
                              onChange={handleField(row.id, 'amount')}
                              type='number'
                              sx={{ width: '100%' }}
                              inputProps={{ min: 0, step: '0.01' }}
                              required
                            />
                          </Grid>
                          <Grid item xs={2} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              onClick={() => handleRemoveRow(row.id)}
                              sx={{ color: '#0191DA' }}
                              disabled={rows.length <= 1}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <TextField
                          label='Remarks'
                          value={row.remarks}
                          onChange={handleField(row.id, 'remarks')}
                          sx={{ width: '100%' }}
                          required
                        />
                        <Box>
                          <Button
                            component='label'
                            variant='outlined'
                            startIcon={<AttachFileIcon />}
                            sx={{ borderRadius: 1 }}
                          >
                            Attach File
                            <VisuallyHiddenInput
                              type='file'
                              onChange={handleAttach(row.id)}
                              accept='.xlsx,.pdf,.doc,.docx'
                            />
                          </Button>
                          {row.attachment && (
                            <Typography variant='body2' sx={{ ml: 1, display: 'inline-block' }}>
                              {row.attachment.name}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    ))}
                  </>
                )}
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    sx={{ borderRadius: 1, textTransform: 'none', bgcolor: '#0191DA' }}
                  >
                    {isProcessing ? 'Processing...' : 'Submit'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Progress Dialog */}
      <Dialog
        open={openProgressDialog}
        onClose={isProcessing ? undefined : handleCloseProgressDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 3,
            textAlign: 'center'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            Task being done in the background!
          </Typography>
          <IconButton
            edge='end'
            color='inherit'
            onClick={handleCloseProgressDialog}
            aria-label='close'
            disabled={isProcessing}
            sx={{ visibility: isProcessing ? 'hidden' : 'visible' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: 'primary.main'
            }}
          >
            PROGRESS
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              mb: 2
            }}
          >
            <CircularProgressWithLabel value={taskStatus?.progress || 0} size={100} thickness={5} />

            {taskStatus?.ready && taskStatus?.result && (
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  mt: 2
                }}
              >
                <Typography variant='body1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Total Rows Processed: {taskStatus.result.total_rows}
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Unique Employee Found: {taskStatus.result.unique_employees}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            pt: 0,
            pb: 2
          }}
        >
          <Button
            variant='contained'
            onClick={handleCloseProgressDialog}
            disabled={isProcessing}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            {taskStatus?.ready ? 'Done' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}

export default UploadPayrollComponent
