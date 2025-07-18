// __tests__/AddNewVacancy.test.js
import React from 'react'

import { usePathname } from 'next/navigation'

import { render, screen } from '@testing-library/react'

import AddNewVacancy from '../[editid]/AddNewVacancy' // Adjust path as needed

// Mock the dynamic imports
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div>Mocked Component</div>

  DynamicComponent.displayName = 'MockedDynamicComponent'

  return DynamicComponent
})

// Mock the usePathname hook from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/jd-management') // Default return value
}))

describe('AddNewVacancy Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test case 1: Render with mode = 'add'
  it('renders GeneratedAddVacancyForm when mode is add', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/add/jd')

    render(<AddNewVacancy />)

    // Check if the mocked component is rendered
    expect(screen.getByText('Mocked Component')).toBeInTheDocument()

    // Verify props passed to GeneratedAddVacancyForm
    const { mode, id } = AddNewVacancy().props.children[0].props.children[1].props

    expect(mode).toBe('add')
    expect(id).toBe('jd')
  })

  // Test case 2: Render with mode = 'edit'
  it('renders GeneratedAddVacancyForm when mode is edit', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/edit/123')

    render(<AddNewVacancy />)

    expect(screen.getByText('Mocked Component')).toBeInTheDocument()

    const { mode, id } = AddNewVacancy().props.children[0].props.children[1].props

    expect(mode).toBe('edit')
    expect(id).toBe('123')
  })

  // Test case 3: Render with mode = 'view'
  it('renders JobVacancyView when mode is view', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/view/456')

    render(<AddNewVacancy />)

    expect(screen.getByText('Mocked Component')).toBeInTheDocument()

    const { mode, id } = AddNewVacancy().props.children[2].props

    expect(mode).toBe('view')
    expect(id).toBe('456')
  })

  // Test case 4: Handles invalid path gracefully
  it('renders nothing when mode is invalid', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management/invalid/789')

    const { container } = render(<AddNewVacancy />)

    // Check if nothing is rendered (empty fragment)
    expect(container.firstChild).toBeNull()
  })

  // Test case 5: Handles root path
  it('renders nothing when path has no segments', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/jd-management')

    const { container } = render(<AddNewVacancy />)

    expect(container.firstChild).toBeNull()
  })
})

// Optional: Add this to check code coverage setup
afterAll(() => {
  console.log('Run `jest --coverage` to see code coverage report')
})
