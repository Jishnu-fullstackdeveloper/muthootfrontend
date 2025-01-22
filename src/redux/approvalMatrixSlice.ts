import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosLib from '@/lib/AxiosLib';

// Define types for approval matrix
interface ApprovalMatrix {
  id: number;
  name: string;
  status: string;
}

interface ApprovalMatrixState {
  approvalMatrixData: ApprovalMatrix[];
  approvalMatrixLoading: boolean;
  approvalMatrixSuccess: string | boolean;
  approvalMatrixFailure: boolean;
  approvalMatrixFailureMessage: string;
}

const initialState: ApprovalMatrixState = {
  approvalMatrixData: [],
  approvalMatrixLoading: false,
  approvalMatrixSuccess: false,
  approvalMatrixFailure: false,
  approvalMatrixFailureMessage: '',
};

// Utility for error handling
const getErrorMessage = (error: any): string =>
  error?.response?.data?.message || 'An error occurred';

// Thunks
export const fetchApprovalMatrix = createAsyncThunk(
  'approvalMatrix/fetchApprovalMatrix',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/approval-matrix', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createNewApprovalMatrix = createAsyncThunk(
  'approvalMatrix/createNewApprovalMatrix',
  async (approvalData: Partial<ApprovalMatrix>, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/approval-matrix', approvalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateApprovalMatrix = createAsyncThunk(
  'approvalMatrix/updateApprovalMatrix',
  async (
    { id, approvalData }: { id: number; approvalData: Partial<ApprovalMatrix> },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.patch(`/approval-matrix/${id}`, approvalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteApprovalMatrix = createAsyncThunk(
  'approvalMatrix/deleteApprovalMatrix',
  async (id: number, { rejectWithValue }) => {
    try {
      await AxiosLib.delete(`/approval-matrix/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const approvalMatrixSlice = createSlice({
  name: 'approvalMatrix',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch approval matrix
    builder.addCase(fetchApprovalMatrix.pending, (state) => {
      state.approvalMatrixLoading = true;
    });
    builder.addCase(fetchApprovalMatrix.fulfilled, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixData = action.payload;
    });
    builder.addCase(fetchApprovalMatrix.rejected, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixFailure = true;
      state.approvalMatrixFailureMessage = action.payload as string;
    });

    // Create approval matrix
    builder.addCase(createNewApprovalMatrix.pending, (state) => {
      state.approvalMatrixLoading = true;
    });
    builder.addCase(createNewApprovalMatrix.fulfilled, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixData.push(action.payload);
      state.approvalMatrixSuccess = 'Approval added successfully';
    });
    builder.addCase(createNewApprovalMatrix.rejected, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixFailure = true;
      state.approvalMatrixFailureMessage = action.payload as string;
    });

    // Update approval matrix
    builder.addCase(updateApprovalMatrix.pending, (state) => {
      state.approvalMatrixLoading = true;
    });
    builder.addCase(updateApprovalMatrix.fulfilled, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixData = state.approvalMatrixData.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      state.approvalMatrixSuccess = 'Approval updated successfully';
    });
    builder.addCase(updateApprovalMatrix.rejected, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixFailure = true;
      state.approvalMatrixFailureMessage = action.payload as string;
    });

    // Delete approval matrix
    builder.addCase(deleteApprovalMatrix.pending, (state) => {
      state.approvalMatrixLoading = true;
    });
    builder.addCase(deleteApprovalMatrix.fulfilled, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixData = state.approvalMatrixData.filter(
        (item) => item.id !== action.payload
      );
    });
    builder.addCase(deleteApprovalMatrix.rejected, (state, action) => {
      state.approvalMatrixLoading = false;
      state.approvalMatrixFailure = true;
      state.approvalMatrixFailureMessage = action.payload as string;
    });
  },
});

export default approvalMatrixSlice.reducer;
