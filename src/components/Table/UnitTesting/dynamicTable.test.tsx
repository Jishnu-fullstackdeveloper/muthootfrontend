import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DynamicTable from '../dynamicTable'
import { ColumnDef } from '@tanstack/react-table'

// Sample data and columns for testing
const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ getValue }) => <span>{getValue<number>()}</span>
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>
  }
]

const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

describe('DynamicTable Component', () => {
    test('renders without crashing', () => {
      render(<DynamicTable columns={columns} data={data} />);
      expect(screen.getByText('ID')).toBeInTheDocument(); // Example assertion
    });

  test('renders table rows with correct data', () => {
    render(<DynamicTable columns={columns} data={data} />)

    // Check if table data is rendered
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  test('opens column selection drawer on filter button click', () => {
    render(<DynamicTable columns={columns} data={data} />)

    const filterButton = screen.getByRole('button', { name: /filter columns/i })
    fireEvent.click(filterButton)

    expect(screen.getByText('Select Columns')).toBeInTheDocument()
  })

  test('toggles dense mode when switching the switch', () => {
    render(<DynamicTable columns={columns} data={data} />)

    const denseSwitch = screen.getByLabelText('Dense padding')
    expect(denseSwitch).toBeInTheDocument()
    
    fireEvent.click(denseSwitch)
    expect(denseSwitch).toBeChecked()
  })
})
