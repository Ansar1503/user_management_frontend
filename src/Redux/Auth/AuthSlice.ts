import { createSlice } from "@reduxjs/toolkit";
import { userData } from "../../types/interfaces";
import { updateProfile } from "./Auth.thunk";

interface AuthState {
  user: userData | null;
  isLoading: boolean;
  error: boolean;
}

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
};

const clearLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

const initialState: AuthState = {
  user: getFromLocalStorage("auth"),
  isLoading: false,
  error: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      saveToLocalStorage("auth", action.payload);
    },
    signOut: (state) => {
      state.user = null;
      clearLocalStorage("auth");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = false;
      state.error = false;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.error = true;
    });
  },
});

export const { setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
