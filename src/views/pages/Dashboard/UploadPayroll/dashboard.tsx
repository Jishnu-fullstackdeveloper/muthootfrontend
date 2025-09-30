// UploadPayrollComponent.tsx
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
  DialogActions,
  Autocomplete
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
import { fetchPayrollConfigs, fetchEmployeeCodes, uploadManualPayroll } from '@/redux/Payroll/payrollSlice'
import { useAppSelector } from '@/lib/hooks'

// Types
type IncentiveRow = {
  id: number
  employeeCode: string
  remarks: string
  amount: string
  attachment: File | null
  error?: string
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

// Reusable Components
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

const CircularProgressWithLabel = ({
  value,
  size = 80,
  thickness = 4
}: {
  value: number
  size?: number
  thickness?: number
}) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress variant='determinate' value={value} size={size} thickness={thickness} />
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
      <Typography variant='h6' component='div' sx={{ fontWeight: 'bold' }}>{`${Math.round(value)}%`}</Typography>
    </Box>
  </Box>
)

const ProgressDialog = ({
  open,
  onClose,
  isProcessing,
  taskStatus
}: {
  open: boolean
  onClose: () => void
  isProcessing: boolean
  taskStatus: TaskStatus | null
}) => (
  <Dialog
    open={open}
    onClose={isProcessing ? undefined : onClose}
    maxWidth='sm'
    fullWidth
    PaperProps={{ sx: { borderRadius: 2, padding: 3, textAlign: 'center' } }}
  >
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {taskStatus?.ready ? 'Processing Complete!' : 'Task being done in the background!'}
      </Typography>
      <IconButton
        edge='end'
        color='inherit'
        onClick={onClose}
        disabled={isProcessing}
        sx={{ visibility: isProcessing ? 'hidden' : 'visible' }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent sx={{ pt: 0 }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
        PROGRESS
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 2 }}>
        <CircularProgressWithLabel value={taskStatus?.progress || 0} size={100} thickness={5} />
        {taskStatus?.ready && (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
            {taskStatus.result ? (
              <>
                <Typography variant='body1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Total Rows Processed: {taskStatus.result.total_rows}
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Unique Employee Found: {taskStatus.result.unique_employees}
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  Status: Completed Successfully
                </Typography>
              </>
            ) : (
              <Typography variant='body1' sx={{ color: 'error.main', fontWeight: 'bold' }}>
                Processing completed with errors
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </DialogContent>

    <DialogActions sx={{ justifyContent: 'center', pt: 0, pb: 2 }}>
      <Button
        variant='contained'
        onClick={onClose}
        disabled={isProcessing}
        sx={{ minWidth: 120, borderRadius: 1, textTransform: 'none', bgcolor: '#0191DA' }}
      >
        {taskStatus?.ready ? 'Done' : 'Cancel'}
      </Button>
    </DialogActions>
  </Dialog>
)

const IncentiveRowComponent = ({
  row,
  employeeCodes,
  onFieldChange,
  onEmployeeCodeSelect,
  onRemove,
  onAttach,
  isLastRow,
  mode
}: {
  row: IncentiveRow
  employeeCodes: string[]
  onFieldChange: (id: number, field: string, value: string) => void
  onEmployeeCodeSelect: (id: number, value: string) => void
  onRemove: (id: number) => void
  onAttach: (id: number, file: File | null) => void
  isLastRow: boolean
  mode: 'bulk' | 'manual' | null
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => onAttach(row.id, acceptedFiles[0] || null), [row.id, onAttach]),
    maxFiles: 1,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
  })

  return (
    <Stack direction='column' spacing={2} mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Autocomplete
            freeSolo
            options={employeeCodes}
            value={row.employeeCode}
            onChange={(event, newValue) => onEmployeeCodeSelect(row.id, newValue || '')}
            filterOptions={(options, params) =>
              options.filter(option => option.toLowerCase().includes(params.inputValue.toLowerCase()))
            }
            renderInput={params => (
              <TextField {...params} label='Employee Code' error={!!row.error} helperText={row.error} required />
            )}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label='Amount'
            value={row.amount}
            onChange={e => onFieldChange(row.id, 'amount', e.target.value)}
            type='number'
            fullWidth
            inputProps={{ min: 0, step: '0.01' }}
            required
          />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => onRemove(row.id)} sx={{ color: '#0191DA' }} disabled={isLastRow}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>

      {mode === 'bulk' ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #C4CDD5',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            bgcolor: '#F9FAFB',
            minHeight: '120px',
            cursor: 'pointer',
            '&:hover': { borderColor: '#0191DA', bgcolor: '#F0F7FF' }
          }}
        >
          <input {...getInputProps()} />
          {row.attachment ? (
            <Stack direction='row' alignItems='center' spacing={1} justifyContent='center'>
              <AttachFileIcon color='action' sx={{ fontSize: 24 }} />
              <Typography variant='body1'>{row.attachment.name}</Typography>
              <Typography
                variant='body2'
                color='text.secondary'
              >{`${(row.attachment.size / 1024).toFixed(0)}kb`}</Typography>
            </Stack>
          ) : (
            <Typography variant='body1' color='text.secondary'>
              Click to Upload or drag and Drop
              <br />
              XLSX file (max. 6Mb)
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Button component='label' variant='outlined' startIcon={<AttachFileIcon />} sx={{ borderRadius: 1 }}>
            Attach File
            <VisuallyHiddenInput
              type='file'
              onChange={e => onAttach(row.id, e.target.files?.[0] || null)}
              accept='.xlsx,.pdf,.doc,.docx,.jpg,.jpeg,.png'
            />
          </Button>
          {row.attachment && (
            <Typography variant='body2' sx={{ ml: 1, display: 'inline-block' }}>
              {row.attachment.name}
            </Typography>
          )}
        </Box>
      )}

      <TextField
        label='Remarks'
        value={row.remarks}
        onChange={e => onFieldChange(row.id, 'remarks', e.target.value)}
        fullWidth
        required
      />
    </Stack>
  )
}

// Main Component
const UploadPayrollComponent = () => {
  const dispatch: AppDispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [incentiveType, setIncentiveType] = useState('')
  const [mode, setMode] = useState<'bulk' | 'manual' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<IncentiveRow[]>([
    { id: 1, employeeCode: '', remarks: '', amount: '', attachment: null }
  ])
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [openProgressDialog, setOpenProgressDialog] = useState(false)

  const {
    payrollConfigs,
    employeeCodes,
    employeeCodesLoading,
    employeeCodesError,
    uploadManualPayrollLoading,
    uploadManualPayrollError,
    uploadManualPayrollResponse
  } = useAppSelector((state: RootState) => state.payrollSliceReducer)

  // Helper functions
  const isEmployeeCodeUnique = (employeeCode: string, currentRowId: number) =>
    !rows.some(row => row.id !== currentRowId && row.employeeCode.trim() === employeeCode.trim())

  const handleFieldChange = (id: number, field: string, value: string) => {
    setRows(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value, error: undefined }
          if (field === 'employeeCode' && value && !isEmployeeCodeUnique(value, id)) {
            updatedRow.error = 'Employee code must be unique'
          }
          return updatedRow
        }
        return row
      })
    )
  }

  const handleEmployeeCodeSelect = (id: number, value: string) => {
    handleFieldChange(id, 'employeeCode', value)
  }

  const handleAttach = (id: number, file: File | null) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, attachment: file } : row)))
  }

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1]
    if (lastRow.employeeCode && !isEmployeeCodeUnique(lastRow.employeeCode, lastRow.id)) {
      setRows(prev =>
        prev.map(row => (row.id === lastRow.id ? { ...row, error: 'Employee code must be unique' } : row))
      )
      return
    }
    setRows(prev => [...prev, { id: Date.now(), employeeCode: '', remarks: '', amount: '', attachment: null }])
  }

  const handleRemoveRow = (id: number) => {
    if (rows.length > 1) setRows(prev => prev.filter(row => row.id !== id))
  }

  // Effects
  useEffect(() => {
    dispatch(fetchEmployeeCodes())
    mockFetchMode('manual')
      .then(response => {
        setMode(response.mode)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch mode from server')
        setLoading(false)
      })
  }, [dispatch])

  useEffect(() => {
    if (employeeCodesError) setError(`Failed to fetch employee codes: ${employeeCodesError}`)
    if (uploadManualPayrollError) {
      setError(`Failed to upload payroll: ${uploadManualPayrollError}`)
      setIsProcessing(false)
      setOpenProgressDialog(false)
    }
    if (uploadManualPayrollResponse) setTaskId(uploadManualPayrollResponse.task_id)
  }, [employeeCodesError, uploadManualPayrollError, uploadManualPayrollResponse])

  useEffect(() => {
    dispatch(fetchPayrollConfigs('AP10000225'))
  }, [dispatch])

  useEffect(() => {
    if (!taskId) return

    const checkTaskStatus = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_PAYROLL_API_BASE_URL || 'https://payroll-dev.gnxsolutions.app'
        const response = await fetch(`${apiBaseUrl}/api/v1/maker/tasks/${taskId}/status/`)
        const data: TaskStatus = await response.json()
        setTaskStatus(data)
        if (!data.ready) setTimeout(checkTaskStatus, 5000)
        else setIsProcessing(false)
      } catch (error) {
        setError('Failed to check task status')
        setIsProcessing(false)
        setOpenProgressDialog(false)
      }
    }

    checkTaskStatus()
    return () => setIsProcessing(false)
  }, [taskId])

  const handleSubmit = async () => {
    if (
      !selectedDate ||
      !incentiveType ||
      rows.some(row => !row.employeeCode.trim() || !row.amount.trim() || !row.remarks.trim())
    ) {
      setError('Please fill all required fields')
      return
    }

    setIsProcessing(true)
    setError(null)
    setTaskStatus(null)
    setOpenProgressDialog(true)

    try {
      const payload = {
        date: selectedDate.format('YYYY-MM'),
        incentive_type: incentiveType,
        entries: rows.map(row => ({
          employee_code: row.employeeCode,
          amount: row.amount,
          remarks: row.remarks,
          attachment: row.attachment || undefined
        }))
      }
      await dispatch(uploadManualPayroll(payload)).unwrap()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setIsProcessing(false)
      setOpenProgressDialog(false)
    }
  }

  const handleCloseProgressDialog = () => {
    setOpenProgressDialog(false)
    if (!isProcessing) {
      setTaskId(null)
      setTaskStatus(null)
    }
  }

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  if (error && !openProgressDialog)
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color='error'>{error}</Typography>
        <Button variant='contained' onClick={() => setError(null)} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    )

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
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Incentive/Deduction Type</InputLabel>
                    <Select
                      value={incentiveType}
                      label='Incentive/Deduction Type'
                      onChange={e => setIncentiveType(e.target.value)}
                    >
                      <MenuItem value=''>Select Type</MenuItem>
                      <MenuItem value='Incentive'>Incentive</MenuItem>
                      <MenuItem value='Deduction'>Deduction</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Select Month and Year
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DatePicker
                        label='Month'
                        openTo='month'
                        views={['month']}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        slotProps={{ textField: { fullWidth: true, error: !selectedDate } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label='Year'
                        openTo='year'
                        views={['year']}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        slotProps={{ textField: { fullWidth: true, error: !selectedDate } }}
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

                {rows.map((row, index) => (
                  <IncentiveRowComponent
                    key={row.id}
                    row={row}
                    employeeCodes={employeeCodes}
                    onFieldChange={handleFieldChange}
                    onEmployeeCodeSelect={handleEmployeeCodeSelect}
                    onRemove={handleRemoveRow}
                    onAttach={handleAttach}
                    isLastRow={rows.length === 1}
                    mode={mode}
                  />
                ))}

                <Box sx={{ textAlign: 'right', mt: 3 }}>
                  <Button
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={isProcessing || employeeCodesLoading || uploadManualPayrollLoading}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      bgcolor: '#0191DA',
                      minWidth: 120,
                      '&:disabled': { bgcolor: '#BDBDBD' }
                    }}
                  >
                    {isProcessing || uploadManualPayrollLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </Box>

                {employeeCodesLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography variant='body2' sx={{ ml: 2 }}>
                      Loading employee codes...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <ProgressDialog
        open={openProgressDialog}
        onClose={handleCloseProgressDialog}
        isProcessing={isProcessing}
        taskStatus={taskStatus}
      />
    </LocalizationProvider>
  )
}

// Mock function
const mockFetchMode = (testMode?: 'bulk' | 'manual') =>
  new Promise<{ mode: 'bulk' | 'manual' }>(resolve => setTimeout(() => resolve({ mode: testMode || 'manual' }), 1000))

export default UploadPayrollComponent
