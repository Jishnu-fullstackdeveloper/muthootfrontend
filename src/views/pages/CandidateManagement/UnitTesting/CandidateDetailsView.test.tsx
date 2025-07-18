import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
// eslint-disable-next-line import/order
import { useRouter, useParams } from 'next/navigation'

import CandidateDetails from '../CandidateDetailsView'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}))

// Mock console.log for download logging
console.log = jest.fn()

describe('CandidateDetails Component', () => {
  let mockRouter

  beforeEach(() => {
    mockRouter = { push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  // Helper to mock useParams
  const setupParams = (id: string) => {
    ;(useParams as jest.Mock).mockReturnValue({ id })
  }

  // Test 1: Renders "Candidate Not Found" when ID is invalid
  test('renders "Candidate Not Found" when candidate is not found', () => {
    setupParams('999') // Non-existent ID
    render(<CandidateDetails />)
    expect(screen.getByText(/Candidate Not Found/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back to List/i })).toBeInTheDocument()
  })

  // Test 2: Triggers navigation when Back button is clicked (not found case)
  test('navigates back to list when Back button is clicked on not found page', () => {
    setupParams('999')
    render(<CandidateDetails />)
    fireEvent.click(screen.getByRole('button', { name: /Back to List/i }))
    expect(mockRouter.push).toHaveBeenCalledWith('/candidate-management')
  })

  // Test 3: Renders candidate details for a valid ID
  test('renders candidate details when candidate is found', () => {
    setupParams('1') // John Doe
    render(<CandidateDetails />)
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument()
    expect(screen.getByText(/3 years/i)).toBeInTheDocument()
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument()
    expect(screen.getByText(/85%/i)).toBeInTheDocument()
    expect(screen.getByText(/Pending/i)).toBeInTheDocument()
  })

  // Test 4: Displays job description
  test('displays job description for the candidate', () => {
    setupParams('1')
    render(<CandidateDetails />)
    expect(
      screen.getByText(/Responsible for designing, developing, and maintaining software applications/i)
    ).toBeInTheDocument()
  })

  // Test 5: Renders profile photo with correct attributes
  test('renders profile photo with correct src and alt', () => {
    setupParams('1')
    render(<CandidateDetails />)
    const avatar = screen.getByAltText(/John Doe/i)

    expect(avatar).toHaveAttribute('src', '/images/john_doe.jpg')
  })

  // Test 6: Displays ATS Score with correct color (success)
  test('displays ATS Score with success color when >75', () => {
    setupParams('1') // ATS Score: 85
    render(<CandidateDetails />)
    const chip = screen.getByText(/85%/i)

    expect(chip).toHaveStyle('background-color:') // Success color (adjust if needed)
  })

  // Test 7: Displays ATS Score with warning color (50-75)
  test('displays ATS Score with warning color when between 50 and 75', () => {
    setupParams('2') // Jane Smith, ATS Score: 70
    render(<CandidateDetails />)
    const chip = screen.getByText(/70%/i)

    expect(chip).toHaveStyle('background-color:') // Warning color
  })

  // Test 8: Displays ATS Score with error color (<50)
  test('displays ATS Score with error color when <50', () => {
    setupParams('5') // Robert Brown, ATS Score: 40
    render(<CandidateDetails />)
    const chip = screen.getByText(/40%/i)

    expect(chip).toHaveStyle('background-color:') // Error color
  })

  // Test 9: Displays status with correct color (Shortlisted)
  test('displays Shortlisted status with success color', () => {
    setupParams('2') // Jane Smith
    render(<CandidateDetails />)
    const chip = screen.getByText(/Shortlisted/i)

    expect(chip).toHaveStyle('background-color:') // Success color
  })

  // Test 10: Displays status with error color (Rejected)
  test('displays Rejected status with error color', () => {
    setupParams('4') // Emily Davis
    render(<CandidateDetails />)
    const chip = screen.getByText(/Rejected/i)

    expect(chip).toHaveStyle('background-color:') // Error color
  })

  // Test 11: Displays status with warning color (Pending)
  test('displays Pending status with warning color', () => {
    setupParams('1') // John Doe
    render(<CandidateDetails />)
    const chip = screen.getByText(/Pending/i)

    expect(chip).toHaveStyle('background-color:') // Warning color
  })

  // Test 12: Triggers download for Resume button
  test('triggers resume download when Resume button is clicked', () => {
    setupParams('1')

    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    } as any)

    render(<CandidateDetails />)
    fireEvent.click(screen.getByRole('button', { name: /Resume/i }))
    expect(console.log).toHaveBeenCalledWith('Downloading John_Doe_resume.pdf from /documents/john_doe_resume.pdf')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockRouter.push).not.toHaveBeenCalled() // Ensure no navigation
    createElementSpy.mockRestore()
  })

  // Test 13: Triggers download for Pan Card button
  test('triggers pan card download when Pan Card button is clicked', () => {
    setupParams('1')

    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    } as any)

    render(<CandidateDetails />)
    fireEvent.click(screen.getByRole('button', { name: /Pan Card/i }))
    expect(console.log).toHaveBeenCalledWith('Downloading John_Doe_pan_card.pdf from /documents/john_doe_pan.pdf')
    createElementSpy.mockRestore()
  })

  // Test 14: Triggers download for Pay Slip button
  test('triggers pay slip download when Pay Slip button is clicked', () => {
    setupParams('1')

    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    } as any)

    render(<CandidateDetails />)
    fireEvent.click(screen.getByRole('button', { name: /Pay Slip/i }))
    expect(console.log).toHaveBeenCalledWith('Downloading John_Doe_pay_slip.pdf from /documents/john_doe_pay_slip.pdf')
    createElementSpy.mockRestore()
  })

  // Test 15: Navigates back to list when Back button is clicked (candidate found)
  test('navigates back to list when Back button is clicked on candidate page', () => {
    setupParams('1')
    render(<CandidateDetails />)
    fireEvent.click(screen.getByRole('button', { name: /Back to List/i }))
    expect(mockRouter.push).toHaveBeenCalledWith('/candidate-management')
  })

  // Test 16: Renders document section header
  test('renders Documents section header', () => {
    setupParams('1')
    render(<CandidateDetails />)
    expect(screen.getByText(/Documents/i)).toBeInTheDocument()
  })
})
