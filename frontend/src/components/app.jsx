import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';  
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";

const LoginPage = React.lazy(()=> import('./loginPage.jsx'))

const checkAuthStatus = async ()=>{
    console.log('Проверка куки')
}

function App() {
    const dispatch = useDispatch();
    const location = useLocation()
    useEffect(()=>{
        checkAuthStatus()
    }, [location.path])
    return (
    <>

        <Header/>
        <main>
            <Suspense>
                <Routes>
                    <Route path="/login" element={<LoginPage/>} />
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;