import React from 'react'

import { useRouter } from 'next/navigation'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { addSerializer } from 'jest-snapshot'

// import pretty from 'pretty'

import { useAppSelector } from '@/lib/hooks' //useAppDispatch
import { getBranchList } from '@/redux/BranchManagement/BranchManagementSlice'
import BranchListing from '../BranchListing'
import type { BranchManagementState } from '@/types/branch'

// Custom serializer to ignore Material-UI dynamic IDs
addSerializer({
  test: value => value && typeof value === 'object' && 'nodeType' in value,
  print: (value, serialize) => {
    const cleanedHtml = serialize(value)
      .replace(/id=":[a-z0-9]+:"/g, 'id="[DYNAMIC_ID]"')
      .replace(/for=":[a-z0-9]+:"/g, 'for="[DYNAMIC_ID]"')
      .replace(/aria-controls=":[a-z0-9]+:"/g, 'aria-controls="[DYNAMIC_ID]"')
      .replace(/aria-labelledby=":[a-z0-9]+:"/g, 'aria-labelledby="[DYNAMIC_ID]"')

    return cleanedHtml
  }
})

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock Redux hooks
jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn()
}))

// Mock getBranchList
jest.mock('@/redux/BranchManagement/BranchManagementSlice', () => ({
  getBranchList: jest.fn().mockImplementation(() =>
    Promise.resolve({
      payload: {
        data: [
          {
            id: '1',
            name: 'Branch 1',
            branchCode: 'B001',
            branchStatus: 'ACTIVE',
            area: { regionId: 'R1', name: 'Area 1' },
            bucket: { name: 'Bucket 1' },
            district: { name: 'District 1' },
            state: { name: 'State 1' }
          },
          {
            id: '2',
            name: 'Branch 2',
            branchCode: 'B002',
            branchStatus: 'INACTIVE',
            area: { regionId: 'R2', name: 'Area 2' },
            bucket: { name: 'Bucket 2' },
            district: { name: 'District 2' },
            state: { name: 'State 2' }
          }
        ],
        total: 20
      }
    })
  )
}))

// Mock BranchListingTableView globally to avoid rendering issues
jest.mock('../BranchListingTableView', () => () => <div data-testid='table-view'>Branch Listing Table View</div>)

describe('BranchListing Component', () => {
  const mockDispatch = jest.fn()
  const mockRouter = { push: jest.fn() }
  const mockSelector = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // ;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
    ;(useAppSelector as jest.Mock).mockImplementation(() => mockSelector())

    // // Default state to prevent undefined errors
    // mockSelector.mockReturnValue({
    //   branchListData: {
    //     data: [
    //       {
    //         id: '1',
    //         name: 'Branch 1',
    //         branchCode: 'B001',
    //         branchStatus: 'ACTIVE',
    //         area: { regionId: 'R1', name: 'Area 1' },
    //         bucket: { name: 'Bucket 1' },
    //         district: { name: 'District 1' },
    //         state: { name: 'State 1' }
    //       },
    //       {
    //         id: '2',
    //         name: 'Branch 2',
    //         branchCode: 'B002',
    //         branchStatus: 'INACTIVE',
    //         area: { regionId: 'R2', name: 'Area 2' },
    //         bucket: { name: 'Bucket 2' },
    //         district: { name: 'District 2' },
    //         state: { name: 'State 2' }
    //       }
    //     ],
    //     total: 20
    //   },
    //   branchListLoading: false,
    //   branchListTotal: 20,
    //   branchListFailure: false,
    //   branchListFailureMessage: '',
    //   branchDetailsData: null,
    //   branchDetailsLoading: false,
    //   branchDetailsSuccess: false,
    //   branchDetailsFailure: false,
    //   branchDetailsFailureMessage: ''
    // } as BranchManagementState)
    jest.clearAllMocks()
  })

  test('renders loading state', () => {
    mockSelector.mockReturnValue({
      branchListData: null,
      branchListLoading: true,
      branchListTotal: 0,
      branchListFailure: false,
      branchListFailureMessage: '',
      branchDetailsData: null,
      branchDetailsLoading: false,
      branchDetailsSuccess: false,
      branchDetailsFailure: false,
      branchDetailsFailureMessage: ''
    } as BranchManagementState)
    render(<BranchListing />)
    expect(screen.getByText('Loading branches...')).toBeInTheDocument()
  })

  test('renders error state', () => {
    mockSelector.mockReturnValue({
      branchListData: null,
      branchListLoading: false,
      branchListTotal: 0,
      branchListFailure: true,
      branchListFailureMessage: 'Failed to load branches',
      branchDetailsData: null,
      branchDetailsLoading: false,
      branchDetailsSuccess: false,
      branchDetailsFailure: false,
      branchDetailsFailureMessage: ''
    } as BranchManagementState)
    render(<BranchListing />)
    expect(screen.getByText('Error: Failed to load branches')).toBeInTheDocument()
  })

  test('renders grid view with branch data', () => {
    render(<BranchListing />)
    expect(screen.getByText('Branch 1')).toBeInTheDocument()
    expect(screen.getByText('Branch 2')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('INACTIVE')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Grid View|Table View/ })).toHaveLength(2)
  })

  test('renders table view with branch data', async () => {
    render(<BranchListing />)

    // Verify grid view is initially present by checking for branch cards
    const branchCards = screen.getAllByText(/Branch [1-2]/)

    expect(branchCards).toHaveLength(2) // Two branches in grid view

    // Click to switch to table view
    fireEvent.click(screen.getByRole('button', { name: /Table View/ }))
    await waitFor(() => {
      // Check that the table view is rendered
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
      expect(screen.getByText('Branch Listing Table View')).toBeInTheDocument()

      // Verify grid view elements are no longer present
      // Instead of checking for a specific class, check if the branch cards are gone
      // by ensuring the table view has replaced the grid view content
      const branchCardsAfterSwitch = screen.queryAllByText(/Branch [1-2]/)

      expect(branchCardsAfterSwitch).toHaveLength(0) // Grid view items should be gone
    })
  })

  test('handles search input', async () => {
    render(<BranchListing />)
    const searchInput = screen.getByPlaceholderText('Search by Branch Name or Code...')

    fireEvent.change(searchInput, { target: { value: 'Branch 1' } })
    await waitFor(() => {
      expect(searchInput).toHaveValue('Branch 1')
      expect(mockDispatch).toHaveBeenCalledWith(getBranchList({ search: 'Branch 1', page: 1, limit: 10 }))
    })
  })

  test('handles pagination page change', async () => {
    render(<BranchListing />)
    const pagination = screen.getByRole('navigation')

    fireEvent.click(pagination.querySelector('button[aria-label="Go to next page"]')!)
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(getBranchList({ search: '', page: 2, limit: 10 }))
    })
  })

  // test('handles limit change', async () => {
  //   render(<BranchListing />)
  //   // Find the pagination limit dropdown using getByRole('combobox')
  //   const select = screen.getByRole('combobox', { name: 'rows per page' })
  //   // Open the dropdown to render the options
  //   fireEvent.mouseDown(select)
  //   // Find the option "25" using getByText since getByRole('option') might not work
  //   const option = screen.getByText('25')
  //   fireEvent.click(option)
  //   await waitFor(() => {
  //     expect(mockDispatch).toHaveBeenCalledWith(getBranchList({ search: '', page: 1, limit: 25 }))
  //   })
  // })

  test('handles branch click', () => {
    render(<BranchListing />)
    const branchBox = screen.getByText('Branch 1').closest('div')!

    fireEvent.click(branchBox)
    expect(mockRouter.push).toHaveBeenCalledWith('/branch-management/view/employees-details?id=1')
  })

  test('handles branch report dashboard click', () => {
    render(<BranchListing />)
    const button = screen.getByRole('button', { name: /Branch Report Dashboard/ })

    fireEvent.click(button)
    expect(mockRouter.push).toHaveBeenCalledWith('/branch-management/budget-report')
  })

  // test('matches snapshot', () => {
  //   const { asFragment } = render(<BranchListing />)
  //   expect(asFragment()).toMatchSnapshot()
  // })
})
