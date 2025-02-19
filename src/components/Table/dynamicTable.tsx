'use client'
import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  //PaginationState,
  getSortedRowModel,
  SortingState,
  RowSelectionState
} from '@tanstack/react-table'
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
  Tooltip
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

interface DynamicTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  pagination: { pageIndex: number; pageSize: number }
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
}

const DynamicTable = ({
  columns: initialColumns,
  data,
  pagination,
  //onPaginationChange,
  onPageChange,
  onRowsPerPageChange
}: any) => {
  const [columns, setColumns] = useState<ColumnDef<any>[]>(initialColumns)
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

  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => extractHeaders(initialColumns))

  const paginatedData = useMemo(() => {
    const start = pagination?.pageIndex * pagination?.pageSize
    const end = start + pagination?.pageSize
    return data?.slice(start, end) // Slice the data for the current page
  }, [data, pagination])

  const table = useReactTable({
    columns,
    data: paginatedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data?.length / pagination?.pageSize),
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
        .filter(header => updatedSelectedColumns[header]) // Filter out unselected columns
        .map(header => initialColumns.find(col => col.header === header))
        .filter(col => col !== undefined) as ColumnDef<any>[]

      setColumns(newColumns)

      return updatedSelectedColumns
    })
  }

  // Drag-and-Drop Handlers for the drawer
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

    // Update the columns state based on the new order of headers and filter out unselected columns
    const newColumns = updatedHeaders
      .filter(header => updatedSelectedColumns[header]) // Filter out unselected columns
      .map(header => initialColumns.find(col => col.header === header))
      .filter(col => col !== undefined) as ColumnDef<any>[]

    setColumns(newColumns)
  }

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Tooltip title='Filter Columns'>
            <IconButton onClick={() => setOpenColumnDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
                        <UnfoldMoreIcon sx={{ color: 'gray' }} />
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Switch checked={dense} onChange={e => setDense(e.target.checked)} />}
                    label='Dense padding'
                  />
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={data?.length}
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
          invisible: true, // Show backdrop for click handling
          sx: { backgroundColor: 'transparent' } // Make backdrop transparent
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
    </>
  )
}

export default DynamicTable
