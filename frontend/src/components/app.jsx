import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';  
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'

import { checkAuthStatus, refreshTokenIfNeeded } from './authUtils';
import { Navigate } from "react-router-dom";


const LoginPage = React.lazy(()=> import('./loginPage.jsx'))
const MainPage = React.lazy(()=> import('./mainPage.jsx'))
const Directories = React.lazy(()=>import('./directories.jsx'))
const Cars = React.lazy(()=>import('./cars.jsx'))
const Users = React.lazy(()=>import('./users.jsx'))

export const mainAddress = 'http://127.0.0.1:8000'
export const accessLifeTime = 10*1000*60


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

    useEffect(()=>{
        checkAuthStatus(dispatch, setIsAuthChecking)
    }, [dispatch])
    
    return (
    <>
        <Header/>
        <main>
            <Suspense>
                <Routes>
                    <Route path="*" element={<div className='e404'><p>404... not found</p></div>} />
                    <Route path="/" element={<MainPage/>}></Route>
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path='/directories' element={<ProtectedRoute requiredRole='Менеджер'><Directories/></ProtectedRoute>}/>
                    <Route path='/forbidden' element={<div className='e404'><p>403... Недостаточно прав</p></div>}/>
                    <Route path="/cars" element={<Cars/>} />
                    <Route path="/users" element={<ProtectedRoute requiredRole='Менеджер'><Users/></ProtectedRoute>}/>
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;