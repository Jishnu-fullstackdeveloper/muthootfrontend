'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Keep this for navigation purposes
import { useSearchParams } from 'next/navigation'; // Use this for query parameters in Next 13+
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
  const searchParams = useSearchParams(); // Using this hook to get query parameters

  const [sections, setSections] = useState<Section[]>([{ approvalFor: '' }]);

  useEffect(() => {
    // Check for query parameters using searchParams.get
    const approvalType = searchParams.get('approvalType') || '';
    const numberOfLevels = searchParams.get('numberOfLevels') || '1';
    const approvalFor = searchParams.get('approvalFor') || '';

    console.log("Fetched Query Params:", approvalType, numberOfLevels, approvalFor);

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
  }, [searchParams]); // Re-run when searchParams change

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

  const handleRemoveSection = (index: number) => {
    const updatedSections = formik.values.sections.filter((_, i) => i !== index);
    setSections(updatedSections);
    formik.setFieldValue('sections', updatedSections);
  };

  const handleSectionChange = (index: number, value: string | null) => {
    if (value === null) return;
    const updatedSections = [...formik.values.sections];
    updatedSections[index].approvalFor = value;
    formik.setFieldValue('sections', updatedSections);
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
                    handleSectionChange(index, newValue)
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
                onClick={() => handleRemoveSection(index)}
                aria-label="delete"
                disabled={formik.values.sections.length === 1}
                className="col-span-1"
              >
                <DeleteIcon  />
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
    </form>
  );
};

export default AddNewApprovalMatrixGenerated;
