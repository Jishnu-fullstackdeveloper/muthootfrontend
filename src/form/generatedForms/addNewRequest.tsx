"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormControl, MenuItem, FormControlLabel } from "@mui/material";
import DynamicTextField from '@/components/TextField/dynamicTextField';
import DynamicSelect from '@/components/Select/dynamicSelect';
import DynamicButton from '@/components/Button/dynamicButton';
import DynamicCheckbox from "@/components/Checkbox/dynamicCheckbox";
// import DynamicDatepicker from '@/components/Datepicker/dynamicDatepicker'

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
    initialValues: {"designation":"","department":"","empCategoryType":"","grade":"","band":"","company":"","businessUnit":"","territory":"","zone":"","region":"","area":"","cluster":"","branch":""},
    validationSchema,
    onSubmit: values => {
      console.log("Form Submitted:", values);
    }
  });

  return (
    <form onSubmit={requestFormik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Resignation Request Form</h1>
      
        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Employee Category Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
            Designation *
          </label>
          <DynamicSelect
            id="designation"
            name="designation"
            value={requestFormik.values.designation}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("designation", true)}
            error={requestFormik.touched.designation && Boolean(requestFormik.errors.designation)}
            helperText={requestFormik.touched.designation && requestFormik.errors.designation ? requestFormik.errors.designation : ''}
          >
            <MenuItem value="Software Engineer">Software Engineer</MenuItem>
            <MenuItem value="Project Manager">Project Manager</MenuItem>
            <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
            <MenuItem value="Data Scientist">Data Scientist</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department *
          </label>
          <DynamicSelect
            id="department"
            name="department"
            value={requestFormik.values.department}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("department", true)}
            error={requestFormik.touched.department && Boolean(requestFormik.errors.department)}
            helperText={requestFormik.touched.department && requestFormik.errors.department ? requestFormik.errors.department : ''}
          >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Operations">Operations</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="empCategoryType" className="block text-sm font-medium text-gray-700">
            Employee Category Type *
          </label>
          <DynamicSelect
            id="empCategoryType"
            name="empCategoryType"
            value={requestFormik.values.empCategoryType}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("empCategoryType", true)}
            error={requestFormik.touched.empCategoryType && Boolean(requestFormik.errors.empCategoryType)}
            helperText={requestFormik.touched.empCategoryType && requestFormik.errors.empCategoryType ? requestFormik.errors.empCategoryType : ''}
          >
            <MenuItem value="Software Engineer">Software Engineer</MenuItem>
            <MenuItem value="Project Manager">Project Manager</MenuItem>
            <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
            <MenuItem value="Data Scientist">Data Scientist</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade *
          </label>
          <DynamicSelect
            id="grade"
            name="grade"
            value={requestFormik.values.grade}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("grade", true)}
            error={requestFormik.touched.grade && Boolean(requestFormik.errors.grade)}
            helperText={requestFormik.touched.grade && requestFormik.errors.grade ? requestFormik.errors.grade : ''}
          >
            <MenuItem value="G1">G1</MenuItem>
            <MenuItem value="G2">G2</MenuItem>
            <MenuItem value="G3">G3</MenuItem>
            <MenuItem value="G4">G4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="band" className="block text-sm font-medium text-gray-700">
            Band *
          </label>
          <DynamicSelect
            id="band"
            name="band"
            value={requestFormik.values.band}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("band", true)}
            error={requestFormik.touched.band && Boolean(requestFormik.errors.band)}
            helperText={requestFormik.touched.band && requestFormik.errors.band ? requestFormik.errors.band : ''}
          >
            <MenuItem value="B1">B1</MenuItem>
            <MenuItem value="B2">B2</MenuItem>
            <MenuItem value="B3">B3</MenuItem>
            <MenuItem value="B4">B4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Location Category Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company *
          </label>
          <DynamicSelect
            id="company"
            name="company"
            value={requestFormik.values.company}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("company", true)}
            error={requestFormik.touched.company && Boolean(requestFormik.errors.company)}
            helperText={requestFormik.touched.company && requestFormik.errors.company ? requestFormik.errors.company : ''}
          >
            <MenuItem value="C1">C1</MenuItem>
            <MenuItem value="C2">C2</MenuItem>
            <MenuItem value="C3">C3</MenuItem>
            <MenuItem value="C4">C4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700">
            Business Unit *
          </label>
          <DynamicSelect
            id="businessUnit"
            name="businessUnit"
            value={requestFormik.values.businessUnit}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("businessUnit", true)}
            error={requestFormik.touched.businessUnit && Boolean(requestFormik.errors.businessUnit)}
            helperText={requestFormik.touched.businessUnit && requestFormik.errors.businessUnit ? requestFormik.errors.businessUnit : ''}
          >
            <MenuItem value="BU1">BU1</MenuItem>
            <MenuItem value="BU2">BU2</MenuItem>
            <MenuItem value="BU3">BU3</MenuItem>
            <MenuItem value="BU4">BU4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="territory" className="block text-sm font-medium text-gray-700">
            Territory *
          </label>
          <DynamicSelect
            id="territory"
            name="territory"
            value={requestFormik.values.territory}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("territory", true)}
            error={requestFormik.touched.territory && Boolean(requestFormik.errors.territory)}
            helperText={requestFormik.touched.territory && requestFormik.errors.territory ? requestFormik.errors.territory : ''}
          >
            <MenuItem value="T1">T1</MenuItem>
            <MenuItem value="T2">T2</MenuItem>
            <MenuItem value="T3">T3</MenuItem>
            <MenuItem value="T4">T4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
            Zone *
          </label>
          <DynamicSelect
            id="zone"
            name="zone"
            value={requestFormik.values.zone}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("zone", true)}
            error={requestFormik.touched.zone && Boolean(requestFormik.errors.zone)}
            helperText={requestFormik.touched.zone && requestFormik.errors.zone ? requestFormik.errors.zone : ''}
          >
            <MenuItem value="Z1">Z1</MenuItem>
            <MenuItem value="Z2">Z2</MenuItem>
            <MenuItem value="Z3">Z3</MenuItem>
            <MenuItem value="Z4">Z4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region *
          </label>
          <DynamicSelect
            id="region"
            name="region"
            value={requestFormik.values.region}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("region", true)}
            error={requestFormik.touched.region && Boolean(requestFormik.errors.region)}
            helperText={requestFormik.touched.region && requestFormik.errors.region ? requestFormik.errors.region : ''}
          >
            <MenuItem value="R1">R1</MenuItem>
            <MenuItem value="R2">R2</MenuItem>
            <MenuItem value="R3">R3</MenuItem>
            <MenuItem value="R4">R4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">
            Area *
          </label>
          <DynamicSelect
            id="area"
            name="area"
            value={requestFormik.values.area}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("area", true)}
            error={requestFormik.touched.area && Boolean(requestFormik.errors.area)}
            helperText={requestFormik.touched.area && requestFormik.errors.area ? requestFormik.errors.area : ''}
          >
            <MenuItem value="A1">A1</MenuItem>
            <MenuItem value="A2">A2</MenuItem>
            <MenuItem value="A3">A3</MenuItem>
            <MenuItem value="A4">A4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="cluster" className="block text-sm font-medium text-gray-700">
            Cluster *
          </label>
          <DynamicSelect
            id="cluster"
            name="cluster"
            value={requestFormik.values.cluster}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("cluster", true)}
            error={requestFormik.touched.cluster && Boolean(requestFormik.errors.cluster)}
            helperText={requestFormik.touched.cluster && requestFormik.errors.cluster ? requestFormik.errors.cluster : ''}
          >
            <MenuItem value="CL1">CL1</MenuItem>
            <MenuItem value="CL2">CL2</MenuItem>
            <MenuItem value="CL3">CL3</MenuItem>
            <MenuItem value="CL4">CL4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
            Branch *
          </label>
          <DynamicSelect
            id="branch"
            name="branch"
            value={requestFormik.values.branch}
            onChange={requestFormik.handleChange}
            onFocus={() => requestFormik.setFieldTouched("branch", true)}
            error={requestFormik.touched.branch && Boolean(requestFormik.errors.branch)}
            helperText={requestFormik.touched.branch && requestFormik.errors.branch ? requestFormik.errors.branch : ''}
          >
            <MenuItem value="R1">R1</MenuItem>
            <MenuItem value="R2">R2</MenuItem>
            <MenuItem value="R3">R3</MenuItem>
            <MenuItem value="R4">R4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    
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
