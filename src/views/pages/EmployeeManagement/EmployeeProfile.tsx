'use client'
import React, { useEffect, useRef } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined'
import TransgenderOutlinedIcon from '@mui/icons-material/TransgenderOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchEmployeeById,
  fetchTerritoryById,
  fetchZoneById,
  fetchRegionById,
  fetchAreaById,
  fetchClusterById,
  fetchBranchById
} from '@/redux/EmployeeManagement/employeeManagementSlice'

const EmployeeProfilePage = () => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const employeeId = searchParams.get('id')

  const {
    selectedEmployee,
    selectedEmployeeStatus,
    selectedEmployeeError,
    territory,
    territoryStatus,
    zone,
    zoneStatus,
    region,
    regionStatus,
    area,
    areaStatus,
    cluster,
    clusterStatus,
    branch,
    branchStatus
  } = useAppSelector(state => state.employeeManagementReducer)

  // Track fetched IDs to prevent duplicate API calls
  const fetchedIds = useRef({
    employee: null,
    territory: null,
    zone: null,
    region: null,
    area: null,
    cluster: null,
    branch: null
  })

  // Fetch employee and related data
  useEffect(() => {
    // Fetch employee data if employeeId exists and hasn't been fetched
    if (employeeId && fetchedIds.current.employee !== employeeId) {
      dispatch(fetchEmployeeById(employeeId))
      fetchedIds.current.employee = employeeId
    }

    // Fetch related data if selectedEmployee exists
    if (selectedEmployee) {
      const companyStructure = selectedEmployee.companyStructure

      // Fetch territory if territoryId exists and hasn't been fetched
      if (companyStructure.territoryId && fetchedIds.current.territory !== companyStructure.territoryId) {
        dispatch(fetchTerritoryById(companyStructure.territoryId))
        fetchedIds.current.territory = companyStructure.territoryId
      }

      // Fetch zone if zoneId exists and hasn't been fetched
      if (companyStructure.zoneId && fetchedIds.current.zone !== companyStructure.zoneId) {
        dispatch(fetchZoneById(companyStructure.zoneId))
        fetchedIds.current.zone = companyStructure.zoneId
      }

      // Fetch region if regionId exists and hasn't been fetched
      if (companyStructure.regionId && fetchedIds.current.region !== companyStructure.regionId) {
        dispatch(fetchRegionById(companyStructure.regionId))
        fetchedIds.current.region = companyStructure.regionId
      }

      // Fetch area if areaId exists and hasn't been fetched
      if (companyStructure.areaId && fetchedIds.current.area !== companyStructure.areaId) {
        dispatch(fetchAreaById(companyStructure.areaId))
        fetchedIds.current.area = companyStructure.areaId
      }

      // Fetch cluster if clusterId exists and hasn't been fetched
      if (companyStructure.clusterId && fetchedIds.current.cluster !== companyStructure.clusterId) {
        dispatch(fetchClusterById(companyStructure.clusterId))
        fetchedIds.current.cluster = companyStructure.clusterId
      }

      // Fetch branch if branchId exists and hasn't been fetched
      if (companyStructure.branchId && fetchedIds.current.branch !== companyStructure.branchId) {
        dispatch(fetchBranchById(companyStructure.branchId))
        fetchedIds.current.branch = companyStructure.branchId
      }
    }
  }, [dispatch, employeeId, selectedEmployee])

  // Map API data to UI format
  const employee = selectedEmployee
    ? {
        id: selectedEmployee.id,
        employeeCode: selectedEmployee.employeeCode,
        title: selectedEmployee.title || '-',
        firstName: selectedEmployee.firstName,
        middleName: selectedEmployee.middleName || '-',
        lastName: selectedEmployee.lastName,
        employeeType: selectedEmployee.employeeDetails.employmentType,
        status: selectedEmployee.employeeDetails.employmentStatus,
        company: selectedEmployee.companyStructure.company,
        businessUnit: selectedEmployee.businessUnit.name,
        department: selectedEmployee.department.name,
        territory: territory?.name || selectedEmployee.companyStructure.territory || '-', // Use territory name from API if available
        zone: zone?.name || selectedEmployee.companyStructure.zone || '-',
        region: region?.name || selectedEmployee.companyStructure.region || '-',
        area: area?.name || selectedEmployee.companyStructure.area || '-',
        cluster: cluster?.name || selectedEmployee.companyStructure.cluster || '-',
        branch: branch?.name || selectedEmployee.companyStructure.branch || '-',
        branchCode: selectedEmployee.companyStructure.branchCode || '-',
        cityClassification: selectedEmployee.address.cityClassification,
        state: selectedEmployee.address.state,
        dateOfJoining: selectedEmployee.employeeDetails.dateOfJoining,
        groupDOJ: selectedEmployee.employeeDetails.groupDOJ,
        grade: selectedEmployee.grade.name,
        band: selectedEmployee.band.name,
        designation: selectedEmployee.designation.name,
        employeeCategory: selectedEmployee.department.employeeCategoryTypeId ? 'Defined' : '-', // Assuming category exists if ID is present
        employeeCategoryType: '-', // Not directly in API response
        l1ManagerCode: selectedEmployee.managementHierarchy.l1ManagerCode,
        l1Manager: selectedEmployee.managementHierarchy.l1Manager || '-',
        l2ManagerCode: selectedEmployee.managementHierarchy.l2ManagerCode,
        l2Manager: selectedEmployee.managementHierarchy.l2Manager || '-',
        hrManagerCode: selectedEmployee.managementHierarchy.hrManagerCode,
        hrManager: selectedEmployee.managementHierarchy.hrManager || '-',
        functionHead: selectedEmployee.managementHierarchy.functionHead || '-',
        practiceHead: selectedEmployee.managementHierarchy.practiceHead || '-',
        jobRole: selectedEmployee.jobRole.name || '-',
        dateOfBirth: selectedEmployee.personalDetails?.dateOfBirth || '-',
        gender: selectedEmployee.personalDetails?.gender || '-',
        maritalStatus: selectedEmployee.personalDetails?.maritalStatus || '-',
        personalEmailAddress: selectedEmployee.personalEmailAddress || '-',
        officialEmailAddress: selectedEmployee.officeEmailAddress || '-',
        confirmationStatus: selectedEmployee.employeeDetails?.confirmationStatus || '-',
        residenceAddressLine1: selectedEmployee.address?.residenceAddressLine1 || '-',
        residenceState: selectedEmployee.address?.residenceState || '-',
        residenceCity: selectedEmployee.address?.residenceCity || '-',
        residenceCountry: selectedEmployee.address?.residenceCountry || '-',
        residencePostalCode: selectedEmployee.address?.residencePostalCode || '-',
        residenceLandline: selectedEmployee.address?.residenceLandline || '-',
        bloodGroup: selectedEmployee.personalDetails?.bloodGroup || '-',
        confirmationDate: selectedEmployee.employeeDetails?.confirmationDate || '-',
        emergencyContactName: selectedEmployee.emergencyContact?.emergencyContactName || '-',
        emergencyContactRelation: selectedEmployee.emergencyContact?.emergencyContactRelationship || '-',
        emergencyContactMobilePhone: selectedEmployee.emergencyContact?.emergencyContactMobilePhone || '-',
        pfAccountNumber: selectedEmployee.payrollDetails?.pfAccountNo || '-',
        panNumber: selectedEmployee.payrollDetails?.panNo || '-',
        bankName: selectedEmployee.payrollDetails?.bankName || '-',
        bankAccountNumber: selectedEmployee.payrollDetails?.bankAccountNo || '-',
        ifscCode: selectedEmployee.payrollDetails?.ifscCode || '-',
        uanNumber: selectedEmployee.payrollDetails?.uanNumber || '-',
        noticePeriod: selectedEmployee.employeeDetails?.noticePeriod || '-',
        mobileNumber: selectedEmployee.mobileNumber || '-',
        dateOfResignation: selectedEmployee.resignationDetails?.dateOfResignation || '-',
        finalApprovalLWD: selectedEmployee.resignationDetails?.finalApprovalLWD || '-',
        foodCardNumber: selectedEmployee.payrollDetails?.foodCardNo || '-',
        npsAccountNumber: selectedEmployee.payrollDetails?.npsAccountNo || '-',
        esiNo: selectedEmployee.payrollDetails?.esiNo || '-',
        isDisability: selectedEmployee.personalDetails?.isDisability ? 'Yes' : 'No',
        typeOfDisability: selectedEmployee.personalDetails?.typeOfDisability || '-',
        nameAsPerAadhar: selectedEmployee.personalDetails?.nameAsPerAadhar || '-',
        functionalManager: selectedEmployee.managementHierarchy?.functionalManager || '-',
        totalExperience: selectedEmployee.experienceDetails?.totalExperience || '-',
        age: selectedEmployee.experienceDetails?.ageYYMM || '-',
        retirementDate: selectedEmployee.experienceDetails?.retirementDate || '-',
        pfApplicable: selectedEmployee.payrollDetails?.pfApplicable ? 'Yes' : 'No',
        pfGrossLimit: selectedEmployee.payrollDetails?.pfGrossLimit || '-',
        lwfApplicable: selectedEmployee.payrollDetails?.lwfApplicable ? 'Yes' : 'No',
        esiApplicable: selectedEmployee.payrollDetails?.esiApplicable ? 'Yes' : 'No',
        aadharNumber: selectedEmployee.personalDetails?.aadharNumber || '-'
      }
    : null

  // Combine loading states for employee and related data
  if (
    selectedEmployeeStatus === 'loading' ||
    territoryStatus === 'loading' ||
    zoneStatus === 'loading' ||
    regionStatus === 'loading' ||
    areaStatus === 'loading' ||
    clusterStatus === 'loading' ||
    branchStatus === 'loading'
  ) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress color='primary' />
      </Box>
    )
  }

  // Combine error states for employee and related data
  if (selectedEmployeeStatus === 'failed' || !employee) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography>{selectedEmployeeError || 'Employee not found'}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        bgcolor: 'white.100',
        minHeight: '100vh',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 2
      }}
    >
      {/* Header Section */}
      <Card
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #1565c0 0%, #64b5f6 100%)',
          color: 'white'
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '3rem',
              border: '4px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            {(employee?.firstName?.charAt(0)?.toUpperCase() || '') +
              (employee?.lastName?.charAt(0)?.toUpperCase() || '')}
          </Avatar>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
            {employee.title} {employee.firstName} {employee.middleName !== '-' ? employee.middleName : ''}{' '}
            {employee.lastName}
          </Typography>
          <Tooltip title='Employee Code'>
            <Typography variant='subtitle1' sx={{ mb: 2, opacity: 0.9, color: 'white' }}>
              {employee.employeeCode}
            </Typography>
          </Tooltip>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Tooltip title='Designation'>
              <Chip
                label={`${employee.designation}`}
                color='primary'
                variant='filled'
                size='small'
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.200' } }}
              />
            </Tooltip>
            <Tooltip title='Department'>
              <Chip
                label={`${employee.department}`}
                color='primary'
                variant='filled'
                size='small'
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.200' } }}
              />
            </Tooltip>
            <Tooltip title='Employee Status'>
              <Chip
                label={employee.status}
                color={employee.status === 'Active' ? 'success' : 'error'}
                variant='filled'
                size='small'
                sx={{
                  bgcolor: 'white',
                  color: employee.status === 'Active' ? 'success.main' : 'error.main',
                  '&:hover': { bgcolor: 'grey.200' }
                }}
              />
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Personal Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Personal Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CakeOutlinedIcon fontSize='small' color='primary' />
                  <strong>Date of Birth:</strong> {employee.dateOfBirth.split('T')[0]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TransgenderOutlinedIcon fontSize='small' color='primary' />
                  <strong>Gender:</strong> {employee.gender}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FamilyRestroomOutlinedIcon fontSize='small' color='primary' />
                  <strong>Marital Status:</strong> {employee.maritalStatus}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlinedIcon fontSize='small' color='primary' />
                  <strong>Personal Email Address:</strong> {employee.personalEmailAddress}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkOutlineOutlinedIcon fontSize='small' color='primary' />
                  <strong>Official Email Address:</strong> {employee.officialEmailAddress}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneOutlinedIcon fontSize='small' color='primary' />
                  <strong>Mobile Number:</strong> {employee.mobileNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospitalOutlinedIcon fontSize='small' color='primary' />
                  <strong>Blood Group:</strong> {employee.bloodGroup}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessibilityNewOutlinedIcon fontSize='small' color='primary' />
                  <strong>Is Disability:</strong> {employee.isDisability}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutlineOutlinedIcon fontSize='small' color='primary' />
                  <strong>Type of Disability:</strong> {employee.typeOfDisability}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeOutlinedIcon fontSize='small' color='primary' />
                  <strong>Name as per Aadhar:</strong> {employee.nameAsPerAadhar}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCardOutlinedIcon fontSize='small' color='primary' />
                  <strong>Aadhar Number:</strong> {employee.aadharNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkHistoryOutlinedIcon fontSize='small' color='primary' />
                  <strong>Total Experience:</strong> {employee.totalExperience}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayOutlinedIcon fontSize='small' color='primary' />
                  <strong>Age (YY:MM):</strong> {employee.age}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsOutlinedIcon fontSize='small' color='primary' />
                  <strong>Retirement Date:</strong> {employee.retirementDate.split('T')[0]}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Employment Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Employment Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkOutlineOutlinedIcon fontSize='small' color='primary' />
                  <strong>Employee Type:</strong> {employee.employeeType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessOutlinedIcon fontSize='small' color='primary' />
                  <strong>Company:</strong> {employee.company}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ApartmentOutlinedIcon fontSize='small' color='primary' />
                  <strong>Business Unit:</strong> {employee.businessUnit}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayOutlinedIcon fontSize='small' color='primary' />
                  <strong>Date of Joining:</strong> {employee.dateOfJoining.split('T')[0]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GradeOutlinedIcon fontSize='small' color='primary' />
                  <strong>Grade:</strong> {employee.grade}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BookmarkOutlinedIcon fontSize='small' color='primary' />
                  <strong>Band:</strong> {employee.band}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkHistoryOutlinedIcon fontSize='small' color='primary' />
                  <strong>Confirmation Date:</strong> {employee.confirmationDate.split('T')[0]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutlineOutlinedIcon fontSize='small' color='primary' />
                  <strong>Confirmation Status:</strong> {employee.confirmationStatus}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayOutlinedIcon fontSize='small' color='primary' />
                  <strong>Notice Period:</strong> {employee.noticePeriod}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkspacesOutlinedIcon fontSize='small' color='primary' />
                  <strong>Date of Resignation:</strong> {employee.dateOfResignation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayOutlinedIcon fontSize='small' color='primary' />
                  <strong>Final Approval LWD:</strong> {employee.finalApprovalLWD}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Location Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Location Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationCityOutlinedIcon fontSize='small' color='primary' />
                  <strong>Territory:</strong> {employee.territory}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapOutlinedIcon fontSize='small' color='primary' />
                  <strong>Zone:</strong> {employee.zone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnOutlinedIcon fontSize='small' color='primary' />
                  <strong>Region:</strong> {employee.region}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PinDropOutlinedIcon fontSize='small' color='primary' />
                  <strong>Area:</strong> {employee.area}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsOutlinedIcon fontSize='small' color='primary' />
                  <strong>Cluster:</strong> {employee.cluster}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoreOutlinedIcon fontSize='small' color='primary' />
                  <strong>Branch:</strong> {employee.branch}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeOutlinedIcon fontSize='small' color='primary' />
                  <strong>Branch Code:</strong> {employee.branchCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ApartmentOutlinedIcon fontSize='small' color='primary' />
                  <strong>City Classification:</strong> {employee.cityClassification}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagOutlinedIcon fontSize='small' color='primary' />
                  <strong>State:</strong> {employee.state}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Management Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Management Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupervisorAccountOutlinedIcon fontSize='small' color='primary' />
                  <strong>L1 Manager:</strong> {employee.l1Manager} ({employee.l1ManagerCode})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ManageAccountsOutlinedIcon fontSize='small' color='primary' />
                  <strong>L2 Manager:</strong> {employee.l2Manager} ({employee.l2ManagerCode})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminPanelSettingsOutlinedIcon fontSize='small' color='primary' />
                  <strong>HR Manager:</strong> {employee.hrManager} ({employee.hrManagerCode})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutlineOutlinedIcon fontSize='small' color='primary' />
                  <strong>Function Head:</strong> {employee.functionHead}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkspacesOutlinedIcon fontSize='small' color='primary' />
                  <strong>Practice Head:</strong> {employee.practiceHead}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsOutlinedIcon fontSize='small' color='primary' />
                  <strong>Functional Manager:</strong> {employee.functionalManager}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkHistoryOutlinedIcon fontSize='small' color='primary' />
                  <strong>Job Role:</strong> {employee.jobRole}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Residence Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Residence Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence Address Line 1:</strong> {employee.residenceAddressLine1}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationCityOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence City:</strong> {employee.residenceCity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence State:</strong> {employee.residenceState}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence Country:</strong> {employee.residenceCountry}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PinDropOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence Postal Code:</strong> {employee.residencePostalCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneOutlinedIcon fontSize='small' color='primary' />
                  <strong>Residence Landline:</strong> {employee.residenceLandline}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContactEmergencyOutlinedIcon fontSize='small' color='primary' />
                  <strong>Emergency Contact Name:</strong> {employee.emergencyContactName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FamilyRestroomOutlinedIcon fontSize='small' color='primary' />
                  <strong>Emergency Contact Relation:</strong> {employee.emergencyContactRelation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContactPhoneOutlinedIcon fontSize='small' color='primary' />
                  <strong>Emergency Contact Mobile Phone:</strong> {employee.emergencyContactMobilePhone}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Payroll Information */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            '&:before': { display: 'none' },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold' }}>
              Payroll Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceOutlinedIcon fontSize='small' color='primary' />
                  <strong>PF Account Number:</strong> {employee.pfAccountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCardOutlinedIcon fontSize='small' color='primary' />
                  <strong>PAN Number:</strong> {employee.panNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceWalletOutlinedIcon fontSize='small' color='primary' />
                  <strong>Bank Name:</strong> {employee.bankName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceOutlinedIcon fontSize='small' color='primary' />
                  <strong>Bank Account Number:</strong> {employee.bankAccountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptLongOutlinedIcon fontSize='small' color='primary' />
                  <strong>IFSC Code:</strong> {employee.ifscCode}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeOutlinedIcon fontSize='small' color='primary' />
                  <strong>UAN Number:</strong> {employee.uanNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CardGiftcardOutlinedIcon fontSize='small' color='primary' />
                  <strong>File Card Number:</strong> {employee.foodCardNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceOutlinedIcon fontSize='small' color='primary' />
                  <strong>NPS Account Number:</strong> {employee.npsAccountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityOutlinedIcon fontSize='small' color='primary' />
                  <strong>ESI No:</strong> {employee.esiNo}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceOutlinedIcon fontSize='small' color='primary' />
                  <strong>PF Applicable:</strong> {employee.pfApplicable}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceWalletOutlinedIcon fontSize='small' color='primary' />
                  <strong>PF Gross Limit: {employee.pfGrossLimit}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceOutlinedIcon fontSize='small' color='primary' />
                  <strong>LWF Applicable:</strong> {employee.lwfApplicable}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityOutlinedIcon fontSize='small' color='primary' />
                  <strong>ESI Applicable:</strong> {employee.esiApplicable}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

export default EmployeeProfilePage
