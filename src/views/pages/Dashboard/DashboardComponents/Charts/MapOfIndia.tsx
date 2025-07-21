'use client'
import React from 'react'

import { Box, Typography, Card, CardContent } from '@mui/material'

const IndiaSalesMap: React.FC = () => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: '20px auto',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backgroundColor: '#f8f9ff'
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Typography
          variant='h5'
          component='h2'
          sx={{
            marginBottom: 3,
            fontWeight: 600,
            color: '#333',
            textAlign: 'left'
          }}
        >
          Sales map by States
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <svg width='400' height='480' viewBox='0 0 400 480' style={{ maxWidth: '100%', height: 'auto' }}>
            {/* India Map SVG Paths */}

            {/* Jammu & Kashmir */}
            <path
              d='M120 40 L160 35 L170 50 L165 65 L155 70 L140 75 L125 70 L115 55 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Himachal Pradesh */}
            <path
              d='M140 75 L155 70 L165 65 L175 75 L170 85 L160 90 L145 85 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Punjab */}
            <path
              d='M125 70 L140 75 L145 85 L135 95 L125 90 L120 80 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Haryana */}
            <path
              d='M135 95 L145 85 L160 90 L165 100 L155 110 L140 105 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Delhi */}
            <path d='M155 110 L165 100 L170 105 L165 115 L155 120 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Uttar Pradesh */}
            <path
              d='M140 105 L155 110 L165 115 L190 120 L210 125 L220 140 L215 155 L200 160 L180 155 L160 150 L145 145 L135 130 Z'
              fill='#d50000'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Rajasthan */}
            <path
              d='M80 120 L135 130 L145 145 L140 160 L130 175 L120 190 L100 195 L80 185 L70 170 L75 150 L80 135 Z'
              fill='#1976d2'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Madhya Pradesh */}
            <path
              d='M140 160 L200 160 L215 155 L230 165 L240 180 L235 195 L225 210 L210 220 L190 215 L170 210 L150 205 L130 195 L130 175 Z'
              fill='#1976d2'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Gujarat */}
            <path
              d='M80 195 L100 195 L120 190 L130 195 L130 220 L125 235 L115 250 L100 255 L85 250 L70 240 L65 225 L70 210 Z'
              fill='#9c27b0'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Maharashtra */}
            <path
              d='M130 220 L190 215 L210 220 L225 210 L240 225 L235 240 L225 255 L210 260 L190 255 L170 250 L150 245 L135 240 L125 235 Z'
              fill='#ff9800'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Goa */}
            <path d='M125 255 L135 250 L140 260 L135 270 L125 265 Z' fill='#ff9800' stroke='#1976d2' strokeWidth='1' />

            {/* Karnataka */}
            <path
              d='M135 270 L190 255 L210 260 L220 275 L215 290 L200 305 L180 310 L160 305 L145 300 L130 285 Z'
              fill='#4caf50'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Kerala */}
            <path
              d='M130 315 L145 300 L160 305 L165 320 L160 335 L155 350 L145 365 L135 360 L130 345 L125 330 Z'
              fill='#4caf50'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Tamil Nadu */}
            <path
              d='M160 305 L200 305 L215 290 L230 300 L240 315 L235 330 L225 345 L210 355 L190 360 L170 355 L155 350 L160 335 L165 320 Z'
              fill='#ff9800'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Andhra Pradesh */}
            <path
              d='M210 220 L240 225 L255 235 L270 250 L265 265 L250 280 L230 275 L215 270 L210 260 L225 255 L235 240 Z'
              fill='#ff9800'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Telangana */}
            <path
              d='M225 255 L240 225 L255 235 L250 250 L235 255 L225 250 Z'
              fill='#ff9800'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Odisha */}
            <path
              d='M240 180 L270 185 L285 195 L290 210 L285 225 L270 235 L255 235 L245 225 L240 210 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Chhattisgarh */}
            <path
              d='M225 210 L240 180 L255 185 L270 195 L275 210 L270 225 L255 220 L240 215 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Jharkhand */}
            <path
              d='M240 140 L270 145 L285 155 L280 170 L270 185 L255 180 L245 170 L240 155 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Bihar */}
            <path
              d='M220 125 L240 140 L255 135 L270 145 L275 130 L270 115 L255 120 L240 125 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* West Bengal */}
            <path
              d='M270 115 L295 120 L310 135 L315 150 L310 165 L295 175 L280 170 L270 155 L275 140 L275 130 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Sikkim */}
            <path d='M295 100 L305 95 L310 105 L305 115 L295 110 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Assam */}
            <path
              d='M315 120 L350 115 L365 125 L370 140 L365 155 L350 160 L335 155 L320 150 L315 135 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Meghalaya */}
            <path d='M325 155 L345 150 L350 160 L345 170 L330 165 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Tripura */}
            <path d='M340 170 L350 165 L355 175 L350 185 L340 180 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Mizoram */}
            <path d='M335 185 L345 180 L350 190 L345 200 L335 195 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Manipur */}
            <path d='M350 160 L365 155 L370 165 L365 175 L350 170 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Nagaland */}
            <path d='M360 140 L375 135 L380 145 L375 155 L360 150 Z' fill='#e8f4fd' stroke='#1976d2' strokeWidth='1' />

            {/* Arunachal Pradesh */}
            <path
              d='M320 80 L365 75 L380 85 L385 100 L380 115 L365 120 L350 115 L335 110 L320 105 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />

            {/* Uttarakhand */}
            <path
              d='M170 85 L190 80 L205 90 L210 105 L200 115 L185 110 L175 100 Z'
              fill='#e8f4fd'
              stroke='#1976d2'
              strokeWidth='1'
            />
          </svg>
        </Box>
      </CardContent>
    </Card>
  )
}

export default IndiaSalesMap
