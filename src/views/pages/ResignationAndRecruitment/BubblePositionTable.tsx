'use client'

// MUI Imports -
import {
  Card,
  CardHeader,
  Chip,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Clear, CalendarToday, TransferWithinAStation } from '@mui/icons-material'

// Sample Data for Bubble Positions
const bubblePositions = [
  {
    branchId: 'TVM001',
    branchName: 'Thiruvananthapuram',
    designation: 'Software Engineer',
    numberOfEmployees: 10,
    positionReason: 'Expansion'
  },
  {
    branchId: 'KTM002',
    branchName: 'Kottayam',
    designation: 'Software Engineer',
    numberOfEmployees: 5,
    positionReason: 'New Project'
  },
  {
    branchId: 'EKM003',
    branchName: 'Ernakulam',
    designation: 'Software Engineer',
    numberOfEmployees: 7,
    positionReason: 'Backfill'
  }
]

const BubblePositionTable = () => {
  const router = useRouter()

  // Function to handle View Details action
  const onViewDetails = (branchId: string) => {
    // router.push(`/bubble-positions/view/${branchId}`)
  }

  return (
    <Card>
      <CardHeader title='Bubble Position Table' subheader='Details of available bubble positions' />

      <TableContainer
        component={Paper}
        sx={{
          overflowY: 'auto',
          maxHeight: '400px',
          '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: '#f0f0f0'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d4d4d4',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfbfbf'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell>Branch ID</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Number of Employees</TableCell>
              <TableCell>Position Reason</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bubblePositions.map(position => (
              <TableRow key={position.branchId}>
                <TableCell>{position.branchName}</TableCell>
                <TableCell>{position.branchId}</TableCell>
                <TableCell>{position.designation}</TableCell>
                <TableCell>{position.numberOfEmployees}</TableCell>
                <TableCell>{position.positionReason}</TableCell>
                <TableCell>
                  <Tooltip title='View Details'>
                    <IconButton onClick={() => onViewDetails(position.branchId)}>
                      <i className='tabler-eye text-textSecondary'></i>
                    </IconButton>
                  </Tooltip>
                  {/* Disabled Transfer Action */}
                  <Tooltip title='Transfer (Disabled)'>
                    <span>
                      <IconButton onClick={() => {}}>
                        <i className='tabler-transfer-in text-textSecondary'></i>
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default BubblePositionTable
