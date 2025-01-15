"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, TextField, Button, FormControl, MenuItem } from "@mui/material";
import DynamicButton from "@/components/Button/dynamicButton"; // Assuming you have a custom DynamicButton component

const validationSchema = Yup.object().shape({
  "designation": Yup.string().required("Designation is required"),
  "department": Yup.string().required("Department is required"),
  "empCategoryType": Yup.string().required("Employee Category Type is required"),
  "grade": Yup.string().required("Grade is required"),
  "band": Yup.string().required("Band is required"),
  "company": Yup.string().required("Company is required"),
  "businessUnit": Yup.string().required("Business Unit is required"),
  "territory": Yup.string().required("Territory is required"),
  "zone": Yup.string().required("Zone is required"),
  "region": Yup.string().required("Region is required"),
  "area": Yup.string().required("Area is required"),
  "cluster": Yup.string().required("Cluster is required"),
  "branch": Yup.string().required("Branch is required")
});

const GeneratedForm: React.FC = () => {
  const requestFormik: any = useFormik({
    initialValues: {
      "designation": "",
      "department": "",
      "empCategoryType": "",
      "grade": "",
      "band": "",
      "company": "",
      "businessUnit": "",
      "territory": "",
      "zone": "",
      "region": "",
      "area": "",
      "cluster": "",
      "branch": ""
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    }
  });

  return (
    <form onSubmit={requestFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Resignation Request Form</h1>
      
      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">Employee Category Details</legend>
        <div className="grid grid-cols-2 gap-4">
          
          <FormControl fullWidth margin="normal">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
              Designation *
            </label>
            <Autocomplete
              id="designation"
              
              options={["Software Engineer", "Project Manager", "UI/UX Designer", "Data Scientist"]}
              value={requestFormik.values.designation}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("designation", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.designation && Boolean(requestFormik.errors.designation)}
                  helperText={requestFormik.touched.designation && requestFormik.errors.designation ? requestFormik.errors.designation : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <Autocomplete
              id="department"
              
              options={["IT", "HR", "Finance", "Operations"]}
              value={requestFormik.values.department}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("department", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.department && Boolean(requestFormik.errors.department)}
                  helperText={requestFormik.touched.department && requestFormik.errors.department ? requestFormik.errors.department : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="empCategoryType" className="block text-sm font-medium text-gray-700">
              Employee Category Type *
            </label>
            <Autocomplete
              id="empCategoryType"
              
              options={["Software Engineer", "Project Manager", "UI/UX Designer", "Data Scientist"]}
              value={requestFormik.values.empCategoryType}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("empCategoryType", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.empCategoryType && Boolean(requestFormik.errors.empCategoryType)}
                  helperText={requestFormik.touched.empCategoryType && requestFormik.errors.empCategoryType ? requestFormik.errors.empCategoryType : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade *
            </label>
            <Autocomplete
              id="grade"
              
              options={["G1", "G2", "G3", "G4"]}
              value={requestFormik.values.grade}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("grade", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.grade && Boolean(requestFormik.errors.grade)}
                  helperText={requestFormik.touched.grade && requestFormik.errors.grade ? requestFormik.errors.grade : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="band" className="block text-sm font-medium text-gray-700">
              Band *
            </label>
            <Autocomplete
              id="band"
              
              options={["B1", "B2", "B3", "B4"]}
              value={requestFormik.values.band}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("band", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.band && Boolean(requestFormik.errors.band)}
                  helperText={requestFormik.touched.band && requestFormik.errors.band ? requestFormik.errors.band : ''}
                />
              )}
            />
          </FormControl>
        </div>
      </fieldset>

      <fieldset className="border border-gray-300 rounded p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-700">Location Category Details</legend>
        <div className="grid grid-cols-2 gap-4">
          
          <FormControl fullWidth margin="normal">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company *
            </label>
            <Autocomplete
              id="company"
              
              options={["C1", "C2", "C3", "C4"]}
              disableClearable
              value={requestFormik.values.company}
              onChange={(_, value) => requestFormik.setFieldValue("company", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.company && Boolean(requestFormik.errors.company)}
                  helperText={requestFormik.touched.company && requestFormik.errors.company ? requestFormik.errors.company : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Business Unit *
            </label>
            <Autocomplete
              id="businessUnit"
              
              options={["BU1", "BU2", "BU3", "BU4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Territory *
            </label>
            <Autocomplete
              id="territory"
              
              options={["BU1", "BU2", "BU3", "BU4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Zone *
            </label>
            <Autocomplete
              id="zone"
              
              options={["Z1", "Z2", "Z3", "Z4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Region *
            </label>
            <Autocomplete
              id="region"
              
              options={["R1", "R2", "R3", "R4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Area *
            </label>
            <Autocomplete
              id="businessUnit"
              
              options={["A1", "A2", "A3", "A4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Cluster *
            </label>
            <Autocomplete
              id="cluster"
              
              options={["CL1", "CL2", "CL3", "CL4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
              Branch *
            </label>
            <Autocomplete
              id="branch"
              
              options={["B1", "B2", "B3", "B4"]}
              value={requestFormik.values.businessUnit}
              disableClearable
              onChange={(_, value) => requestFormik.setFieldValue("businessUnit", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
                  helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
                />
              )}
            />
          </FormControl>

          {/* Additional fields for Territory, Zone, Region, etc., would go here */}
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

export default GeneratedForm;
