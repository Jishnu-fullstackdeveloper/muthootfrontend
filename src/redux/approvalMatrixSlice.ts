import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AxiosLib from '@/lib/AxiosLib'; // Ensure AxiosLib is configured correctly

// Define SectionConfig interface
interface SectionConfig {
  approverDesignationId: string;
  approvalSequenceLevel: number;
}

// Define ApprovalMatrixState interface
interface ApprovalMatrixState {
  approvalMatrixData: any[]; // Store the list of approval matrices
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For tracking API calls
  error: string | null; // For error handling
  totalItems: number; // Total number of approval matrices (for pagination)
}

// Initial state
const initialState: ApprovalMatrixState = {
  approvalMatrixData: [],
  status: 'idle',
  error: null,
  totalItems: 0,
};

// Async thunk for fetching all approval matrices with pagination
export const fetchApprovalMatrices = createAsyncThunk(
  'apphrms/fetchApprovalMatrices',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get('approval-system/approval-action', {
        params: { page, limit }, // Pass pagination parameters
      });
      const { result, meta } = response.data; // Destructure result and meta
      return {
        data: result, // Approval matrix data
        totalItems: meta.total, // Total items for pagination
        page: meta.page,
        limit: meta.limit,
        totalPages: meta.totalPages,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch approval matrices'
      );
    }
  }
);

// Create approval matrix (new)
export const createNewApprovalMatrix = createAsyncThunk(
  'apphrms/createNewApprovalMatrix',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('approval-system/approval-action', params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateApprovalMatrix = createAsyncThunk<
  any, // Return type for the async thunk
  { uuid: string; approvalMatrix: any } // Input type for the parameters
>(
  'apphrms/updateApprovalMatrix',
  async (params, { rejectWithValue }) => {
    try {
      const { uuid, approvalMatrix } = params;
      const requestData = {
        approvalMatrix: approvalMatrix, // Include the approvalMatrix in the request body
      };

      // Double-check the URL path for accuracy
      const response = await AxiosLib.put(
        `appproval-system/approval-action/${uuid}`, // Ensure the URL matches the backend routing
        requestData
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('API Error Response:', error.response);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error('No response from server:', error.request);
        return rejectWithValue({ message: 'No response from server. Please try again later.' });
      } else {
        console.error('Unexpected error:', error);
        return rejectWithValue({ message: 'Unexpected error occurred.' });
      }
    }
  }
);



// Async thunk for deleting an approval matrix
export const deleteApprovalMatrix = createAsyncThunk(
  'apphrms/deleteApprovalMatrix',
  async (uuid: string, { rejectWithValue }) => {
    try {
      // Call the API endpoint for deletion
      await AxiosLib.delete(`approval-system/approval-action/${uuid}`);
      return uuid; // Return the deleted uuid for success
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete approval matrix'
      );
    }
  }
);

// Slice definition
const approvalMatrixSlice = createSlice({
  name: 'approvalMatrix',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchApprovalMatrices with pagination
    builder
      .addCase(fetchApprovalMatrices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchApprovalMatrices.fulfilled,
        (state, action: PayloadAction<{ data: any[]; totalItems: number }>) => {
          state.status = 'succeeded';
          state.approvalMatrixData = action.payload.data;
          state.totalItems = action.payload.totalItems; // Update the total items count
        }
      )
      .addCase(
        fetchApprovalMatrices.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = 'failed';
          state.error = action.payload || 'Something went wrong';
        }
      );

    // Handle createNewApprovalMatrix
    builder
      .addCase(createNewApprovalMatrix.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewApprovalMatrix.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.approvalMatrixData.push(action.payload);
      })
      .addCase(createNewApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Handle updateApprovalMatrix
    builder
      .addCase(updateApprovalMatrix.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApprovalMatrix.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        const index = state.approvalMatrixData.findIndex(
          (matrix) => matrix.uuid === action.payload.uuid
        );
        if (index !== -1) {
          state.approvalMatrixData[index] = action.payload; // Update the specific approval matrix
        }
      })
      .addCase(updateApprovalMatrix.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Handle deleteApprovalMatrix
    builder
      .addCase(deleteApprovalMatrix.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        deleteApprovalMatrix.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.approvalMatrixData = state.approvalMatrixData.filter(
            (matrix) => matrix.uuid !== action.payload
          );
        }
      )
      .addCase(
        deleteApprovalMatrix.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = 'failed';
          state.error = action.payload || 'Failed to delete approval matrix';
        }
      );
  },
});

export default approvalMatrixSlice.reducer;
