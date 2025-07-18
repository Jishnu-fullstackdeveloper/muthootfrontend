import { useRouter } from 'next/navigation'

import { render, screen, fireEvent } from '@testing-library/react'

import ViewJD from '../viewJD'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('ViewJD Component', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Test 1: Renders the component without crashing
  test('renders ViewJD component with all sections', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('ASST. BRANCH MANAGER')).toBeInTheDocument()
    expect(screen.getByText('Back to JD List')).toBeInTheDocument()
    expect(screen.getByText('Role Summary')).toBeInTheDocument()
    expect(screen.getByText('Key Responsibilities')).toBeInTheDocument()
    expect(screen.getByText('Key Challenges')).toBeInTheDocument()
    expect(screen.getByText('Key Interactions')).toBeInTheDocument()
    expect(screen.getByText('Role Details')).toBeInTheDocument()
    expect(screen.getByText('Key Skills & Attributes')).toBeInTheDocument()
    expect(screen.getByText('Educational & Experience Description')).toBeInTheDocument()
    expect(screen.getByText('Organizational Chart')).toBeInTheDocument()
  })

  // Test 2: Navigates back to JD list on button click
  test('navigates to JD list when back button is clicked', () => {
    render(<ViewJD mode='view' id='1' />)
    fireEvent.click(screen.getByText('Back to JD List'))
    expect(mockPush).toHaveBeenCalledWith('/jd-management')
  })

  // Test 3: Renders key responsibilities
  test('renders key responsibilities correctly', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('Lead development')).toBeInTheDocument()
    expect(screen.getByText('Manage the end-to-end product development lifecycle')).toBeInTheDocument()
    expect(screen.getByText('Review processes')).toBeInTheDocument()
    expect(screen.getByText('Ensure team compliance with coding best practices')).toBeInTheDocument()
  })

  // Test 4: Renders key interactions
  test('renders key interactions correctly', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('Internal Stakeholders:')).toBeInTheDocument()
    expect(screen.getByText('Coordination with product and design teams')).toBeInTheDocument()
    expect(screen.getByText('External Stakeholders:')).toBeInTheDocument()
    expect(screen.getByText('Client discussions and feedback loops')).toBeInTheDocument()
  })

  // Test 5: Renders key skills and attributes
  test('renders key skills and attributes correctly', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('Factor/Category: Technical Expertise')).toBeInTheDocument()
    expect(screen.getByText('Competencies: Java, Spring Boot, API Integration')).toBeInTheDocument()
    expect(screen.getByText('Definitions: Java development, Backend design')).toBeInTheDocument()
    expect(screen.getByText('Behavioral Attributes: Adaptability, Problem-solving')).toBeInTheDocument()
    expect(screen.getByText('Factor/Category: Communication Skills')).toBeInTheDocument()
    expect(screen.getByText('Competencies: Stakeholder Engagement')).toBeInTheDocument()
    expect(screen.getByText('Definitions: Effective communication with clients')).toBeInTheDocument()
    expect(
      screen.getByText('Behavioral Attributes: Team leadership, Cross-functional collaboration')
    ).toBeInTheDocument()
  })

  // Test 6: Renders organizational chart with nested nodes
  test('renders organizational chart recursively', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('CEO')).toBeInTheDocument()
    expect(screen.getByText('CTO')).toBeInTheDocument()
    expect(screen.getByText('Lead Developer')).toBeInTheDocument()
    expect(screen.getByText('QA Manager')).toBeInTheDocument()
    expect(screen.getByText('CFO')).toBeInTheDocument()
    expect(screen.getByText('Finance Manager')).toBeInTheDocument()
    expect(screen.getByText('Accountant')).toBeInTheDocument()
  })

  // Test 7: Renders role details
  test('renders role details correctly', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(screen.getByText('Company Name: ABC Ltd.')).toBeInTheDocument()
    expect(screen.getByText('Reporting To: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Function/Department: Research & Development')).toBeInTheDocument()
    expect(screen.getByText('Written By: HR Department')).toBeInTheDocument()
  })

  // Test 8: Renders educational & experience description
  test('renders educational and experience description', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(
      screen.getByText(
        'Bachelor’s Degree in Computer Science/Related Fields with 5+ years of relevant experience in leadership and technical expertise areas.'
      )
    ).toBeInTheDocument()
  })

  // Test 9: Renders key challenges
  test('renders key challenges correctly', () => {
    render(<ViewJD mode='view' id='1' />)
    expect(
      screen.getByText(
        'Adapting to evolving market trends, driving technical innovation while maintaining compliance, and ensuring cross-functional collaboration with varying business unit objectives.'
      )
    ).toBeInTheDocument()
  })
})
