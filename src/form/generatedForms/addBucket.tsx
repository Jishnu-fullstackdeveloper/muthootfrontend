'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormControl, TextField, IconButton, InputAdornment, Autocomplete , Tooltip, Card } from '@mui/material'
import DynamicButton from '@/components/Button/dynamicButton'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline'
import { useRouter } from 'next/navigation'
import { Modal, Box, Button } from '@mui/material';

type Props = {
  mode: any
  id: any
}

const AddOrEditBucket: React.FC<Props> = ({ mode, id }) => {
  console.log('mode', mode)
  console.log('id', id)

  const [roleCount, setRoleCount] = useState<string>('')
  const [error, setError] = useState<string>('') // Error message
  const [warning, setWarning] = useState<string>('') // Warning message
  const [designations, setDesignations] = useState<any[]>([{ designationName: '', roleCount: 1 }])
  const [showModal, setShowModal] = useState(false);
  const [showTurnoverModal, setShowTurnoverModal] = useState(false); // New state for Turnover modal
  // const [showNewTurnoverModal, setShowNewTurnoverModal] = useState(false); // Modal to create new turnover
  const [modalData, setModalData] = useState(null);
  // const [turnoverAmount, setTurnoverAmount] = useState<number | string>(''); // State for turnover amount
  // const [turnoverCode, setTurnoverCode] = useState<string>('');
  // const [isEditMode, setIsEditMode] = useState(false) // Track whether we're in edit mode
  const [selectedTurnover, setSelectedTurnover] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedTurnoverCode, setSelectedTurnoverCode] = useState('');

  const [showNewTurnoverModal, setShowNewTurnoverModal] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [turnoverAmount, setTurnoverAmount] = useState('');
const [turnoverCode, setTurnoverCode] = useState('');
// const [selectedTurnover, setSelectedTurnover] = useState(null);

  interface DataItem {
    id: number;
    turnover: number;
    code: string;
  }
  const [data, setData] = useState([
    { id: 1, turnoverCode: 'ABC123' },
    { id: 2, turnoverCode: 'DEF456' },
    { id: 3, turnoverCode: 'GHI789' },
    { id: 4, turnoverCode: 'JKL012' },
    { id: 5, turnoverCode: 'MNO345' },
    { id: 6, turnoverCode: 'PQR678' },
    { id: 7, turnoverCode: 'STU901' },
    { id: 8, turnoverCode: 'VWX234' },
    { id: 9, turnoverCode: 'YZA567' },
    { id: 10, turnoverCode: 'BCD890' },
    { id: 11, turnoverCode: 'EFG123' },
    { id: 12, turnoverCode: 'HIJ456' },
  ])
  
  


  const handleIconClick = (item: any) => {
    setModalData(item); // Set data for the modal
    setShowModal(true);  // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setModalData(null);   // Clear modal data
  };



  // Open modal to create a new turnover
  const handleAddNewTurnover = () => {
    setIsEditMode(false) // Set to false when adding a new turnover
    setTurnoverAmount('')
    setTurnoverCode('')
    setShowNewTurnoverModal(true)
  }
  const handleEditTurnover = (item: any) => {
    console.log(item); // Log item to verify the data
    setIsEditMode(true); 
    setSelectedTurnover(item); 
    // setTurnoverAmount(item.turnoverCode.toString());
    setTurnoverCode(item.turnoverCode);
    setShowNewTurnoverModal(true);
  }
  
 const handleSubmit = () => {
    // Handle the submit action and pass the selected turnover code to the input field
    setTurnoverCode(selectedTurnoverCode);
    handleCloseModal();
  };
  const handleSaveNewTurnover = () => {
    if (isEditMode && selectedTurnover) {
      // Handle editing existing turnover
      const updatedData = data.map((item) =>
        item.id === selectedTurnover.id
          ? { ...item,  turnoverCode: turnoverCode }
          : item
      )
      setData(updatedData)
    } else {
      // Handle adding new turnover
      const newTurnover = {
        id: data.length + 1,
        turnoverCode: turnoverCode,
      }
      setData([...data, newTurnover])
    }
    setShowNewTurnoverModal(false) // Close the modal after saving
  }
  const handleCancelNewTurnover = () => {
    setShowNewTurnoverModal(false) // Close the modal without saving
  }

  const handleDeleteTurnover = () => {
    const updatedData = data.filter((item) => item.id !== selectedTurnover?.id)
    setData(updatedData)
    setShowDeleteModal(false) // Close delete confirmation modal
  }

  const handleOpenDeleteModal = (item: any) => {
    setSelectedTurnover(item)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  


  // Formik Setup
  const bucketFormik = useFormik({
    initialValues: {
      bucketName: '',
      turnoverCode: '',
      turnoverId: '',
      note: '',
      designations: [{ designationName: '', roleCount: 1 }]
    },
    validationSchema: Yup.object().shape({
      bucketName: Yup.string().required('Bucket Name is required'),
      note: Yup.string(),
      designations: Yup.array()
        .of(
          Yup.object().shape({
            designationName: Yup.string().required('Designation is required'),
            roleCount: Yup.number().required('Role Count is required').min(1)
          })
        )
        .min(1, 'At least one designation is required')
    }),
    onSubmit: values => {
      console.log('Form Submitted:', values)
    }
  })

  const handleSaveNewBucket = () => {
    const bucketData = {
      bucketName: bucketFormik.values.bucketName,
      turnoverCode: bucketFormik.values.turnoverCode,
      note: bucketFormik.values.note,
      designations: bucketFormik.values.designations,
      id: data.length + 1, // Generate a new ID based on the existing data length
    };
  
    // Add the new bucket to the data state (or update if necessary)
    setData([...data, bucketData]); // Assuming you're adding the bucket data to the state
    bucketFormik.resetForm(); // Optionally reset the form after saving
    setShowNewTurnoverModal(false); // Close modal after saving
  };
  
  const handleBucketSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    handleSaveNewBucket(); // Call the function to save the new bucket
  };
  const router = useRouter()

  // Cancel button handler
  const handleCancel = () => {
    router.back()
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value
    const newDesignations = [...designations]

    
    if (value === '') {
      newDesignations[index].roleCount = '' // Empty input for backspace
      setWarning('') // Remove warning
      setError('')
    } else if (parseInt(value, 10) === 0) {
      setError('Value cannot be zero') // Show error in red
      setWarning('')
      newDesignations[index].roleCount = '' // Reset if zero
    } else {
      setError('')
      setWarning('')
      newDesignations[index].roleCount = parseInt(value, 10)
    }
    setDesignations(newDesignations)
  }

  return (
    <form onSubmit={bucketFormik.handleSubmit} className='p-6 bg-white shadow-md rounded'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Bucket Management Form</h1>

      <fieldset className='border border-gray-300 rounded p-4 mb-6'>
        <legend className='text-lg font-semibold text-gray-700'>Bucket Details</legend>
        <div className='grid grid-cols-2 gap-4'>
          <FormControl fullWidth margin='normal'>
            <label htmlFor='bucketName' className='block text-sm font-medium text-gray-700'>
              Bucket Name *
            </label>
            <TextField
              id='bucketName'
              name='bucketName'
              type='text'
              value={bucketFormik.values.bucketName}
              onChange={bucketFormik.handleChange}
              onFocus={() => bucketFormik.setFieldTouched('bucketName', true)}
              error={bucketFormik.touched.bucketName && Boolean(bucketFormik.errors.bucketName)}
              helperText={bucketFormik.touched.bucketName && bucketFormik.errors.bucketName ? String(bucketFormik.errors.bucketName) : undefined}
            />
          </FormControl>

          <FormControl fullWidth margin='normal' >
            <label htmlFor='turnoverCode' className='block text-sm font-medium text-gray-700'>
              Turnover Code
            </label>
            <div style={{ flexDirection:'row' }}>
            <TextField
            onClick={() => handleIconClick(data[0])} 
            value={turnoverCode}
            InputProps={{
              readOnly: true,
            }}
            sx={{paddingRight:'10px'}}
              id='turnoverCode'
              name='turnoverCode'
             
             
              onChange={bucketFormik.handleChange}
              onFocus={() => bucketFormik.setFieldTouched('turnoverCode', true)}
              error={bucketFormik.touched.turnoverCode && Boolean(bucketFormik.errors.turnoverCode)}
              helperText={bucketFormik.touched.turnoverCode && bucketFormik.errors.turnoverCode ? String(bucketFormik.errors.turnoverCode) : undefined}
             
            />
            

             </div>


             <Modal open={showModal} onClose={handleCloseModal}>
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
            width: '50%',
          }}
        >
          <Button
            onClick={handleCloseModal}
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
                borderColor: '#bbb',
              },
            }}
          >
            <i className="tabler-x"></i>
          </Button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50 , marginBottom:10 }}>
  <h2 style={{ paddingLeft: 50 }}>Turnover Details</h2>
  <Button
    variant="outlined"
    onClick={handleAddNewTurnover}
    sx={{
      marginRight: 40,
      borderColor: '#888',
      color: '#888',
      '&:hover': {
        borderColor: '#555',
        backgroundColor: '#f5f5f5',
       
      },
    }}
  >
    Add
  </Button>
</div>


          {/* Turnover Data Table */}
          <div style={{ marginTop: '16px', maxHeight: '60vh', overflowY: 'auto', marginBottom: '50px' }}>
      <table style={{ width: '80%', borderCollapse: 'collapse', marginLeft: '60px', marginBottom: "50px" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>No</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Turnover Code</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Actions</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                backgroundColor: selectedTurnoverCode === item.turnoverCode ? '#e0f7fa' : hoveredRow === item.id ? '#f0f0f0' : '', // Highlight selected row with a color
              }}
              onMouseEnter={() => setHoveredRow(item.id)} // Set hovered row when mouse enters
              onMouseLeave={() => setHoveredRow(null)} // Reset hovered row when mouse leaves
            >
              
              <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                {item.id.toLocaleString()}
              </td>

              <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                {item.turnoverCode}
              </td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
              <Button
        onClick={() => handleEditTurnover(item)}
        sx={{
          borderColor: '#888',
          color: '#888',
          '&:hover': {
            borderColor: '#555',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <i className="tabler-edit"></i>
      </Button>

                <Button
                  onClick={() => handleOpenDeleteModal(item)}
                  sx={{
                    borderColor: '#888',
                    color: '#888',
                    '&:hover': {
                      backgroundColor: 'red',
                    },
                    marginLeft: 2,
                  }}
                >
                  <i className="tabler-trash"></i>
                  
                </Button>
                </td>
<td>
                {hoveredRow === item.id && ( // Only show radio button if this row is hovered
                  <label>
                    <input
                      type="radio"
                      name="turnoverCode"
                      value={item.turnoverCode}
                      checked={selectedTurnoverCode === item.turnoverCode}
                      onChange={() => setSelectedTurnoverCode(item.turnoverCode)} // Set the selected turnover code
                    />
                  </label>
                )}
             </td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedTurnoverCode}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      {/* New Turnover Modal */}
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
            maxWidth: '400px',
          }}
        >
          <h2>{isEditMode ? 'Edit Turnover Amount' : 'Add New Turnover Amount'}</h2>

          <div className="flex flex-col space-y-4" style={{ marginTop: 10 }}>
            <FormControl fullWidth>
            <TextField
  label="Turnover Code"
  variant="outlined"
  value={turnoverCode} // Value is bound to state
  onChange={(e) => setTurnoverCode(e.target.value)} // OnChange handler to update state
/>
            </FormControl>


            <div className="flex" style={{ paddingLeft: 50 }}>
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
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
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
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={handleCloseDeleteModal}>

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
            maxWidth: '400px',
          }}
        >

<Box sx={{
  display: 'flex',       // Use flexbox layout
  justifyContent: 'center', // Horizontally center the icon
  alignItems: 'center',   // Vertically center the icon
  height: '100%',         // Make sure the Box takes up full height
}}>
  <i 
    className="tabler-exclamation-circle" 
    style={{
      fontSize: '100px',   // Increase the icon size
      color: 'red',        // Set the icon color to red
    }}
  ></i>
</Box>


<Box sx={{ padding: 2, textAlign: 'center', color: 'gray', fontFamily: 'Arial, sans-serif' }}>
  <h2>Are you sure?</h2>
  <h5>
    Do you really want to delete this data? This process can't be undone.
  </h5>
</Box>




<div className="flex" style={{ paddingLeft: 50, marginTop:10 }}>
  <Button
    
    onClick={handleDeleteTurnover}
    sx={{
      padding:2,
      paddingLeft:7,
      paddingRight:7,
      marginRight: 4,
      backgroundColor: '#e53935',  
              color:'#f5f5f5',
      '&:hover': {
        borderColor: 'darkred',  // Darker red border color on hover
        backgroundColor: '#ffcccc', // Light red background on hover
        color: 'darkred',         // Darker red text color on hover
      },
    }}
  >
   Delete
  </Button>

  <Button
    
    onClick={handleCloseDeleteModal}
    sx={{
      padding:2,
      paddingLeft:7,
      paddingRight:7,
      marginRight: 4,
      backgroundColor: '#757575',  
              color:'#f5f5f5',
      '&:hover': {
        borderColor: 'darkred',  // Darker red border color on hover
        backgroundColor: '#ffcccc', // Light red background on hover
        color: 'darkred',         // Darker red text color on hover
      },
    }}
  >
   Cancel
  </Button>
</div>

        </Box>
      </Modal>

          </FormControl>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          
          

        
        </div>

        <div>
        <label htmlFor='designation' className='block text-sm font-medium text-gray-700'>
              Designation
            </label>
          {designations.map((designation, index) => (
  <div
    key={index}
    style={{
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '16px',
      marginTop: 10,
      alignItems: 'center',
      width: '100%',
    }}
  >
    <div style={{ width: '300px' }}>
      <Autocomplete
        options={['Manager', 'Lead', 'Member', 'Assistant', 'Director']}
        value={designation.designationName}
        onChange={(e, value) => {
          const newDesignations = [...designations];
          
          // Check if the designation is already selected in any other row
          const isDuplicate = newDesignations.some((item, idx) => item.designationName === value && idx !== index);

          if (isDuplicate) {
            // If duplicate, show error message
            newDesignations[index].designationName = value || '';
            setDesignations([...newDesignations]);
            setError('This designation is already selected. Please choose a different one.');
          } else {
            // If no duplicate, update the designation
            newDesignations[index].designationName = value || '';
            setError('');
            setDesignations(newDesignations);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Designation ${index + 1}`}
            error={bucketFormik.touched.designations && Boolean(bucketFormik.errors.designations) || Boolean(error)}
            helperText={bucketFormik.touched.designations && bucketFormik.errors.designations ? bucketFormik.errors.designations : error || ''}
            style={{ width: '100%' }}
          />
        )}
      />
    </div>

    <div style={{ width: '150px', marginLeft: '10px' }}>
      <TextField
        label="Role Count"
        type="number"
        value={designation.roleCount === '' ? '' : designation.roleCount}
        onChange={(e) => handleTextFieldChange(e, index)}
        onBlur={(e) => {
          if (e.target.value === '') {
            const newDesignations = [...designations];
            newDesignations[index].roleCount = 1;
            setDesignations(newDesignations);
            setRoleCount('');
            setWarning('');
            setError('');
          }
        }}
        error={bucketFormik.touched.designations && !!bucketFormik.errors.designations}
        helperText={error || warning}
        fullWidth
      />
    </div>

    {designations.length > 1 && index > 0 && (
      <IconButton
        color="secondary"
        onClick={() => setDesignations(designations.filter((_, i) => i !== index))}
      >
        <RemoveIcon />
      </IconButton>
    )}

    {index === designations.length - 1 && (
      <IconButton
        color="primary"
        onClick={() => setDesignations([...designations, { designationName: '', roleCount: 1 }])}
      >
        <AddIcon />
      </IconButton>
    )}
  </div>
))}

        </div>

        <FormControl fullWidth margin='normal'>
          <label htmlFor='note' className='block text-sm font-medium text-gray-700'>
            Note
          </label>
          <TextField
            id='note'
            name='note'
            multiline
            rows={4}
            value={bucketFormik.values.note}
            onChange={bucketFormik.handleChange}
            onFocus={() => bucketFormik.setFieldTouched('note', true)}
            error={bucketFormik.touched.note && Boolean(bucketFormik.errors.note)}
            helperText={bucketFormik.touched.note && bucketFormik.errors.note ? bucketFormik.errors.note : undefined}
          />
        </FormControl>
      </fieldset>

      {/* Submit and Cancel Buttons */}
      <div className='flex justify-end space-x-4'>
        <DynamicButton
          type='button'
          variant='contained'
          className='bg-blue-500 text-white hover:bg-blue-700'
          onClick={handleCancel}
        >
          Cancel
        </DynamicButton>

        <DynamicButton type='submit' variant='contained' className='bg-blue-500 text-white hover:bg-blue-700'>
          Save
        </DynamicButton>
      </div>

      
    </form>
  )
}

export default AddOrEditBucket




