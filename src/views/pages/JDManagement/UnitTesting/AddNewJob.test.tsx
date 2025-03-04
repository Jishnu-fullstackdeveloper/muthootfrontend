import React from 'react'

import { usePathname } from 'next/navigation'

import { render, screen } from '@testing-library/react'

import AddNewJob from '../[editid]/AddNewJob'

// Mock dynamic imports
let mod: React.ComponentType<any> | null = null // Define mod as a React component type

jest.mock('next/dynamic', () => (factory: () => Promise<any>) => {
  factory().then(module => (mod = module.default))

  return (props: any) => (mod ? React.createElement(mod, props) : null) // Use React.createElement
})

// Mock AddNewJdSample
jest.mock('@/form/generatedForms/addNewJdSample', () => ({
  __esModule: true,
  default: jest.fn(({ mode, id }) => (
    <div data-testid='add-new-jd-sample'>
      AddNewJdSample - Mode: {mode}, ID: {id}
    </div>
  ))
}))

// Mock ViewJd (assuming it's the same ViewJd from your previous code)
jest.mock('../viewJD', () => ({
  __esModule: true,
  default: jest.fn(({ mode, id }) => (
    <div data-testid='view-jd'>
      ViewJd - Mode: {mode}, ID: {id}
    </div>
  ))
}))

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('AddNewJob Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test 1: Renders AddNewJdSample for mode 'add'
  test("renders AddNewJdSample when mode is 'add'", () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/add/123')
    render(<AddNewJob />)
    expect(screen.getByTestId('add-new-jd-sample')).toBeInTheDocument()
    expect(screen.getByText('AddNewJdSample - Mode: add, ID: 123')).toBeInTheDocument()
    expect(screen.queryByTestId('view-jd')).not.toBeInTheDocument()
  })

  // Test 2: Renders AddNewJdSample for mode 'edit'
  test("renders AddNewJdSample when mode is 'edit'", () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/edit/456')
    render(<AddNewJob />)
    expect(screen.getByTestId('add-new-jd-sample')).toBeInTheDocument()
    expect(screen.getByText('AddNewJdSample - Mode: edit, ID: 456')).toBeInTheDocument()
    expect(screen.queryByTestId('view-jd')).not.toBeInTheDocument()
  })

  // Test 3: Renders ViewJd for mode 'view'
  test("renders ViewJd when mode is 'view'", () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/view/789')
    render(<AddNewJob />)
    expect(screen.getByTestId('view-jd')).toBeInTheDocument()
    expect(screen.getByText('ViewJd - Mode: view, ID: 789')).toBeInTheDocument()
    expect(screen.queryByTestId('add-new-jd-sample')).not.toBeInTheDocument()
  })

  // Test 4: Handles invalid mode gracefully
  test('renders nothing when mode is invalid', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/invalid/123')
    render(<AddNewJob />)
    expect(screen.queryByTestId('add-new-jd-sample')).not.toBeInTheDocument()
    expect(screen.queryByTestId('view-jd')).not.toBeInTheDocument()
  })

  // Test 5: Extracts mode and id correctly from pathname
  test('extracts mode and id from pathname', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/add/999')
    render(<AddNewJob />)
    expect(screen.getByText('AddNewJdSample - Mode: add, ID: 999')).toBeInTheDocument()
  })

  // Test 6: Handles root pathname gracefully
  test('renders nothing when pathname is root', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<AddNewJob />)
    expect(screen.queryByTestId('add-new-jd-sample')).not.toBeInTheDocument()
    expect(screen.queryByTestId('view-jd')).not.toBeInTheDocument()
  })
})
