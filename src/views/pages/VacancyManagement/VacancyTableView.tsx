import React, { useState, useMemo } from 'react';
import { IconButton, Tooltip, Typography, Chip } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import DynamicTable from '@/components/Table/dynamicTable';
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog';

const VacancyListingTableView = ({ vacancies }: any) => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vacancyIdToDelete, setVacancyIdToDelete] = useState<string | number | null>(null);

  const handleDeleteClick = (id: string | number) => {
    setVacancyIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (id?: string | number) => {
    if (id) {
      // Perform the delete operation here
      console.log('Deleting vacancy with ID:', id);
      // After deletion, you might want to refresh the data or remove the item from the list
    }
    setDeleteModalOpen(false);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.title}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('jobType', {
        header: 'JOB TYPE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.jobType}
              </Typography>
            </div>
          </div>
        ),
      }),

    columnHelper.accessor('vacancyPositions', {
        header: 'POSITIONS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.vacancyPositions}
              </Typography>
            </div>
          </div>
        ),
      }),
      
      columnHelper.accessor('numberOfOpenings', {
        header: 'OPENINGS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.numberOfOpenings}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('branch', {
        header: 'BRANCH',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.branch}
              </Typography>
            </div>
          </div>
        ),
      }),

    columnHelper.accessor('noOfFilledPositions', {
        header: 'FILLED POSITIONS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.noOfFilledPositions}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('noOfApplicants', {
        header: 'APPLIED',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.noOfApplicants}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('shortlisted', {
        header: 'SHORLISTED',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.shortlisted}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('city', {
        header: 'CITY',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.city}
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('experience', {
        header: 'EXPERIENCE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.experience} years
              </Typography>
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('startDate', {
        header: 'START DATE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              {/* <Typography color='text.primary' className='font-medium'>
                {row.original.startDate}
              </Typography> */}
              <Chip
                variant='tonal' 
                label={`${row.original.startDate}`} 
                color='success'
                size='medium'
                sx={{
                fontWeight: 'bold',
                fontSize: '0.85rem', // Slightly increased font size
                textTransform: 'uppercase',
                width: 103
                }}
            />
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('endDate', {
        header: 'END DATE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              {/* <Typography color='text.primary' className='font-medium'>
                {row.original.endDate}
              </Typography> */}
              <Chip
                      variant='tonal' 
                      label={`${row.original.endDate}`} 
                      color='error'
                      size='medium'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.85rem', // Slightly increased font size
                        textTransform: 'uppercase',
                        width: 105
                      }}
                    />
            </div>
          </div>
        ),
      }),

    //   columnHelper.accessor('contactPerson', {
    //     header: 'CONTACT PERSON',
    //     cell: ({ row }) => (
    //       <div className='flex items-center gap-4'>
    //         <div className='flex flex-col'>
    //           <Typography color='text.primary' className='font-medium'>
    //             {row.original.contactPerson}
    //           </Typography>
    //         </div>
    //       </div>
    //     ),
    //   }),

      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Chip
                label={row.original.status}
                color={
                  row.original.status === 'Open'
                    ? 'success'
                    : row.original.status === 'Closed'
                    ? 'default'
                    : 'warning'
                }
                size='small'
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          </div>
        ),
      }),

      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: {
          className: 'sticky right-0',
        },
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/vacancy-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>

            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/vacancy-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete' placement='top'>
              <IconButton onClick={() => handleDeleteClick(row.original.id)}>
                <i className='tabler-trash text-textSecondary'></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    []
  );

  return (
    <div>
      <DynamicTable columns={columns} data={vacancies} />
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={vacancyIdToDelete}
      />
    </div>
  );
};

export default VacancyListingTableView;
