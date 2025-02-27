import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";
import axios from "axios";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: any, thunkApi) => {
    try {
      const response = await axiosInstance.post("/updateProfile", userData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Sign-in failed"
          );
        } else if (error.request) {
          return thunkApi.rejectWithValue(
            "Network error: Unable to connect to the server"
          );
        } else {
          return thunkApi.rejectWithValue(
            error.message || "An unexpected error occurred"
          );
        }
      } else {
        return thunkApi.rejectWithValue("An unknown error occurred");
      }
    }
  }
);


