import React from "react";
import '../styles/header.scss'
import Logored from '../img/logored.svg' 
import Telegram from '../img/tg.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";


function Header(){
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)

    return (
    <div className="header">
        <div className="main">
            <div className="logo">
                <Link to='/'><Logored /></Link>
            </div>
            
            
            <div className="contacts">
                <div className="telegram">
                    <p>+7(8352)20-12-09</p>
                    <Telegram></Telegram>
                </div>
                <p>Электронная сервисная книжка "Мой силант"</p>
            </div>
            <div className="user">
                {isAuth?
                    <>
                        <p>Здравствуйте, user</p>
                    </>
                    :
                    <>
                        <Link to='/login'>Войти</Link>
                    </>}
            </div>
        </div>
    </div>
    )
}

export default Header