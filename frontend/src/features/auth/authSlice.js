import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState: {
        isAuth: false,
        isAuthInProgress: true,
        username: null,
    },
    reducers:{
        loginSuccess: (state, action)=>{
            state.isAuth = true;
            state.isAuthInProgress = false;
            state.username = action.payload;
        },
        logoutSuccess: (state)=>{
            state.isAuth = false;
            isAuthInProgress = false;
            state.username = null;
        },
        endLogin: (state)=>{
            state.isAuthInProgress = false
        }
    }
})

export const {loginSuccess, logoutSuccess, endLogin} = authSlice.actions
export default authSlice.reducer