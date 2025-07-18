import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import TurnOverModal from '../TurnOverModal'

const mockHandleCloseTurnoverModal = jest.fn()
const mockHandleRadioChange = jest.fn()
const mockSubmitSelectedTurnoverCode = jest.fn()

const turnoverListData = [
  { turnoverID: 1, turnoverCode: 'T001' },
  { turnoverID: 2, turnoverCode: 'T002' }
]

describe('TurnOverModal Component', () => {
  test('renders modal when showTurnOverModal is true', () => {
    render(
      <TurnOverModal
        showTurnOverModal={true}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={null}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    expect(screen.getByText('Turnover Code')).toBeInTheDocument()
  })

  test('does not render modal when showTurnOverModal is false', () => {
    render(
      <TurnOverModal
        showTurnOverModal={false}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={null}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    expect(screen.queryByText('Turnover Code')).not.toBeInTheDocument()
  })

  test('calls handleCloseTurnoverModal when close button is clicked', () => {
    render(
      <TurnOverModal
        showTurnOverModal={true}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={null}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    const closeButton = screen.getByRole('button', { name: /close/i })

    fireEvent.click(closeButton)
    expect(mockHandleCloseTurnoverModal).toHaveBeenCalledTimes(1)
  })

  test('calls handleRadioChange when a radio button is selected', () => {
    render(
      <TurnOverModal
        showTurnOverModal={true}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={null}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    const radioButtons = screen.getAllByRole('radio')

    fireEvent.click(radioButtons[0])
    expect(mockHandleRadioChange).toHaveBeenCalledWith('T001')
  })

  test('submit button is disabled when no turnover code is selected', () => {
    render(
      <TurnOverModal
        showTurnOverModal={true}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={null}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  test('calls submitselectedTurnoverCode when submit button is clicked', () => {
    render(
      <TurnOverModal
        showTurnOverModal={true}
        handleCloseTurnoverModal={mockHandleCloseTurnoverModal}
        turnoverListData={turnoverListData}
        selectedTurnoverCode={'T001'}
        handleRadioChange={mockHandleRadioChange}
        submitselectedTurnoverCode={mockSubmitSelectedTurnoverCode}
      />
    )
    const submitButton = screen.getByRole('button', { name: /submit/i })

    expect(submitButton).not.toBeDisabled()
    fireEvent.click(submitButton)
    expect(mockSubmitSelectedTurnoverCode).toHaveBeenCalledTimes(1)
  })
})
