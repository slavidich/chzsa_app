import React from "react";
import '../styles/loginPage.scss'
import Logored from '../img/logored.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";

function LoginPage (){
    return(
    <>
        <div className="loginpage">
            <p>Страница авторизации</p>
        </div>
    </>)
}

export default LoginPage