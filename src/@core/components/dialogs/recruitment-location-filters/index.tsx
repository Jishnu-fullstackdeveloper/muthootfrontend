import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'

type AreaFilterDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedLocationFilters: Record<string, any>
  onApplyFilters: (selectedFilters: Record<string, any>) => void
  options: Record<string, any>
  handleLocationFilterChange: (filterKey: string) => (value: any) => void
}

const AreaFilterDialog = ({
  open,
  setOpen,
  selectedLocationFilters,
  onApplyFilters,
  options,
  handleLocationFilterChange
}: AreaFilterDialogProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  const handleApplyFilters = () => {
    onApplyFilters(selectedLocationFilters)
    setOpen(false)
  }

  return (
    <Dialog
      maxWidth='md'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          padding: '24px',
          borderRadius: '8px'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h6' fontWeight='bold'>
          Filter by Area
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Group 1 */}
          <Grid item xs={12}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Territory Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Territory'
              options={options.territory}
              onOptionSelect={handleLocationFilterChange('territory')}
              value={selectedLocationFilters.territory}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Zone'
              options={options.zone}
              onOptionSelect={handleLocationFilterChange('zone')}
              value={selectedLocationFilters.zone}
              sx={{ width: '100%' }}
            />
          </Grid>

          {/* Group 2 */}
          <Grid item xs={12}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Regional Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Region'
              options={options.region}
              onOptionSelect={handleLocationFilterChange('region')}
              value={selectedLocationFilters.region}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Area'
              options={options.area}
              onOptionSelect={handleLocationFilterChange('area')}
              value={selectedLocationFilters.area}
              sx={{ width: '100%' }}
            />
          </Grid>

          {/* Group 3 */}
          <Grid item xs={12}>
            <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
              Cluster Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Cluster'
              options={options.cluster}
              onOptionSelect={handleLocationFilterChange('cluster')}
              value={selectedLocationFilters.cluster}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DynamicAutocomplete
              label='Branch'
              options={options.branch}
              onOptionSelect={handleLocationFilterChange('branch')}
              value={selectedLocationFilters.branch}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={handleClose} variant='outlined' color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleApplyFilters} color='primary' variant='contained'>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AreaFilterDialog
