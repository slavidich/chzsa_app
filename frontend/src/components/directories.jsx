import React from "react";
import '../styles/directories.scss'
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from 'axios';
import { Navigate } from "react-router-dom";
import {mainAddress} from './app.jsx'

const directorieslist = [
    ['TECHNIQUE_MODEL', 'Модель техники'],
    ['ENGINE_MODEL', 'Модель двигателя'],
    ['TRANSMISSION_MODEL', 'Модель трансмиссии'],
    ['DRIVEN_AXLE_MODEL', 'Модель ведущего моста'],
    ['STEERED_AXLE_MODEL', 'Модель управляемого моста'],
    ['MAINTENANCE_TYPE', 'Вид ТО'],
    ['FAILURE_NODE', 'Узел отказа'],
    ['RECOVERY_METHOD', 'Способ восстановления'],
]

function Directories(){
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [directories, setDirectories] = React.useState([])
    const [activeType, setActiveType] = React.useState(directorieslist[0][0]); // Установим первый тип активным

    const getDirectroies = async(type)=>{
        setLoading(true);
        try{
            const response = await axios.get(`${mainAddress}/api/directories?entity_name=${type}`, {withCredentials: true})
            setDirectories(response.data);
        }
        catch (error){
            if (error.response && error.response.status===403){
                return <Navigate to="/forbidden" replace />;
            }
        }
        setLoading(false)
    }
    React.useEffect(()=>{
        getDirectroies(activeType)
    }, [activeType])

    if (loading){
        return (<div className='e404'>Загрузка</div>)
    }

    return(
    <>
        <div className='directories'></div>
        <p>Справочники!</p>
    </>)
}
export default Directories