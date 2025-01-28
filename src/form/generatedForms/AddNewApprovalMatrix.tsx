'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  FormControl,
  TextField,
  Autocomplete,
  Tooltip,
  IconButton,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useAppDispatch } from '@/lib/hooks';
import { createNewApprovalMatrix, updateApprovalMatrix } from '@/redux/approvalMatrixSlice';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
//import { deleteApprovalMatrix } from '@/redux/approvalMatrixSlice';

type Section = {
  approvalFor: { id: number; designation: string } | null;
};

const validationSchema = Yup.object({
  approvalType: Yup.string().required('Approval Type is required'),
  numberOfLevels: Yup.number()
    .required('Number of Levels is required')
    .min(1, 'Number of Levels must be at least 1')
    .max(10, 'Number of Levels cannot exceed 10'),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        approvalFor: Yup.object()
          .shape({
            id: Yup.number().required('Invalid option selected'),
            designation: Yup.string().required('Invalid option selected'),
          })
          .required('Approval For is required'),
      })
    )
    .min(1, 'At least one section is required'),
});

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch()
  const isUpdateMode = Boolean(searchParams.get('uuid'));

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    const approvalType = searchParams.get('approvalType') || '';
    const numberOfLevels = searchParams.get('numberOfLevels') || '1';
    const approvalFor = searchParams.get('approvalFor') || '[]';

    if (isUpdateMode) {
      ApprovalMatrixFormik.setFieldValue('uuid', uuid);
      ApprovalMatrixFormik.setFieldValue('approvalType', approvalType);
      ApprovalMatrixFormik.setFieldValue('numberOfLevels', parseInt(numberOfLevels, 10));
      ApprovalMatrixFormik.setFieldValue('sections', JSON.parse(approvalFor).map((approval: any) => ({
        approvalFor: approval,
      })));
    }
  }, [searchParams, isUpdateMode]);

  const ApprovalMatrixFormik = useFormik({
    initialValues: {
      uuid: '',
      approvalType: '',
      numberOfLevels: 1,
      sections: [] as Section[],
      draggingIndex: null as number | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const configurations = values.sections.map((section, index) => ({
        approverDesignationId: section.approvalFor?.id || '', // Map to approverDesignationId
        approvalSequenceLevel: index + 1, // Level is based on index (starting from 1)
      }));

      // const params = {
      //   "name": "string",
      //   "description": "string",
      //   "parentActionId": 1,
      //   "configurations": [
      //     {
      //       "approverDesignationId": 2,
      //       "approvalSequenceLevel": 1
      //     },
      //     {
      //       "approverDesignationId": 2,
      //       "approvalSequenceLevel": 2
      //     },
      //     {
      //       "approverDesignationId": 2,
      //       "approvalSequenceLevel": 2
      //     }
      //   ]
      // }

      const params = {
        name: values.approvalType,
        // name: 'Sample',
        description: 'description',
        parentActionId: 1,
        configurations: configurations
        // configurations: [
        //   {
        //     "approverDesignationId": 2,
        //     "approvalSequenceLevel": 1
        //   },
        //   {
        //     "approverDesignationId": 2,
        //     "approvalSequenceLevel": 2
        //   },
        //   {
        //     "approverDesignationId": 4,
        //     "approvalSequenceLevel": 2
        //   }
        // ], // This is the array of mapped configurations
      };

      if (isUpdateMode) {
        // Update the approval matrix
        dispatch(updateApprovalMatrix({ uuid: values.uuid, approvalMatrix: params })).unwrap();
      } else {
        // Create a new approval matrix
        dispatch(createNewApprovalMatrix(params as any)).unwrap();
      }

      console.log('Approval Data to API:', params);
      ApprovalMatrixFormik.resetForm();
    },
  });

  const handleAddSection = () => {
    const numberOfSections = ApprovalMatrixFormik.values.numberOfLevels;
    const newSections = Array.from({ length: numberOfSections }, () => ({ approvalFor: null }));
    ApprovalMatrixFormik.setFieldValue('sections', newSections);
    setSectionsVisible(true);
  };

  const handleResetLevels = () => {
    ApprovalMatrixFormik.setFieldValue('numberOfLevels', 1);
    ApprovalMatrixFormik.setFieldValue('sections', []);
    setSectionsVisible(false);
  };

  const handleDragStart = (index: number) => {
    ApprovalMatrixFormik.setFieldValue('draggingIndex', index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    const draggingIndex = ApprovalMatrixFormik.values.draggingIndex;
    if (draggingIndex === null || draggingIndex === index) return;

    const updatedSections = [...ApprovalMatrixFormik.values.sections];
    const [removed] = updatedSections.splice(draggingIndex, 1);
    updatedSections.splice(index, 0, removed);

    ApprovalMatrixFormik.setFieldValue('sections', updatedSections);
    ApprovalMatrixFormik.setFieldValue('draggingIndex', null);
  };

  const handleOpenDialog = (index: number) => {
    setDeleteIndex(index);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedSections = ApprovalMatrixFormik.values.sections.filter((_, i) => i !== deleteIndex);
      ApprovalMatrixFormik.setFieldValue('sections', updatedSections);
    }
    handleCloseDialog();
  };

  const handleUpdate = (uuid: string, updatedData: any) => {
    dispatch(updateApprovalMatrix({ uuid, approvalMatrix: updatedData }))
      .unwrap()
      .then((res) => {
        console.log('Approval matrix updated successfully', res);
      })
      .catch((err) => {
        console.error('Error updating approval matrix:', err);
      });
  };

  return (
    <form onSubmit={ApprovalMatrixFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Approval Process Form</h1>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, p: 4, boxShadow: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <FormControl fullWidth>
            <TextField
              label="Approval Type"
              id="approvalType"
              name="approvalType"
              variant="outlined"
              value={ApprovalMatrixFormik.values.approvalType}
              onChange={ApprovalMatrixFormik.handleChange}
              onBlur={ApprovalMatrixFormik.handleBlur}
              error={ApprovalMatrixFormik.touched.approvalType && Boolean(ApprovalMatrixFormik.errors.approvalType)}
              helperText={ApprovalMatrixFormik.touched.approvalType && ApprovalMatrixFormik.errors.approvalType}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Number of Levels"
              id="numberOfLevels"
              name="numberOfLevels"
              type="number"
              value={ApprovalMatrixFormik.values.numberOfLevels}
              onChange={ApprovalMatrixFormik.handleChange}
              onBlur={ApprovalMatrixFormik.handleBlur}
              error={ApprovalMatrixFormik.touched.numberOfLevels && Boolean(ApprovalMatrixFormik.errors.numberOfLevels)}
              helperText={ApprovalMatrixFormik.touched.numberOfLevels && ApprovalMatrixFormik.errors.numberOfLevels}
              inputProps={{ min: 1, max: 10 }}
            />
          </FormControl>

          <Tooltip title={`Add ${ApprovalMatrixFormik.values.numberOfLevels || 0} level(s)`} arrow>
            <IconButton onClick={handleAddSection}>
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset levels" arrow>
            <IconButton onClick={handleResetLevels}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {sectionsVisible && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 6 }}>
            {ApprovalMatrixFormik.values.sections.map((section, index) => (
              <Box
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                sx={{
                  display: 'flex', alignItems: 'center', p: 2, width: '100%', maxWidth: 600, boxShadow: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <DragIndicatorIcon sx={{ mr: 2, color: '#666' }} />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Approval {index + 1}:
                </Typography>
                <Autocomplete
                  value={section.approvalFor || null}
                  onChange={(_, newValue) => {
                    ApprovalMatrixFormik.setFieldValue(
                      `sections[${index}].approvalFor`,
                      newValue || null
                    );
                  }}
                  options={[
                    { id: 1, designation: 'Salesman' },
                    { id: 2, designation: 'Engineer' },
                    { id: 3, designation: 'Branch Manager' },
                    { id: 4, designation: 'HR' },
                    { id: 5, designation: 'Finance' },
                  ]}
                  getOptionLabel={(option) => option.designation || ''}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Approval by"
                      error={Boolean(ApprovalMatrixFormik.touched.sections?.[index]?.approvalFor)}
                      helperText={
                        ApprovalMatrixFormik.touched.sections?.[index]?.approvalFor
                          ? 'Approval For is required'
                          : ''
                      }
                    />
                  )}
                  sx={{ flex: 1, mr: 2 }}
                />
                <IconButton onClick={() => handleOpenDialog(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="contained" color="secondary" onClick={() => ApprovalMatrixFormik.resetForm()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!ApprovalMatrixFormik.isValid || !ApprovalMatrixFormik.dirty}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
export default AddNewApprovalMatrixGenerated;
