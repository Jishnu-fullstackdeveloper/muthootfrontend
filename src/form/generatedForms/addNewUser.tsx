


'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Use useParams instead of useSearchParams
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormControl, TextField, Autocomplete, Grid } from '@mui/material';
import DynamicButton from '@/components/Button/dynamicButton';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addNewUser, updateUser, resetAddUserStatus, fetchEmployees } from '@/redux/UserManagment/userManagementSlice';
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice';

type Props = {
  mode: 'add' | 'edit';
};

const AddOrEditUser: React.FC<Props> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams(); // Get the id from the route

  const { isAddUserLoading, addUserSuccess, addUserFailure, addUserFailureMessage , userManagementData} =
  useAppSelector((state: any) => state.UserManagementReducer || {});

const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer || {});

  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const userId = mode === 'edit' ? (params.id as string) : null; // Extract id from route params

  useEffect(() => {
    dispatch(fetchEmployees({}));
    dispatch(fetchUserRole({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'edit' && userId && userManagementData?.data) {
      const existingUser = userManagementData.data.find((user: any) => user.userId === userId);
      if (existingUser) {
        // Populate form with existing user data
        userFormik.setValues({
          employeeCode: existingUser.employeeCode || '',
          userId: existingUser.userId || '',
          firstName: existingUser.firstName || '',
          middleName: existingUser.middleName || '',
          lastName: existingUser.lastName || '',
          email: existingUser.email || '',
          designation : existingUser.designation || '',
          roles: existingUser.roles?.length
            ? existingUser.roles.map((role: any) => (typeof role === 'string' ? role : role.name))
            : existingUser.role
            ? [existingUser.role]
            : []
        });
      } else {
        // Optionally fetch user data if not in store
        // dispatch(fetchUserById(userId)); // You'd need to implement this action
      }
    }
  }, [mode, userId, userManagementData]);

  useEffect(() => {
    if (addUserFailure && addUserFailureMessage) {
      const messages = Array.isArray(addUserFailureMessage.message)
        ? addUserFailureMessage.message
        : [addUserFailureMessage.message || addUserFailureMessage || 'Unknown error'];
      setApiErrors(messages);
    } else {
      setApiErrors([]);
    }
  }, [addUserFailure, addUserFailureMessage]);

  useEffect(() => {
    if (addUserSuccess) {
      router.push('/user-management');
    }
  }, [addUserSuccess, router]);

  useEffect(() => {
    return () => {
      dispatch(resetAddUserStatus());
    };
  }, [dispatch]);

  const sanitizeRole = (role: string) => {
    return role.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
  };

  const userFormik = useFormik({
    initialValues: {
      employeeCode: '',
      userId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      designation:'',
      roles: []
    },
    validationSchema: Yup.object().shape({
      employeeCode: Yup.string().required('Employee Code is required'),
      userId: Yup.string().required('AD User Id is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      // designation:Yup.string().designation('requesrd').required('dhhdhdh'),
      roles: Yup.array()
        .of(
          Yup.string()
            .matches(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens')
            .min(1, 'Role name cannot be empty')
        )
        .min(1, 'At least one role is required')
    }),
    onSubmit: async (values) => {
      const sanitizedRoles = values.roles.map((role) => sanitizeRole(role)).filter((role) => role.length > 0);

      if (sanitizedRoles.length === 0) {
        setApiErrors(['At least one valid role is required']);
        return;
      }

      if (mode === 'edit' && userId) {
        const editParams = {
          email: values.email,
          newRoleNames: sanitizedRoles
        };
        console.log('Edit Payload:', editParams);
        try {
          await dispatch(updateUser({ id: userId, params: editParams })).unwrap();
        } catch (error: any) {
          setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred']);
        }
      } else {
        const addParams = {
          employeeCode: values.employeeCode,
          userId: values.userId,
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          email: values.email,
          designation: values.designation,
          newRoleNames: sanitizedRoles
        };
        console.log('Add Payload:', addParams);
        try {
          await dispatch(addNewUser(addParams)).unwrap();
        } catch (error: any) {
          setApiErrors(Array.isArray(error.message) ? error.message : [error.message || 'An error occurred']);
        }
      }
    }
  });

  const handleCancel = () => {
    dispatch(resetAddUserStatus());
    router.back();
  };

  const roleOptions = (userRoleData?.data || []).map((role: any) => ({
    label: role.name,
    value: role.name
  }));

  return (
    <form onSubmit={userFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{mode === 'edit' ? 'Edit User' : 'Add New User'}</h1>

      {apiErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          {apiErrors.map((error, index) => (
            <div key={index} className="text-red-600">• {error}</div>
          ))}
        </div>
      )}

      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">User Details</legend>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Employee Code *"
                name="employeeCode"
                value={userFormik.values.employeeCode}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.employeeCode && !!userFormik.errors.employeeCode}
                helperText={userFormik.touched.employeeCode && userFormik.errors.employeeCode}
                disabled={mode === 'edit'} // Disable in edit mode if not editable
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="User ID *"
                name="userId"
                value={userFormik.values.userId}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.userId && !!userFormik.errors.userId}
                helperText={userFormik.touched.userId && userFormik.errors.userId}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="First Name *"
                name="firstName"
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
            <FormControl fullWidth margin="normal">
              <TextField
                label="Middle Name"
                name="middleName"
                value={userFormik.values.middleName}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Last Name *"
                name="lastName"
                value={userFormik.values.lastName}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.lastName && !!userFormik.errors.lastName}
                helperText={userFormik.touched.lastName && userFormik.errors.lastName}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Email *"
                name="email"
                value={userFormik.values.email}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.email && !!userFormik.errors.email}
                helperText={userFormik.touched.email && userFormik.errors.email}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Designation *"
                name="designation"
                value={userFormik.values.designation}
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                error={userFormik.touched.designation && !!userFormik.errors.designation}
                helperText={userFormik.touched.designation && userFormik.errors.designation}
                disabled={mode === 'edit'}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                options={roleOptions}
                getOptionLabel={(option) => option.label}
                loading={isUserRoleLoading}
                value={roleOptions.filter((option) => userFormik.values.roles.includes(option.value))}
                onChange={(event, newValue) => {
                  const sanitizedRoles = newValue.map((option) => sanitizeRole(option.value));
                  userFormik.setFieldValue('roles', sanitizedRoles);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Roles *"
                    error={userFormik.touched.roles && !!userFormik.errors.roles}
                    helperText={userFormik.touched.roles && userFormik.errors.roles}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </fieldset>

      <div className="flex justify-end space-x-4">
        <DynamicButton
          type="button"
          variant="contained"
          className="bg-gray-500 text-white hover:bg-gray-700"
          onClick={handleCancel}
          disabled={isAddUserLoading}
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type="submit"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
          disabled={isAddUserLoading}
        >
          {isAddUserLoading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Add User'}
        </DynamicButton>
      </div>
    </form>
  );
};

export default AddOrEditUser;
