'use client'
import React from 'react'

import { Typography, IconButton } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import DynamicTable from '@/components/Table/dynamicTable'
import { tableData } from '@/shared/tableData'

type Person = {
  id: number
  name: string
  age: number
  email: string
}

function Page() {
  const handleView = (row: Person) => {
    alert(`View action clicked ${row}`)
  }

  const handleEdit = (row: Person) => {
    alert(`Edit action clicked ${row}`)
  }

  const handleDelete = (row: Person) => {
    alert(`Delete action clicked ${row}`)
  }

  const columns: ColumnDef<Person>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
    { accessorKey: 'email', header: 'Email' },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div>
          <IconButton aria-label='view' onClick={() => handleView(row.original)} sx={{ fontSize: 18 }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label='edit' onClick={() => handleEdit(row.original)} sx={{ fontSize: 18 }}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete' onClick={() => handleDelete(row.original)} sx={{ fontSize: 18 }}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <div>
      <Typography variant='h4'>Table</Typography>
      <DynamicTable columns={columns} data={tableData} />
    </div>
  )
}

export default Page
