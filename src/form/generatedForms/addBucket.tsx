"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormControl, TextField, IconButton, InputAdornment, Autocomplete } from "@mui/material";
import DynamicButton from '@/components/Button/dynamicButton';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';

const validationSchema = Yup.object().shape({
  bucketName: Yup.string().required("Bucket Name is required"),
  turnoverLimit: Yup.number().required("Turnover Limit is required"),
  turnoverId: Yup.string().required("Turnover ID is required"),
  note: Yup.string(),
  designations: Yup.array().of(
    Yup.object().shape({
      designationName: Yup.string().required("Designation is required"),
      roleCount: Yup.number().required("Role Count is required").min(1)
    })
  ).min(1, "At least one designation is required")
});

const GeneratedForm: React.FC = () => {
  const [designations, setDesignations] = useState([{ designationName: "", roleCount: 1 }]);
  const formik: any = useFormik({
    initialValues: {
      bucketName: "",
      turnoverLimit: "",
      turnoverId: "",
      note: "",
      designations: [{ designationName: "", roleCount: 1 }]
    },
    validationSchema,
    onSubmit: values => {
      console.log("Form Submitted:", values);
    }
  });

  const handleAddDesignation = () => {
    setDesignations([...designations, { designationName: "", roleCount: 1 }]);
  };

  const handleRemoveDesignation = (index: number) => {
    setDesignations(designations.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Bucket Management Form</h1>

      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">Bucket Details</legend>
        <div className="grid grid-cols-2 gap-4">
          {/* Bucket Name */}
          <FormControl fullWidth margin="normal">
            <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">
              Bucket Name *
            </label>
            <TextField
              id="bucketName"
              name="bucketName"
              type="text"
              value={formik.values.bucketName}
              onChange={formik.handleChange}
              onFocus={() => formik.setFieldTouched("bucketName", true)}
              error={formik.touched.bucketName && Boolean(formik.errors.bucketName)}
              helperText={formik.touched.bucketName && formik.errors.bucketName ? formik.errors.bucketName : undefined}
            />
          </FormControl>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Turnover Limit */}
          <FormControl fullWidth margin="normal">
            <label htmlFor="turnoverLimit" className="block text-sm font-medium text-gray-700">
              Turnover Limit *
            </label>
            <TextField
              id="turnoverLimit"
              name="turnoverLimit"
              type="number"
              value={formik.values.turnoverLimit}
              onChange={formik.handleChange}
              onFocus={() => formik.setFieldTouched("turnoverLimit", true)}
              error={formik.touched.turnoverLimit && Boolean(formik.errors.turnoverLimit)}
              helperText={formik.touched.turnoverLimit && formik.errors.turnoverLimit ? formik.errors.turnoverLimit : undefined}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>
              }}
            />
          </FormControl>

          {/* Turnover ID */}
          <FormControl fullWidth margin="normal">
            <label htmlFor="turnoverId" className="block text-sm font-medium text-gray-700">
              Turnover ID *
            </label>
            <TextField
              id="turnoverId"
              name="turnoverId"
              type="text"
              value={formik.values.turnoverId}
              onChange={formik.handleChange}
              onFocus={() => formik.setFieldTouched("turnoverId", true)}
              error={formik.touched.turnoverId && Boolean(formik.errors.turnoverId)}
              helperText={formik.touched.turnoverId && formik.errors.turnoverId ? formik.errors.turnoverId : undefined}
            />
          </FormControl>
        </div>

        {/* Designations */}
        <div>
          <h4>Designations</h4>
          {designations.map((designation, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '16px',
                alignItems: 'center',
                width: '100%', // Ensures the form row stretches to available width
              }}
            >
              {/* Designation Field */}
              <div style={{ width: '300px' }}>
                <Autocomplete
                  options={["Manager", "Lead", "Member", "Assistant", "Director"]}
                  value={designation.designationName}
                  onChange={(e, value) => {
                    const newDesignations = [...designations];
                    newDesignations[index].designationName = value || "";
                    setDesignations(newDesignations);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`Designation ${index + 1}`}
                      error={formik.touched.designations && Boolean(formik.errors.designations)}
                      helperText={formik.touched.designations && formik.errors.designations ? formik.errors.designations : ''}
                      style={{ width: '100%' }} // Ensure the TextField takes up all available space in its container
                    />
                  )}
                />
              </div>

              {/* Role Count Field */}
              <div style={{ width: '150px', marginLeft: '10px' }}>
                <TextField
                  label="Role Count"
                  type="number"
                  value={designation.roleCount}
                  onChange={(e) => {
                    const value = e.target.value;

                    // If the value is empty (backspace deletes everything), reset to 1
                    if (value === "") {
                      const newDesignations = [...designations];
                      newDesignations[index].roleCount = 1; // Default to 1
                      setDesignations(newDesignations);
                    } else {
                      // If the value is a valid positive number
                      const parsedValue = Number(value);
                      if (parsedValue <= 0) {
                        // If negative or zero, show error and reset to 1
                        const newDesignations = [...designations];
                        newDesignations[index].roleCount = 1; // Default to 1
                        setDesignations(newDesignations);
                      } else {
                        // If valid positive value, update state
                        const newDesignations = [...designations];
                        newDesignations[index].roleCount = parsedValue;
                        setDesignations(newDesignations);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // If the field loses focus and the value is empty, reset to 1
                    if (e.target.value === "") {
                      const newDesignations = [...designations];
                      newDesignations[index].roleCount = 1;
                      setDesignations(newDesignations);
                    }
                  }}
                  error={designation.roleCount <= 0 && designation.roleCount !== ""}
                  helperText={designation.roleCount <= 0 && designation.roleCount !== "" ? "Role Count must be a positive number." : ""}
                  fullWidth
                />
              </div>
              {designations.length > 1 && index > 0 && (
                  <IconButton
                    color="secondary"
                    onClick={() => handleRemoveDesignation(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              {/* Buttons Section */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                {/* Only show the Add button on the last field */}
                {index === designations.length - 1 && (
                  <IconButton color="primary" onClick={handleAddDesignation}>
                    <AddIcon />
                  </IconButton>
                )}

                {/* Show the Remove button only for added fields (not the first one) */}
                
              </div>
            </div>
          ))}
        </div>

        {/* Note Field */}
        <FormControl fullWidth margin="normal">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <TextField
            id="note"
            name="note"
            multiline
            rows={4}
            value={formik.values.note}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("note", true)}
            error={formik.touched.note && Boolean(formik.errors.note)}
            helperText={formik.touched.note && formik.errors.note ? formik.errors.note : undefined}
          />
        </FormControl>
      </fieldset>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-4">
        <DynamicButton
          type="button"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type="submit"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Post Bucket
        </DynamicButton>
      </div>
    </form>
  );
};

export default GeneratedForm;
