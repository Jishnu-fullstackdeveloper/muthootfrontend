import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schemaPath = path.join(__dirname, '../src/form/json/add_approval_level.json')
const outputPath = path.join(__dirname, '../src/form/generatedForms/AddNewApprovalMatrix.tsx')

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))

interface FieldValidation {
  pattern?: string
}

interface FieldDependency {
  field: string
  value: string
}

interface DynamicField {
  name: string
  label: string
  type: string
  options?: string[]
  required?: boolean
  validation?: FieldValidation
  dependsOn?: FieldDependency
}

interface SectionField extends DynamicField {
  fields?: DynamicField[]
}

interface Section {
  section: string
  fields: SectionField[]
}

interface Action {
  type: string
  label: string
}

interface Schema {
  title: string
  fields: Section[]
  actions: Action[]
}

function validateSchema(schema: Schema): string[] {
  const errors: string[] = []
  const fieldNames = new Set<string>()

  schema.fields.forEach(section => {
    section.fields.forEach(field => {
      if (fieldNames.has(field.name)) {
        errors.push(`Duplicate field name detected: "${field.name}" in section "${section.section}"`)
      } else {
        fieldNames.add(field.name)
      }
    })
  })

  return errors
}

// Validate the schema before generating the form
const validationErrors = validateSchema(schema)

if (validationErrors.length > 0) {
  console.error('Schema validation failed with the following errors:')
  validationErrors.forEach(error => console.error(`- ${error}`))
  console.log('Form generation aborted due to validation errors.')
  process.exit(1) // Exit the script if validation fails
}

function generateFieldCode(field: SectionField): string {
  let fieldType: string = 'any'

  const dependencyCondition = field.dependsOn
    ? `formik.values["${field.dependsOn.field}"] === "${field.dependsOn.value}"`
    : 'true'

  const requiredAsterisk = field.required ? '*' : ''

  if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
    fieldType = 'string'
    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="${field.name}" className="block text-sm font-medium text-gray-700">
            ${field.label} ${requiredAsterisk}
          </label>
          <DynamicTextField
            id="${field.name}"
            name="${field.name}"
            type="${field.type}"
            value={formik.values.${field.name}}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("${field.name}", true)}
            error={formik.touched.${field.name} && Boolean(formik.errors.${field.name})}
            helperText={formik.touched.${field.name} && formik.errors.${field.name} ? formik.errors.${field.name} : undefined}
          />
        </FormControl>
      )}
    `
  }

  if (field.type === 'textarea') {
    fieldType = 'string'
    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="${field.name}" className="block text-sm font-medium text-gray-700">
            ${field.label} ${requiredAsterisk}
          </label>
          <DynamicTextField
            id="${field.name}"
            multiline
            rows={4}
            name="${field.name}"
            value={formik.values.${field.name}}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("${field.name}", true)}
            error={formik.touched.${field.name} && Boolean(formik.errors.${field.name})}
            helperText={formik.touched.${field.name} && formik.errors.${field.name} ? formik.errors.${field.name} : undefined}
          />
        </FormControl>
      )}
    `
  }

  if (field.type === 'number') {
    fieldType = 'number'
    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="${field.name}" className="block text-sm font-medium text-gray-700">
            ${field.label} ${requiredAsterisk}
          </label>
          <DynamicTextField
            id="${field.name}"
            name="${field.name}"
            type="${field.type}"
            value={formik.values.${field.name}}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("${field.name}", true)}
            error={formik.touched.${field.name} && Boolean(formik.errors.${field.name})}
            helperText={formik.touched.${field.name} && formik.errors.${field.name} ? formik.errors.${field.name} : undefined}
          />
        </FormControl>
      )}
    `
  }

  if (field.type === 'select') {
    fieldType = 'string'
    const optionsCode = [
      { value: '', label: '' },
      ...(field.options?.map(option => ({
        value: option,
        label: option
      })) || [])
    ]

    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="${field.name}" className="block text-sm font-medium text-gray-700">
            ${field.label} ${requiredAsterisk}
          </label>
          <DynamicSelect
            id="${field.name}"
            name="${field.name}"
            value={formik.values.${field.name}}
            onChange={formik.handleChange}
            onFocus={() => formik.setFieldTouched("${field.name}", true)}
            error={formik.touched.${field.name} && Boolean(formik.errors.${field.name})}
            helperText={formik.touched.${field.name} && formik.errors.${field.name} ? formik.errors.${field.name} : ''}
          >
            <MenuItem value=""></MenuItem>
            ${field.options?.map(option => `<MenuItem value="${option}">${option}</MenuItem>`).join('\n')}
          </DynamicSelect>
        </FormControl>
      )}
    `
  }

  if (field.type === 'checkbox') {
    fieldType = 'boolean'
    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            control={
              <DynamicCheckbox
                id="${field.name}"
                checked={formik.values.${field.name}}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched("${field.name}", true)}
              />
            }
            label="${field.label} ${requiredAsterisk}"
          />
        </FormControl>
      )}
    `
  }

  if (field.type === 'datepicker') {
    return `
      {${dependencyCondition} && (
        <FormControl fullWidth margin="normal">
          <label htmlFor="${field.name}" className="block text-sm font-medium text-gray-700">
            ${field.label} ${requiredAsterisk}
          </label>
          <DynamicDatepicker
          />
        </FormControl>
      )}
    `
  }

  if (field.type === 'dynamic-array' && field.fields) {
    const dynamicFieldsCode = field.fields.map((nestedField: any) => generateFieldCode(nestedField)).join('\n')

    return `
      {${dependencyCondition} && (
        <div>
          <h4>${field.label} ${requiredAsterisk}</h4>
          {formik.values.${field.name} && Array.isArray(formik.values.${field.name}) && formik.values.${field.name}.map((item: any, index: number) => (
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
                ${dynamicFieldsCode}
              </div>
              <DynamicButton
                children="Remove"
                type="button"
                variant="outlined"
                onClick={() => formik.setFieldValue("${field.name}", formik.values.${field.name}.filter((_: any, i: number) => i !== index))}
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
              onClick={() => formik.setFieldValue("${field.name}", [...(formik.values.${field.name} || []), {}])}
              label="Add More"
            />
          </div>
        </div>
      )}
    `
  }

  return ``
}

function generateFormComponent(schema: Schema): string {
  const sectionsCode = schema.fields
    .map(section => {
      const fieldsCode = section.fields.map(field => generateFieldCode(field)).join('\n')

      return `
        <fieldset className="border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-700">${section.section}</legend>
          <div className="grid grid-cols-2 gap-4">
            ${fieldsCode}
          </div>
        </fieldset>
      `
    })
    .join('\n')

  const actionsCode = schema.actions
    .map(
      action => `
        <DynamicButton
          type="${action.type === 'submit' ? 'submit' : 'button'}"
          variant="contained"
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          ${action.label}
        </DynamicButton>`
    )
    .join('\n')

  return `"use client";
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
  ${schema.fields
    .map(section =>
      section.fields
        .map(field => {
          const baseValidation = field.required
            ? `Yup.${field.type === 'email' ? 'string().email()' : 'string()'}.required("${field.label} is required")`
            : 'Yup.string()'

          const patternValidation = field.validation?.pattern
            ? `.matches(/${field.validation.pattern}/, "${field.label} is invalid")`
            : ''

          return `"${field.name}": ${baseValidation}${patternValidation}`
        })
        .join(',\n')
    )
    .join(',\n')}
});

const GeneratedForm: React.FC = () => {
  const formik: any = useFormik({
    initialValues: ${JSON.stringify(
      schema.fields.reduce(
        (acc, section) => {
          section.fields.forEach(field => {
            acc[field.name] = field.type === 'checkbox' ? false : ''
          })
          return acc
        },
        {} as Record<string, any>
      )
    )},
    validationSchema,
    onSubmit: values => {
      console.log("Form Submitted:", values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">${schema.title}</h1>
      ${sectionsCode}
      <div className="flex justify-end space-x-4">
        ${actionsCode}
      </div>
    </form>
  );
};

export default GeneratedForm;
`
}

const formComponentCode = generateFormComponent(schema)
fs.writeFileSync(outputPath, formComponentCode, 'utf-8')
console.log(`Generated form saved to ${outputPath}`)
