"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import DynamicButton from "@/components/Button/dynamicButton";
import { styled } from "@mui/material/styles";

const optionsData = {
  employeeCategoryDetails: [
    { id: "designation", label: "Designation", options: ["Software Engineer", "Project Manager", "UI/UX Designer", "Data Scientist"] },
    { id: "department", label: "Department", options: ["IT", "HR", "Finance", "Operations"] },
    { id: "empCategoryType", label: "Employee Category Type", options: ["Full-Time", "Part-Time", "Contractor", "Intern"] },
    { id: "grade", label: "Grade", options: ["G1", "G2", "G3", "G4"] },
    { id: "band", label: "Band", options: ["B1", "B2", "B3", "B4"] }, 
  ],
  locationCategoryDetails: [
    { id: "company", label: "Company", options: ["C1", "C2", "C3", "C4"] },
    { id: "businessUnit", label: "Business Unit", options: ["BU1", "BU2", "BU3", "BU4"] },
    { id: "territory", label: "Territory", options: ["T1", "T2", "T3", "T4"] },
    { id: "zone", label: "Zone", options: ["Z1", "Z2", "Z3", "Z4"] },
    { id: "region", label: "Region", options: ["R1", "R2", "R3", "R4"] },
    { id: "area", label: "Area", options: ["A1", "A2", "A3", "A4"] },
    { id: "cluster", label: "Cluster", options: ["CL1", "CL2", "CL3", "CL4"] },
    { id: "branch", label: "Branch", options: ["BR1", "BR2", "BR3", "BR4"] },
  ],
};

const validationSchema = Yup.object(
  Object.values(optionsData).flat().reduce((schema, field) => {
    schema[field.id] = Yup.string().required(`${field.label} is required`);
    return schema;
  }, {} as { [key: string]: Yup.StringSchema })
);

const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-paper": {
    maxHeight: 150, // Set maximum height for dropdown
    overflowY: "auto", // Enable scrollbar
  },
});

const AddNewRequestGeneratedForm: React.FC = () => {
  const requestFormik = useFormik({
    initialValues: Object.values(optionsData).flat().reduce((values, field) => {
      values[field.id] = "";
      return values;
    }, {} as { [key: string]: string }),
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  return (
    <form onSubmit={requestFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Resignation Request Form</h1>

      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">Employee Category Details</legend>
        <div className="grid grid-cols-2 gap-4">
          {optionsData.employeeCategoryDetails.map((field) => (
            <FormControl fullWidth margin="normal" key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label} *
              </label>
              <StyledAutocomplete
                id={field.id}
                options={field.options}
                //value={requestFormik.values[field.id]}
                disableClearable
                onChange={(_, value) => requestFormik.setFieldValue(field.id, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={requestFormik.touched[field.id] && Boolean(requestFormik.errors[field.id])}
                    helperText={requestFormik.touched[field.id] && requestFormik.errors[field.id]}
                  />
                )}
              />
            </FormControl>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">Location Category Details</legend>
        <div className="grid grid-cols-2 gap-4">
          {optionsData.locationCategoryDetails.map((field) => (
            <FormControl fullWidth margin="normal" key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label} *
              </label>
              <StyledAutocomplete
                id={field.id}
                options={field.options}
                //value={requestFormik.values[field.id]}
                disableClearable
                onChange={(_, value) => requestFormik.setFieldValue(field.id, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={requestFormik.touched[field.id] && Boolean(requestFormik.errors[field.id])}
                    helperText={requestFormik.touched[field.id] && requestFormik.errors[field.id]}
                  />
                )}
              />
            </FormControl>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end space-x-4">
        
        <DynamicButton
          type="button"
          variant="contained"
          className="bg-gray-500 text-white hover:bg-gray-700"
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type="submit"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Submit
        </DynamicButton>
      </div>
    </form>
  );
};

export default AddNewRequestGeneratedForm;
