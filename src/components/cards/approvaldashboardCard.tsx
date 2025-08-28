import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import React, { JSX } from 'react'

interface DashboardCardProps {
  title: string
  value: number | string
  description?: string
}

const DashboardCard = ({ title, value, description }: DashboardCardProps) => {
  const getCardStyles = () => {
    let baseStyles: {
      primaryColor: string
      secondaryColor: string
      title: string
      icon?: JSX.Element
    }

    switch (title) {
      case 'Pending Reviews':
        baseStyles = {
          primaryColor: '#00B798',
          secondaryColor: '#008D75',
          title: 'pending'
        }
        baseStyles.icon = (
          <path
            d='M9.99935 1.6665V4.99984M9.99935 14.9998V18.3332M4.99935 9.99984H1.66602M18.3327 9.99984H14.9993M15.898 15.8985L13.541 13.5415M15.898 4.16646L13.541 6.52348M4.10066 15.8985L6.45768 13.5415M4.10066 4.16646L6.45768 6.52348'
            stroke='#ED960B'
            strokeWidth='1.66667'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill={baseStyles.primaryColor}
          />
        )
        return baseStyles
      case 'Approved Last Week':
        baseStyles = {
          primaryColor: '#FF6C6C',
          secondaryColor: '#DA2424',
          title: 'approved'
        }
        baseStyles.icon = (
          <path
            d='M8.42227 13.9776C8.20004 13.9776 7.98893 13.8887 7.83338 13.7331L4.68893 10.5887C4.36671 10.2664 4.36671 9.73312 4.68893 9.41089C5.01115 9.08867 5.54449 9.08867 5.86671 9.41089L8.42227 11.9665L14.1334 6.25534C14.4556 5.93312 14.9889 5.93312 15.3112 6.25534C15.6334 6.57756 15.6334 7.11089 15.3112 7.43312L9.01115 13.7331C8.8556 13.8887 8.64449 13.9776 8.42227 13.9776Z'
            fill={baseStyles.primaryColor}
          />
        )
        return baseStyles
      case 'Rejected Last Week':
        baseStyles = {
          primaryColor: '#ED960B',
          secondaryColor: '#D08101',
          title: 'rejected'
        }
        baseStyles.icon = (
          <>
            <path
              d='M13.2951 14.2304L6.22407 7.15932C5.98248 6.91773 5.98248 6.51703 6.22407 6.27544C6.46567 6.03384 6.86636 6.03384 7.10796 6.27544L14.179 13.3465C14.4206 13.5881 14.4206 13.9888 14.179 14.2304C13.9374 14.472 13.5367 14.472 13.2951 14.2304Z'
              fill={baseStyles.primaryColor}
            />
            <path
              d='M5.82097 14.2304C5.57938 13.9888 5.57938 13.5881 5.82097 13.3465L12.892 6.27544C13.1336 6.03384 13.5343 6.03384 13.7759 6.27544C14.0175 6.51703 14.0175 6.91773 13.7759 7.15932L6.70486 14.2304C6.46326 14.472 6.06257 14.472 5.82097 14.2304Z'
              fill={baseStyles.primaryColor}
            />
          </>
        )
        return baseStyles
      case 'Total Processed':
        baseStyles = {
          primaryColor: '#0096DA',
          secondaryColor: '#006ED3',
          title: 'proceed'
        }
        baseStyles.icon = (
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M6.05232 2.71543C6.15264 1.77445 6.94906 1.0415 7.91667 1.0415H12.0833C13.0509 1.0415 13.8474 1.77445 13.9477 2.71543C14.5836 2.72838 15.1335 2.76127 15.603 2.84751C16.2347 2.96354 16.7723 3.18457 17.2097 3.62201C17.7113 4.12361 17.9271 4.75517 18.0279 5.50526C18.125 6.22774 18.125 7.14634 18.125 8.286V13.3774C18.125 14.5171 18.125 15.4357 18.0279 16.1582C17.9271 16.9083 17.7113 17.5398 17.2097 18.0414C16.7081 18.543 16.0765 18.7588 15.3265 18.8596C14.604 18.9568 13.6854 18.9567 12.5457 18.9567H7.45428C6.31462 18.9567 5.39601 18.9568 4.67354 18.8596C3.92345 18.7588 3.29189 18.543 2.79029 18.0414C2.2887 17.5398 2.07295 16.9083 1.9721 16.1582C1.87497 15.4357 1.87498 14.5171 1.875 13.3775V8.28599C1.87498 7.14634 1.87497 6.22774 1.9721 5.50526C2.07295 4.75517 2.2887 4.12361 2.79029 3.62201C3.22773 3.18457 3.7653 2.96354 4.39696 2.84751C4.86648 2.76127 5.41636 2.72838 6.05232 2.71543ZM6.05397 3.96578C5.45557 3.97856 4.99443 4.00868 4.62279 4.07694C4.15045 4.1637 3.87705 4.30302 3.67418 4.5059C3.44354 4.73653 3.29317 5.06034 3.21096 5.67182C3.12633 6.30128 3.125 7.13554 3.125 8.33172V13.3317C3.125 14.5279 3.12633 15.3622 3.21096 15.9916C3.29317 16.6031 3.44354 16.9269 3.67418 17.1575C3.90481 17.3882 4.22862 17.5386 4.8401 17.6208C5.46956 17.7054 6.30382 17.7067 7.5 17.7067H12.5C13.6962 17.7067 14.5304 17.7054 15.1599 17.6208C15.7714 17.5386 16.0952 17.3882 16.3258 17.1575C16.5565 16.9269 16.7068 16.6031 16.789 15.9916C16.8737 15.3622 16.875 14.5279 16.875 13.3317V8.33172C16.875 7.13554 16.8737 6.30128 16.789 5.67182C16.7068 5.06034 16.5565 4.73653 16.3258 4.5059C16.1229 4.30302 15.8496 4.1637 15.3772 4.07694C15.0056 4.00868 14.5444 3.97856 13.946 3.96578C13.8389 4.8996 13.0458 5.62484 12.0833 5.62484H7.91667C6.95416 5.62484 6.16105 4.8996 6.05397 3.96578ZM7.91667 2.2915C7.57149 2.2915 7.29167 2.57133 7.29167 2.9165V3.74984C7.29167 4.09502 7.57149 4.37484 7.91667 4.37484H12.0833C12.4285 4.37484 12.7083 4.09502 12.7083 3.74984V2.9165C12.7083 2.57133 12.4285 2.2915 12.0833 2.2915H7.91667ZM12.9569 8.74006C13.1924 8.9924 13.1788 9.38789 12.9264 9.62341L9.35502 12.9567C9.11489 13.1809 8.74225 13.1809 8.50212 12.9567L7.07355 11.6234C6.82121 11.3879 6.80757 10.9924 7.04309 10.7401C7.27861 10.4877 7.67411 10.4741 7.92645 10.7096L8.92857 11.6449L12.0736 8.7096C12.3259 8.47407 12.7214 8.48771 12.9569 8.74006Z'
            fill={baseStyles.primaryColor}
          />
        )
        return baseStyles
      default:
        baseStyles = {
          primaryColor: '#34D399',
          secondaryColor: '#059669',
          title: 'default'
        }
        baseStyles.icon = (
          <path
            d='M9.99935 1.6665V4.99984M9.99935 14.9998V18.3332M4.99935 9.99984H1.66602M18.3327 9.99984H14.9993M15.898 15.8985L13.541 13.5415M15.898 4.16646L13.541 6.52348M4.10066 15.8985L6.45768 13.5415M4.10066 4.16646L6.45768 6.52348'
            stroke='white'
            strokeWidth='1.66667'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        )
        return baseStyles
    }
  }

  const { primaryColor, secondaryColor, icon } = getCardStyles()

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: 155,
          borderRadius: '14px',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          background: primaryColor
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <SvgIcon
            sx={{
              width: '100%',
              height: '100%'
            }}
            viewBox='0 0 271 159'
          >
            {/* <path
            opacity='0.2'
            d='M20.6445 9.04294e-06C9.59898 0.00017677 0.644539 8.95443 0.644533 20L0.644535 56.4932C8.11452 60.6021 28.203 64.9743 58.6963 52.2617C90.1256 39.1588 97.755 10.2723 99 0L20.6445 9.04294e-06Z'
            fill={secondaryColor}
          />
          <path
            opacity='0.2'
            d='M270.545 138.933C270.545 149.978 261.591 158.933 250.545 158.933H105C111.569 136.633 139.01 92.0332 196.219 92.0332C253.427 92.0331 269.606 57.3434 270.545 39.999V138.933Z'
            fill={secondaryColor}
          /> */}
            <path
              opacity='0.2'
              d='M20.6445 9.04294e-06C9.59898 0.00017677 0.644539 8.95443 0.644533 20L0.644535 56.4932C8.11452 60.6021 28.203 64.9743 58.6963 52.2617C90.1256 39.1588 97.755 10.2723 99 0L20.6445 9.04294e-06Z'
              fill={secondaryColor}
            />
            <path
              opacity='0.2'
              d='M270.545 138.933C270.545 149.978 261.591 158.933 250.545 158.933H105C111.569 136.633 139.01 92.0332 196.219 92.0332C253.427 92.0331 269.606 57.3434 270.545 39.999V138.933Z'
              fill={secondaryColor}
            />
            <rect x='21' y='20' width='40' height='40' rx='8' fill='white' />
            <g transform='translate(31 30) scale(1)'>{icon}</g>
          </SvgIcon>
        </Box>
        <CardContent
          sx={{
            p: 0,
            position: 'relative',
            zIndex: 1,
            mt: 'auto'
          }}
        >
          <Typography variant='body2' color='white' fontWeight='600'>
            {title}
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default DashboardCard
