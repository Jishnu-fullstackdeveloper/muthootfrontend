import { useRouter } from 'next/navigation'

import { render, screen, fireEvent } from '@testing-library/react'

import JobVacancyView from '../ViewVacancy'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('JobVacancyView Component', () => {
  let mockPush

  beforeEach(() => {
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Test 1: Check if the component renders job title and grade
  test('renders job title and grade correctly', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Grade: A')).toBeInTheDocument()
  })

  // Test 2: Check if job type, experience, branch, and city are rendered
  test('renders job metadata correctly', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    expect(screen.getByText('Full-Time')).toBeInTheDocument()
    expect(screen.getByText('Experience: 3')).toBeInTheDocument()
    expect(screen.getByText('Branch: Head Office')).toBeInTheDocument()
    expect(screen.getByText('City: Bangalore')).toBeInTheDocument()
  })

  // Test 3: Check if tabs are rendered and switch correctly
  test('renders tabs and switches content on tab change', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)

    // Check initial tab (Job Title)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()

    // Switch to Job Details tab
    fireEvent.click(screen.getByText('Job Details'))
    expect(screen.getByText('Job Description')).toBeInTheDocument()
    expect(screen.getByText('We are providing services for reviews')).toBeInTheDocument()
  })

  // Test 4: Check if candidate table section is rendered
  test('renders candidate table section', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    expect(screen.getByText('Applied Candidate Table')).toBeInTheDocument()
    expect(screen.getByText('Candidate Table Mock')).toBeInTheDocument()
  })

  // Test 5: Check if back button works
  test('back button triggers router push', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    fireEvent.click(screen.getByText('Back to Vacancies List'))
    expect(mockPush).toHaveBeenCalledWith('/vacancy-management')
  })

  // Test 6: Check if skills chips are rendered
  test('renders skills chips correctly', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    fireEvent.click(screen.getByText('Job Details')) // Switch to Job Details tab
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  // Test 7: Check if application details are rendered
  test('renders application details correctly', () => {
    render(<JobVacancyView mode={undefined} id={undefined} />)
    expect(screen.getByText('Start Date: 2024-01-01')).toBeInTheDocument()
    expect(screen.getByText('End Date: 2024-01-31')).toBeInTheDocument()
    expect(screen.getByText('Contact Person: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Status: Open')).toBeInTheDocument()
  })
})
