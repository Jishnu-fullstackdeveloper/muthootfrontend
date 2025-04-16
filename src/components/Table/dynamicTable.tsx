'use client'

import React, { useState, useMemo, useEffect } from 'react'

import type { ColumnDef, SortingState, RowSelectionState } from '@tanstack/react-table'
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControlLabel,
  Box,
  Drawer,
  Grid,
  Checkbox,
  IconButton,
  Typography,
  Tooltip,
  Card
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import CloseIcon from '@mui/icons-material/Close'
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined'

// New Client-Side TablePagination Component
const ClientSideTablePagination = ({ totalCount, pagination, onPageChange, onRowsPerPageChange }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Prevent rendering on server
  }

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      count={totalCount || 0}
      rowsPerPage={pagination?.pageSize ?? 10}
      page={pagination?.pageIndex ?? 0}
      onPageChange={(_, page) => onPageChange(page)}
      onRowsPerPageChange={e => onRowsPerPageChange(Number(e.target.value))}
    />
  )
}

const DynamicTable = ({
  columns: initialColumns,
  data,
  totalCount,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onPageCountChange, // Added
  tableName // New prop for table name
}: any) => {
  // Load initial column state from localStorage or use first 7 columns as default
  const [columns, setColumns] = useState<ColumnDef<any>[]>(() => {
    const savedColumns = localStorage.getItem(`${tableName}_columns`)

    if (savedColumns) {
      const headers = JSON.parse(savedColumns)

      return headers
        .map(header => initialColumns.find(col => col.header === header))
        .filter(Boolean) as ColumnDef<any>[]
    }

    return initialColumns.slice(0, 7) // Default to first 7 columns
  })

  const [sorting, setSorting] = useState<SortingState>([{ id: initialColumns[0]?.id, desc: false }])

  //const [dense, setDense] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [openColumnDrawer, setOpenColumnDrawer] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isMounted, setIsMounted] = useState(false)

  // Function to extract headers from nested columns
  const extractHeaders = (cols: ColumnDef<any>[]) => {
    const headers: Record<string, boolean> = {}

    const traverse = (columns: ColumnDef<any>[]) => {
      columns.forEach(col => {
        if (col.header) {
          headers[col.header as string] = true
        }

        if ('columns' in col && col.columns) {
          traverse(col.columns as ColumnDef<any>[])
        }
      })
    }

    traverse(cols)

    return headers
  }

  // Initialize selectedColumns with saved state or first 7 columns selected
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
    const allHeaders = extractHeaders(initialColumns)
    const savedColumns = localStorage.getItem(`${tableName}_columns`)

    if (savedColumns) {
      const savedHeaders = JSON.parse(savedColumns)

      return Object.keys(allHeaders).reduce(
        (acc, header) => {
          acc[header] = savedHeaders.includes(header)

          return acc
        },
        {} as Record<string, boolean>
      )
    }

    const selectedHeaders = Object.keys(allHeaders).slice(0, 7) // Take the first 7 headers

    return Object.keys(allHeaders).reduce(
      (acc, header) => {
        acc[header] = selectedHeaders.includes(header) // True for first 7, false for others

        return acc
      },
      {} as Record<string, boolean>
    )
  })

  // New state to maintain the order of headers for the drawer
  const [headerOrder, setHeaderOrder] = useState<string[]>(() => {
    const savedColumns = localStorage.getItem(`${tableName}_columns`)

    if (savedColumns) {
      return JSON.parse(savedColumns)
    }

    return Object.keys(extractHeaders(initialColumns)) // Default to all headers in initial order
  })

  // Save columns and header order to localStorage whenever they change
  useEffect(() => {
    const headersToSave = columns.map(col => col.header)

    localStorage.setItem(`${tableName}_columns`, JSON.stringify(headersToSave))
    setHeaderOrder(prev => {
      // Merge saved headers with all possible headers, preserving order
      const allHeaders = Object.keys(extractHeaders(initialColumns))
      const unseenHeaders = allHeaders.filter(header => !headersToSave.includes(header))

      return [...headersToSave, ...unseenHeaders]
    })
  }, [columns, tableName, initialColumns])

  const pageCount = useMemo(() => Math.ceil((totalCount || 0) / pagination?.pageSize), [totalCount, pagination])

  useMemo(() => {
    if (onPageCountChange) {
      onPageCountChange(pageCount)
    }
  }, [pageCount, onPageCountChange])

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination?.pageSize),
    state: {
      pagination,
      sorting,
      rowSelection
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection
  })

  const handleColumnSelect = (columnKey: string) => {
    setSelectedColumns(prev => {
      const updatedSelectedColumns = {
        ...prev,
        [columnKey]: !prev[columnKey]
      }

      // Update the columns state based on the updated selectedColumns
      const newColumns = headerOrder // Use headerOrder to maintain order
        .filter(header => updatedSelectedColumns[header])
        .map(header => initialColumns.find(col => col.header === header))
        .filter(col => col !== undefined) as ColumnDef<any>[]

      setColumns(newColumns)

      return updatedSelectedColumns
    })
  }

  // Updated handler for "Select All" checkbox
  const handleSelectAll = (checked: boolean) => {
    const allHeaders = extractHeaders(initialColumns)
    const selectedHeaders = Object.keys(allHeaders).slice(0, 7) // First 7 headers

    const updatedSelectedColumns = Object.keys(allHeaders).reduce(
      (acc, header) => {
        acc[header] = checked ? true : selectedHeaders.includes(header) // All true if checked, first 7 true if unchecked

        return acc
      },
      {} as Record<string, boolean>
    )

    setSelectedColumns(updatedSelectedColumns)

    // Update columns based on "Select All" state
    const newColumns = checked
      ? initialColumns // Select all columns
      : initialColumns.slice(0, 7) // Reset to first 7 if unchecked

    setColumns(newColumns)

    // Update headerOrder to reflect all headers or first 7 in initial order
    setHeaderOrder(checked ? Object.keys(allHeaders) : Object.keys(allHeaders))
  }

  // Drag-and-Drop Handlers for the drawer
  const handleDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDrop = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'))

    if (draggedIndex === index) return

    const updatedHeaders = [...headerOrder] // Use headerOrder instead of selectedColumns keys
    const [movedHeader] = updatedHeaders.splice(draggedIndex, 1)

    updatedHeaders.splice(index, 0, movedHeader)

    const updatedSelectedColumns = updatedHeaders.reduce(
      (acc, header) => {
        acc[header] = selectedColumns[header] || false // Preserve selection state, default to false if undefined

        return acc
      },
      {} as Record<string, boolean>
    )

    setSelectedColumns(updatedSelectedColumns)
    setHeaderOrder(updatedHeaders) // Update the header order

    const newColumns = updatedHeaders
      .filter(header => updatedSelectedColumns[header])
      .map(header => initialColumns.find(col => col.header === header))
      .filter(col => col !== undefined) as ColumnDef<any>[]

    setColumns(newColumns)
  }

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault()
  }

  // Check if all columns are selected for "Select All" checkbox state
  const allColumnsSelected = Object.values(selectedColumns).every(selected => selected)

  useEffect(() => {
    setPageIndex(pagination?.pageIndex ?? 0)
    setPageSize(pagination?.pageSize ?? 10)
  }, [pagination])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Card>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          right: 0,
          zIndex: 1, // Ensure it stays above the table
          display: 'flex',
          justifyContent: tableName ? 'space-between' : 'flex-end', // Conditional justification
          alignItems: 'center', // Added to vertically center the content
          p: 2,
          backgroundColor: 'inherit' // Match the background of the table container
        }}
      >
        {/* Table Name on the left, only if provided */}
        {tableName && (
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {tableName}
          </Typography>
        )}

        {/* Filter Icon on the right */}
        <Tooltip title='More Columns'>
          <IconButton
            onClick={() => setOpenColumnDrawer(true)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light gray hover background (customizable)
                borderRadius: '4px' // Rectangular shape
              }
            }}
          >
            {/* <Typography variant='subtitle2' sx={{ fontSize: 12, mr: 1 }}>
              More columns
            </Typography> */}
            <DoubleArrowOutlinedIcon className='size-4' />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          {/* size={dense ? 'small' : 'medium'} */}
          <TableHead>
            <TableRow>
              {table.getHeaderGroups()[0].headers.map(header => {
                const isSorted = sorting.find(s => s.id === header.column.id)

                return (
                  <TableCell
                    key={header.id}
                    sx={{ whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: 'bold', background: '#f5f5f5' }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSorted ? (
                        isSorted.desc ? (
                          <ArrowDropDownIcon sx={{ color: '#1976d2' }} />
                        ) : (
                          <ArrowDropUpIcon sx={{ color: '#1976d2' }} />
                        )
                      ) : (
                        <i className='tabler-arrows-up-down size-3' />
                      )}
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} sx={{ whiteSpace: 'nowrap' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          backgroundColor: 'white',
          borderTop: '1px solid rgba(224, 224, 224, 1)',
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
          mt: 1,
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: 1
        }}
      >
        <ClientSideTablePagination
          totalCount={totalCount}
          pagination={pagination}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Box>
      <Drawer
        anchor='right'
        open={openColumnDrawer}
        onClose={() => setOpenColumnDrawer(false)}
        BackdropProps={{
          invisible: true,
          sx: { backgroundColor: 'transparent' }
        }}
      >
        <Box sx={{ width: 250, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6'>Select Columns</Typography>
            <Tooltip title='Close'>
              <IconButton onClick={() => setOpenColumnDrawer(false)} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {/* Select All Checkbox */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={allColumnsSelected} onChange={e => handleSelectAll(e.target.checked)} />}
              label='Select All'
            />
          </Box>
          <Grid container spacing={2}>
            {headerOrder.map((header, index) => (
              <Grid
                item
                xs={12}
                key={header}
                draggable
                onDragStart={e => handleDragStart(e, index)}
                onDragOver={allowDrop}
                onDrop={e => handleDrop(e, index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DragIndicatorIcon sx={{ cursor: 'grab' }} />
                  <FormControlLabel
                    control={<Checkbox checked={selectedColumns[header]} onChange={() => handleColumnSelect(header)} />}
                    label={header}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>
    </Card>
  )
}

export default DynamicTable
