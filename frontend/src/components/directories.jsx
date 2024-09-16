import React from "react";
import '../styles/directories.scss'
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from 'axios';
import { Navigate } from "react-router-dom";
import {mainAddress} from './app.jsx'

function Directories(){
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [directories, setDirectories] = React.useState([])
    const getDirectroies = async()=>{
        try{
            const response = await axios.get(`${mainAddress}/api/directorytypes`, {withCredentials: true})
        }
        catch (error){
            if (error.response.status===403){
                setError(403)
            }
        }
        setLoading(false)
    }
    React.useEffect(()=>{
        getDirectroies()
    }, [])
    if (loading){
        return (<div className='e404'>Загрузка</div>)
    }
    if (error===403){
        return <Navigate to='/forbidden' replace />
    }
    return(
    <>
        <p>Справочники!</p>
    </>)
}
export default Directories