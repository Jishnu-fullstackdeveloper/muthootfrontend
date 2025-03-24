'use client'
import React, { useState, useMemo } from 'react'

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
  TableFooter,
  TablePagination,
  FormControlLabel,
  Switch,
  Box,
  Drawer,
  Grid,
  Checkbox,
  IconButton,
  Typography,
  Tooltip,
  Card
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

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
  const [columns, setColumns] = useState<ColumnDef<any>[]>(initialColumns.slice(0, 7)) // Start with first 5 columns
  const [sorting, setSorting] = useState<SortingState>([{ id: initialColumns[0]?.id, desc: false }])
  const [dense, setDense] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [openColumnDrawer, setOpenColumnDrawer] = useState(false)

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

  // Initialize selectedColumns with first 5 columns selected
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
    const allHeaders = extractHeaders(initialColumns)
    const selectedHeaders = Object.keys(allHeaders).slice(0, 7) // Take the first 5 headers

    return Object.keys(allHeaders).reduce(
      (acc, header) => {
        acc[header] = selectedHeaders.includes(header) // True for first 5, false for others

        return acc
      },
      {} as Record<string, boolean>
    )
  })

  // const paginatedData = useMemo(() => {
  //   const start = pagination?.pageIndex * pagination?.pageSize
  //   const end = start + pagination?.pageSize

  //   return data?.data?.slice(start, end) || []
  // }, [data, pagination])

  // Pass pageCount to parent whenever it changes
  const pageCount = useMemo(() => Math.ceil((totalCount || 0) / pagination?.pageSize), [totalCount, pagination])

  //console.log(totalCount, 'dddddddddddddddddddddddddd')

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
      const newColumns = Object.keys(updatedSelectedColumns)
        .filter(header => updatedSelectedColumns[header])
        .map(header => initialColumns.find(col => col.header === header))
        .filter(col => col !== undefined) as ColumnDef<any>[]

      setColumns(newColumns)

      return updatedSelectedColumns
    })
  }

  // Drag-and-Drop Handlers for the drawer (unchanged)
  const handleDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDrop = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'))

    if (draggedIndex === index) return

    const headersArray = Object.keys(selectedColumns)
    const updatedHeaders = [...headersArray]
    const [movedHeader] = updatedHeaders.splice(draggedIndex, 1)

    updatedHeaders.splice(index, 0, movedHeader)

    const updatedSelectedColumns = updatedHeaders.reduce(
      (acc, header) => {
        acc[header] = selectedColumns[header]

        return acc
      },
      {} as Record<string, boolean>
    )

    setSelectedColumns(updatedSelectedColumns)

    const newColumns = updatedHeaders
      .filter(header => updatedSelectedColumns[header])
      .map(header => initialColumns.find(col => col.header === header))
      .filter(col => col !== undefined) as ColumnDef<any>[]

    setColumns(newColumns)
  }

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault()
  }

  // Rest of the component (Table, Drawer, etc.) remains unchanged
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
        <Tooltip title='Filter Columns'>
          <IconButton onClick={() => setOpenColumnDrawer(true)}>
            <FilterListIcon className='size-4' />
            <Typography variant='subtitle2' sx={{ fontSize: 15, ml: 1 }}>
              Filter
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table size={dense ? 'small' : 'medium'}>
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Switch checked={dense} onChange={e => setDense(e.target.checked)} />}
                    label='Dense padding'
                  />
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={totalCount || 0}
                    rowsPerPage={pagination?.pageSize}
                    page={pagination?.pageIndex}
                    onPageChange={(_, page) => onPageChange(page)}
                    onRowsPerPageChange={e => onRowsPerPageChange(Number(e.target.value))}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Drawer
        anchor='right'
        open={openColumnDrawer}
        onClose={() => setOpenColumnDrawer(false)}
        BackdropProps={{
          invisible: true,
          sx: { backgroundColor: 'transparent' }
        }}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Select Columns
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(selectedColumns).map((header, index) => (
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
