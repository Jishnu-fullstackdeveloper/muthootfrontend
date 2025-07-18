interface ResignedEmployee {
  id: string
  employeeCode: string
  firstName: string
  middleName?: string
  lastName: string
  designation: { name: string }
  department: { name: string }
  resignationDetails: {
    finalApprovalLWD: string
    noticePeriod: string
    relievingDate: string
    notes?: string
  }
}

export const resignedEmployees: ResignedEmployee[] = [
  {
    id: '1',
    employeeCode: 'EMP001',
    firstName: 'John',
    middleName: 'A',
    lastName: 'Doe',
    designation: { name: 'Software Engineer' },
    department: { name: 'Engineering' },
    resignationDetails: {
      finalApprovalLWD: '2025-03-15T00:00:00Z',
      noticePeriod: '30 days',
      relievingDate: '2025-04-15T00:00:00Z',
      notes: 'Pursuing higher studies'
    }
  },
  {
    id: '2',
    employeeCode: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    designation: { name: 'Project Manager' },
    department: { name: 'Operations' },
    resignationDetails: {
      finalApprovalLWD: '2025-04-10T00:00:00Z',
      noticePeriod: '60 days',
      relievingDate: '2025-06-10T00:00:00Z',
      notes: 'Relocating to another city'
    }
  },
  {
    id: '3',
    employeeCode: 'EMP003',
    firstName: 'Michael',
    middleName: 'B',
    lastName: 'Johnson',
    designation: { name: 'Data Analyst' },
    department: { name: 'Analytics' },
    resignationDetails: {
      finalApprovalLWD: '2025-02-28T00:00:00Z',
      noticePeriod: '45 days',
      relievingDate: '2025-04-15T00:00:00Z'
    }
  },
  {
    id: '4',
    employeeCode: 'EMP004',
    firstName: 'Emily',
    lastName: 'Brown',
    designation: { name: 'HR Specialist' },
    department: { name: 'Human Resources' },
    resignationDetails: {
      finalApprovalLWD: '2025-05-01T00:00:00Z',
      noticePeriod: '30 days',
      relievingDate: '2025-06-01T00:00:00Z',
      notes: 'Starting own business'
    }
  },
  {
    id: '5',
    employeeCode: 'EMP005',
    firstName: 'David',
    middleName: 'C',
    lastName: 'Wilson',
    designation: { name: 'DevOps Engineer' },
    department: { name: 'Engineering' },
    resignationDetails: {
      finalApprovalLWD: '2025-03-20T00:00:00Z',
      noticePeriod: '60 days',
      relievingDate: '2025-05-20T00:00:00Z'
    }
  },
  {
    id: '6',
    employeeCode: 'EMP006',
    firstName: 'Sarah',
    middleName: 'L',
    lastName: 'Taylor',
    designation: { name: 'UI/UX Designer' },
    department: { name: 'Design' },
    resignationDetails: {
      finalApprovalLWD: '2025-06-15T00:00:00Z',
      noticePeriod: '30 days',
      relievingDate: '2025-07-15T00:00:00Z',
      notes: 'Joining a startup'
    }
  },
  {
    id: '7',
    employeeCode: 'EMP007',
    firstName: 'Robert',
    lastName: 'Martinez',
    designation: { name: 'Marketing Specialist' },
    department: { name: 'Marketing' },
    resignationDetails: {
      finalApprovalLWD: '2025-04-20T00:00:00Z',
      noticePeriod: '45 days',
      relievingDate: '2025-06-05T00:00:00Z'
    }
  },
  {
    id: '8',
    employeeCode: 'EMP008',
    firstName: 'Lisa',
    middleName: 'M',
    lastName: 'Anderson',
    designation: { name: 'Financial Analyst' },
    department: { name: 'Finance' },
    resignationDetails: {
      finalApprovalLWD: '2025-05-10T00:00:00Z',
      noticePeriod: '60 days',
      relievingDate: '2025-07-10T00:00:00Z',
      notes: 'Career change to consulting'
    }
  },
  {
    id: '9',
    employeeCode: 'EMP009',
    firstName: 'Thomas',
    lastName: 'Lee',
    designation: { name: 'Quality Assurance Engineer' },
    department: { name: 'Engineering' },
    resignationDetails: {
      finalApprovalLWD: '2025-03-01T00:00:00Z',
      noticePeriod: '30 days',
      relievingDate: '2025-04-01T00:00:00Z',
      notes: 'Moving abroad'
    }
  }
]
