import { Box, Button, FormControl, Modal, TextField } from '@mui/material'
import React, { useState } from 'react'
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
          <Button
            onClick={handleCloseTurnoverModal}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '10%',
              border: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#bbb'
              }
            }}
          >
            <i className='tabler-x'></i>
          </Button>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 50,
              marginBottom: 10
            }}
          >
            <h2 className='pl-12' style={{ paddingLeft: 50 }}>
              Turnover Details
            </h2>
            {/* <Button
              variant='outlined'
              onClick={handleAddNewTurnover}
              sx={{
                marginRight: 40,
                borderColor: '#888',
                color: '#888',
                '&:hover': {
                  borderColor: '#555',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Add
            </Button> */}
          </div>

          {/* Turnover Data Table */}
          <div style={{ marginTop: '16px', maxHeight: '60vh', overflowY: 'auto', marginBottom: '50px' }}>
            <table style={{ width: '80%', borderCollapse: 'collapse', marginLeft: '60px', marginBottom: '50px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>No</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Turnover Code</th>
                  {/* <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Actions</th> */}
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
                            ? '#f0f0f0'
                            : '' // Highlight selected row with a color
                    }}
                    onMouseEnter={() => setHoveredRow(item.turnoverID)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>

                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {item.turnoverCode}
                    </td>

                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {/* <Button
                        onClick={() => handleEditTurnover(item)}
                        sx={{
                          borderColor: '#888',
                          color: '#888',
                          '&:hover': {
                            borderColor: '#555',
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                      >
                        <i className='tabler-edit'></i>
                      </Button> */}

                      {/* <Button
                        onClick={() => handleOpenDeleteModal(item)}
                        sx={{
                          borderColor: '#888',
                          color: '#888',
                          '&:hover': {
                            backgroundColor: 'red'
                          },
                          marginLeft: 2
                        }}
                      >
                        <i className='tabler-trash'></i>
                      </Button> */}
                    </td>

                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <label>
                        <input
                          type='radio'
                          name='turnoverCode' // Group all radio buttons
                          value={item.turnoverCode}
                          checked={selectedTurnoverCode === item.turnoverCode} // Controlled selection
                          onChange={() => handleRadioChange(item.turnoverCode)} // Update selected turnover code
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

      <Modal open={showNewTurnoverModal} onClose={handleCancelNewTurnover}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '400px'
          }}
        >
          <h2>{isEditMode ? 'Edit Turnover Amount' : 'Add New Turnover Amount'}</h2>

          <div className='flex flex-col space-y-4' style={{ marginTop: 10 }}>
            <FormControl fullWidth>
              <TextField
                label='Turnover Code'
                variant='outlined'
                value={turnoverCode} // Value is bound to state
                onChange={e => setTurnoverCode(e.target.value)} // OnChange handler to update state
              />
            </FormControl>

            <div className='flex' style={{ paddingLeft: 50 }}>
              <Button
                onClick={handleSaveNewTurnover}
                sx={{
                  padding: 2,
                  paddingLeft: 7,
                  paddingRight: 7,
                  marginRight: 4,
                  borderColor: '#888',
                  background: '#039be5',
                  color: '#f5f5f5',
                  '&:hover': {
                    border: 1,
                    color: 'black',
                    borderColor: '#555',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Save
              </Button>
              <Button
                variant='outlined'
                onClick={handleCancelNewTurnover}
                sx={{
                  padding: 2,
                  paddingLeft: 7,
                  paddingRight: 7,
                  marginRight: 4,
                  borderColor: '#888',
                  background: '#616161',
                  color: '#f5f5f5',
                  '&:hover': {
                    border: 1,
                    color: 'black',
                    borderColor: '#555',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default TurnOverModal
