'use client'

import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import {
  Box,
  Tooltip,
  IconButton,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Divider
} from '@mui/material'
import { TextFieldProps } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import { useRouter } from 'next/navigation'


const BucketListing = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false) // State to handle modal visibility
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null) // Store the bucket ID to delete
  const [openViewModal, setOpenViewModal] = useState(false) // State for viewing bucket details
  const [selectedBucket, setSelectedBucket] = useState<any>(null)
  const router = useRouter()

  const buckets = [
    {
      id: 1,
      name: 'Bucket 1',
      designation: [
        { designationName: 'Branch Manager', count: 3 },
        { designationName: 'HR Manager', count: 2 }
      ],
      turnover_limit: 2,
      turnover_id: 1122,
      note: 'This bucket is intended to cover roles related to the administrative and human resources sectors. It has a relatively low turnover limit due to the specialized nature of these positions.'
    },
    {
      id: 2,
      name: 'Bucket 2',
      designation: [
        { designationName: 'Marketing Lead', count: 5 },
        { designationName: 'Sales Manager', count: 4 },
      ],
      turnover_limit: 3,
      turnover_id: 1133,
      note: 'This bucket is focused on roles that drive growth and revenue generation for the organization. Marketing and sales are critical to the company’s success, requiring a higher turnover capacity to adapt to changing market dynamics. The Marketing Lead and Sales Manager positions in this bucket are vital for executing campaigns, improving customer acquisition strategies, and expanding the brand’s reach. As these roles require both creativity and leadership skills, they often face higher turnover, and the organization needs to ensure timely replacements to keep up with business objectives.'
    },
    {
      id: 3,
      name: 'Bucket 3',
      designation: [
        { designationName: 'Tech Lead', count: 7 },
        { designationName: 'Software Engineer', count: 8 },
      ],
      turnover_limit: 5,
      turnover_id: 1144,
      note: 'This bucket caters to the technical teams of the organization, including software engineers and tech leads. These positions are crucial for the development, maintenance, and innovation of the company’s products and services. Due to the fast-paced and highly competitive nature of the tech industry, turnover in these roles tends to be higher, making it essential to have a higher turnover limit for quick replacements. The roles in this bucket require technical expertise and are key in driving the company’s technological advancements, which is why they are critical for the organization’s long-term success.'
    }
  ]
  

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const handleAddClick = () => {
    router.push('/bucket-management/add/new-bucket')
  }

  const handleEdit = (id: number) => {
    router.push(`/bucket-management/edit/${id}`)
  }

  const handleDeleteClick = (id: number) => {
    setSelectedBucketId(id)
    setOpenModal(true) // Open the modal when delete is clicked
  }

  const handleDeleteConfirm = () => {
    if (selectedBucketId) {
      console.log(`Deleting bucket with ID: ${selectedBucketId}`)
      // Perform your actual delete operation here, e.g., API call to delete the bucket
    }
    setOpenModal(false) // Close the modal after confirmation
    setSelectedBucketId(null) // Reset the selected bucket ID
  }

  

  const handleDeleteCancel = () => {
    setOpenModal(false) // Close the modal without deleting
    setSelectedBucketId(null) // Reset the selected bucket ID
  }
 

  const handleViewModal = () => {
    setOpenViewModal(false) // Close the modal after confirmation
    setSelectedBucket(null) // Reset the selected bucket
  }


  return (
    <div>
      {/* Card 1 - Search and Add Button */}
      <Box
        sx={{
          padding: 3,
          marginBottom: 3,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: '#333',
              letterSpacing: 1
            }}
          >
            Bucket List
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Tooltip title='Click here for help'>
              <IconButton size='small'>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              label='Search Designation'
              value={search}
              onChange={(value: any) => setSearch(value)}
              placeholder='Search by List...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='New Bucket'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={handleAddClick}
              children='New Bucket'
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Box>

      {/* Card 2 - List View */}
      <CardActions>
        {viewMode === 'list' ? (
       <Box sx={{ marginTop: 2, width: '100%' }}>
       {buckets
         .filter(bucket => bucket.name.toLowerCase().includes(search.toLowerCase()))
         .map(bucket => (
           <Box
             key={bucket.id}
             sx={{
               marginBottom: 2,
               paddingLeft: 10,
               paddingRight:10,
               paddingTop: 5,
               paddingBottom: 5,
               backgroundColor: 'white',
               borderRadius: 2,
               border: '1px solid #ddd',
               width: '100%',
               display: 'flex',
               justifyContent: 'space-between', // Space between the left and right sections
             }}
           >
             <Box sx={{ flex: 1 }}> {/* Left side content */}
               <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                 {bucket.name}
               </Typography>
               <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                 Turnover Limit: {bucket.turnover_limit}
               </Typography>
               <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                 Designations:
                 <ul>
                   {bucket.designation.map((designation, index) => (
                     <li key={index}>
                       {designation.designationName}: {designation.count}
                     </li>
                   ))}
                 </ul>
               </Typography>
             </Box>
     
             <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> {/* Right side buttons */}
               <Button variant='outlined' onClick={() => handleEdit(bucket.id)} sx={{ marginBottom: 1 }}>
                 <i className='tabler-edit' />
               </Button>
               <Button variant='outlined' color='error' onClick={() => handleDeleteClick(bucket.id)}>
                 <i className='tabler-trash' />
               </Button>
             </Box>
           </Box>
         ))}
     </Box>
     
       
        
        ) : (
          <Grid container spacing={3}>
          {buckets
            .filter((buc: any) => buc.name.toLowerCase().includes(search.toLowerCase()))
            .map((bucket: any) => (
              <Grid item xs={12} sm={6} md={4} key={bucket.id}>
                <Card
                  sx={{
                   
                   
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    position: 'relative', // For positioning buttons at the top-right corner
                  }}
                  className="transition transform hover:-translate-y-1"
                  onClick={() => {
                    setSelectedBucket(bucket) // Set the selected bucket
                    setOpenViewModal(true) // Open the modal
                  }}
                >
                
                
        
                  <CardContent>
                  <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    paddingBottom:'20px',
    borderBottom: '1px solid #ddd', // Bottom border line
  }}
>
  {/* Bucket Name on the Left */}
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      backgroundColor: '#e0f7fa', // Light blue background
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '1.2rem',
      whiteSpace: 'nowrap', // Prevent text from wrapping
      overflow: 'hidden',
      textOverflow: 'ellipsis', // Add ellipsis when text overflows
      maxWidth: 'calc(100% - 100px)', // Adjust width to prevent overflow with buttons on the right
    }}
  >
    {bucket.name}
  </Typography>

  {/* Edit and Delete Buttons on the Right */}
  <Box sx={{ display: 'flex', gap: 1 }}>
    {/* Edit Button */}
    <Button
      variant="outlined"
      onClick={(e: any) => {
        e.stopPropagation();
        handleEdit(bucket.id);
      }}
      sx={{
        minWidth: 'auto',
        padding: 1,
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <i className="tabler-edit" style={{ color: '#808080', fontSize: '24px' }} />
    </Button>

    {/* Delete Button */}
    <Button
      variant="outlined"
      color="error"
      onClick={(e: any) => {
        e.stopPropagation();
        handleDeleteClick(bucket.id);
      }}
      sx={{
        minWidth: 'auto',
        padding: 1,
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <i className="tabler-trash" style={{ color: '#808080', fontSize: '24px' }} />
    </Button>
    <Dialog fullWidth maxWidth="sm">
  <DialogTitle>Bucket Details</DialogTitle>
  <DialogContent>
    {/* Display bucket details here */}
    <Typography variant="h6">Bucket Name: {bucket?.name}</Typography>
    <Typography variant="body1">Turnover Amount: {bucket?.turnover_limit}</Typography>
    <Typography variant="body1">Designations:</Typography>
    <ul>
      {bucket?.designation?.map((designation: any, index: number) => (
        <li key={index}>
          {designation.designationName}: {designation.count}
        </li>
      ))}
    </ul>
  </DialogContent>
</Dialog>

  </Box>
</Box>

  
  <Typography 
  variant="body2" 
  sx={{ 
    paddingTop:3,
    color: 'text.secondary', 
    fontSize: '1rem' // You can adjust the font size here as well if needed
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' , fontSize: '1.1rem' }}>
    Turnover Amount  : 
  </Typography>
  {bucket.turnover_limit}
</Typography>


  <div>
    <Typography 
      variant="body2" 
      sx={{ 
        color: 'text.secondary', 
        fontSize: '1.1rem', 
        fontWeight: 'bold',// Increased font size for better readability
      }}
    >
      Designations:
    </Typography>
    
    {/* Light gray background for the <ul> section */}
    <ul
  style={{
    backgroundColor: '#f9f9f9', // Light gray background
    padding: '20px 40px',
    borderRadius: '4px',
    marginTop: '8px',
    listStyleType: 'disc', 
    paddingLeft: '30px', 
  }}
>
  {bucket.designation.map((designation: any, index: number) => (
    <li key={index}>
      {designation.designationName}: {designation.count}
    </li>
  ))}
</ul>

  </div>
</CardContent>


                </Card>
              </Grid>
            ))}
        </Grid>
        

        )}
      </CardActions>

      {/* Delete Confirmation Modal */}
      <Modal open={openModal} onClose={handleDeleteCancel}>
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
        <DialogActions>
          <Button onClick={handleDeleteCancel}  sx={{
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
    }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm}  sx={{
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
    }}>
            Confirm
          </Button>
        </DialogActions>
     </Box>
      </Modal>

      <Dialog open={openViewModal} onClose={handleViewModal} fullWidth maxWidth="sm">
        
      <div>
  <DialogTitle sx={{ textAlign: 'center', color: '#01579b', fontSize: '25px', position: 'relative' }}>
    Bucket Details
    <Button 
      onClick={handleViewModal} 
      sx={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        color: 'gray' 
      }}
    >
      <i className="tabler-x"></i>
    </Button>
  </DialogTitle>
  <DialogActions>
    {/* Other actions */}
  </DialogActions>
</div>


    <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
    <DialogContent
      sx={{
       
        marginLeft:5,
        padding: '25px', // Add padding to the content
      }}
    >
    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold', paddingBottom: 3, fontSize: '1.1rem' }}>
  Bucket Name : <span style={{ color: '#0277bd' }}>{selectedBucket?.name}</span>
</Typography>



<Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' ,  paddingBottom: 3, fontSize: '1.1rem'}}>
        Turnover Amount :<span style={{ color: '#0277bd' }}> {selectedBucket?.turnover_limit}</span>
      </Typography>
      <Typography variant="body1" sx={{ color: '#000', fontWeight: 'bold' ,  paddingBottom: 3, fontSize: '1.1rem'}}>
        Designations:
      </Typography>

      {/* Designation List with Background and Padding */}
      <ul
        style={{
          width:'70%',
          marginLeft:30,
          backgroundColor: '#eceff1', // Light green background for the ul section
          padding: 30, // Add padding inside the list
          borderRadius: '4px', // Add border radius for rounded corners
          listStyleType: 'disc', // Disc style for list items
          marginTop: '8px', // Spacing between the text and list
        }}
      >
        {selectedBucket?.designation?.map((designation: any, index: number) => (
          <li key={index} style={{ marginBottom: '8px', color: '#37474f' }}> {/* Black color for text */}
            {designation.designationName}: {designation.count}
          </li>
        ))}
      </ul>


    </DialogContent>
    <Typography 
  
  sx={{ 
    color: '#424242', 
    margin:3,
    paddingBottom: 3,
    marginBottom:10,   
    fontSize: '1 px', 
    backgroundColor: '#f0f0f0', // Background color
    fontStyle: 'italic', // Italic text
    padding: '15px', // Add padding for better readability
    borderRadius: '4px' // Optional: Add border radius for rounded corners
  }}
>
  <span style={{ color: '#424242' }}>{selectedBucket?.note}</span>
</Typography>
   
  
</Dialog>


    </div>
  )
}

export default BucketListing

