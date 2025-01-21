import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  FormControl,
  IconButton,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import DynamicButton from '@/components/Button/dynamicButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Section = {
  approvalFor: any;
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sections, setSections] = useState<Section[]>([{ approvalFor: '' }]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  useEffect(() => {
    const approvalType = searchParams.get('approvalType') || '';
    const numberOfLevels = searchParams.get('numberOfLevels') || '1';
    const approvalFor = searchParams.get('approvalFor') || '';

    if (approvalType) {
      formik.setFieldValue('approvalType', approvalType);
    }
    if (numberOfLevels) {
      formik.setFieldValue('numberOfLevels', parseInt(numberOfLevels));
    }
    if (approvalFor) {
      setSections([{ approvalFor }]);
      formik.setFieldValue('sections', [{ approvalFor }]);
    }
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      approvalType: '',
      numberOfLevels: 1,
      sections: [{ approvalFor: '' }],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  const handleAddSection = () => {
    const newSections = Array.from({ length: formik.values.numberOfLevels }, () => ({ approvalFor: '' }));
    setSections([...sections, ...newSections]);
    formik.setFieldValue('sections', [...formik.values.sections, ...newSections]);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null) {
      const updatedSections = formik.values.sections.filter((_, i) => i !== sectionToDelete);
      setSections(updatedSections);
      formik.setFieldValue('sections', updatedSections);
      setSectionToDelete(null);
    }
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (index: number) => {
    setSectionToDelete(index);
    setDialogOpen(true);
  };

  const handleResetLevels = () => {
    formik.setFieldValue('numberOfLevels', 1);
    setSections([{ approvalFor: '' }]);
    formik.setFieldValue('sections', [{ approvalFor: '' }]);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Approval Process Form</h1>

      <fieldset className="border border-gray-300 rounded p-8 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <FormControl fullWidth margin="normal">
            <label htmlFor="approvalType" className="block text-sm font-medium text-gray-700">
              Approval Type *
            </label>
            <TextField
              id="approvalType"
              name="approvalType"
              value={formik.values.approvalType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.approvalType && Boolean(formik.errors.approvalType)}
              helperText={formik.touched.approvalType && formik.errors.approvalType}
              variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="numberOfLevels" className="block text-sm font-medium text-gray-700">
              Number of Levels *
            </label>
            <div className="flex items-center space-x-2">
              <TextField
                id="numberOfLevels"
                name="numberOfLevels"
                type="number"
                value={formik.values.numberOfLevels}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numberOfLevels && Boolean(formik.errors.numberOfLevels)}
                helperText={formik.touched.numberOfLevels && formik.errors.numberOfLevels}
                variant="outlined"
                inputProps={{ min: 1, max: 10 }}
                sx={{ width: 700 }}
              />
              <IconButton onClick={handleAddSection} aria-label="add">
                <AddIcon />
              </IconButton>
              <IconButton onClick={handleResetLevels} aria-label="reset">
                <RefreshIcon />
              </IconButton>
            </div>
          </FormControl>
        </div>

        <div className="mt-6">
          {formik.values.sections.map((_, index) => (
            <div key={index} className="flex space-x-3 space-y-3 justify-center">
              <Typography
                variant="body1"
                className="font-medium text-gray-700 col-span-2 mt-7"
              >
                Approval {index + 1}:
              </Typography>

              <FormControl fullWidth className="w-2/5">
                <Autocomplete
                  id={`sections.${index}.approvalFor`}
                  onChange={(_, newValue: string | null) =>
                    formik.setFieldValue(`sections.${index}.approvalFor`, newValue)
                  }
                  options={['Salesman', 'Engineer', 'Branch Manager', 'HR', 'Finance']}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        formik.touched.sections?.[index]?.approvalFor &&
                        Boolean((formik.errors.sections?.[index] as { approvalFor: string }).approvalFor)
                      }
                      helperText={
                        formik.touched.sections?.[index]?.approvalFor &&
                        (formik.errors.sections?.[index] as { approvalFor: string }).approvalFor
                      }
                      variant="outlined"
                      fullWidth
                      placeholder="Approval by"
                    />
                  )}
                />
              </FormControl>

              <IconButton
                onClick={() => handleOpenDeleteDialog(index)}
                aria-label="delete"
                disabled={formik.values.sections.length === 1}
                className="col-span-1"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end space-x-4">
        <DynamicButton
          type="button"
          variant="contained"
          className="bg-gray-500 text-white hover:bg-gray-700"
          onClick={() => formik.resetForm()}
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type="submit"
          variant="contained"
          className="bg-primary-500 text-white hover:bg-primary-700"
          onClick={() => formik.handleSubmit()}
        >
          Save
        </DynamicButton>
      </div>

      {/* Dialog Box */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
          <DynamicButton
            onClick={() => setDialogOpen(false)}
            variant="text"
            className="text-gray-700"
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            onClick={confirmDeleteSection}
            variant="text"
            className="bg-primary-500 text-primary hover:bg-primary-700"
          >
            Delete
          </DynamicButton>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddNewApprovalMatrixGenerated;
