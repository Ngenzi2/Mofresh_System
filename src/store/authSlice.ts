import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean; // ADDED: Required for PrivateRoute
  otpEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false, // ADDED: Required for PrivateRoute
  otpEmail: null,
};

const dummyApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await dummyApiDelay();
      if (email && password) {
        return {
          user: { email, name: 'John Doe' },
          token: 'dummy-token-' + Date.now(),
        };
      }
      throw new Error('Invalid credentials');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      fullName,
      phone,
      email,
      password,
    }: { fullName: string; phone: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await dummyApiDelay();
      // Simulate successful registration - return email for OTP
      if (email && password && fullName && phone) {
        return { email };
      }
      throw new Error('Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp }: { otp: string }, { rejectWithValue }) => {
    try {
      await dummyApiDelay();
      // Simulate OTP verification
      if (otp.length === 6) {
        return {
          user: { email: 'user@example.com', name: 'John Doe' },
          token: 'dummy-token-' + Date.now(),
        };
      }
      throw new Error('Invalid OTP');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; // ADDED
    },
    setOtpEmail: (state, action: PayloadAction<string>) => {
      state.otpEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ADDED
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpEmail = action.payload.email;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ADDED
        state.otpEmail = null;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, setOtpEmail } = authSlice.actions;
export default authSlice.reducer;