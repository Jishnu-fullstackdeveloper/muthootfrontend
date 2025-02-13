import React, { useState, useMemo } from 'react';
import { IconButton, Tooltip, Typography, Chip, Button } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import DynamicTable from '@/components/Table/dynamicTable';
import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog';

const CandidateListingTableView = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateIdToDelete, setCandidateIdToDelete] = useState<string | number | null>(null);

  const handleDeleteClick = (id: string | number) => {
    setCandidateIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (id?: string | number) => {
    if (id) {
      console.log('Rejecting candidate with ID:', id);
    }
    setDeleteModalOpen(false);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(() => [

    columnHelper.accessor('name', {
      header: 'CANDIDATE NAME',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.name}
        </Typography>
      ),
    }),

    columnHelper.accessor('appliedPost', {
      header: 'APPLIED POST',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.appliedPost}
        </Typography>
      ),
    }),

    columnHelper.accessor('email', {
      header: 'EMAIL',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.email}
        </Typography>
      ),
    }),

    columnHelper.accessor('phoneNumber', {
      header: 'PHONE NUMBER',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.phoneNumber}
        </Typography>
      ),
    }),

    columnHelper.accessor('experience', {
      header: 'EXPERIENCE',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.experience} years
        </Typography>
      ),
    }),

    columnHelper.accessor('atsScore', {
      header: 'ATS SCORE',
      cell: ({ row }) => (
        <Chip
          label={`${row.original.atsScore}%`}
          color={row.original.atsScore > 75 ? 'success' : row.original.atsScore > 50 ? 'warning' : 'error'}
          size='small'
          sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}
        />
      ),
    }),

    columnHelper.accessor('action', {
      header: 'ACTION',
      meta: { className: 'sticky right-0' },
      cell: ({ row }) => (
        <div className='flex items-center'>
          <Tooltip title='View' placement='top'>
            <IconButton onClick={() => router.push(`/candidate/view/${row.original.id}`)}>
              <i className='tabler-eye text-textSecondary'></i>
            </IconButton>
          </Tooltip>

          <Tooltip title='Shortlist' placement='top'>
            {/* <IconButton onClick={() => console.log('Shortlisting candidate:', row.original.id)}>
              <i className='tabler-check text-green-500 text-[22px]' />
            </IconButton> */}
            <Button 
                variant='tonal' 
                color='success' 
                size='small'
                onClick={() => console.log('Shortlisting candidate:', row.original.id)}
            >
                Shortlist <i className='ml-1 tabler-check' />
            </Button>
          </Tooltip>

          <Tooltip title='Reject' placement='top' className='ml-2'>
            {/* <IconButton onClick={() => handleDeleteClick(row.original.id)}>
              <i className='tabler-trash text-red-500'></i>
            </IconButton> */}
            <Button 
                variant='tonal' 
                color='error' 
                size='small'
                onClick={() => handleDeleteClick(row.original.id)}
            >
                Reject <i className='ml-1 tabler-circle-minus'></i>
            </Button>
          </Tooltip>
        </div>
      ),
      enableSorting: false,
    }),
  ], [router]);

  //  Added Sample Data (5 Rows)
  const candidates = [
    { 
        id: 1, 
        name: 'John Doe', 
        appliedPost: 'Software Engineer', 
        email: 'john.doe@example.com', 
        phoneNumber: '123-456-7890', 
        experience: 3, 
        atsScore: 85 
    },
    { 
        id: 2, 
        name: 'Jane Smith', 
        appliedPost: 'Frontend Developer', 
        email: 'jane.smith@example.com', 
        phoneNumber: '987-654-3210', 
        experience: 2, 
        atsScore: 70 
    },
    { 
        id: 3, 
        name: 'Michael Johnson', 
        appliedPost: 'Backend Developer', 
        email: 'michael.johnson@example.com', 
        phoneNumber: '555-666-7777', 
        experience: 5, 
        atsScore: 90 
    },
    { 
        id: 4, 
        name: 'Emily Davis', 
        appliedPost: 'UI/UX Designer', 
        email: 'emily.davis@example.com', 
        phoneNumber: '111-222-3333', 
        experience: 4, 
        atsScore: 60 
    },
    { 
        id: 5, 
        name: 'Robert Brown', 
        appliedPost: 'Data Scientist', 
        email: 'robert.brown@example.com', 
        phoneNumber: '444-555-6666', 
        experience: 6, 
        atsScore: 40 
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={candidates} />
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={candidateIdToDelete}
      />
    </div>
  );
};

export default CandidateListingTableView;
