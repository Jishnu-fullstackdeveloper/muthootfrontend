import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter, useSearchParams } from 'next/navigation';
import ViewUserRole from '../ViewUserRole';
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

jest.mock('@/redux/UserRoles/userRoleSlice', () => ({
  fetchUserRole: jest.fn()
}));


const mockStore = configureStore([]);

describe('ViewUserRole Component', () => {
  let store;
  let pushMock;
  let searchParamsMock;

  beforeEach(() => {
    pushMock = jest.fn();
    searchParamsMock = new URLSearchParams({ id: '1', name: 'Admin', description: 'Administrator Role' });

    useRouter.mockReturnValue({ push: pushMock, back: jest.fn() });
    useSearchParams.mockReturnValue(searchParamsMock);

    store = mockStore({
      UserRoleReducer: {
        userRoleData: { data: [{ id: '1', name: 'Admin', description: 'Administrator Role', permissions: [{ name: 'user_read', description: 'Can read user data' }] }] },
        isUserRoleLoading: false
      }
    });
  });

  it('renders the component correctly', async () => {
    render(
      <Provider store={store}>
        <ViewUserRole />
      </Provider>
    );

    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Permissions:')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Administrator Role')).toBeInTheDocument();
  });

  it('displays permissions correctly', async () => {
    render(
      <Provider store={store}>
        <ViewUserRole />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('User Management')).toBeInTheDocument());
    expect(screen.getByText('✅')).toBeInTheDocument(); // Read permission for user
  });

  it('displays loading state', () => {
    store = mockStore({
      UserRoleReducer: {
        userRoleData: {},
        isUserRoleLoading: true
      }
    });

    render(
      <Provider store={store}>
        <ViewUserRole />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays no data message if role is not found', () => {
    store = mockStore({
      UserRoleReducer: {
        userRoleData: { data: [] },
        isUserRoleLoading: false
      }
    });

    render(
      <Provider store={store}>
        <ViewUserRole />
      </Provider>
    );

    expect(screen.getByText('No role data found for ID: 1')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', () => {
    render(
      <Provider store={store}>
        <ViewUserRole />
      </Provider>
    );

    screen.getByRole('button', { name: /edit/i }).click();
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('/user-role/edit/Admin'));
  });
});
