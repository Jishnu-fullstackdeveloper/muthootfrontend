'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { Box, Button, Typography, Autocomplete, TextField, ListItemText, Drawer, Divider } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import EditIcon from '@mui/icons-material/Edit'

import DynamicTable from '@/components/Table/dynamicTable'
import type { InterviewCustomization } from '@/utils/sampleData/InterviewManagement/InterviewCustomData'
import {
  sampleCustomizationData,
  bandOptions,
  departmentOptions,
  designationOptions,
  levelOptions
} from '@/utils/sampleData/InterviewManagement/InterviewCustomData'

interface InterviewCustomizationTableProps {
  customizations?: InterviewCustomization[] // Optional prop, defaults to sample data
}

// Edit Form Component
interface EditInterviewFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (updatedData: Partial<InterviewCustomization>) => void
  initialData: InterviewCustomization
}

const EditInterviewForm: React.FC<EditInterviewFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    band: initialData.band || [],
    department: initialData.department || [],
    designation: initialData.designation || [],
    levels: initialData.levels || []
  })

  // Sync formData with initialData when the dialog opens
  useEffect(() => {
    setFormData({
      band: initialData.band || [],
      department: initialData.department || [],
      designation: initialData.designation || [],
      levels: initialData.levels || []
    })
  }, [initialData])

  const handleChange = (field: keyof typeof formData, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  return (
    <Drawer anchor='right' open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 350 } } }}>
      <Box sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Edit Interview Customization
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Band Field */}
          <Autocomplete
            multiple
            options={['Select All', ...bandOptions]}
            value={formData.band}
            onChange={(event, newValue) => {
              const filteredValues = newValue.filter(val => val !== 'Select All')

              if (newValue.includes('Select All')) {
                handleChange('band', bandOptions.every(opt => formData.band.includes(opt)) ? [] : [...bandOptions])
              } else {
                handleChange('band', filteredValues)
              }
            }}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField
                {...params}
                variant='outlined'
                size='small'
                placeholder={formData.band.length === 0 ? 'Select bands' : formData.band.join(', ')}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {option === 'Select All' ? option : `${selected ? '✔ ' : ''}${option}`}
                    </Typography>
                  }
                />
              </li>
            )}
            renderTags={() => null}
            sx={{ width: '100%' }}
          />

          {/* Department Field */}
          <Autocomplete
            multiple
            options={['Select All', ...departmentOptions]}
            value={formData.department}
            onChange={(event, newValue) => {
              const filteredValues = newValue.filter(val => val !== 'Select All')

              if (newValue.includes('Select All')) {
                handleChange(
                  'department',
                  departmentOptions.every(opt => formData.department.includes(opt)) ? [] : [...departmentOptions]
                )
              } else {
                handleChange('department', filteredValues)
              }
            }}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField
                {...params}
                variant='outlined'
                size='small'
                placeholder={formData.department.length === 0 ? 'Select departments' : formData.department.join(', ')}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {option === 'Select All' ? option : `${selected ? '✔ ' : ''}${option}`}
                    </Typography>
                  }
                />
              </li>
            )}
            renderTags={() => null}
            sx={{ width: '100%' }}
          />

          {/* Designation Field */}
          <Autocomplete
            multiple
            options={['Select All', ...designationOptions]}
            value={formData.designation}
            onChange={(event, newValue) => {
              const filteredValues = newValue.filter(val => val !== 'Select All')

              if (newValue.includes('Select All')) {
                handleChange(
                  'designation',
                  designationOptions.every(opt => formData.designation.includes(opt)) ? [] : [...designationOptions]
                )
              } else {
                handleChange('designation', filteredValues)
              }
            }}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField
                {...params}
                variant='outlined'
                size='small'
                placeholder={
                  formData.designation.length === 0 ? 'Select designations' : formData.designation.join(', ')
                }
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {option === 'Select All' ? option : `${selected ? '✔ ' : ''}${option}`}
                    </Typography>
                  }
                />
              </li>
            )}
            renderTags={() => null}
            sx={{ width: '100%' }}
          />

          {/* Levels Field */}
          <Autocomplete
            multiple
            options={['Select All', ...levelOptions]}
            value={formData.levels}
            onChange={(event, newValue) => {
              const filteredValues = newValue.filter(val => val !== 'Select All')

              if (newValue.includes('Select All')) {
                handleChange(
                  'levels',
                  levelOptions.every(opt => formData.levels.includes(opt)) ? [] : [...levelOptions]
                )
              } else {
                handleChange('levels', filteredValues)
              }
            }}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField
                {...params}
                variant='outlined'
                size='small'
                placeholder={formData.levels.length === 0 ? 'Select levels' : formData.levels.join(', ')}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {option === 'Select All' ? option : `${selected ? '✔ ' : ''}${option}`}
                    </Typography>
                  }
                />
              </li>
            )}
            renderTags={() => null}
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button onClick={onClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary' variant='contained'>
            Submit
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

const InterviewCustomizationTable = ({
  customizations = sampleCustomizationData
}: InterviewCustomizationTableProps) => {
  const columnHelper = createColumnHelper<InterviewCustomization>()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // State to manage the data (for editing purposes)
  const [tableDataState, setTableDataState] = useState<InterviewCustomization[]>(customizations)

  // State to manage the edit form
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<InterviewCustomization | null>(null)

  // Prepare table data
  const tableData = useMemo(() => {
    return {
      data: tableDataState,
      totalCount: tableDataState.length
    }
  }, [tableDataState])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  // Function to handle updates to the table data
  const handleUpdate = (id: string, field: keyof InterviewCustomization, value: string[] | 'Yes' | 'No') => {
    setTableDataState(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)))
    console.log(`Updated ${field} for ID ${id} to ${value}`)
  }

  // Function to handle edit form submission
  const handleEditSubmit = (updatedData: Partial<InterviewCustomization>) => {
    if (selectedRow) {
      setTableDataState(prev => prev.map(item => (item.id === selectedRow.id ? { ...item, ...updatedData } : item)))
      console.log(`Updated row with ID ${selectedRow.id} with new data:`, updatedData)
    }
  }

  const columns = useMemo<ColumnDef<InterviewCustomization, any>[]>(
    () => [
      columnHelper.accessor('band', {
        header: 'BAND',
        cell: ({ row }) => (
          <Box>
            {row.original.band.length > 0 ? (
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {row.original.band.map((item, index) => (
                  <li key={index}>
                    <Typography variant='body2'>{item}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>-</Typography>
            )}
          </Box>
        )
      }),
      columnHelper.accessor('businessUnit', {
        header: 'BUSINESS UNIT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.businessUnit}</Typography>
      }),
      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => (
          <Box>
            {row.original.department.length > 0 ? (
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {row.original.department.map((item, index) => (
                  <li key={index}>
                    <Typography variant='body2'>{item}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>-</Typography>
            )}
          </Box>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Box>
            {row.original.designation.length > 0 ? (
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {row.original.designation.map((item, index) => (
                  <li key={index}>
                    <Typography variant='body2'>{item}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>-</Typography>
            )}
          </Box>
        )
      }),
      columnHelper.accessor('levels', {
        header: 'LEVELS',
        cell: ({ row }) => (
          <Box>
            {row.original.levels.length > 0 ? (
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {row.original.levels.map((item, index) => (
                  <li key={index}>
                    <Typography variant='body2'>{item}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>-</Typography>
            )}
          </Box>
        )
      }),
      columnHelper.accessor('aptitudeAvailable', {
        header: 'APTITUDE AVAILABLE',
        cell: ({ row }) => (
          <Button
            variant='text'
            color={row.original.aptitudeAvailable === 'Yes' ? 'success' : 'error'}
            onClick={() => {
              const newValue = row.original.aptitudeAvailable === 'Yes' ? 'No' : 'Yes'

              handleUpdate(row.original.id, 'aptitudeAvailable', newValue)
            }}
          >
            {row.original.aptitudeAvailable}
          </Button>
        )
      }),
      columnHelper.accessor('Action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            <Button
              variant='text'
              color='secondary'
              size='small'
              startIcon={<EditIcon />}
              onClick={e => {
                e.stopPropagation()
                setSelectedRow(row.original)
                setEditDialogOpen(true)
              }}
              sx={{ fontSize: '12px' }}
            ></Button>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {tableData.data.length === 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No customization data found
          </Typography>
        </Box>
      )}
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Interview Customization Table'
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
      {selectedRow && (
        <EditInterviewForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={selectedRow}
        />
      )}
    </Box>
  )
}

export default InterviewCustomizationTable
