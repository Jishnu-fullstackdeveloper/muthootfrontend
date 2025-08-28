import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import React from 'react'

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
      icon: JSX.Element
    }

    switch (title) {
      case 'Active Templates':
        baseStyles = {
          primaryColor: '#00B798',
          secondaryColor: '#008D75',
          title: 'active',
          icon: (
            <>
              <rect width='40' height='40' rx='8' fill='white' />
              <path
                d='M18.4223 23.9776C18.2 23.9776 17.9889 23.8887 17.8334 23.7331L14.6889 20.5887C14.3667 20.2664 14.3667 19.7331 14.6889 19.4109C15.0112 19.0887 15.5445 19.0887 15.8667 19.4109L18.4223 21.9665L24.1334 16.2553C24.4556 15.9331 24.9889 15.9331 25.3112 16.2553C25.6334 16.5776 25.6334 17.1109 25.3112 17.4331L19.0112 23.7331C18.8556 23.8887 18.6445 23.9776 18.4223 23.9776Z'
                fill='#00B798'
              />
            </>
          )
        }
        return baseStyles
      case 'Deactivated Templates':
        baseStyles = {
          primaryColor: '#FF6C6C',
          secondaryColor: '#DA2424',
          title: 'deactivated',
          icon: (
            <>
              <rect width='40' height='40' rx='8' fill='white' />
              <path
                d='M20.625 11.6665C20.625 11.3213 20.3452 11.0415 20 11.0415C19.6548 11.0415 19.375 11.3213 19.375 11.6665V14.9998C19.375 15.345 19.6548 15.6248 20 15.6248C20.3452 15.6248 20.625 15.345 20.625 14.9998V11.6665Z'
                fill='#E66D6F'
              />
              <path
                d='M17.3266 13.6638C17.6445 13.5295 17.7934 13.1628 17.6591 12.8449C17.5247 12.5269 17.1581 12.378 16.8401 12.5124C13.9236 13.7446 11.875 16.6323 11.875 19.9998C11.875 24.4872 15.5127 28.1248 20 28.1248C24.4873 28.1248 28.125 24.4872 28.125 19.9998C28.125 16.6323 26.0764 13.7446 23.1599 12.5124C22.842 12.378 22.4753 12.5269 22.3409 12.8449C22.2066 13.1628 22.3555 13.5295 22.6734 13.6638C25.1435 14.7074 26.875 17.1522 26.875 19.9998C26.875 23.7968 23.797 26.8748 20 26.8748C16.203 26.8748 13.125 23.7968 13.125 19.9998C13.125 17.1522 14.8565 14.7074 17.3266 13.6638Z'
                fill='#E66D6F'
              />
            </>
          )
        }
        return baseStyles
      case 'Pending Reviews':
        baseStyles = {
          primaryColor: '#ED960B',
          secondaryColor: '#D08101',
          title: 'pending',
          icon: (
            <>
              <rect width='40' height='40' rx='8' fill='white' />
              <g clipPath='url(#clip0_1519_2675)'>
                <path
                  d='M19.9993 11.6665V14.9998M19.9993 24.9998V28.3332M14.9993 19.9998H11.666M28.3327 19.9998H24.9993M25.898 25.8985L23.541 23.5415M25.898 14.1665L23.541 16.5235M14.1007 25.8985L16.4577 23.5415M14.1007 14.1665L16.4577 16.5235'
                  stroke='#ED960B'
                  strokeWidth='1.66667'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </g>
              <defs>
                <clipPath id='clip0_1519_2675'>
                  <rect width='20' height='20' fill='white' transform='translate(10 10)' />
                </clipPath>
              </defs>
            </>
          )
        }
        return baseStyles
      case 'New Templates Added':
        baseStyles = {
          primaryColor: '#1976D2',
          secondaryColor: '#135BA1',
          title: 'new',
          icon: (
            <>
              <rect width='40' height='40' rx='8' fill='white' />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M16.0523 12.7154C16.1526 11.7744 16.9491 11.0415 17.9167 11.0415H22.0833C23.0509 11.0415 23.8474 11.7744 23.9477 12.7154C24.5836 12.7284 25.1335 12.7613 25.603 12.8475C26.2347 12.9635 26.7723 13.1846 27.2097 13.622C27.7113 14.1236 27.9271 14.7552 28.0279 15.5053C28.125 16.2277 28.125 17.1463 28.125 18.286V23.3774C28.125 24.5171 28.125 25.4357 28.0279 26.1582C27.9271 26.9083 27.7113 27.5398 27.2097 28.0414C26.7081 28.543 26.0765 28.7588 25.3265 28.8596C24.604 28.9568 23.6854 28.9567 22.5457 28.9567H17.4543C16.3146 28.9567 15.396 28.9568 14.6735 28.8596C13.9235 28.7588 13.2919 28.543 12.7903 28.0414C12.2887 27.5398 12.073 26.9083 11.9721 26.1582C11.875 25.4357 11.875 24.5171 11.875 23.3775V18.286C11.875 17.1463 11.875 16.2277 11.9721 15.5053C12.073 14.7552 12.2887 14.1236 12.7903 13.622C13.2277 13.1846 13.7653 12.9635 14.397 12.8475C14.8665 12.7613 15.4164 12.7284 16.0523 12.7154ZM16.054 13.9658C15.4556 13.9786 14.9944 14.0087 14.6228 14.0769C14.1504 14.1637 13.8771 14.303 13.6742 14.5059C13.4435 14.7365 13.2932 15.0603 13.211 15.6718C13.1263 16.3013 13.125 17.1355 13.125 18.3317V23.3317C13.125 24.5279 13.1263 25.3622 13.211 25.9916C13.2932 26.6031 13.4435 26.9269 13.6742 27.1575C13.9048 27.3882 14.2286 27.5386 14.8401 27.6208C15.4696 27.7054 16.3038 27.7067 17.5 27.7067H22.5C23.6962 27.7067 24.5304 27.7054 25.1599 27.6208C25.7714 27.5386 26.0952 27.3882 26.3258 27.1575C26.5565 26.9269 26.7068 26.6031 26.789 25.9916C26.8737 25.3622 26.875 24.5279 26.875 23.3317V18.3317C26.875 17.1355 26.8737 16.3013 26.789 15.6718C26.7068 15.0603 26.5565 14.7365 26.3258 14.5059C26.1229 14.303 25.8496 14.1637 25.3772 14.0769C25.0056 14.0087 24.5444 13.9786 23.946 13.9658C23.8389 14.8996 23.0458 15.6248 22.0833 15.6248H17.9167C16.9542 15.6248 16.1611 14.8996 16.054 13.9658ZM17.9167 12.2915C17.5715 12.2915 17.2917 12.5713 17.2917 12.9165V13.7498C17.2917 14.095 17.5715 14.3748 17.9167 14.3748H22.0833C22.4285 14.3748 22.7083 14.095 22.7083 13.7498V12.9165C22.7083 12.5713 22.4285 12.2915 22.0833 12.2915H17.9167ZM22.9569 18.7401C23.1924 18.9924 23.1788 19.3879 22.9264 19.6234L19.355 22.9567C19.1149 23.1809 18.7423 23.1809 18.5021 22.9567L17.0736 21.6234C16.8212 21.3879 16.8076 20.9924 17.0431 20.7401C17.2786 20.4877 17.6741 20.4741 17.9264 20.7096L18.9286 21.6449L22.0736 18.7096C22.3259 18.4741 22.7214 18.4877 22.9569 18.7401Z'
                fill='#0096DA'
              />
            </>
          )
        }
        return baseStyles
      default:
        baseStyles = {
          primaryColor: '#34D399',
          secondaryColor: '#059669',
          title: 'default',
          icon: (
            <>
              <rect width='40' height='40' rx='8' fill='white' />
              <path
                d='M19.9993 11.6665V14.9998M19.9993 24.9998V28.3332M14.9993 19.9998H11.666M28.3327 19.9998H24.9993M25.898 25.8985L23.541 23.5415M25.898 14.1665L23.541 16.5235M14.1007 25.8985L16.4577 23.5415M14.1007 14.1665L16.4577 16.5235'
                stroke='white'
                strokeWidth='1.66667'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </>
          )
        }
        return baseStyles
    }
  }

  const { primaryColor, secondaryColor, icon } = getCardStyles()

  return (
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
        </SvgIcon>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 21,
          width: 40,
          height: 40
        }}
      >
        <SvgIcon
          sx={{
            width: 40,
            height: 40
          }}
          viewBox='0 0 40 40'
        >
          {icon}
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
  )
}

export default DashboardCard
