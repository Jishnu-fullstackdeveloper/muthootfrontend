'use client'
import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
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
  Checkbox,
  Box
} from '@mui/material'

interface DynamicTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}
export interface Person {
  id: number
  name: string
  age: number
  email: string
}

const DynamicTable = <TData extends { id: number }>({ columns, data }: DynamicTableProps<TData>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [dense, setDense] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const paginatedData = useMemo(
    () => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [data, pagination]
  )

  const table = useReactTable({
    columns,
    data: paginatedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: {
      pagination,
      sorting,
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting
  })

  return (
    <TableContainer component={Paper}>
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              <TableCell padding='checkbox'>
                <Checkbox
                  indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  checked={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              </TableCell>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  sortDirection={header.column.getIsSorted() || false}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                        style: { cursor: 'pointer' }
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : null}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} hover>
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={row.getIsSelected()}
                  indeterminate={row.getIsSomeSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              </TableCell>
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <FormControlLabel
                  control={<Switch checked={dense} onChange={e => setDense(e.target.checked)} />}
                  label='Dense padding'
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={data.length}
                  rowsPerPage={pagination.pageSize}
                  page={pagination.pageIndex}
                  onPageChange={(_, page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                  onRowsPerPageChange={e => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default DynamicTable
