import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';  
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'
import { endLogin, loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from "axios";
import { Navigate } from "react-router-dom";


const LoginPage = React.lazy(()=> import('./loginPage.jsx'))
const MainPage = React.lazy(()=> import('./mainPage.jsx'))
const Directories = React.lazy(()=>import('./directories.jsx'))

export const mainAddress = 'http://127.0.0.1:8000'


function App() {
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)
    const location = useLocation()
    const [isAuthChecking, setIsAuthChecking] = React.useState(true)

    const ProtectedRoute = ({requiredRole, children})=>{
        if (isAuthChecking) {
            return <div></div>;
        }
        if (role!==requiredRole){
            return <Navigate to="/forbidden" replace />;
        }
        return children
    }
    const updateAccessToken = async()=>{
        try{
            const response = await axios.post(`${mainAddress}/api/token/refresh`,{},{withCredentials:true})
            const data= response.data
            dispatch(loginSuccess({username: data.username, role:data.role}))
        }catch(error){
            dispatch(logoutSuccess())
            return false
        }
    }
    const checkAuthStatus = async ()=>{
        setIsAuthChecking(true);
        if (localStorage.getItem('IWasHere')==null){
            dispatch(logoutSuccess())
            setIsAuthChecking(false);
            return false
        }
        try{
            const response = await axios.post(`${mainAddress}/api/token/whoami`, {}, {withCredentials:true})
            const data = response.data
            dispatch(loginSuccess({username: data.username, role:data.role}))
        } catch (error){
            if (error.status===401){
                await updateAccessToken()
            } else{
                dispatch(logoutSuccess())
            }
        }finally
        {
            setIsAuthChecking(false);
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
                    <Route path='/directories' element={<ProtectedRoute requiredRole='Менеджер'><Directories/></ProtectedRoute>}/>
                    <Route path='/forbidden' element={<div className='e404'><p>403... Недостаточно прав</p></div>}/>
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;