'use client';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchApprovalMatrices, deleteApprovalMatrix } from '@/redux/approvalMatrixSlice';
import ModifiedDynamicTable from '@/components/Modifiedtable/modifiedDynamicTable';
import { ColumnDef } from '@tanstack/react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ApprovalSettings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Redux state
  const { approvalMatrixData, status, error, totalItems } = useAppSelector(
    (state) => state.approvalMatrixReducer
  );

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch data on page/limit change
  useEffect(() => {
    dispatch(fetchApprovalMatrices({ page, limit }));
  }, [dispatch, page, limit]);

  // Log data for debugging
  useEffect(() => {
    console.log('Approval Matrix Data:', approvalMatrixData);
  }, [approvalMatrixData]);

  // Handle edit
  // const handleEdit = (rowData: any) => {
  //   router.push(`/approval-matrix/edit/edit-approval?id=${rowData.uuid}`);
  // };

  const handleEdit = (rowData: any) => {
    const queryParams = new URLSearchParams({
      uuid: rowData.uuid,
      approvalType: rowData.name,
      numberOfLevels: rowData.configurations.length.toString(),
      approvalFor: JSON.stringify(rowData.configurations.map((config: any) => ({
        id: config.approverDesignationId,
        designation: config.approverDesignation,
      }))),
    }).toString();

    router.push(`/approval-matrix/edit/edit-approval?${queryParams}`);
  };


  // Handle dialog open
  const handleOpenDialog = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  // // Handle delete
  // const handleDelete = async () => {
  //   if (selectedId) {
  //     dispatch(deleteApprovalMatrix(selectedId));
  //     dispatch(fetchApprovalMatrices({ page, limit })); // Refresh the data
  //     setOpenDialog(false);
  //     setSelectedId(null);
  //   }
  // };

  // Handle delete
  const handleDelete = async () => {
    if (selectedId) {
      // Dispatch delete action
      const resultAction = await dispatch(deleteApprovalMatrix(selectedId));
      // Check for error during deletion
      if (deleteApprovalMatrix.fulfilled.match(resultAction)) {
        // On success, fetch updated data
        dispatch(fetchApprovalMatrices({ page, limit }));
      }
      // Close the dialog and reset selection
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  // Columns for the table
  const columns: ColumnDef<any>[] = [
    { accessorKey: 'uuid', header: 'UUID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'configurations',
      header: 'Configurations',
      cell: ({ row }) => row.original.configurations.map((config: any) => config.approvalSequenceLevel).join(', '),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <div>
          <IconButton
            aria-label="edit"
            sx={{ fontSize: 18 }}
            onClick={() => handleEdit(info.row.original)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            sx={{ fontSize: 18 }}
            onClick={() => handleOpenDialog(info.row.original.uuid)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <Box>
      <Box className="flex justify-between p-1 w-full">
        <Typography variant="h4">Approval Matrix</Typography>
        <Button
          variant="contained"
          onClick={() => router.push(`/approval-matrix/add/new-approval`)}
        >
          New Approval
        </Button>
      </Box>

      <Box className="mt-2">
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography>Error: {error}</Typography>}
        {status === 'succeeded' && (
          <ModifiedDynamicTable columns={columns} data={approvalMatrixData} />
        )}
      </Box>

      {/* Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this approval matrix?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalSettings;
