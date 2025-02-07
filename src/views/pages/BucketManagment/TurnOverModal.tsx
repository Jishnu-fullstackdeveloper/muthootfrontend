import React, { useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'

const TurnOverModal = ({
  showNewTurnoverModal,
  handleCancelNewTurnover,
  isEditMode,
  turnoverCode,
  setTurnoverCode,
  handleSaveNewTurnover,
  handleAddNewTurnover,
  turnoverListData,
  selectedTurnoverCode,
  hoveredRow,
  setHoveredRow,
  handleEditTurnover,
  handleOpenDeleteModal,
  setSelectedTurnoverCode,
  handleSubmit,
  submitselectedTurnoverCode,
  showTurnOverModal,
  handleCloseTurnoverModal,
  handleRadioChange
}: any) => {
  return (
    <div>
      <Modal open={showTurnOverModal} onClose={handleCloseTurnoverModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 2,
            boxShadow: 24,
            maxHeight: '80vh',
            width: '50%'
          }}
        >
          <div className='flex justify-end'>
            <Button onClick={handleCloseTurnoverModal} aria-label='Close'>
              <i className='tabler-x'></i>
            </Button>
          </div>

          <div style={{ marginTop: '16px', maxHeight: '60vh', overflowY: 'auto', marginBottom: '50px' }}>
            <table
              style={{
                width: '80%',
                borderCollapse: 'collapse',
                marginLeft: '60px',
                marginBottom: '50px'
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>No</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Turnover Code</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {turnoverListData?.map((item, index) => (
                  <tr
                    key={item.turnoverID}
                    style={{
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      backgroundColor:
                        selectedTurnoverCode === item.turnoverCode
                          ? '#e0f7fa'
                          : hoveredRow === item.turnoverID
                            ? '#f0f0f0' // Hover color should be applied here
                            : '' // Default background
                    }}
                    onMouseEnter={() => setHoveredRow(item.turnoverID)} // Set hovered row on mouse enter
                    onMouseLeave={() => setHoveredRow(null)} // Reset hovered row on mouse leave
                  >
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {item.turnoverCode}
                    </td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <label>
                        <input
                          type='radio'
                          name='turnoverCode'
                          value={item.turnoverCode}
                          checked={selectedTurnoverCode === item.turnoverCode}
                          onChange={() => handleRadioChange(item.turnoverCode)}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button
              variant='contained'
              onClick={submitselectedTurnoverCode}
              disabled={!selectedTurnoverCode}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default TurnOverModal
