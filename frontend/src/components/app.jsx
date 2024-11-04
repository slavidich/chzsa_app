import React, {useEffect, Suspense} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route} from "react-router-dom"
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'

import { checkAuthStatus } from './authUtils';
import { Navigate } from "react-router-dom";

const LoginPage = React.lazy(()=> import('./loginPage.jsx'))
const MainPage = React.lazy(()=> import('./mainPage.jsx'))

const Directories = React.lazy(()=>import('./directories/directories.jsx'))
const AddDirectory = React.lazy(()=>import('./directories/AddDirectory.jsx'))
const CheckDirectory = React.lazy(()=>import('./directories/CheckDirectory.jsx'))

const Users = React.lazy(()=>import('./users/users.jsx'))
const AddUser = React.lazy(()=>import('./users/AddUser.jsx'))
const CheckUser = React.lazy(()=>import('./users/CheckUser.jsx'))

const Cars = React.lazy(()=>import('./cars/cars.jsx'))
const AddCar = React.lazy(()=>import('./cars/addCar.jsx'))

const Services = React.lazy(()=>import('./services/services.jsx'))
const AddService = React.lazy(()=>import('./services/AddService.jsx'))
const CheckService = React.lazy(()=>import('./services/CheckService.jsx'))

const AllTo = React.lazy(()=>import('./to/AllTo.jsx'))
const AddTo = React.lazy(()=>import('./to/AddTo.jsx'))

const Complaints = React.lazy(()=> import('./complaint/Complaints.jsx'))
const AddComplaint = React.lazy(()=> import('./complaint/AddComplaint.jsx'))

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
                    <Route path="/services" element={<ProtectedRoute requiredRole='Менеджер'><Services/></ProtectedRoute>}/>
                    <Route path="/services/new" element={<ProtectedRoute requiredRole='Менеджер'><AddService/></ProtectedRoute>}/>
                    <Route path="/services/:id" element={<ProtectedRoute requiredRole='Менеджер'><CheckService/></ProtectedRoute>}/>
                    <Route path="/cars" element={<Cars/>} />
                    <Route path="/cars/new" element={<ProtectedRoute requiredRole='Менеджер'><AddCar/></ProtectedRoute>} />
                    <Route path="/cars/:id" element={<AddCar check={true}/>} />

                    <Route path="/to" element={<AllTo/>}/>
                    <Route path="/to/new" element={<AddTo/>}/>
                    <Route path="/to/:id" element={<AddTo check={true}/>} />

                    <Route path='/complaint' element={<Complaints/>}/>
                    <Route path='/complaint/new' element={<AddComplaint/>}/>
                    <Route path="/complaint/:id" element={<AddComplaint check={true}/>} />

                    <Route path='/forbidden' element={<div className='e404'><p>403... Недостаточно прав</p></div>}/>
                    
                    
                    
                </Routes>
            </Suspense>
        </main>
        <Footer/>
    </>
    );
}

export default App;