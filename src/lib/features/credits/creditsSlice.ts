import { getCreditBalance } from "@/app/api/creditsApi/creditsApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


interface CreditsState {
  balance: number;
  loading: boolean;
  error: string | null;
}

const initialState: CreditsState = {
  balance: 0,
  loading: false,
  error: null,
};

export const fetchCreditBalance = createAsyncThunk(
  "credits/fetchBalance",
  async (jwtToken: string, { rejectWithValue }) => {
    try {
      const response = await getCreditBalance(jwtToken);
      return response.balance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch balance");
    }
  }
);

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
    },
    resetCredits(state) {
      state.balance = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreditBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCreditBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBalance, resetCredits } = creditsSlice.actions;
export default creditsSlice.reducer;



// use this to call the api, it will directly update the state as well
// useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) dispatch(fetchCreditBalance(token));
//   }, []);