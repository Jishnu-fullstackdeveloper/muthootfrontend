'use client';
import DynamicButton from '@/components/Button/dynamicButton';
import { Box, Card, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import DynamicTable from '@/components/Table/dynamicTable';
import { ColumnDef } from '@tanstack/react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

const ApprovalSettings = () => {
  const router = useRouter();

  // State to manage table data
  const [tableData, setTableData] = useState<any[]>([]);

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
        numberOfLevels: 1,
        approvalFor: 'Sales Executive',
      },
    ]);
  }, []);

  // Handler for editing a row
  const handleEdit = (rowData: any) => {
    const { id, approvalType, numberOfLevels, approvalFor } = rowData;
    router.push(`/approval-matrix/edit/edit-approval?id=${id}&approvalType=${approvalType}&numberOfLevels=${numberOfLevels}&approvalFor=${approvalFor}`);
  };

  // Handler for deleting a row
  const handleDelete = (id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
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
            onClick={() => handleEdit(info.row.original)}
            sx={{ fontSize: 18, color: 'Highlight' }}
          >
            <DriveFileRenameOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(info.row.original.id)}
            sx={{ fontSize: 18, color: 'crimson' }}
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
        {tableData.length > 0 && <DynamicTable columns={columns} data={tableData} />}
      </div>
    </div>
  );
};

export default ApprovalSettings;
