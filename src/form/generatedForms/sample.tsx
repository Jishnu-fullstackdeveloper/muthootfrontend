'use client'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, Autocomplete, Grid } from '@mui/material'

import * as Yup from 'yup'

import DynamicButton from '@/components/Button/dynamicButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addNewUser, updateUser, resetAddUserStatus, fetchEmployees } from '@/redux/userManagementSlice'
import { fetchUserRole } from '@/redux/userRoleSlice'

type Props = {
  mode: 'add' | 'edit'
  id?: string
}

const AddOrEditUser: React.FC<Props> = ({ mode, id }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { employeeData, isEmployeeLoading, isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage } =
    useAppSelector((state: any) => state.UserManagementReducer || {})

  const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer || {})

  const [apiErrors, setApiErrors] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchEmployees({}))
    dispatch(fetchUserRole({ page: 1, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      const messages = Array.isArray(addUserFailureMessage) ? addUserFailureMessage : [addUserFailureMessage]

      setApiErrors(messages)
    } else {
      setApiErrors([])
    }
  }, [addUserFailure, addUserFailureMessage])

  useEffect(() => {
    if (addUserSuccess) {
      router.push('/user-management')
    }
  }, [addUserSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [dispatch])

  // Sanitize role to only allow letters, numbers, spaces, and hyphens
  const sanitizeRole = (role: string) => {
    return role.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
  }

  const userFormik = useFormik({
    initialValues: {
      employeeCode: mode === 'edit' ? searchParams.get('employeeCode') || '' : '',
      firstName: mode === 'edit' ? searchParams.get('firstName') || '' : '',
      middleName: mode === 'edit' ? searchParams.get('middleName') || '' : '',
      lastName: mode === 'edit' ? searchParams.get('lastName') || '' : '',
      email: mode === 'edit' ? searchParams.get('email') || '' : '',
      tempPassword: '',
      role: mode === 'edit' ? sanitizeRole(searchParams.get('role') || '') : ''
    },
    validationSchema: Yup.object().shape({
      employeeCode: Yup.string().required('Employee Code is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      ...(mode === 'add' && {
        tempPassword: Yup.string()
          .required('Temporary password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase, one lowercase, one number, and one special character'
          )
      }),
      role: Yup.string()
        .required('Role is required')
        .matches(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens')
    }),
    onSubmit: async values => {
      const sanitizedRole = sanitizeRole(values.role) // Ensure role is sanitized before submission

      if (mode === 'edit' && id) {
        const editParams = {
          email: values.email,
          newRoleName: sanitizedRole // Send sanitized role as a string
        }

        try {
          await dispatch(updateUser({ id, params: editParams })).unwrap()
        } catch (error: any) {
          setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred'])
        }
      } else {
        const addParams = {
          employeeCode: values.employeeCode,
          firstName: values.firstName,
          lastName: `${values.middleName} ${values.lastName}`.trim(),
          email: values.email,
          tempPassword: values.tempPassword,
          role: sanitizedRole
        }

        try {
          await dispatch(addNewUser(addParams)).unwrap()
        } catch (error: any) {
          setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred'])
        }
      }
    }
  })

  const handleCancel = () => {
    dispatch(resetAddUserStatus())
    router.back()
  }

  const employeeOptions = (employeeData || []).map((employee: any) => ({
    label: `${employee.employeeCode}`,
    value: employee.employeeCode,
    firstName: employee.firstName || '',
    middleName: employee.middleName || '',
    lastName: employee.lastName || '',
    email: employee.officeEmailAddress || employee.email || ''
  }))

  const roleOptions = (userRoleData?.data || []).map((role: any) => ({
    label: role.name,
    value: role.name
  }))

  const handleEmployeeChange = (event: any, newValue: any) => {
    if (newValue) {
      userFormik.setValues({
        ...userFormik.values,
        employeeCode: newValue.value,
        firstName: newValue.firstName,
        middleName: newValue.middleName,
        lastName: newValue.lastName,
        email: newValue.email
      })
    } else {
      userFormik.setValues({
        ...userFormik.values,
        employeeCode: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: ''
      })
    }
  }

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit User Role' : 'Add New User'}</h1>

      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          {apiErrors.map((error, index) => (
            <div key={index} className='text-red-600'>
              • {error}
            </div>
          ))}
        </div>
      )}

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>User Details</legend>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <Autocomplete
                options={employeeOptions}
                getOptionLabel={option => option.label}
                loading={isEmployeeLoading}
                value={employeeOptions.find(option => option.value === userFormik.values.employeeCode) || null}
                onChange={handleEmployeeChange}
                disabled={mode === 'edit'} // Disable in edit mode
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Employee Code *'
                    error={userFormik.touched.employeeCode && !!userFormik.errors.employeeCode}
                    helperText={userFormik.touched.employeeCode && userFormik.errors.employeeCode}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <Autocomplete
                options={roleOptions}
                getOptionLabel={option => option.label}
                loading={isUserRoleLoading}
                value={roleOptions.find(option => option.value === userFormik.values.role) || null}
                onChange={(event, newValue) => {
                  const sanitizedRole = newValue ? sanitizeRole(newValue.value) : ''

                  userFormik.setFieldValue('role', sanitizedRole)
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Role *'
                    error={userFormik.touched.role && !!userFormik.errors.role}
                    helperText={userFormik.touched.role && userFormik.errors.role}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <TextField
                label='First Name *'
                name='firstName'
                value={userFormik.values.firstName}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.firstName && !!userFormik.errors.firstName}
                helperText={userFormik.touched.firstName && userFormik.errors.firstName}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <TextField
                label='Last Name *'
                name='lastName'
                value={`${userFormik.values.middleName} ${userFormik.values.lastName}`.trim()}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.lastName && !!userFormik.errors.lastName}
                helperText={userFormik.touched.lastName && userFormik.errors.lastName}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth margin='normal'>
          <TextField
            label='Email *'
            name='email'
            value={userFormik.values.email}
            onChange={userFormik.handleChange}
            onBlur={userFormik.handleBlur}
            error={userFormik.touched.email && !!userFormik.errors.email}
            helperText={userFormik.touched.email && userFormik.errors.email}
            disabled={mode === 'edit'}
          />
        </FormControl>

        {mode === 'add' && (
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Temporary Password *'
              name='tempPassword'
              type='password'
              value={userFormik.values.tempPassword}
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              error={userFormik.touched.tempPassword && !!userFormik.errors.tempPassword}
              helperText={userFormik.touched.tempPassword && userFormik.errors.tempPassword}
            />
          </FormControl>
        )}
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-gray-500 text-white hover:bg-gray-700'
          onClick={handleCancel}
          disabled={isAddUserLoading}
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          disabled={isAddUserLoading}
        >
          {isAddUserLoading ? 'Saving...' : mode === 'edit' ? 'Update Role' : 'Add User'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUser

;('use client')

type Props = {
  mode: 'add' | 'edit'
  id?: string
}

const AddOrEditUser: React.FC<Props> = ({ mode, id }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { employeeData, isEmployeeLoading, isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage } =
    useAppSelector((state: any) => state.UserManagementReducer || {})

  const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer || {})

  const [apiErrors, setApiErrors] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchEmployees({}))
    dispatch(fetchUserRole({ page: 1, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      const messages = Array.isArray(addUserFailureMessage) ? addUserFailureMessage : [addUserFailureMessage]

      setApiErrors(messages)
    } else {
      setApiErrors([])
    }
  }, [addUserFailure, addUserFailureMessage])

  useEffect(() => {
    if (addUserSuccess) {
      router.push('/user-management')
    }
  }, [addUserSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [dispatch])

  const userFormik = useFormik({
    initialValues: {
      firstName: mode === 'edit' ? searchParams.get('firstName') || '' : '',
      middleName: mode === 'edit' ? searchParams.get('middleName') || '' : '',
      lastName: mode === 'edit' ? searchParams.get('lastName') || '' : '',
      email: mode === 'edit' ? searchParams.get('email') || '' : '',
      tempPassword: '',
      role: mode === 'edit' ? searchParams.get('role') || '' : '',
      employeeCode: mode === 'edit' ? searchParams.get('employeeCode') || '' : ''
    },
    validationSchema: Yup.object().shape({
      employeeCode: Yup.string().required('Employee Code is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      ...(mode === 'add' && {
        tempPassword: Yup.string()
          .required('Temporary password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase, one lowercase, one number, and one special character'
          )
      }),
      role: Yup.string().required('Role is required')
    }),
    onSubmit: async values => {
      const addParams = {
        employeeCode: values.employeeCode,
        firstName: values.firstName,
        lastName: `${values.middleName} ${values.lastName}`.trim(),
        email: values.email,
        tempPassword: values.tempPassword,
        role: values.role
      }

      const editParams = {
        email: values.email,
        newRoleName: [values.role] // Changed to string[] to match the expected type
      }

      try {
        if (mode === 'edit' && id) {
          await dispatch(
            updateUser({
              id,
              params: editParams
            })
          ).unwrap()
        } else {
          await dispatch(addNewUser(addParams)).unwrap()
        }
      } catch (error: any) {
        setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred'])
      }
    }
  })

  const handleCancel = () => {
    dispatch(resetAddUserStatus())
    router.back()
  }

  const employeeOptions = (employeeData || []).map((employee: any) => ({
    label: `${employee.employeeCode}`,
    value: employee.employeeCode,
    firstName: employee.firstName || '',
    middleName: employee.middleName || '',
    lastName: employee.lastName || '',
    email: employee.officeEmailAddress || employee.email || ''
  }))

  const roleOptions = (userRoleData?.data || []).map((role: any) => ({
    label: role.name,
    value: role.name
  }))

  const handleEmployeeChange = (event: any, newValue: any) => {
    if (newValue) {
      userFormik.setValues({
        ...userFormik.values,
        employeeCode: newValue.value,
        firstName: newValue.firstName,
        middleName: newValue.middleName,
        lastName: newValue.lastName,
        email: newValue.email
      })
    } else {
      userFormik.setValues({
        ...userFormik.values,
        employeeCode: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: ''
      })
    }
  }

  return (
    <form onSubmit={userFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</h1>

      {apiErrors.length > 0 && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
          {apiErrors.map((error, index) => (
            <div key={index} className='text-red-600'>
              • {error}
            </div>
          ))}
        </div>
      )}

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>User Details</legend>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin='normal' style={{ width: '100%' }}>
              <Autocomplete
                options={employeeOptions}
                getOptionLabel={option => option.label}
                loading={isEmployeeLoading}
                onChange={handleEmployeeChange}
                value={employeeOptions.find(option => option.value === userFormik.values.employeeCode) || null}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                disabled={mode === 'edit'} // Disable in edit mode
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Employee Code *'
                    error={userFormik.touched.employeeCode && !!userFormik.errors.employeeCode}
                    helperText={userFormik.touched.employeeCode && userFormik.errors.employeeCode}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin='normal' style={{ width: '100%' }}>
              <Autocomplete
                options={roleOptions}
                getOptionLabel={option => option.label}
                loading={isUserRoleLoading}
                value={roleOptions.find(option => option.value === userFormik.values.role) || null}
                onChange={(event, newValue) => {
                  userFormik.setFieldValue('role', newValue ? newValue.value : '')
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Role *'
                    error={userFormik.touched.role && !!userFormik.errors.role}
                    helperText={userFormik.touched.role && userFormik.errors.role}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <TextField
                label='First Name *'
                name='firstName'
                value={userFormik.values.firstName}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.firstName && !!userFormik.errors.firstName}
                helperText={userFormik.touched.firstName && userFormik.errors.firstName}
                disabled // Disable in edit mode
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin='normal'>
              <TextField
                label='Last Name *'
                name='lastName'
                value={`${userFormik.values.middleName} ${userFormik.values.lastName}`.trim()}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.lastName && !!userFormik.errors.lastName}
                helperText={userFormik.touched.lastName && userFormik.errors.lastName}
                disabled
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth margin='normal'>
          <TextField
            label='Email *'
            name='email'
            value={userFormik.values.email}
            onChange={userFormik.handleChange}
            onBlur={userFormik.handleBlur}
            error={userFormik.touched.email && !!userFormik.errors.email}
            helperText={userFormik.touched.email && userFormik.errors.email}
            disabled
          />
        </FormControl>

        {mode === 'add' && (
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Temporary Password *'
              name='tempPassword'
              type='password'
              value={userFormik.values.tempPassword}
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              error={userFormik.touched.tempPassword && !!userFormik.errors.tempPassword}
              helperText={userFormik.touched.tempPassword && userFormik.errors.tempPassword}
            />
          </FormControl>
        )}
      </fieldset>

      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-gray-500 text-white hover:bg-gray-700'
          onClick={handleCancel}
          disabled={isAddUserLoading}
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type='submit'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          disabled={isAddUserLoading}
        >
          {isAddUserLoading ? 'Saving...' : mode === 'edit' ? 'Update Role' : 'Save'}
        </DynamicButton>
      </div>
    </form>
  )
}

export default AddOrEditUser

// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { FormControl, TextField, Autocomplete, Grid } from '@mui/material';
// import DynamicButton from '@/components/Button/dynamicButton';
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { updateUser, resetAddUserStatus, fetchEmployees, addNewUser } from '@/redux/userManagementSlice';
// import { fetchUserRole } from '@/redux/userRoleSlice';

// type Props = {
//   mode: 'add' | 'edit';
//   id?: string;
// };

// const AddOrEditUser: React.FC<Props> = ({ mode, id }) => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const { employeeData, isEmployeeLoading, isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage } =
//     useAppSelector((state: any) => state.UserManagementReducer || {});
//   const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer || {});

//   const [apiErrors, setApiErrors] = useState<string[]>([]);

//   useEffect(() => {
//     dispatch(fetchEmployees({}));
//     dispatch(fetchUserRole({ page: 1, limit: 100 }));
//   }, [dispatch]);

//   useEffect(() => {
//     if (addUserFailure && addUserFailureMessage) {
//       const messages = Array.isArray(addUserFailureMessage) ? addUserFailureMessage : [addUserFailureMessage];
//       setApiErrors(messages);
//     } else {
//       setApiErrors([]);
//     }
//   }, [addUserFailure, addUserFailureMessage]);

//   useEffect(() => {
//     if (addUserSuccess) {
//       router.push('/user-management');
//     }
//   }, [addUserSuccess, router]);

//   useEffect(() => {
//     return () => {
//       dispatch(resetAddUserStatus());
//     };
//   }, [dispatch]);

//   // Initial values for edit mode from query params, empty for add mode
//   const initialEmployeeCode = mode === 'edit' ? searchParams.get('employeeCode') || '' : '';
//   const initialFirstName = mode === 'edit' ? searchParams.get('firstName') || '' : '';
//   const initialLastName = mode === 'edit' ? searchParams.get('lastName') || '' : '';
//   const initialEmail = mode === 'edit' ? searchParams.get('email') || '' : '';
//   const initialRole = mode === 'edit' ? searchParams.get('role') || '' : '';

//   const userFormik = useFormik({
//     initialValues: {
//       employeeCode: initialEmployeeCode,
//       firstName: initialFirstName,
//       lastName: initialLastName,
//       email: initialEmail,
//       role: initialRole,
//     },
//     validationSchema: Yup.object().shape({
//       employeeCode: Yup.string().required('Employee Code is required'),
//       firstName: Yup.string().required('First Name is required'),
//       lastName: Yup.string().required('Last Name is required'),
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       role: Yup.string()
//         .required('Role is required')
//         .matches(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens'),
//     }),
//     onSubmit: async (values) => {
//       if (mode === 'edit' && id) {
//         const editParams = {
//           email: values.email,
//           newRoleName: values.role,
//         };
//         try {
//           await dispatch(updateUser({ id, params: editParams })).unwrap();
//         } catch (error: any) {
//           setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred']);
//         }
//       } else if (mode === 'add') {
//         const addParams = {
//           employeeCode: values.employeeCode,
//           firstName: values.firstName,
//           lastName: values.lastName,
//           email: values.email,
//           role: values.role,
//         };
//         try {
//           await dispatch(addNewUser(addParams)).unwrap();
//         } catch (error: any) {
//           setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred']);
//         }
//       }
//     },
//   });

//   const handleCancel = () => {
//     dispatch(resetAddUserStatus());
//     router.back();
//   };

//   // Employee options for Autocomplete
//   const employeeOptions = (employeeData?.data || []).map((employee: any) => ({
//     label: employee.employeeCode,
//     value: employee.employeeCode,
//     firstName: employee.firstName || '',
//     lastName: employee.lastName || '',
//     email: employee.email || '',
//   }));

//   const roleOptions = (userRoleData?.data || []).map((role: any) => ({
//     label: role.name,
//     value: role.name,
//   }));

//   const sanitizeRole = (role: string) => {
//     return role
//       .replace(/[^a-zA-Z0-9\s-]/g, '')
//       .trim();
//   };

//   // Handle employee selection and auto-fill fields
//   const handleEmployeeChange = (event: any, newValue: any) => {
//     if (newValue) {
//       userFormik.setValues({
//         ...userFormik.values,
//         employeeCode: newValue.value,
//         firstName: newValue.firstName,
//         lastName: newValue.lastName,
//         email: newValue.email,
//       });
//     } else {
//       userFormik.setValues({
//         ...userFormik.values,
//         employeeCode: '',
//         firstName: '',
//         lastName: '',
//         email: '',
//       });
//     }
//   };

//   return (
//     <form onSubmit={userFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">{mode === 'edit' ? 'Edit User Role' : 'Add New User'}</h1>

//       {apiErrors.length > 0 && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
//           {apiErrors.map((error, index) => (
//             <div key={index} className="text-red-600">• {error}</div>
//           ))}
//         </div>
//       )}

//       <fieldset className="border border-gray-300 rounded p-4 mb-6">
//         <legend className="text-lg font-semibold text-gray-700">User Details</legend>

//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <FormControl fullWidth margin="normal">
//               {mode === 'add' ? (
//                 <Autocomplete
//                   options={employeeOptions}
//                   getOptionLabel={(option) => option.label}
//                   loading={isEmployeeLoading}
//                   value={employeeOptions.find((option) => option.value === userFormik.values.employeeCode) || null}
//                   onChange={handleEmployeeChange}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Employee Code *"
//                       error={userFormik.touched.employeeCode && !!userFormik.errors.employeeCode}
//                       helperText={userFormik.touched.employeeCode && userFormik.errors.employeeCode}
//                     />
//                   )}
//                 />
//               ) : (
//                 <TextField
//                   label="Employee Code *"
//                   name="employeeCode"
//                   value={userFormik.values.employeeCode}
//                   disabled
//                   InputProps={{ readOnly: true }}
//                 />
//               )}
//             </FormControl>
//           </Grid>

//           <Grid item xs={6}>
//             <FormControl fullWidth margin="normal">
//               <Autocomplete
//                 options={roleOptions}
//                 getOptionLabel={(option) => option.label}
//                 loading={isUserRoleLoading}
//                 value={roleOptions.find((option) => option.value === userFormik.values.role) || null}
//                 onChange={(event, newValue) => {
//                   const sanitizedRole = newValue ? sanitizeRole(newValue.value) : '';
//                   userFormik.setFieldValue('role', sanitizedRole);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Role *"
//                     error={userFormik.touched.role && !!userFormik.errors.role}
//                     helperText={userFormik.touched.role && userFormik.errors.role}
//                     onChange={(e) => {
//                       const sanitizedValue = sanitizeRole(e.target.value);
//                       userFormik.setFieldValue('role', sanitizedValue);
//                     }}
//                   />
//                 )}
//               />
//             </FormControl>
//           </Grid>
//         </Grid>

//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <FormControl fullWidth margin="normal">
//               <TextField
//                 label="First Name *"
//                 name="firstName"
//                 value={userFormik.values.firstName}
//                 onChange={userFormik.handleChange}
//                 onBlur={userFormik.handleBlur}
//                 error={userFormik.touched.firstName && !!userFormik.errors.firstName}
//                 helperText={userFormik.touched.firstName && userFormik.errors.firstName}
//                 disabled={mode === 'edit'}
//                 InputProps={{ readOnly: mode === 'edit' }}
//               />
//             </FormControl>
//           </Grid>

//           <Grid item xs={6}>
//             <FormControl fullWidth margin="normal">
//               <TextField
//                 label="Last Name *"
//                 name="lastName"
//                 value={userFormik.values.lastName}
//                 onChange={userFormik.handleChange}
//                 onBlur={userFormik.handleBlur}
//                 error={userFormik.touched.lastName && !!userFormik.errors.lastName}
//                 helperText={userFormik.touched.lastName && userFormik.errors.lastName}
//                 disabled={mode === 'edit'}
//                 InputProps={{ readOnly: mode === 'edit' }}
//               />
//             </FormControl>
//           </Grid>
//         </Grid>

//         <FormControl fullWidth margin="normal">
//           <TextField
//             label="Email *"
//             name="email"
//             value={userFormik.values.email}
//             onChange={userFormik.handleChange}
//             onBlur={userFormik.handleBlur}
//             error={userFormik.touched.email && !!userFormik.errors.email}
//             helperText={userFormik.touched.email && userFormik.errors.email}
//             disabled={mode === 'edit'}
//             InputProps={{ readOnly: mode === 'edit' }}
//           />
//         </FormControl>
//       </fieldset>

//       <div className="flex justify-end space-x-4">
//         <DynamicButton
//           type="button"
//           variant="contained"
//           className="bg-gray-500 text-white hover:bg-gray-700"
//           onClick={handleCancel}
//           disabled={isAddUserLoading}
//         >
//           Cancel
//         </DynamicButton>

//         <DynamicButton
//           type="submit"
//           variant="contained"
//           className="bg-blue-500 text-white hover:bg-blue-700"
//           disabled={isAddUserLoading}
//         >
//           {isAddUserLoading ? (mode === 'edit' ? 'Updating...' : 'Adding...') : mode === 'edit' ? 'Update Role' : 'Add User'}
//         </DynamicButton>
//       </div>
//     </form>
//   );
// };

// export default AddOrEditUser;
