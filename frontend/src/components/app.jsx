import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';  
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'
import { endLogin, loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from "axios";

const LoginPage = React.lazy(()=> import('./loginPage.jsx'))
const MainPage = React.lazy(()=> import('./mainPage.jsx'))
export const mainAddress = 'http://127.0.0.1:8000'


function App() {
    const dispatch = useDispatch();
    const location = useLocation()

    const updateAccessToken = async()=>{
        try{
            const response = await axios.post(`${mainAddress}/api/token/refresh`,{},{withCredentials:true})
            const data= response.data
            dispatch(loginSuccess(data.username))
        }catch(error){
            dispatch(logoutSuccess())
            return false
        }
    }
    const checkAuthStatus = async ()=>{
        try{
            const response = await axios.post(`${mainAddress}/api/token/whoami`, {}, {withCredentials:true})
            const data = response.data
            dispatch(loginSuccess(data.username))
        } catch (error){
            if (error.status===401){
                updateAccessToken()
            } else{
                dispatch(logoutSuccess())
            }
        }
        return true
    }

    useEffect(()=>{
        checkAuthStatus()
    }, [])
    return (
    <>
        <Header/>
        <main>
            <Suspense>
                <Routes>
                    <Route path="/" element={<MainPage/>}></Route>
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="*" element={<div className='e404'><p>404... not found</p></div>} />
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;