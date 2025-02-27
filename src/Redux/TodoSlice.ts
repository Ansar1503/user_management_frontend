import { createSlice } from "@reduxjs/toolkit";

const TodSlice = createSlice({
    initialState:[],
    name:'todo',
    reducers:{
        setTodo:(state,action)=>{
            state.push(action.payload)
        }
    }
})

export const {setTodo} = TodSlice.actions
export default TodSlice.reducer