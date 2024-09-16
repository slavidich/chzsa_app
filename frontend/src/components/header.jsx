import React from "react";
import '../styles/header.scss'
import Logored from '../img/logored.svg' 
import Telegram from '../img/tg.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";



function Header(){
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)
    const isAuthInProgress = useSelector(state => state.auth.isAuthInProgress)
    const username = useSelector(state => state.auth.username)
    const navigate = useNavigate()
    const role = useSelector(state=>state.auth.role)

    const handleLogout = () =>{
        dispatch(logoutSuccess())
        navigate('/')
    }
    return (
    <div className={isAuth?"header":"header-low header "}>
        <div className="main">
            <div className="logo">
                <Link to='/'><Logored/></Link>
            </div>
            <div className="contacts">
                <p>Электронная сервисная книжка "Мой силант"</p>
                <div className="telegram">
                    <p>+7(8352)20-12-09</p>
                    <Telegram></Telegram>
                </div>
                
            </div>
            <div className="user">
                {isAuthInProgress?
                    <>

                    </>
                :
                    <>
                        {isAuth?
                            <>

                                <p>{username}</p>
                                <p onClick={handleLogout}>Выйти</p>
                            </>
                            :
                            <>
                                <Link to='/login'>Войти</Link>
                            </>}
                    </>}
            </div>

        </div>
        {isAuth?
            <div className="buttons">
                {role==='Менеджер'?<Link to='/directories'>Справочники</Link>:<></>}
                <Link to='/cars'>Машины</Link>
                <Link to='/to'>ТО</Link>
                <Link to='/complaint'>Рекламации</Link>
            </div>
        :
            <></>
        }
    </div>
    )
}

export default Header