'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Form Imports
import { useFormik } from 'formik'
import * as Yup from 'yup'

// MUI Imports
import {
  Box,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Button,
  Divider
} from '@mui/material'

// Component Imports
import DynamicButton from '@/components/Button/dynamicButton'

// Static Dropdown Options (from BudgetListing)
const mockDropdownOptions = {
  grade: ['G1', 'G2', 'G3'],
  designation: ['Senior Developer', 'Product Lead', 'Team Lead'],
  businessRole: ['Technical Lead', 'Product Strategy', 'Operations'],
  campusLateral: ['Campus', 'Lateral'],
  employeeCategory: ['Permanent', 'Contract'],
  employeeType: ['Full-Time', 'Part-Time'],
  hiringManager: ['John Doe', 'Jane Smith', 'Alice Johnson'],
  company: ['Tech Corp', 'Innovate Inc'],
  businessUnit: ['Engineering', 'Product', 'Sales'],
  department: ['Development', 'Product Management', 'Sales'],
  territory: ['Territory 1', 'Territory 2'],
  zone: ['Zone 1', 'Zone 2'],
  region: ['Region 1', 'Region 2'],
  area: ['Area 1', 'Area 2'],
  cluster: ['Cluster 1', 'Cluster 2'],
  branch: ['Branch 1', 'Branch 2'],
  cityClassification: ['Metro', 'Non-Metro'],
  state: ['California', 'Texas'],
  position: ['Senior Developer', 'Product Lead'],
  yearOfBudget: ['2025', '2026']
}

// Validation Schema
const validationSchema = Yup.object({
  // General Budget Request
  jobTitle: Yup.string().required('Job Title is required'),
  noOfOpenings: Yup.number().required('No. of Openings is required').min(1, 'No. of Openings must be at least 1'),
  grade: Yup.string().required('Grade is required'),
  designation: Yup.string().required('Designation is required'),
  businessRole: Yup.string().required('Business Role is required'),
  experienceMin: Yup.number()
    .required('Minimum Experience is required')
    .min(0, 'Minimum Experience must be at least 0'),
  experienceMax: Yup.number()
    .required('Maximum Experience is required')
    .min(Yup.ref('experienceMin'), 'Maximum Experience must be greater than or equal to Minimum Experience'),
  campusLateral: Yup.string().required('Campus / Lateral is required'),
  employeeCategory: Yup.string().required('Employee Category is required'),
  employeeType: Yup.string().required('Employee Type is required'),
  hiringManager: Yup.string().required('Hiring Manager is required'),
  startDate: Yup.date().required('Start Date is required').nullable(),
  closingDate: Yup.date()
    .required('Closing Date is required')
    .nullable()
    .min(Yup.ref('startDate'), 'Closing Date must be after Start Date'),

  // Organization Unit Details
  company: Yup.string().required('Company is required'),
  businessUnit: Yup.string().required('Business Unit is required'),
  department: Yup.string().required('Department is required'),

  // Joining Location Details
  territory: Yup.string().required('Territory is required'),
  zone: Yup.string().required('Zone is required'),
  region: Yup.string().required('Region is required'),
  area: Yup.string().required('Area is required'),
  cluster: Yup.string().required('Cluster is required'),
  branch: Yup.string().required('Branch is required'),
  branchCode: Yup.string().required('Branch Code is required'),
  cityClassification: Yup.string().required('City Classification is required'),
  state: Yup.string().required('State is required'),

  // Department Budget Fields
  budgetDepartment: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  count: Yup.number().required('Count is required').min(1, 'Count must be at least 1'),
  yearOfBudget: Yup.string().required('Year of Budget is required')
})

const ManualRequestGeneratedForm: React.FC = () => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)

  const formik = useFormik({
    initialValues: {
      // General Budget Request
      jobTitle: '',
      noOfOpenings: '',
      grade: '',
      designation: '',
      businessRole: '',
      experienceMin: '',
      experienceMax: '',
      campusLateral: '',
      employeeCategory: '',
      employeeType: '',
      hiringManager: '',
      startDate: '',
      closingDate: '',

      // Organization Unit Details
      company: '',
      businessUnit: '',
      department: '',

      // Joining Location Details
      territory: '',
      zone: '',
      region: '',
      area: '',
      cluster: '',
      branch: '',
      branchCode: '',
      cityClassification: '',
      state: '',

      // Department Budget Fields
      budgetDepartment: '',
      position: '',
      count: '',
      yearOfBudget: ''
    },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
      router.push('/budget-management') // Redirect after submission
    }
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Card
      sx={{
        p: 6,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Box component='form' onSubmit={formik.handleSubmit}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
          New Budget Request Form
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label='budget request tabs'
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label='General Budget'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
          <Tab
            label='Organization Unit'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
          <Tab
            label='Joining Location'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
          <Tab
            label='Department Budget'
            sx={{ minWidth: 0, padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'medium' }}
          />
        </Tabs>

        {/* General Budget Request */}
        {selectedTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              General Budget Request
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Job Title'
                  name='jobTitle'
                  value={formik.values.jobTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                  helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='No. of Openings'
                  name='noOfOpenings'
                  type='number'
                  value={formik.values.noOfOpenings}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.noOfOpenings && Boolean(formik.errors.noOfOpenings)}
                  helperText={formik.touched.noOfOpenings && formik.errors.noOfOpenings}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    name='grade'
                    value={formik.values.grade}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Grade'
                    error={formik.touched.grade && Boolean(formik.errors.grade)}
                  >
                    {mockDropdownOptions.grade.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.grade && formik.errors.grade && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.grade}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    name='designation'
                    value={formik.values.designation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Designation'
                    error={formik.touched.designation && Boolean(formik.errors.designation)}
                  >
                    {mockDropdownOptions.designation.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.designation && formik.errors.designation && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.designation}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Business Role</InputLabel>
                  <Select
                    name='businessRole'
                    value={formik.values.businessRole}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Business Role'
                    error={formik.touched.businessRole && Boolean(formik.errors.businessRole)}
                  >
                    {mockDropdownOptions.businessRole.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.businessRole && formik.errors.businessRole && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.businessRole}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label='Experience (Min)'
                    name='experienceMin'
                    type='number'
                    value={formik.values.experienceMin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceMin && Boolean(formik.errors.experienceMin)}
                    helperText={formik.touched.experienceMin && formik.errors.experienceMin}
                    fullWidth
                    variant='outlined'
                  />
                  <TextField
                    label='Experience (Max)'
                    name='experienceMax'
                    type='number'
                    value={formik.values.experienceMax}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceMax && Boolean(formik.errors.experienceMax)}
                    helperText={formik.touched.experienceMax && formik.errors.experienceMax}
                    fullWidth
                    variant='outlined'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Campus / Lateral</InputLabel>
                  <Select
                    name='campusLateral'
                    value={formik.values.campusLateral}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Campus / Lateral'
                    error={formik.touched.campusLateral && Boolean(formik.errors.campusLateral)}
                  >
                    {mockDropdownOptions.campusLateral.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.campusLateral && formik.errors.campusLateral && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.campusLateral}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Employee Category</InputLabel>
                  <Select
                    name='employeeCategory'
                    value={formik.values.employeeCategory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Employee Category'
                    error={formik.touched.employeeCategory && Boolean(formik.errors.employeeCategory)}
                  >
                    {mockDropdownOptions.employeeCategory.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.employeeCategory && formik.errors.employeeCategory && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.employeeCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    name='employeeType'
                    value={formik.values.employeeType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Employee Type'
                    error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}
                  >
                    {mockDropdownOptions.employeeType.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.employeeType && formik.errors.employeeType && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.employeeType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Hiring Manager</InputLabel>
                  <Select
                    name='hiringManager'
                    value={formik.values.hiringManager}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Hiring Manager'
                    error={formik.touched.hiringManager && Boolean(formik.errors.hiringManager)}
                  >
                    {mockDropdownOptions.hiringManager.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.hiringManager && formik.errors.hiringManager && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.hiringManager}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Start Date'
                  name='startDate'
                  type='date'
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  fullWidth
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Closing Date'
                  name='closingDate'
                  type='date'
                  value={formik.values.closingDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.closingDate && Boolean(formik.errors.closingDate)}
                  helperText={formik.touched.closingDate && formik.errors.closingDate}
                  fullWidth
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Organization Unit Details */}
        {selectedTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              Organization Unit Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Company</InputLabel>
                  <Select
                    name='company'
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Company'
                    error={formik.touched.company && Boolean(formik.errors.company)}
                  >
                    {mockDropdownOptions.company.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.company && formik.errors.company && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.company}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Business Unit</InputLabel>
                  <Select
                    name='businessUnit'
                    value={formik.values.businessUnit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Business Unit'
                    error={formik.touched.businessUnit && Boolean(formik.errors.businessUnit)}
                  >
                    {mockDropdownOptions.businessUnit.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.businessUnit && formik.errors.businessUnit && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.businessUnit}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name='department'
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Department'
                    error={formik.touched.department && Boolean(formik.errors.department)}
                  >
                    {mockDropdownOptions.department.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department && formik.errors.department && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.department}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Joining Location Details */}
        {selectedTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              Joining Location Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Territory</InputLabel>
                  <Select
                    name='territory'
                    value={formik.values.territory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Territory'
                    error={formik.touched.territory && Boolean(formik.errors.territory)}
                  >
                    {mockDropdownOptions.territory.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.territory && formik.errors.territory && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.territory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Zone</InputLabel>
                  <Select
                    name='zone'
                    value={formik.values.zone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Zone'
                    error={formik.touched.zone && Boolean(formik.errors.zone)}
                  >
                    {mockDropdownOptions.zone.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.zone && formik.errors.zone && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.zone}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Region</InputLabel>
                  <Select
                    name='region'
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Region'
                    error={formik.touched.region && Boolean(formik.errors.region)}
                  >
                    {mockDropdownOptions.region.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.region && formik.errors.region && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.region}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Area</InputLabel>
                  <Select
                    name='area'
                    value={formik.values.area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Area'
                    error={formik.touched.area && Boolean(formik.errors.area)}
                  >
                    {mockDropdownOptions.area.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.area && formik.errors.area && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.area}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Cluster</InputLabel>
                  <Select
                    name='cluster'
                    value={formik.values.cluster}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Cluster'
                    error={formik.touched.cluster && Boolean(formik.errors.cluster)}
                  >
                    {mockDropdownOptions.cluster.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.cluster && formik.errors.cluster && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.cluster}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name='branch'
                    value={formik.values.branch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Branch'
                    error={formik.touched.branch && Boolean(formik.errors.branch)}
                  >
                    {mockDropdownOptions.branch.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.branch && formik.errors.branch && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.branch}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Branch Code'
                  name='branchCode'
                  value={formik.values.branchCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
                  helperText={formik.touched.branchCode && formik.errors.branchCode}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>City Classification</InputLabel>
                  <Select
                    name='cityClassification'
                    value={formik.values.cityClassification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='City Classification'
                    error={formik.touched.cityClassification && Boolean(formik.errors.cityClassification)}
                  >
                    {mockDropdownOptions.cityClassification.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.cityClassification && formik.errors.cityClassification && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.cityClassification}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>State</InputLabel>
                  <Select
                    name='state'
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='State'
                    error={formik.touched.state && Boolean(formik.errors.state)}
                  >
                    {mockDropdownOptions.state.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Department Budget Fields */}
        {selectedTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              Department Budget Fields
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name='budgetDepartment'
                    value={formik.values.budgetDepartment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Department'
                    error={formik.touched.budgetDepartment && Boolean(formik.errors.budgetDepartment)}
                  >
                    {mockDropdownOptions.department.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.budgetDepartment && formik.errors.budgetDepartment && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.budgetDepartment}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Position</InputLabel>
                  <Select
                    name='position'
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Position'
                    error={formik.touched.position && Boolean(formik.errors.position)}
                  >
                    {mockDropdownOptions.position.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.position && formik.errors.position && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.position}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Count'
                  name='count'
                  type='number'
                  value={formik.values.count}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.count && Boolean(formik.errors.count)}
                  helperText={formik.touched.count && formik.errors.count}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Year of Budget</InputLabel>
                  <Select
                    name='yearOfBudget'
                    value={formik.values.yearOfBudget}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Year of Budget'
                    error={formik.touched.yearOfBudget && Boolean(formik.errors.yearOfBudget)}
                  >
                    {mockDropdownOptions.yearOfBudget.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.yearOfBudget && formik.errors.yearOfBudget && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.yearOfBudget}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Form Actions */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <DynamicButton
            type='button'
            variant='contained'
            sx={{ bgcolor: 'grey.500', color: 'white', '&:hover': { bgcolor: 'grey.700' } }}
            onClick={() => router.push('/budget-management')}
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            type='submit'
            variant='contained'
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Submit
          </DynamicButton>
        </Box>
      </Box>
    </Card>
  )
}

export default ManualRequestGeneratedForm
