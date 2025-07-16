'use client'

import React, { useMemo } from 'react'

import { Card, CardContent, Typography, Box, Chip, useTheme, IconButton, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

import OptionIcon from '@/icons/DashboardRecruitHr/OptionIcon'
import UpArrowIcon from '@/icons/DashboardRecruitHr/UpArrowIcon'
import DownArrowIcon from '@/icons/DashboardRecruitHr/DownArrowIcon'

//import ApplicantResourcesCard from './ApplicantResources'

interface StatCard {
  title: string
  count: string
  percentage: string
  trend: 'increase' | 'decrease'
  icon: React.ReactNode
  backgroundColor: string
  textColor?: string
}

const StatCardItem = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}))

const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}))

const StatCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}))

const StatCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.common.white
}))

const StatCardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StatCardValue = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: theme.palette.common.white
}))

const StatCardIcon = styled(Box)(({ theme }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.common.white
}))

const StatisticCards = () => {
  const theme = useTheme()

  const statCardsData = useMemo<StatCard[]>(
    () => [
      {
        title: 'Applications',
        count: '1,534',
        percentage: '4.22%',
        trend: 'increase',
        backgroundColor: '#00B798',
        icon: ''
      },
      {
        title: 'Shortlisted',
        count: '869',
        percentage: '3.15%',
        trend: 'increase',
        backgroundColor: '#ED960B',
        icon: ''
      },
      {
        title: 'Hired',
        count: '236',
        percentage: '2.45%',
        trend: 'decrease',
        backgroundColor: '#0096DA',
        icon: ''
      }
    ],
    []
  )

  return (
    <Grid container spacing={2}>
      {statCardsData.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StatCardItem sx={{ backgroundColor: card.backgroundColor, height: 120, p: 1.5 }}>
            <StatCardContent>
              <StatCardHeader>
                <StatCardTitle variant='body2'>{card.title}</StatCardTitle>
                <IconButton size='small' sx={{ color: 'white' }}>
                  <OptionIcon />
                </IconButton>
              </StatCardHeader>

              <StatCardFooter sx={{ mt: 6 }}>
                <StatCardValue variant='h4'>{card.count}</StatCardValue>
                <Chip
                  size='small'
                  label={card.percentage}
                  color={card.trend === 'increase' ? 'success' : 'error'}
                  sx={{
                    p: 1,
                    fontSize: '12px',
                    fontWeight: 400,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    flexDirection: 'row-reverse',
                    gap: '4px',
                    '& .MuiChip-label': {
                      paddingLeft: '4px',
                      paddingRight: '0px'
                    },
                    '& .MuiChip-icon': {
                      color: 'white',
                      marginLeft: '0px',
                      marginRight: '0px',
                      fontSize: '12px',
                      '& svg': {
                        fontSize: '12px'
                      }
                    }
                  }}
                  icon={card.trend === 'increase' ? <UpArrowIcon /> : <DownArrowIcon />}
                />
              </StatCardFooter>
            </StatCardContent>
          </StatCardItem>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatisticCards
