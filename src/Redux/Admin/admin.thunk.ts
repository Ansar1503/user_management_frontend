import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";
import axios from "axios";
import { userData } from "../../types/interfaces";

export const getUsersData = createAsyncThunk(
  "admin/getUsers",
  async (
    {
      role,
      status,
      sortBy,
      sortOrder,
      searchQuery,
      page,
      limit
    }: {
      role: string;
      status: string;
      sortBy: string;
      sortOrder: string;
      searchQuery: string;
      page?: number,
      limit?: number,
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.get(
        `/admin/getUsers?role=${role}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchQuery=${searchQuery}&page=${page}&limit=${limit}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Failed to fetch users"
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

export const editUserDetails = createAsyncThunk(
  "admin/editUserDetails",
  async (data: Partial<userData>, thunkApi) => {
    try {
      console.log("data entered editUserDetails", data);
      const response = await axiosInstance.patch(
        "/admin/upateUserDetails",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log("thunk response", response);
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Failed to update user"
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

export const fetchUserDetails = createAsyncThunk(
  "admin/getuserdetails",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.patch(
        "/admin/getUserDetails",
        { id: id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Failed to fetch user data"
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

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteUser/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Failed to fetch user data"
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

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (data: Partial<userData>, thunkApi) => {
    try {
      
      const response = await axiosInstance.post('/admin/createUser',data,{
        headers:{"Content-Type":"application/json"}
      });
      console.log(response)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(
            error.response.data?.message || "Failed to create user"
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
