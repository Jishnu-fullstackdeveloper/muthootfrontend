// Sample candidate data with job descriptions (replace with actual data source in production)
export const candidateDetails = [
  {
    id: 1,
    name: 'John Doe',
    appliedPost: 'Software Engineer',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    experience: 3,
    jobPortal: 'LinkedIn',
    atsScore: 85,
    status: 'Pending',
    jobDescription:
      'Responsible for designing, developing, and maintaining software applications. Requires expertise in JavaScript, Node.js, and cloud technologies.',
    documents: {
      resume: '/documents/john_doe_resume.pdf',
      panCard: '/documents/john_doe_pan.pdf',
      paySlip: '/documents/john_doe_payslip.pdf'
    },
    profilePhoto: '/images/john_doe.jpg' // Placeholder image path
  },
  {
    id: 2,
    name: 'Jane Smith',
    appliedPost: 'Frontend Developer',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    experience: 2,
    jobPortal: 'Indeed',
    atsScore: 70,
    status: 'Shortlisted',
    jobDescription:
      'Develops user-facing features using React.js and ensures responsive design across devices. Proficiency in CSS and UX principles is essential.',
    documents: {
      resume: '/documents/jane_smith_resume.pdf',
      panCard: '/documents/jane_smith_pan.pdf',
      paySlip: '/documents/jane_smith_payslip.pdf'
    },
    profilePhoto: '/images/jane_smith.jpg'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    appliedPost: 'Backend Developer',
    email: 'michael.johnson@example.com',
    phoneNumber: '555-666-7777',
    experience: 5,
    jobPortal: 'Glassdoor',
    atsScore: 90,
    status: 'Pending',
    jobDescription:
      'Builds and maintains server-side logic using Python and Django. Focuses on database optimization and API development.',
    documents: {
      resume: '/documents/michael_johnson_resume.pdf',
      panCard: '/documents/michael_johnson_pan.pdf',
      paySlip: '/documents/michael_johnson_payslip.pdf'
    },
    profilePhoto: '/images/michael_johnson.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    appliedPost: 'UI/UX Designer',
    email: 'emily.davis@example.com',
    phoneNumber: '111-222-3333',
    experience: 4,
    jobPortal: 'Monster',
    atsScore: 60,
    status: 'Rejected',
    jobDescription:
      'Designs intuitive user interfaces and conducts user research. Skilled in Figma, Adobe XD, and prototyping.',
    documents: {
      resume: '/documents/emily_davis_resume.pdf',
      panCard: '/documents/emily_davis_pan.pdf',
      paySlip: '/documents/emily_davis_payslip.pdf'
    },
    profilePhoto: '/images/emily_davis.jpg'
  },
  {
    id: 5,
    name: 'Robert Brown',
    appliedPost: 'Data Scientist',
    email: 'robert.brown@example.com',
    phoneNumber: '444-555-6666',
    experience: 6,
    jobPortal: 'CareerBuilder',
    atsScore: 40,
    status: 'Pending',
    jobDescription: 'Analyzes large datasets to derive insights using Python, R, and machine learning techniques.',
    documents: {
      resume: '/documents/robert_brown_resume.pdf',
      panCard: '/documents/robert_brown_pan.pdf',
      paySlip: '/documents/robert_brown_payslip.pdf'
    },
    profilePhoto: '/images/robert_brown.jpg'
  },
  {
    id: 6,
    name: 'Robert Downy Jr',
    appliedPost: 'Data Analyst',
    email: 'robert.downy@example.com',
    phoneNumber: '444-999-6666',
    experience: 5,
    jobPortal: 'LinkedIn',
    atsScore: 80,
    status: 'Shortlisted',
    jobDescription:
      'Interprets data trends and creates reports using SQL, Excel, and Tableau for business decision-making.',
    documents: {
      resume: '/documents/robert_downy_jr_resume.pdf',
      panCard: '/documents/robert_downy_jr_pan.pdf',
      paySlip: '/documents/robert_downy_jr_payslip.pdf'
    },
    profilePhoto: '/images/robert_downy_jr.jpg'
  }
]
