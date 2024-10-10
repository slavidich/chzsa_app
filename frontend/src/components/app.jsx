import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route} from "react-router-dom"
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'

import { checkAuthStatus } from './authUtils';
import { Navigate } from "react-router-dom";
import AddUser from "./users/AddUser";

const LoginPage = React.lazy(()=> import('./loginPage.jsx'))
const MainPage = React.lazy(()=> import('./mainPage.jsx'))

const Directories = React.lazy(()=>import('./directories/directories.jsx'))
const AddDirectory = React.lazy(()=>import('./directories/AddDirectory.jsx'))
const CheckDirectory = React.lazy(()=>import('./directories/CheckDirectory.jsx'))

const Users = React.lazy(()=>import('./users/users.jsx'))
const CheckUser = React.lazy(()=>import('./users/CheckUser.jsx'))
const Cars = React.lazy(()=>import('./cars/cars.jsx'))

const Services = React.lazy(()=>import('./services/services.jsx'))


export const mainAddress = 'http://127.0.0.1:8000'
export const accessLifeTime = 5*1000*60
export const pagination_page = 10
export const error404 = <div className='e404'><p>404... not found</p></div>

function App() {
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)
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
                    <Route path="*" element={error404} />
                    <Route path="/" element={<MainPage/>}></Route>
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path='/directories' element={<ProtectedRoute requiredRole='Менеджер'><Directories/></ProtectedRoute>}/>
                    <Route path='/directories/new' element={<ProtectedRoute requiredRole='Менеджер'><AddDirectory/></ProtectedRoute>}/>
                    <Route path='/directories/:id' element={<CheckDirectory></CheckDirectory>}/>
                    <Route path="/users" element={<ProtectedRoute requiredRole='Менеджер'><Users/></ProtectedRoute>}/>
                    <Route path="/users/:id" element={<ProtectedRoute requiredRole='Менеджер'><CheckUser/></ProtectedRoute>}/>
                    <Route path="/users/new" element={<ProtectedRoute requiredRole='Менеджер'><AddUser/></ProtectedRoute>}/>
                    <Route path='/forbidden' element={<div className='e404'><p>403... Недостаточно прав</p></div>}/>
                    <Route path="/cars" element={<Cars/>} />
                    
                    <Route path="/services" element={<ProtectedRoute requiredRole='Менеджер'><Services/></ProtectedRoute>}/>
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;