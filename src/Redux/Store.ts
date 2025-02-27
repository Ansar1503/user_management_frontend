import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/AuthSlice";
import adminReducer from './Admin/admin.slice'
import todoreducer from './TodoSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin:adminReducer,
    todo:todoreducer
  },
});


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store