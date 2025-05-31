/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, forwardRef } from 'react'

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Button,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Slide
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

interface Location {
  territory: string
  zone: string
  region: string
  area: string
  cluster: string
  branch: string
}

interface Documents {
  pan: boolean
  aadhar: boolean
  salarySlip: boolean
  experienceLetter: boolean
  otherDocuments: boolean
  panUrl: string
  aadharUrl: string
  salarySlipUrl: string
  experienceLetterUrl: string
  otherDocumentsUrl: string
  panVerified: boolean
  aadharVerified: boolean
  salarySlipVerified: boolean
  experienceLetterVerified: boolean
  otherDocumentsVerified: boolean
}

interface Cv {
  id: string
  fullName: string
  postForApply: string
  location: Location
  documents: Documents
  isFresher: boolean
  source: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SHORTLISTED'
  resumeUrl: string
}

interface LocationFilters {
  territory: string
  zone: string
  region: string
  area: string
  cluster: string
  branch: string
}

const mockCvData: Cv[] = [
  {
    id: '1',
    fullName: 'John Doe',
    postForApply: 'Software Engineer',
    location: { territory: 'T1', zone: 'Z1', region: 'R1', area: 'A1', cluster: 'C1', branch: 'B1' },
    documents: {
      pan: true,
      aadhar: true,
      salarySlip: false,
      experienceLetter: false,
      otherDocuments: true,
      panUrl: 'https://example.com/pan1.jpg',
      aadharUrl: 'https://example.com/aadhar1.jpg',
      salarySlipUrl: '',
      experienceLetterUrl: '',
      otherDocumentsUrl: 'https://example.com/other1.jpg',
      panVerified: true,
      aadharVerified: true,
      salarySlipVerified: false,
      experienceLetterVerified: false,
      otherDocumentsVerified: false
    },
    isFresher: true,
    source: 'Job Portal',
    status: 'PENDING',
    resumeUrl: 'https://example.com/resume1.pdf'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    postForApply: 'Product Manager',
    location: { territory: 'T2', zone: 'Z2', region: 'R2', area: 'A2', cluster: 'C2', branch: 'B2' },
    documents: {
      pan: true,
      aadhar: true,
      salarySlip: true,
      experienceLetter: true,
      otherDocuments: false,
      panUrl: 'https://example.com/pan2.jpg',
      aadharUrl: 'https://example.com/aadhar2.jpg',
      salarySlipUrl: 'https://example.com/salary2.jpg',
      experienceLetterUrl: 'https://example.com/exp2.jpg',
      otherDocumentsUrl: '',
      panVerified: true,
      aadharVerified: false,
      salarySlipVerified: true,
      experienceLetterVerified: true,
      otherDocumentsVerified: false
    },
    isFresher: false,
    source: 'Referral',
    status: 'SHORTLISTED',
    resumeUrl: 'https://example.com/resume2.pdf'
  },
  {
    id: '3',
    fullName: 'Alice Johnson',
    postForApply: 'Data Analyst',
    location: { territory: 'T1', zone: 'Z1', region: 'R1', area: 'A1', cluster: 'C1', branch: 'B1' },
    documents: {
      pan: true,
      aadhar: false,
      salarySlip: true,
      experienceLetter: true,
      otherDocuments: true,
      panUrl: 'https://example.com/pan3.jpg',
      aadharUrl: '',
      salarySlipUrl: 'https://example.com/salary3.jpg',
      experienceLetterUrl: 'https://example.com/exp3.jpg',
      otherDocumentsUrl: 'https://example.com/other3.jpg',
      panVerified: true,
      aadharVerified: false,
      salarySlipVerified: true,
      experienceLetterVerified: false,
      otherDocumentsVerified: true
    },
    isFresher: false,
    source: 'LinkedIn',
    status: 'APPROVED',
    resumeUrl: 'https://example.com/resume3.pdf'
  },
  {
    id: '4',
    fullName: 'Bob Wilson',
    postForApply: 'UX Designer',
    location: { territory: 'T3', zone: 'Z3', region: 'R3', area: 'A3', cluster: 'C3', branch: 'B3' },
    documents: {
      pan: true,
      aadhar: true,
      salarySlip: false,
      experienceLetter: false,
      otherDocuments: false,
      panUrl: 'https://example.com/pan4.jpg',
      aadharUrl: 'https://example.com/aadhar4.jpg',
      salarySlipUrl: '',
      experienceLetterUrl: '',
      otherDocumentsUrl: '',
      panVerified: false,
      aadharVerified: true,
      salarySlipVerified: false,
      experienceLetterVerified: false,
      otherDocumentsVerified: false
    },
    isFresher: true,
    source: 'Job Fair',
    status: 'REJECTED',
    resumeUrl: 'https://example.com/resume4.pdf'
  }
]

const SlideTransition = forwardRef(function SlideTransition(props, ref) {
  return <Slide {...props} ref={ref} direction={props.direction as 'left' | 'right'} />
})

const CvListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 6 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)

  const [selectedLocationFilters, setSelectedLocationFilters] = useState<LocationFilters>({
    territory: '',
    zone: '',
    region: '',
    area: '',
    cluster: '',
    branch: ''
  })

  const [openResumeDialog, setOpenResumeDialog] = useState(false)
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false)
  const [currentCvIndex, setCurrentCvIndex] = useState(0)
  const [dialogDirection, setDialogDirection] = useState<'left' | 'right'>('right')
  const [cvData, setCvData] = useState<Cv[]>(mockCvData)
  const [hoveredDocCompletion, setHoveredDocCompletion] = useState<string | null>(null)

  const filterAreaOptions: Record<string, string[]> = {
    territory: ['Territory 1', 'Territory 2', 'Territory 3'],
    zone: ['Zone 1', 'Zone 2', 'Zone 3'],
    region: ['Region 1', 'Region 2', 'Region 3'],
    area: ['Area 1', 'Area 2', 'Area 3'],
    cluster: ['Cluster 1', 'Cluster 2', 'Cluster 3'],
    branch: ['Branch 1', 'Branch 2', 'Branch 3']
  }

  const DebouncedInput = ({
    value,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string
    onChange: (value: string) => void
    debounce?: number
  } & Omit<React.ComponentProps<typeof TextField>, 'onChange'>) => {
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => setInputValue(value), [value])
    useEffect(() => {
      const timeout = setTimeout(() => onChange(inputValue), debounce)

      return () => clearTimeout(timeout)
    }, [inputValue, debounce, onChange])

    return (
      <TextField
        variant='outlined'
        {...props}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        sx={{ background: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
    )
  }

  const filteredData = cvData.filter(cv => {
    const matchesSearch =
      cv.fullName.toLowerCase().includes(search.toLowerCase()) ||
      cv.postForApply.toLowerCase().includes(search.toLowerCase())

    const matchesFilters = Object.entries(selectedLocationFilters).every(
      ([key, value]) => !value || cv.location[key as keyof Location]?.toLowerCase() === value.toLowerCase()
    )

    return matchesSearch && matchesFilters
  })

  const paginatedData = filteredData.slice(
    paginationState.pageIndex * paginationState.pageSize,
    (paginationState.pageIndex + 1) * paginationState.pageSize
  )

  const handleApplyFilters = (filters: LocationFilters) => {
    setSelectedLocationFilters(filters)
    setPaginationState(prev => ({ ...prev, pageIndex: 0 }))
  }

  const handlePageChange = (newPage: number) => setPaginationState(prev => ({ ...prev, pageIndex: newPage }))

  const handleAction = (id: string, status: Cv['status']) =>
    setCvData(prev => prev.map(cv => (cv.id === id ? { ...cv, status } : cv)))

  const handleDialogOpen = (index: number, type: 'resume' | 'document') => {
    setCurrentCvIndex(index)
    type === 'resume' ? setOpenResumeDialog(true) : setOpenDocumentDialog(true)
    setDialogDirection('right')
  }

  const handleDialogClose = (type: 'resume' | 'document') =>
    type === 'resume' ? setOpenResumeDialog(false) : setOpenDocumentDialog(false)

  const navigateCv = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentCvIndex > 0) {
      setDialogDirection('left')
      setCurrentCvIndex(prev => prev - 1)
    } else if (direction === 'next' && currentCvIndex < filteredData.length - 1) {
      setDialogDirection('right')
      setCurrentCvIndex(prev => prev + 1)
    }
  }

  const calculateDocumentPercentage = (cv: Cv) => {
    const { documents, isFresher } = cv
    const { pan, aadhar, salarySlip, experienceLetter, otherDocuments } = documents

    const verifiedCount = [
      pan,
      aadhar,
      isFresher ? false : salarySlip,
      isFresher ? false : experienceLetter,
      otherDocuments
    ].filter(Boolean).length

    const totalDocuments = isFresher ? 3 : 5

    return Math.round((verifiedCount / totalDocuments) * 100)
  }

  const ActionButtons = ({ cv, index }: { cv: Cv; index: number }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant='outlined'
        size='small'
        onClick={() => handleAction(cv.id, 'APPROVED')}
        sx={{ color: '#000', borderColor: '#4caf50', borderRadius: 2, px: 2, py: 0.5 }}
        startIcon={<i className='tabler-check' />}
      >
        Approve
      </Button>
      <Button
        variant='outlined'
        size='small'
        onClick={() => handleAction(cv.id, 'SHORTLISTED')}
        sx={{ color: '#000', borderColor: '#0288d1', borderRadius: 2, px: 2, py: 0.5 }}
        startIcon={<i className='tabler-star' />}
      >
        Shortlist
      </Button>
      <Button
        variant='outlined'
        size='small'
        onClick={() => handleAction(cv.id, 'REJECTED')}
        sx={{ color: '#000', borderColor: '#f44336', borderRadius: 2, px: 2, py: 0.5 }}
        startIcon={<i className='tabler-playstation-x' />}
      >
        Reject
      </Button>
    </Box>
  )

  const DocumentGrid = ({ cv }: { cv: Cv }) => (
    <Grid container spacing={3}>
      {[
        { name: 'PAN', url: cv.documents.panUrl, verified: cv.documents.panVerified },
        { name: 'Aadhar', url: cv.documents.aadharUrl, verified: cv.documents.aadharVerified },
        !cv.isFresher && {
          name: 'Salary Slip',
          url: cv.documents.salarySlipUrl,
          verified: cv.documents.salarySlipVerified
        },
        !cv.isFresher && {
          name: 'Experience Letter',
          url: cv.documents.experienceLetterUrl,
          verified: cv.documents.experienceLetterVerified
        },
        { name: 'Other Documents', url: cv.documents.otherDocumentsUrl, verified: cv.documents.otherDocumentsVerified }
      ]
        .filter(Boolean)
        .map((doc, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              {doc.url ? (
                <img
                  src={doc.url}
                  alt={doc.name}
                  style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    borderRadius: 8,
                    mb: 1
                  }}
                >
                  <Typography sx={{ color: '#000' }}>No Image</Typography>
                </Box>
              )}
              <Typography variant='body2' sx={{ color: '#000', mb: 1 }}>
                {doc.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                {doc.verified ? (
                  <CheckCircleOutlineIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                ) : (
                  <CancelOutlinedIcon sx={{ color: '#f44336', fontSize: 20 }} />
                )}
                <Typography variant='body2' sx={{ color: '#000' }}>
                  {doc.verified ? 'Verified' : 'Not Verified'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
    </Grid>
  )

  const SimpleAreaFilterDialog = ({
    open,
    setOpen,
    selectedLocationFilters,
    onApplyFilters,
    options
  }: {
    open: boolean
    setOpen: (open: boolean) => void
    selectedLocationFilters: LocationFilters
    onApplyFilters: (filters: LocationFilters) => void
    options: Record<string, string[]>
  }) => {
    const [filters, setFilters] = useState<LocationFilters>(selectedLocationFilters)

    return (
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
        <DialogContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Location Filters
          </Typography>
          {Object.keys(options).map(key => (
            <TextField
              key={key}
              select
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={filters[key as keyof LocationFilters]}
              onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value=''>None</MenuItem>
              {options[key].map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: '#000' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onApplyFilters(filters)
              setOpen(false)
            }}
            sx={{ color: '#000' }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <SimpleAreaFilterDialog
        open={openLocationFilter}
        setOpen={setOpenLocationFilter}
        selectedLocationFilters={selectedLocationFilters}
        onApplyFilters={handleApplyFilters}
        options={filterAreaOptions}
      />
      <Dialog
        open={openResumeDialog}
        onClose={() => handleDialogClose('resume')}
        maxWidth='lg'
        fullWidth
        TransitionComponent={SlideTransition}
        TransitionProps={{ direction: dialogDirection, timeout: 400 }}
      >
        <DialogContent sx={{ p: 0, height: '85vh' }}>
          {filteredData[currentCvIndex]?.resumeUrl ? (
            <iframe
              src={filteredData[currentCvIndex].resumeUrl}
              title='Resume'
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <Typography variant='body1' sx={{ p: 4, textAlign: 'center', color: '#000' }}>
              No resume available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
          <Button
            onClick={() => navigateCv('prev')}
            disabled={currentCvIndex === 0}
            startIcon={<ArrowBackIosNewOutlinedIcon />}
            sx={{ color: '#000', borderColor: '#000', borderRadius: 2, px: 4, py: 1 }}
            variant='outlined'
          >
            Previous
          </Button>
          <Button
            onClick={() => navigateCv('next')}
            disabled={currentCvIndex === filteredData.length - 1}
            endIcon={<ArrowForwardIosOutlinedIcon />}
            sx={{ color: '#000', borderColor: '#000', borderRadius: 2, px: 4, py: 1 }}
            variant='outlined'
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDocumentDialog}
        onClose={() => handleDialogClose('document')}
        maxWidth='md'
        fullWidth
        TransitionComponent={SlideTransition}
        TransitionProps={{ direction: dialogDirection, timeout: 400 }}
      >
        <DialogContent sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 3, color: '#000', fontWeight: 600 }}>
            Document Details
          </Typography>
          <DocumentGrid cv={filteredData[currentCvIndex]} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
          <Button
            onClick={() => navigateCv('prev')}
            disabled={currentCvIndex === 0}
            startIcon={<ArrowBackIosNewOutlinedIcon />}
            sx={{ color: '#000', borderColor: '#000', borderRadius: 2, px: 4, py: 1 }}
            variant='outlined'
          >
            Previous
          </Button>
          <Button
            onClick={() => navigateCv('next')}
            disabled={currentCvIndex === filteredData.length - 1}
            endIcon={<ArrowForwardIosOutlinedIcon />}
            sx={{ color: '#000', borderColor: '#000', borderRadius: 2, px: 4, py: 1 }}
            variant='outlined'
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            p: 4,
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, flexWrap: 'wrap' }}>
            <DebouncedInput
              value={search}
              onChange={setSearch}
              placeholder='Search by name or post'
              sx={{ width: { xs: '100%', sm: '300px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xl' style={{ color: '#000' }} />
                  </InputAdornment>
                )
              }}
            />
            <Tooltip title='Filter by Location'>
              <IconButton
                onClick={() => setOpenLocationFilter(true)}
                sx={{ border: '1px solid #000', color: '#000', borderRadius: 2, p: 1.5 }}
              >
                <i className='tabler-filter text-xl' />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              bgcolor: '#f5f5f5',
              borderRadius: '16px',
              p: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Tooltip title='Grid View'>
              <IconButton
                color={viewMode === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('grid')}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  color: viewMode === 'grid' ? 'primary.main' : '#000',
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)', transform: 'scale(1.1)' },
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
              >
                <GridViewIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Table View'>
              <IconButton
                color={viewMode === 'table' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('table')}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  color: viewMode === 'table' ? 'primary.main' : '#000',
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)', transform: 'scale(1.1)' },
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
              >
                <TableChartIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
      {paginatedData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Typography variant='h5' sx={{ color: '#000', fontWeight: 500 }}>
            No CVs found
          </Typography>
        </Box>
      ) : (
        <>
          {viewMode === 'grid' && (
            <Box sx={{ padding: 3 }}>
              <Grid container spacing={4}>
                {paginatedData.map((cv, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={cv.id}>
                    <Card
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.03)', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' },
                        minHeight: 350,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#fff',
                          p: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#000' }}>
                          {cv.fullName}
                        </Typography>
                        <Chip
                          label={cv.status}
                          sx={{
                            fontSize: '0.7rem',
                            bgcolor:
                              cv.status === 'APPROVED'
                                ? '#4caf50'
                                : cv.status === 'REJECTED'
                                  ? '#f44336'
                                  : cv.status === 'SHORTLISTED'
                                    ? '#0288d1'
                                    : '#fbc02d',
                            color: '#fff',
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 'auto' }}>
                          <Typography
                            variant='body2'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              fontSize: '0.9rem',
                              color: '#000',
                              mb: 2
                            }}
                          >
                            <WorkOutlineOutlinedIcon fontSize='small' sx={{ color: '#000' }} />
                            {cv.postForApply}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              fontSize: '0.9rem',
                              color: '#000',
                              mb: 2
                            }}
                          >
                            <LocationOnOutlinedIcon fontSize='small' sx={{ color: '#000' }} />
                            {`${cv.location.territory || ''}, ${cv.location.zone || ''}, ${cv.location.region || ''}, ${cv.location.area || ''}, ${cv.location.cluster || ''}, ${cv.location.branch || ''}`}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              fontSize: '0.9rem',
                              color: '#000',
                              mb: 2
                            }}
                          >
                            <SourceOutlinedIcon fontSize='small' sx={{ color: '#000' }} />
                            {cv.source}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              fontSize: '0.9rem',
                              color: '#000',
                              mb: 2
                            }}
                          >
                            <AssignmentTurnedInOutlinedIcon fontSize='small' sx={{ color: '#000' }} />
                            {cv.status}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.9rem',
                              mb: 2,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleDialogOpen(index, 'document')}
                            onMouseEnter={() => setHoveredDocCompletion(cv.id)}
                            onMouseLeave={() => setHoveredDocCompletion(null)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <DescriptionOutlinedIcon
                                fontSize='small'
                                sx={{ color: hoveredDocCompletion === cv.id ? 'primary.main' : '#000' }}
                              />
                              <Typography
                                variant='body2'
                                sx={{
                                  color: hoveredDocCompletion === cv.id ? 'primary.main' : '#000',
                                  transition: 'color 0.2s'
                                }}
                              >
                                Document Completion
                              </Typography>
                            </Box>
                            <Tooltip title={`${calculateDocumentPercentage(cv)}% Complete`}>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                  variant='determinate'
                                  value={calculateDocumentPercentage(cv)}
                                  size={40}
                                  thickness={5}
                                  sx={{ color: hoveredDocCompletion === cv.id ? 'primary.main' : 'primary.main' }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 1
                                  }}
                                >
                                  <Typography
                                    variant='caption'
                                    sx={{ color: '#000', fontWeight: 600, fontSize: '0.65rem' }}
                                  >{`${calculateDocumentPercentage(cv)}%`}</Typography>
                                </Box>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={() => handleDialogOpen(index, 'resume')}
                            sx={{ color: '#000', borderColor: '#0288d1', borderRadius: 2, px: 3, py: 1.5 }}
                            startIcon={<VisibilityOutlinedIcon />}
                          >
                            View Resume
                          </Button>
                          {cv.status === 'PENDING' && <ActionButtons cv={cv} index={index} />}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  onClick={() => handlePageChange(paginationState.pageIndex + 1)}
                  disabled={(paginationState.pageIndex + 1) * paginationState.pageSize >= filteredData.length}
                  sx={{ color: '#000', borderColor: '#000', borderRadius: 2, px: 4, py: 1.5 }}
                  variant='outlined'
                >
                  Load More
                </Button>
              </Box>
            </Box>
          )}
          {viewMode === 'table' && (
            <CvListingTableView
              data={paginatedData}
              totalCount={filteredData.length}
              pagination={paginationState}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Box>
  )
}

const CvListingTableView = ({
  data,
  totalCount,
  pagination,
  onPageChange
}: {
  data: Cv[]
  totalCount: number
  pagination: { pageIndex: number; pageSize: number }
  onPageChange: (newPage: number) => void
}) => (
  <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
    <Typography variant='h6' sx={{ mb: 2, color: '#000' }}>
      CV List
    </Typography>
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Post</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Location</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Documents</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Source</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#000' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(cv => (
            <tr key={cv.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '12px', color: '#000' }}>{cv.fullName}</td>
              <td style={{ padding: '12px', color: '#000' }}>{cv.postForApply}</td>
              <td
                style={{ padding: '12px', color: '#000' }}
              >{`${cv.location.territory || ''}, ${cv.location.zone || ''}, ${cv.location.region || ''}`}</td>
              <td
                style={{ padding: '12px', color: '#000' }}
              >{`PAN: ${cv.documents.pan ? '✓' : '✗'}, Aadhar: ${cv.documents.aadhar ? '✓' : '✗'}${cv.isFresher ? '' : `, Salary: ${cv.documents.salarySlip ? '✓' : '✗'}, Exp: ${cv.documents.experienceLetter ? '✓' : '✗'}`}, Other: ${cv.documents.otherDocuments ? '✓' : '✗'}`}</td>
              <td style={{ padding: '12px', color: '#000' }}>{cv.source}</td>
              <td style={{ padding: '12px', color: '#000' }}>{cv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
      <Typography sx={{ color: '#000' }}>
        Showing {pagination.pageIndex * pagination.pageSize + 1}-
        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount}
      </Typography>
      <Button
        onClick={() => onPageChange(pagination.pageIndex - 1)}
        disabled={pagination.pageIndex === 0}
        sx={{ color: '#000', borderColor: '#000', borderRadius: 2 }}
        variant='outlined'
      >
        Previous
      </Button>
      <Button
        onClick={() => onPageChange(pagination.pageIndex + 1)}
        disabled={(pagination.pageIndex + 1) * pagination.pageSize >= totalCount}
        sx={{ color: '#000', borderColor: '#000', borderRadius: 2 }}
        variant='outlined'
      >
        Next
      </Button>
    </Box>
  </Box>
)

export default CvListing
