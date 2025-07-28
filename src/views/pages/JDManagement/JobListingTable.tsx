'use client'
import React, { useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Box } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

interface ExperienceDescription {
  min: string
  max: string
}

interface EducationAndExperience {
  minimumQualification: string
  experienceDescription: ExperienceDescription
}

interface RoleSpecification {
  jobRole: string
  companyName: string
  jobType: string
}

interface JobRole {
  action: string
  id: string
  jobRoleId: string
  approvalStatus: string
  details: {
    roleSpecification: RoleSpecification
    skills: string[]
    educationAndExperience: EducationAndExperience[]
  }
  createdAt: string
}

interface JobListingTableViewProps {
  jobs: JobRole[]
  totalCount: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
}

// Utility function for title case formatting
const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const JobListingTableView = ({
  jobs,
  totalCount,
  pagination,
  onPageChange,
  onRowsPerPageChange
}: JobListingTableViewProps) => {
  const router = useRouter()
  const columnHelper = createColumnHelper<JobRole>()

  const columns = useMemo<ColumnDef<JobRole, any>[]>(
    () => [
      columnHelper.accessor(row => row.details.roleSpecification?.jobRole, {
        header: 'JOB ROLE',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {row.original.details.roleSpecification?.jobRole?.toUpperCase() || 'N/A'}
          </Typography>
        )
      }),

      // columnHelper.accessor(row => row.details.skills, {
      //   header: 'SKILLS',
      //   cell: ({ row }) => (
      //     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      //       {row.original.details.skills?.length > 0 ? (
      //         row.original.details.skills.map((skill, index) => (
      //           <Chip
      //             key={index}
      //             label={toTitleCase(skill)}
      //             sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
      //           />
      //         ))
      //       ) : (
      //         <Typography color='text.secondary' sx={{ fontSize: '14px' }}>
      //           N/A
      //         </Typography>
      //       )}
      //     </Box>
      //   )
      // }),
      columnHelper.accessor(row => row.details.educationAndExperience[0]?.experienceDescription, {
        header: 'MIN EXPERIENCE',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {row.original.details.educationAndExperience[0]?.experienceDescription
              ? `${row.original.details.educationAndExperience[0].experienceDescription.min}  years`
              : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor(row => row.details.educationAndExperience[0]?.experienceDescription, {
        header: 'MAX EXPERIENCE',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {row.original.details.educationAndExperience[0]?.experienceDescription
              ? `${row.original.details.educationAndExperience[0].experienceDescription.max} years`
              : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor(row => row.details.educationAndExperience[0]?.minimumQualification, {
        header: 'EDUCATION',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {toTitleCase(row.original.details.educationAndExperience[0]?.minimumQualification || 'N/A')}
          </Typography>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification?.companyName, {
        header: 'COMPANY',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {toTitleCase(row.original.details.roleSpecification?.companyName?.replace(/_/g, ' ') || 'N/A')}
          </Typography>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification?.jobType, {
        header: 'JOB TYPE',
        cell: ({ row }) => (
          <Typography color='text.primary' sx={{ fontWeight: 500, fontSize: '14px' }}>
            {toTitleCase(row.original.details.roleSpecification?.jobType || 'N/A')}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: {
          className: 'sticky right-0'
        },
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={jobs}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        totalCount={totalCount}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </div>
  )
}

export default JobListingTableView
