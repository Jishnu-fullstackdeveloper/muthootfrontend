import { usePathname } from 'next/navigation'

import { render, screen } from '@testing-library/react'

import AddNewApproval from '../AddNewApproval' // Adjust path

// Mock the AddNewApprovalMatrixGenerated component
jest.mock('@/form/generatedForms/AddNewApprovalMatrix', () => {
  return function MockApprovalMatrix() {
    return <div data-testid='mock-approval-matrix'>Mock Approval Matrix</div>
  }
})

// Mock Next.js navigation explicitly
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('AddNewApproval', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AddNewApprovalMatrixGenerated when mode is "add"', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/approval/add')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument() // Ensure component renders
    expect(screen.getByTestId('mock-approval-matrix')).toBeInTheDocument()
    expect(screen.getByText('Mock Approval Matrix')).toBeInTheDocument()
  })

  it('renders AddNewApprovalMatrixGenerated when mode is "edit"', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/approval/edit')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument()
    expect(screen.getByTestId('mock-approval-matrix')).toBeInTheDocument()
    expect(screen.getByText('Mock Approval Matrix')).toBeInTheDocument()
  })

  it('does not render AddNewApprovalMatrixGenerated when mode is "view"', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/approval/view')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument()
    expect(screen.queryByTestId('mock-approval-matrix')).not.toBeInTheDocument()
  })

  it('does not render AddNewApprovalMatrixGenerated when pathname has no mode segment', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/approval')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument()
    expect(screen.queryByTestId('mock-approval-matrix')).not.toBeInTheDocument()
  })

  it('handles root pathname correctly', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument()
    expect(screen.queryByTestId('mock-approval-matrix')).not.toBeInTheDocument()
  })

  it('renders correctly with longer pathname', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/approval/add/extra/segments')
    const { container } = render(<AddNewApproval />)

    expect(container).toBeInTheDocument()
    expect(screen.getByTestId('mock-approval-matrix')).toBeInTheDocument()
    expect(screen.getByText('Mock Approval Matrix')).toBeInTheDocument()
  })
})
