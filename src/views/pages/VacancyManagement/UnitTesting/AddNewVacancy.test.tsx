import { usePathname } from 'next/navigation'

import { render, screen } from '@testing-library/react'

import AddNewVacancy from '../[editid]/AddNewVacancy' // Adjust path if needed

// Mock dynamic imports
jest.mock('next/dynamic', () => factory => {
  const Component = factory()

  return Component // Immediately resolve the dynamic import
})

// Mock the imported components
jest.mock('@/form/generatedForms/addVacancy', () => () => (
  <div data-testid='generated-add-vacancy-form'>Add/Edit Vacancy Form</div>
))
jest.mock('../ViewVacancy', () => () => <div data-testid='job-vacancy-view'>Job Vacancy View</div>)

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('AddNewVacancy', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders GeneratedAddVacancyForm when mode is "add"', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/add/new-vacancy')

    render(<AddNewVacancy />)

    expect(screen.getByTestId('generated-add-vacancy-form')).toBeInTheDocument()
    expect(screen.queryByTestId('job-vacancy-view')).not.toBeInTheDocument()
    expect(screen.getByText('Add/Edit Vacancy Form')).toBeInTheDocument()
  })

  it('renders GeneratedAddVacancyForm when mode is "edit" with an id', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/edit/123')

    render(<AddNewVacancy />)

    expect(screen.getByTestId('generated-add-vacancy-form')).toBeInTheDocument()
    expect(screen.queryByTestId('job-vacancy-view')).not.toBeInTheDocument()
    expect(screen.getByText('Add/Edit Vacancy Form')).toBeInTheDocument()
  })

  it('renders JobVacancyView when mode is "view" with an id', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/view/123')

    render(<AddNewVacancy />)

    expect(screen.getByTestId('job-vacancy-view')).toBeInTheDocument()
    expect(screen.queryByTestId('generated-add-vacancy-form')).not.toBeInTheDocument()
    expect(screen.getByText('Job Vacancy View')).toBeInTheDocument()
  })

  it('does not render any component when mode is invalid', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/invalid/123')

    render(<AddNewVacancy />)

    expect(screen.queryByTestId('generated-add-vacancy-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-vacancy-view')).not.toBeInTheDocument()
  })

  it('passes correct props to GeneratedAddVacancyForm for "add" mode', () => {
    const MockGeneratedAddVacancyForm = jest.fn(() => <div data-testid='generated-add-vacancy-form' />)

    jest.mock('@/form/generatedForms/addVacancy', () => MockGeneratedAddVacancyForm)
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/add/new-vacancy')

    render(<AddNewVacancy />)

    expect(MockGeneratedAddVacancyForm).toHaveBeenCalledWith({ mode: 'add', id: 'new-vacancy' }, expect.anything())
  })

  it('passes correct props to GeneratedAddVacancyForm for "edit" mode', () => {
    const MockGeneratedAddVacancyForm = jest.fn(() => <div data-testid='generated-add-vacancy-form' />)

    jest.mock('@/form/generatedForms/addVacancy', () => MockGeneratedAddVacancyForm)
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/edit/123')

    render(<AddNewVacancy />)

    expect(MockGeneratedAddVacancyForm).toHaveBeenCalledWith({ mode: 'edit', id: '123' }, expect.anything())
  })

  it('passes correct props to JobVacancyView for "view" mode', () => {
    const MockJobVacancyView = jest.fn(() => <div data-testid='job-vacancy-view' />)

    jest.mock('../ViewVacancy', () => MockJobVacancyView)
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management/view/123')

    render(<AddNewVacancy />)

    expect(MockJobVacancyView).toHaveBeenCalledWith({ mode: 'view', id: '123' }, expect.anything())
  })

  it('handles root path gracefully', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')

    render(<AddNewVacancy />)

    expect(screen.queryByTestId('generated-add-vacancy-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-vacancy-view')).not.toBeInTheDocument()
  })

  it('handles empty segments gracefully', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/vacancy-management')

    render(<AddNewVacancy />)

    expect(screen.queryByTestId('generated-add-vacancy-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-vacancy-view')).not.toBeInTheDocument()
  })
})
