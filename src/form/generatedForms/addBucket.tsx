"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormControl, MenuItem, FormControlLabel } from "@mui/material";
import DynamicTextField from '@/components/TextField/dynamicTextField';
import DynamicSelect from '@/components/Select/dynamicSelect';
import DynamicButton from '@/components/Button/dynamicButton';
import DynamicCheckbox from "@/components/Checkbox/dynamicCheckbox";

const validationSchema = Yup.object().shape({
  "bucketName": Yup.string().required("Bucket Name is required"),
"bucketDescription": Yup.string().required("Bucket Description is required"),
"turnoverLimit": Yup.string().required("Turnover Limit is required"),
"bucketType": Yup.string().required("Bucket Type is required"),
"assignedTo": Yup.string().required("Assigned To is required"),
"designation": Yup.string().required("Designation is required"),
"budgetRange": Yup.string().required("Budget Range is required"),
"teamRoles": Yup.string()
});

const GeneratedForm: React.FC = () => {
  const Bucketformik: any = useFormik({
    initialValues: {"bucketName":"","bucketDescription":"","turnoverLimit":"","bucketType":"","assignedTo":"","designation":"","budgetRange":"","teamRoles":""},
    validationSchema,
    onSubmit: values => {
      console.log("Form Submitted:", values);
    }
  });

  return (
    <form onSubmit={Bucketformik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Bucket Management Form</h1>
      
        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Bucket Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">
            Bucket Name *
          </label>
          <DynamicTextField
            id="bucketName"
            name="bucketName"
            type="text"
            value={Bucketformik.values.bucketName}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("bucketName", true)}
            error={Bucketformik.touched.bucketName && Boolean(Bucketformik.errors.bucketName)}
            helperText={Bucketformik.touched.bucketName && Bucketformik.errors.bucketName ? Bucketformik.errors.bucketName : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="bucketDescription" className="block text-sm font-medium text-gray-700">
            Bucket Description *
          </label>
          <DynamicTextField
            id="bucketDescription"
            multiline
            rows={4}
            name="bucketDescription"
            value={Bucketformik.values.bucketDescription}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("bucketDescription", true)}
            error={Bucketformik.touched.bucketDescription && Boolean(Bucketformik.errors.bucketDescription)}
            helperText={Bucketformik.touched.bucketDescription && Bucketformik.errors.bucketDescription ? Bucketformik.errors.bucketDescription : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="turnoverLimit" className="block text-sm font-medium text-gray-700">
            Turnover Limit *
          </label>
          <DynamicTextField
            id="turnoverLimit"
            name="turnoverLimit"
            type="number"
            value={Bucketformik.values.turnoverLimit}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("turnoverLimit", true)}
            error={Bucketformik.touched.turnoverLimit && Boolean(Bucketformik.errors.turnoverLimit)}
            helperText={Bucketformik.touched.turnoverLimit && Bucketformik.errors.turnoverLimit ? Bucketformik.errors.turnoverLimit : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="bucketType" className="block text-sm font-medium text-gray-700">
            Bucket Type *
          </label>
          <DynamicSelect
            id="bucketType"
            name="bucketType"
            value={Bucketformik.values.bucketType}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("bucketType", true)}
            error={Bucketformik.touched.bucketType && Boolean(Bucketformik.errors.bucketType)}
            helperText={Bucketformik.touched.bucketType && Bucketformik.errors.bucketType ? Bucketformik.errors.bucketType : ''}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Type A">Type A</MenuItem>
<MenuItem value="Type B">Type B</MenuItem>
<MenuItem value="Type C">Type C</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
            Assigned To *
          </label>
          <DynamicSelect
            id="assignedTo"
            name="assignedTo"
            value={Bucketformik.values.assignedTo}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("assignedTo", true)}
            error={Bucketformik.touched.assignedTo && Boolean(Bucketformik.errors.assignedTo)}
            helperText={Bucketformik.touched.assignedTo && Bucketformik.errors.assignedTo ? Bucketformik.errors.assignedTo : ''}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Team 1">Team 1</MenuItem>
<MenuItem value="Team 2">Team 2</MenuItem>
<MenuItem value="Team 3">Team 3</MenuItem>
<MenuItem value="Team 4">Team 4</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
            Designation *
          </label>
          <DynamicSelect
            id="designation"
            name="designation"
            value={Bucketformik.values.designation}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("designation", true)}
            error={Bucketformik.touched.designation && Boolean(Bucketformik.errors.designation)}
            helperText={Bucketformik.touched.designation && Bucketformik.errors.designation ? Bucketformik.errors.designation : ''}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
<MenuItem value="Lead">Lead</MenuItem>
<MenuItem value="Member">Member</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700">
            Budget Range *
          </label>
          <DynamicTextField
            id="budgetRange"
            name="budgetRange"
            type="text"
            value={Bucketformik.values.budgetRange}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("budgetRange", true)}
            error={Bucketformik.touched.budgetRange && Boolean(Bucketformik.errors.budgetRange)}
            helperText={Bucketformik.touched.budgetRange && Bucketformik.errors.budgetRange ? Bucketformik.errors.budgetRange : undefined}
          />
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Team and Role Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <div>
          <h4>Team Roles </h4>
          {Bucketformik.values.teamRoles && Array.isArray(Bucketformik.values.teamRoles) &&Bucketformik.values.teamRoles.map((item: any, index: number) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '16px',
              gap: '16px'
            }}>
              <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: '16px'
              }}>
                
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
            Role Name *
          </label>
          <DynamicTextField
            id="roleName"
            name="roleName"
            type="text"
            value={Bucketformik.values.roleName}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("roleName", true)}
            error={Bucketformik.touched.roleName && Boolean(Bucketformik.errors.roleName)}
            helperText={Bucketformik.touched.roleName && Bucketformik.errors.roleName ? Bucketformik.errors.roleName : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="roleCount" className="block text-sm font-medium text-gray-700">
            Number of People in Role *
          </label>
          <DynamicTextField
            id="roleCount"
            name="roleCount"
            type="number"
            value={Bucketformik.values.roleCount}
            onChange={Bucketformik.handleChange}
            onFocus={() => Bucketformik.setFieldTouched("roleCount", true)}
            error={Bucketformik.touched.roleCount && Boolean(Bucketformik.errors.roleCount)}
            helperText={Bucketformik.touched.roleCount &&Bucketformik.errors.roleCount ? Bucketformik.errors.roleCount : undefined}
          />
        </FormControl>
      )}
    
              </div>
              <DynamicButton
                children="Remove"
                type="button"
                variant="outlined"
                onClick={() => Bucketformik.setFieldValue("teamRoles", Bucketformik.values.teamRoles.filter((_: any, i: number) => i !== index))}
                label="Remove"
              />
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '20px'
          }}>
            <DynamicButton
              children="Add More"
              type="button"
              variant="contained"
              onClick={() => Bucketformik.setFieldValue("teamRoles", [...(Bucketformik.values.teamRoles || []), {}])}
              label="Add More"
            />
          </div>
        </div>
      )}
    
          </div>
        </fieldset>
      
      <div className="flex justify-end space-x-4">
        
        <DynamicButton
          type="button"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Cancel
        </DynamicButton>

        <DynamicButton
          type="button"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Save Draft
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
