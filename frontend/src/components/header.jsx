import React, {useState, useEffect} from "react";
import '../styles/header.scss'
import Logored from '../img/logored.svg' 
import Telegram from '../img/tg.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from "react-router-dom";
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {  useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DirectorySVG from '../img/directory.svg'
import ClientSVG from '../img/client.svg';
import ServiceSVG from '../img/service.svg'
import CarSVG from '../img/cars.svg'
import ToSVG from '../img/to1.svg'
import ComplaintSVG from '../img/complaint.svg'
import MenuSVG from '../img/menu.svg'
import {logout} from './authUtils'

function Header(){
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)
    const isAuthInProgress = useSelector(state => state.auth.isAuthInProgress)
    const username = useSelector(state => state.auth.username)
    const navigate = useNavigate()
    const location = useLocation()
    const role = useSelector(state=>state.auth.role)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('740'));
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeLink, setActiveLink] = useState('');
    const[animation, setAnimation] = useState(false)
    
    const handleLogout =async() =>{
        await logout(dispatch)
        navigate('/')
    }
    useEffect(()=>{
        setActiveLink(location.pathname)
    }, [location])

    useEffect(()=>{
        setAnimation(isMenuOpen)
    },[isMenuOpen])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
    <div className={isAuth?"header":"header-low header "}>
        <div className="main">
            <div className="logo">
                <Link to='/'><Logored/></Link>
            </div>
            <div className="contacts">
                <p className='book'>Электронная сервисная книжка "Мой силант"</p>
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
                                <p>{role}</p>
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
            (<div className="buttons">
                
                {isMobile?
                    <div className="center menu-button" onClick={toggleMenu}>
                        <MenuSVG className='menusvg'/>
                        {isMenuOpen &&
                            <>
                                <div className="overlay" onClick={toggleMenu}></div>
                                <div className={`mobile-menu ${animation ? 'open' : ''}`}>
                                    {role==='Менеджер'?<>
                                        <Link className={activeLink==='/directories'?'active':undefined} to='/directories'>Справочники<DirectorySVG className='svgdir'/></Link>
                                        <Link className={activeLink==='/users'?'active':undefined} to='/users'>Клиенты<ClientSVG className='svgclient'/></Link>
                                        <Link className={activeLink==='/services'?'active':undefined} to='/services'>Сервисы<ServiceSVG className='svgdir'/></Link>
                                        </>:<></>}
                                    <Link className={activeLink==='/cars'?'active':undefined} to='/cars?sortField=shipping_date'>Машины<CarSVG className='svgcar'/></Link>
                                    <Link className={activeLink==='/to'?'active':undefined} to='/to?sortField=maintenance_date'>ТО<ToSVG className='svgto'/></Link>
                                    <Link className={activeLink==='/complaint'?'active':undefined} to='/complaint?sortField=date_refuse'>Рекламации<ComplaintSVG className='svgcom'/></Link>
                                </div>
                            </>}
                    </div>
                :<>
                    <div className='left'></div>
                    <div className='center'>{role==='Менеджер'?<>
                        <Link className={activeLink==='/directories'?'active':undefined} to='/directories'>Справочники<DirectorySVG className='svgdir'/></Link>
                        <Link className={activeLink==='/users'?'active':undefined} to='/users'>Клиенты<ClientSVG className='svgclient'/></Link>
                        <Link className={activeLink==='/services'?'active':undefined} to='/services'>Сервисы<ServiceSVG className='svgdir'/></Link>
                        </>:<></>}
                    <Link className={activeLink==='/cars'?'active':undefined} to='/cars?sortField=shipping_date'>Машины<CarSVG className='svgcar'/></Link>
                    <Link className={activeLink==='/to'?'active':undefined} to='/to?sortField=maintenance_date'>ТО<ToSVG className='svgto'/></Link>
                    <Link className={activeLink==='/complaint'?'active':undefined} to='/complaint?sortField=date_refuse'>Рекламации<ComplaintSVG className='svgcom'/></Link></div>
                    <div className='right'></div>
                </>    
                }
                
            </div>)
        :
            <></>
        }
    </div>
    )
}

export default Header