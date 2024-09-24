import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState: {
        isAuth: false,
        isAuthInProgress: true,
        username: null,
        role:null
    },
    reducers:{
        loginSuccess: (state, action)=>{
            state.isAuth = true;
            state.isAuthInProgress = false;
            state.username = action.payload.username;
            state.role = action.payload.role;
        },
        logoutSuccess: (state)=>{
            state.isAuth = false;
            state.isAuthInProgress = false;
            state.username = null;
            state.role = null; 
        },
        endLogin: (state)=>{
            state.isAuthInProgress = false
        },
        setRole: (state, action) => {  
            state.role = action.payload;  
        },
    }
})

export const {loginSuccess, logoutSuccess, endLogin, setRole } = authSlice.actions
export default authSlice.reducer