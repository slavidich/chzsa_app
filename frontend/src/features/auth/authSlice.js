import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState: {
        isAuth: false,
        user: null,
    },
    reducers:{
        loginSuccess: (state, action)=>{
            state.isAuth = true;
            state.user = action.payload;
        },
        logoutSuccess: (state)=>{
            state.isAuth = false;
            state.user = null;
        }
    }
})

export const {loginSuccess, logoutSuccess} = authSlice.actions
export default authSlice.reducer