'use client';
import DynamicButton from '@/components/Button/dynamicButton';
import { Box, Card, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

//import DynamicTable from '@/components/Table/dynamicTable';
import ModifiedDynamicTable from '@/components/Modifiedtable/modifiedDynamicTable';
import { ColumnDef } from '@tanstack/react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ApprovalSettings = () => {
  const router = useRouter();

  // State to manage table data
  const [tableData, setTableData] = useState<any[]>([]);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Load initial data on client-side only
  useEffect(() => {
    setTableData([
      {
        id: 1,
        approvalType: 'Recruitment',
        numberOfLevels: 1,
        approvalFor: 'HR',
      },
      {
        id: 2,
        approvalType: 'Branch Expansion',
        numberOfLevels: 2,
        approvalFor: 'Manager',
      },
      {
        id: 3,
        approvalType: 'Employee Resignation',
        numberOfLevels: 3,
        approvalFor: 'Sales Executive',
      },
    ]);
  }, []);

  // Handler for editing a row
  const handleEdit = (rowData: any) => {
    const { id, approvalType, numberOfLevels, approvalFor } = rowData;
    router.push(`/approval-matrix/edit/edit-approval?id=${id}&approvalType=${approvalType}&numberOfLevels=${numberOfLevels}&approvalFor=${approvalFor}`);
  };

  // Handler for opening the delete confirmation dialog
  const handleOpenDialog = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Handler for closing the delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  // Handler for deleting a row
  const handleDelete = () => {
    if (selectedId !== null) {
      setTableData((prev) => prev.filter((row) => row.id !== selectedId));
      handleCloseDialog();
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'approvalType', header: 'Approval Type' },
    { accessorKey: 'numberOfLevels', header: 'Number of Levels' },
    { accessorKey: 'approvalFor', header: 'Approval By' },
    {
      header: 'Actions',
      meta: { className: 'sticky right-0' },
      cell: (info: any) => (
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
            onClick={() => handleOpenDialog(info.row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between p-1 w-full">
        <Box
          className="w-full flex justify-between gap-4"
          sx={{ alignItems: 'flex-end', mt: 4 }}
        >
          <Typography variant="h4">Approval Matrix</Typography>
          <DynamicButton
            label="New Approval"
            variant="contained"
            icon={<i className="tabler-plus" />}
            position="start"
            onClick={() => router.push(`/approval-matrix/add/new-approval`)}
            children="New Approval"
          />
        </Box>
      </div>
      <div className="mt-2">
        {tableData.length > 0 && <ModifiedDynamicTable columns={columns} data={tableData} showCheckbox={false} />}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation for deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this?
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
    </div>
  );
};

export default ApprovalSettings;
