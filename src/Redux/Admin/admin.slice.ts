import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  deleteUser,
  editUserDetails,
  fetchUserDetails,
  getUsersData,
} from "./admin.thunk";
import { userData } from "../../types/interfaces";

interface adminState {
  users: Partial<userData>[];
  isLoading: boolean;
  error: boolean;
  userDetails: Partial<userData>;
}

const initialState: adminState = {
  users: [],
  isLoading: false,
  error: false,
  userDetails: {},
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersData.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(getUsersData.fulfilled, (state, action) => {
      state.isLoading = true;
      state.users = action.payload;
      state.error = false;
    });
    builder.addCase(getUsersData.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
    builder.addCase(editUserDetails.pending, (state) => {
      state.error = false;
      state.isLoading = true;
    });
    builder.addCase(editUserDetails.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.error = false;
      state.isLoading = false;

      state.users = state.users?.map((user) =>
        user._id?.toString() === updatedUser?._id?.toString()
          ? updatedUser
          : user
      );
    });
    builder.addCase(editUserDetails.rejected, (state) => {
      state.error = true;
      state.isLoading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.error = false;
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      (state.error = true), (state.isLoading = false);
    });
    builder.addCase(createUser.pending, (state) => {
      state.error = false;
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state) => {
      state.error = true;
      state.isLoading = false;
    });
    builder.addCase(fetchUserDetails.pending, (state) => {
      state.error = false;
      state.isLoading = true;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.userDetails = action.payload;
    });
    builder.addCase(fetchUserDetails.rejected, (state) => {
      (state.isLoading = false), (state.error = true);
    });
  },
});

export default adminSlice.reducer;
