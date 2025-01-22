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

type Section = {
  approvalFor: string;
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
        approvalFor: Yup.string().required('Approval For is required'),
      })
    )
    .min(1, 'At least one section is required'),
});

const AddNewApprovalMatrixGenerated: React.FC = () => {
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const ApprovalMatrixFormik = useFormik({
    initialValues: {
      approvalType: '',
      numberOfLevels: 1,
      sections: [] as Section[],
      draggingIndex: null as number | null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const handleAddSection = () => {
    const numberOfSections = ApprovalMatrixFormik.values.numberOfLevels;
    const newSections = Array.from({ length: numberOfSections }, () => ({ approvalFor: '' }));
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

  const hasApprovalForError = () => {
    const errors = ApprovalMatrixFormik.errors.sections;
    const touched = ApprovalMatrixFormik.touched.sections;
    return touched && errors && Array.isArray(errors) && errors.some((e) => e?.approvalFor);
  };

  return (
    <form onSubmit={ApprovalMatrixFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Approval Process Form</h1>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 6, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              label="Approval Type"
              id="approvalType"
              name="approvalType"
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
          <Box>
            {ApprovalMatrixFormik.values.sections.map((section, index) => (
              <Box
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 4,
                  mt: 3,
                  cursor: 'grabbing',
                  backgroundColor: '#ffffff',
                }}
              >
                <DragIndicatorIcon sx={{ mr: 2, color: '#666' }} />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Approval {index + 1}:
                </Typography>
                <Autocomplete
                  value={section.approvalFor}
                  onChange={(_, newValue: string | null) =>
                    ApprovalMatrixFormik.setFieldValue(`sections[${index}].approvalFor`, newValue)
                  }
                  options={['Salesman', 'Engineer', 'Branch Manager', 'HR', 'Finance']}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Approval by"
                      error={
                        ApprovalMatrixFormik.touched.sections?.[index]?.approvalFor 
                      }
                      helperText={
                        ApprovalMatrixFormik.touched.sections?.[index]?.approvalFor 
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
            {hasApprovalForError() && (
              <Typography color="error" className='flex ml-36 mt-4'>
                Approval For is required for all sections.
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="contained" color="secondary" onClick={() => ApprovalMatrixFormik.resetForm()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this section?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddNewApprovalMatrixGenerated;
