'use client'
import React from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, MenuItem, FormControlLabel } from '@mui/material'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicSelect from '@/components/Select/dynamicSelect'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicCheckbox from '@/components/Checkbox/dynamicCheckbox'

// import DynamicDatepicker from '@/components/Datepicker/dynamicDatepicker'

const validationSchema = Yup.object().shape({
  tripName: Yup.string().required('Trip Name is required'),
  travelMode: Yup.string().required('Travel Mode is required'),
  fromPlace: Yup.string().required('From Place is required'),
  toPlace: Yup.string().required('To Place is required'),
  departureDate: Yup.string().required('Departure Date is required'),
  returnDate: Yup.string(),
  additionalTravelSegments: Yup.string(),
  accommodationRequired: Yup.string().required('Accommodation Required is required'),
  hotelName: Yup.string(),
  checkInDate: Yup.string(),
  checkOutDate: Yup.string(),
  additionalAccommodations: Yup.string(),
  differentCostCenter: Yup.string().required('Travel for Different Cost Center is required'),
  costCenter: Yup.string(),
  clientBillable: Yup.string().required('Client Billable is required'),
  insuranceRequired: Yup.string().required('Insurance Required is required'),
  personalTitle: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First Name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last Name is required'),
  contactNumber: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]{10}$/, 'Contact Number is invalid'),
  email: Yup.string()
    .email()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is invalid'),
  advanceRequest: Yup.string().required('Advance Required is required'),
  advanceAmount: Yup.string(),
  additionalInformation: Yup.string(),
  confirmationCheckbox: Yup.string().required('I confirm all details are correct is required')
})

const GeneratedForm: React.FC = () => {
  const formik: any = useFormik({
    initialValues: {
      tripName: '',
      travelMode: '',
      fromPlace: '',
      toPlace: '',
      departureDate: '',
      returnDate: '',
      additionalTravelSegments: '',
      accommodationRequired: '',
      hotelName: '',
      checkInDate: '',
      checkOutDate: '',
      additionalAccommodations: '',
      differentCostCenter: '',
      costCenter: '',
      clientBillable: '',
      insuranceRequired: '',
      personalTitle: '',
      firstName: '',
      middleName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      advanceRequest: '',
      advanceAmount: '',
      additionalInformation: '',
      confirmationCheckbox: false
    },
    validationSchema,
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Travel Request Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Basic Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='tripName' className='block text-sm font-medium text-gray-700'>
                Trip Name *
              </label>
              <DynamicTextField
                id='tripName'
                name='tripName'
                type='text'
                value={formik.values.tripName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('tripName', true)}
                error={formik.touched.tripName && Boolean(formik.errors.tripName)}
                helperText={formik.touched.tripName && formik.errors.tripName ? formik.errors.tripName : undefined}
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Travel Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='travelMode' className='block text-sm font-medium text-gray-700'>
                Travel Mode *
              </label>
              <DynamicSelect
                id='travelMode'
                name='travelMode'
                value={formik.values.travelMode}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('travelMode', true)}
                error={formik.touched.travelMode && Boolean(formik.errors.travelMode)}
                helperText={formik.touched.travelMode && formik.errors.travelMode ? formik.errors.travelMode : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Flight'>Flight</MenuItem>
                <MenuItem value='Train'>Train</MenuItem>
                <MenuItem value='Bus'>Bus</MenuItem>
                <MenuItem value='Car'>Car</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='fromPlace' className='block text-sm font-medium text-gray-700'>
                From Place *
              </label>
              <DynamicTextField
                id='fromPlace'
                name='fromPlace'
                type='text'
                value={formik.values.fromPlace}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('fromPlace', true)}
                error={formik.touched.fromPlace && Boolean(formik.errors.fromPlace)}
                helperText={formik.touched.fromPlace && formik.errors.fromPlace ? formik.errors.fromPlace : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='toPlace' className='block text-sm font-medium text-gray-700'>
                To Place *
              </label>
              <DynamicTextField
                id='toPlace'
                name='toPlace'
                type='text'
                value={formik.values.toPlace}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('toPlace', true)}
                error={formik.touched.toPlace && Boolean(formik.errors.toPlace)}
                helperText={formik.touched.toPlace && formik.errors.toPlace ? formik.errors.toPlace : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='departureDate' className='block text-sm font-medium text-gray-700'>
                Departure Date *
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='returnDate' className='block text-sm font-medium text-gray-700'>
                Return Date
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {true && (
            <div>
              <h4>Add Multiple Travel Details </h4>
              {formik.values.additionalTravelSegments &&
                Array.isArray(formik.values.additionalTravelSegments) &&
                formik.values.additionalTravelSegments.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '16px',
                      gap: '16px'
                    }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px'
                      }}
                    >
                      {true && (
                        <FormControl fullWidth margin='normal'>
                          <label htmlFor='mode' className='block text-sm font-medium text-gray-700'>
                            Travel Mode
                          </label>
                          <DynamicSelect
                            id='mode'
                            name='mode'
                            value={formik.values.mode}
                            onChange={formik.handleChange}
                            onFocus={() => formik.setFieldTouched('mode', true)}
                            error={formik.touched.mode && Boolean(formik.errors.mode)}
                            helperText={formik.touched.mode && formik.errors.mode ? formik.errors.mode : ''}
                          >
                            <MenuItem value=''></MenuItem>
                            <MenuItem value='Flight'>Flight</MenuItem>
                            <MenuItem value='Train'>Train</MenuItem>
                            <MenuItem value='Bus'>Bus</MenuItem>
                            <MenuItem value='Car'>Car</MenuItem>
                          </DynamicSelect>
                        </FormControl>
                      )}

                      {true && (
                        <FormControl fullWidth margin='normal'>
                          <label htmlFor='from' className='block text-sm font-medium text-gray-700'>
                            From Place
                          </label>
                          <DynamicTextField
                            id='from'
                            name='from'
                            type='text'
                            value={formik.values.from}
                            onChange={formik.handleChange}
                            onFocus={() => formik.setFieldTouched('from', true)}
                            error={formik.touched.from && Boolean(formik.errors.from)}
                            helperText={formik.touched.from && formik.errors.from ? formik.errors.from : undefined}
                          />
                        </FormControl>
                      )}

                      {true && (
                        <FormControl fullWidth margin='normal'>
                          <label htmlFor='to' className='block text-sm font-medium text-gray-700'>
                            To Place
                          </label>
                          <DynamicTextField
                            id='to'
                            name='to'
                            type='text'
                            value={formik.values.to}
                            onChange={formik.handleChange}
                            onFocus={() => formik.setFieldTouched('to', true)}
                            error={formik.touched.to && Boolean(formik.errors.to)}
                            helperText={formik.touched.to && formik.errors.to ? formik.errors.to : undefined}
                          />
                        </FormControl>
                      )}
                    </div>
                    <DynamicButton
                      children='Remove'
                      type='button'
                      variant='outlined'
                      onClick={() =>
                        formik.setFieldValue(
                          'additionalTravelSegments',
                          formik.values.additionalTravelSegments.filter((_: any, i: number) => i !== index)
                        )
                      }
                      label='Remove'
                    />
                  </div>
                ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '20px'
                }}
              >
                <DynamicButton
                  children='Add More'
                  type='button'
                  variant='contained'
                  onClick={() =>
                    formik.setFieldValue('additionalTravelSegments', [
                      ...(formik.values.additionalTravelSegments || []),
                      {}
                    ])
                  }
                  label='Add More'
                />
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Accommodation</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='accommodationRequired' className='block text-sm font-medium text-gray-700'>
                Accommodation Required *
              </label>
              <DynamicSelect
                id='accommodationRequired'
                name='accommodationRequired'
                value={formik.values.accommodationRequired}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('accommodationRequired', true)}
                error={formik.touched.accommodationRequired && Boolean(formik.errors.accommodationRequired)}
                helperText={
                  formik.touched.accommodationRequired && formik.errors.accommodationRequired
                    ? formik.errors.accommodationRequired
                    : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {formik.values['accommodationRequired'] === 'Yes' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='hotelName' className='block text-sm font-medium text-gray-700'>
                Location/Hotel Name
              </label>
              <DynamicTextField
                id='hotelName'
                name='hotelName'
                type='text'
                value={formik.values.hotelName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('hotelName', true)}
                error={formik.touched.hotelName && Boolean(formik.errors.hotelName)}
                helperText={formik.touched.hotelName && formik.errors.hotelName ? formik.errors.hotelName : undefined}
              />
            </FormControl>
          )}

          {formik.values['accommodationRequired'] === 'Yes' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='checkInDate' className='block text-sm font-medium text-gray-700'>
                Check-in Date
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {formik.values['accommodationRequired'] === 'Yes' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='checkOutDate' className='block text-sm font-medium text-gray-700'>
                Check-out Date
              </label>
              {/* <DynamicDatepicker /> */}
            </FormControl>
          )}

          {formik.values['accommodationRequired'] === 'Yes' && (
            <div>
              <h4>Add Multiple Accommodation Details </h4>
              {formik.values.additionalAccommodations &&
                Array.isArray(formik.values.additionalAccommodations) &&
                formik.values.additionalAccommodations.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '16px',
                      gap: '16px'
                    }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px'
                      }}
                    >
                      {true && (
                        <FormControl fullWidth margin='normal'>
                          <label htmlFor='hotelName' className='block text-sm font-medium text-gray-700'>
                            Hotel Name
                          </label>
                          <DynamicTextField
                            id='hotelName'
                            name='hotelName'
                            type='text'
                            value={formik.values.hotelName}
                            onChange={formik.handleChange}
                            onFocus={() => formik.setFieldTouched('hotelName', true)}
                            error={formik.touched.hotelName && Boolean(formik.errors.hotelName)}
                            helperText={
                              formik.touched.hotelName && formik.errors.hotelName ? formik.errors.hotelName : undefined
                            }
                          />
                        </FormControl>
                      )}

                      {true && (
                        <FormControl fullWidth margin='normal'>
                          <label htmlFor='checkInDate' className='block text-sm font-medium text-gray-700'>
                            Check-in Date
                          </label>
                          {/* <DynamicDatepicker /> */}
                        </FormControl>
                      )}
                    </div>
                    <DynamicButton
                      children='Remove'
                      type='button'
                      variant='outlined'
                      onClick={() =>
                        formik.setFieldValue(
                          'additionalAccommodations',
                          formik.values.additionalAccommodations.filter((_: any, i: number) => i !== index)
                        )
                      }
                      label='Remove'
                    />
                  </div>
                ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '20px'
                }}
              >
                <DynamicButton
                  children='Add More'
                  type='button'
                  variant='contained'
                  onClick={() =>
                    formik.setFieldValue('additionalAccommodations', [
                      ...(formik.values.additionalAccommodations || []),
                      {}
                    ])
                  }
                  label='Add More'
                />
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Other Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='differentCostCenter' className='block text-sm font-medium text-gray-700'>
                Travel for Different Cost Center *
              </label>
              <DynamicSelect
                id='differentCostCenter'
                name='differentCostCenter'
                value={formik.values.differentCostCenter}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('differentCostCenter', true)}
                error={formik.touched.differentCostCenter && Boolean(formik.errors.differentCostCenter)}
                helperText={
                  formik.touched.differentCostCenter && formik.errors.differentCostCenter
                    ? formik.errors.differentCostCenter
                    : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {formik.values['differentCostCenter'] === 'Yes' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='costCenter' className='block text-sm font-medium text-gray-700'>
                Cost Center
              </label>
              <DynamicSelect
                id='costCenter'
                name='costCenter'
                value={formik.values.costCenter}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('costCenter', true)}
                error={formik.touched.costCenter && Boolean(formik.errors.costCenter)}
                helperText={formik.touched.costCenter && formik.errors.costCenter ? formik.errors.costCenter : ''}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Project A'>Project A</MenuItem>
                <MenuItem value='Project B'>Project B</MenuItem>
                <MenuItem value='Project C'>Project C</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='clientBillable' className='block text-sm font-medium text-gray-700'>
                Client Billable *
              </label>
              <DynamicSelect
                id='clientBillable'
                name='clientBillable'
                value={formik.values.clientBillable}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('clientBillable', true)}
                error={formik.touched.clientBillable && Boolean(formik.errors.clientBillable)}
                helperText={
                  formik.touched.clientBillable && formik.errors.clientBillable ? formik.errors.clientBillable : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='insuranceRequired' className='block text-sm font-medium text-gray-700'>
                Insurance Required *
              </label>
              <DynamicSelect
                id='insuranceRequired'
                name='insuranceRequired'
                value={formik.values.insuranceRequired}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('insuranceRequired', true)}
                error={formik.touched.insuranceRequired && Boolean(formik.errors.insuranceRequired)}
                helperText={
                  formik.touched.insuranceRequired && formik.errors.insuranceRequired
                    ? formik.errors.insuranceRequired
                    : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Traveler Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='personalTitle' className='block text-sm font-medium text-gray-700'>
                Title *
              </label>
              <DynamicSelect
                id='personalTitle'
                name='personalTitle'
                value={formik.values.personalTitle}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('personalTitle', true)}
                error={formik.touched.personalTitle && Boolean(formik.errors.personalTitle)}
                helperText={
                  formik.touched.personalTitle && formik.errors.personalTitle ? formik.errors.personalTitle : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Mr.'>Mr.</MenuItem>
                <MenuItem value='Ms.'>Ms.</MenuItem>
                <MenuItem value='Mrs.'>Mrs.</MenuItem>
                <MenuItem value='Dr.'>Dr.</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                First Name *
              </label>
              <DynamicTextField
                id='firstName'
                name='firstName'
                type='text'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('firstName', true)}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='middleName' className='block text-sm font-medium text-gray-700'>
                Middle Name
              </label>
              <DynamicTextField
                id='middleName'
                name='middleName'
                type='text'
                value={formik.values.middleName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('middleName', true)}
                error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                helperText={
                  formik.touched.middleName && formik.errors.middleName ? formik.errors.middleName : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                Last Name *
              </label>
              <DynamicTextField
                id='lastName'
                name='lastName'
                type='text'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('lastName', true)}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='contactNumber' className='block text-sm font-medium text-gray-700'>
                Contact Number *
              </label>
              <DynamicTextField
                id='contactNumber'
                name='contactNumber'
                type='tel'
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('contactNumber', true)}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={
                  formik.touched.contactNumber && formik.errors.contactNumber ? formik.errors.contactNumber : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email *
              </label>
              <DynamicTextField
                id='email'
                name='email'
                type='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('email', true)}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='advanceRequest' className='block text-sm font-medium text-gray-700'>
                Advance Required *
              </label>
              <DynamicSelect
                id='advanceRequest'
                name='advanceRequest'
                value={formik.values.advanceRequest}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('advanceRequest', true)}
                error={formik.touched.advanceRequest && Boolean(formik.errors.advanceRequest)}
                helperText={
                  formik.touched.advanceRequest && formik.errors.advanceRequest ? formik.errors.advanceRequest : ''
                }
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </DynamicSelect>
            </FormControl>
          )}

          {formik.values['advanceRequest'] === 'Yes' && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='advanceAmount' className='block text-sm font-medium text-gray-700'>
                Advance Amount
              </label>
              <DynamicTextField
                id='advanceAmount'
                name='advanceAmount'
                type='number'
                value={formik.values.advanceAmount}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('advanceAmount', true)}
                error={formik.touched.advanceAmount && Boolean(formik.errors.advanceAmount)}
                helperText={
                  formik.touched.advanceAmount && formik.errors.advanceAmount ? formik.errors.advanceAmount : undefined
                }
              />
            </FormControl>
          )}

          {true && (
            <FormControl fullWidth margin='normal'>
              <label htmlFor='additionalInformation' className='block text-sm font-medium text-gray-700'>
                Additional Information
              </label>
              <DynamicTextField
                id='additionalInformation'
                multiline
                rows={4}
                name='additionalInformation'
                value={formik.values.additionalInformation}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('additionalInformation', true)}
                error={formik.touched.additionalInformation && Boolean(formik.errors.additionalInformation)}
                helperText={
                  formik.touched.additionalInformation && formik.errors.additionalInformation
                    ? formik.errors.additionalInformation
                    : undefined
                }
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Confirmation</legend>
        <div className='grid grid-cols-2 gap-4'>
          {true && (
            <FormControl fullWidth margin='normal'>
              <FormControlLabel
                control={
                  <DynamicCheckbox
                    id='confirmationCheckbox'
                    checked={formik.values.confirmationCheckbox}
                    onChange={formik.handleChange}
                    onFocus={() => formik.setFieldTouched('confirmationCheckbox', true)}
                  />
                }
                label='I confirm all details are correct *'
              />
            </FormControl>
          )}
        </div>
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Cancel
        </DynamicButton>

        <DynamicButton type='button' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save Draft
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Submit for Approval
        </DynamicButton>
      </div>
    </form>
  )
}

export default GeneratedForm
