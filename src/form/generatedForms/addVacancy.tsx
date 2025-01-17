"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormControl, MenuItem, FormControlLabel } from "@mui/material";
import DynamicTextField from '@/components/TextField/dynamicTextField';
import DynamicSelect from '@/components/Select/dynamicSelect';
import DynamicButton from '@/components/Button/dynamicButton';
import DynamicCheckbox from "@/components/Checkbox/dynamicCheckbox";
import DynamicDatepicker from '@/components/Datepicker/dynamicDatepicker'

const validationSchema = Yup.object().shape({
  "vacancyTitle": Yup.string().required("Vacancy Title is required"),
"jobType": Yup.string().required("Job Type is required"),
"jobDescription": Yup.string().required("Job Description is required"),
"numberOfOpenings": Yup.string().required("Number of Openings is required"),
"branch": Yup.string().required("Branch is required"),
"city": Yup.string().required("City is required"),
"stateOrRegion": Yup.string().required("State/Region is required"),
"country": Yup.string().required("Country is required"),
"educationalQualification": Yup.string().required("Educational Qualification is required"),
"experienceInYears": Yup.string().required("Experience (in years) is required"),
"skillsNeeded": Yup.string().required("Skills Needed is required"),
"salaryRange": Yup.string(),
"additionalBenefits": Yup.string(),
"vacancyStartDate": Yup.string().required("Vacancy Start Date is required"),
"vacancyEndDate": Yup.string().required("Vacancy End Date is required"),
"contactPerson": Yup.string().required("Contact Person is required"),
"vacancyStatus": Yup.string().required("Vacancy Status is required")
});

const GeneratedForm: React.FC = () => {
  const formik: any = useFormik({
    initialValues: {"vacancyTitle":"","jobType":"","jobDescription":"","numberOfOpenings":"","branch":"","city":"","stateOrRegion":"","country":"","educationalQualification":"","experienceInYears":"","skillsNeeded":"","salaryRange":"","additionalBenefits":"","vacancyStartDate":"","vacancyEndDate":"","contactPerson":"","vacancyStatus":""},
    validationSchema,
    onSubmit: values => {
      console.log("Form Submitted:", values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Vacancy Management Form</h1>
      
        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Basic Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="vacancyTitle" className="block text-sm font-medium text-gray-700">
            Vacancy Title *
          </label>
          <DynamicTextField
            id="vacancyTitle"
            name="vacancyTitle"
            type="text"
            value={formik.values.vacancyTitle}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("vacancyTitle", true)}
            error={formik.touched.vacancyTitle && Boolean(formik.errors.vacancyTitle)}
            helperText={formik.touched.vacancyTitle && formik.errors.vacancyTitle ? formik.errors.vacancyTitle : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
            Job Type *
          </label>
          <DynamicSelect
            id="jobType"
            name="jobType"
            value={formik.values.jobType}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("jobType", true)}
            error={formik.touched.jobType && Boolean(formik.errors.jobType)}
            helperText={formik.touched.jobType && formik.errors.jobType ? formik.errors.jobType : ''}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
<MenuItem value="Part-time">Part-time</MenuItem>
<MenuItem value="Contract">Contract</MenuItem>
<MenuItem value="Internship">Internship</MenuItem>
          </DynamicSelect>
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description *
          </label>
          <DynamicTextField
            id="jobDescription"
            multiline
            rows={4}
            name="jobDescription"
            value={formik.values.jobDescription}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("jobDescription", true)}
            error={formik.touched.jobDescription && Boolean(formik.errors.jobDescription)}
            helperText={formik.touched.jobDescription && formik.errors.jobDescription ? formik.errors.jobDescription : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="numberOfOpenings" className="block text-sm font-medium text-gray-700">
            Number of Openings *
          </label>
          <DynamicTextField
            id="numberOfOpenings"
            name="numberOfOpenings"
            type="number"
            value={formik.values.numberOfOpenings}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("numberOfOpenings", true)}
            error={formik.touched.numberOfOpenings && Boolean(formik.errors.numberOfOpenings)}
            helperText={formik.touched.numberOfOpenings && formik.errors.numberOfOpenings ? formik.errors.numberOfOpenings : undefined}
          />
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Job Location</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
            Branch *
          </label>
          <DynamicTextField
            id="branch"
            name="branch"
            type="text"
            value={formik.values.branch}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("branch", true)}
            error={formik.touched.branch && Boolean(formik.errors.branch)}
            helperText={formik.touched.branch && formik.errors.branch ? formik.errors.branch : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <DynamicTextField
            id="city"
            name="city"
            type="text"
            value={formik.values.city}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("city", true)}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city ? formik.errors.city : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="stateOrRegion" className="block text-sm font-medium text-gray-700">
            State/Region *
          </label>
          <DynamicTextField
            id="stateOrRegion"
            name="stateOrRegion"
            type="text"
            value={formik.values.stateOrRegion}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("stateOrRegion", true)}
            error={formik.touched.stateOrRegion && Boolean(formik.errors.stateOrRegion)}
            helperText={formik.touched.stateOrRegion && formik.errors.stateOrRegion ? formik.errors.stateOrRegion : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <DynamicTextField
            id="country"
            name="country"
            type="text"
            value={formik.values.country}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("country", true)}
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country && formik.errors.country ? formik.errors.country : undefined}
          />
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Qualification Needed</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="educationalQualification" className="block text-sm font-medium text-gray-700">
            Educational Qualification *
          </label>
          <DynamicTextField
            id="educationalQualification"
            multiline
            rows={4}
            name="educationalQualification"
            value={formik.values.educationalQualification}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("educationalQualification", true)}
            error={formik.touched.educationalQualification && Boolean(formik.errors.educationalQualification)}
            helperText={formik.touched.educationalQualification && formik.errors.educationalQualification ? formik.errors.educationalQualification : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="experienceInYears" className="block text-sm font-medium text-gray-700">
            Experience (in years) *
          </label>
          <DynamicTextField
            id="experienceInYears"
            name="experienceInYears"
            type="number"
            value={formik.values.experienceInYears}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("experienceInYears", true)}
            error={formik.touched.experienceInYears && Boolean(formik.errors.experienceInYears)}
            helperText={formik.touched.experienceInYears && formik.errors.experienceInYears ? formik.errors.experienceInYears : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="skillsNeeded" className="block text-sm font-medium text-gray-700">
            Skills Needed *
          </label>
          <DynamicTextField
            id="skillsNeeded"
            multiline
            rows={4}
            name="skillsNeeded"
            value={formik.values.skillsNeeded}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("skillsNeeded", true)}
            error={formik.touched.skillsNeeded && Boolean(formik.errors.skillsNeeded)}
            helperText={formik.touched.skillsNeeded && formik.errors.skillsNeeded ? formik.errors.skillsNeeded : undefined}
          />
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Salary Details</legend>
          <div className="grid grid-cols-2 gap-4">
            
      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
            Salary Range 
          </label>
          <DynamicTextField
            id="salaryRange"
            name="salaryRange"
            type="text"
            value={formik.values.salaryRange}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("salaryRange", true)}
            error={formik.touched.salaryRange && Boolean(formik.errors.salaryRange)}
            helperText={formik.touched.salaryRange && formik.errors.salaryRange ? formik.errors.salaryRange : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="additionalBenefits" className="block text-sm font-medium text-gray-700">
            Additional Benefits 
          </label>
          <DynamicTextField
            id="additionalBenefits"
            multiline
            rows={4}
            name="additionalBenefits"
            value={formik.values.additionalBenefits}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("additionalBenefits", true)}
            error={formik.touched.additionalBenefits && Boolean(formik.errors.additionalBenefits)}
            helperText={formik.touched.additionalBenefits && formik.errors.additionalBenefits ? formik.errors.additionalBenefits : undefined}
          />
        </FormControl>
      )}
    
          </div>
        </fieldset>
      

        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">Application Details</legend>
          <div className="grid grid-cols-2 gap-4">
            


      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
            Contact Person *
          </label>
          <DynamicTextField
            id="contactPerson"
            name="contactPerson"
            type="text"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("contactPerson", true)}
            error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
            helperText={formik.touched.contactPerson && formik.errors.contactPerson ? formik.errors.contactPerson : undefined}
          />
        </FormControl>
      )}
    

      {true && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="vacancyStatus" className="block text-sm font-medium text-gray-700">
            Vacancy Status *
          </label>
          <DynamicSelect
            id="vacancyStatus"
            name="vacancyStatus"
            value={formik.values.vacancyStatus}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("vacancyStatus", true)}
            error={formik.touched.vacancyStatus && Boolean(formik.errors.vacancyStatus)}
            helperText={formik.touched.vacancyStatus && formik.errors.vacancyStatus ? formik.errors.vacancyStatus : ''}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Open">Open</MenuItem>
<MenuItem value="Closed">Closed</MenuItem>
<MenuItem value="On Hold">On Hold</MenuItem>
          </DynamicSelect>
        </FormControl>
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
          Submit
        </DynamicButton>
      </div>
    </form>
  );
};

export default GeneratedForm;
