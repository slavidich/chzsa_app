import React, {useEffect, useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import { Button, CircularProgress  } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import { useParams } from 'react-router-dom';
import {EditableField, catchErrors, validateEmail} from "../muiUtil.jsx";
// ДОДЕЛАТЬ import '../../styles/'

function CheckService(){
    const navigate = useNavigate()
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch()
    const role = useSelector(state=>state.auth.role)
    const [formLoading, setFormLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:'',
        username:'',
    })
    const [fetchedData, setFetchedData] = useState({})
    const [formErrors, setFormErrors] = useState({
        name:false,
        user_first_name:false,
        user_last_name:false,
        user_email:false,
    })
    const getData= async()=>{
        setFormLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response=await axios.get(`${mainAddress}/api/services/${id}`,{withCredentials:true})
            setFormData({...response.data})
            setFetchedData({...response.data})
            setFormLoading(false)
        }catch(error){
            catchErrors(error, navigate)
        }
    }
    useEffect(()=>{
        getData()
    },[])
    const handleChange=(e)=>{
        const {name, value} = e.target
        setFormData({
            ...formData, 
            [name]:value
        })
        validateField(name, value)
    }
    const validateField = (name, value) => {
        let isValid = true;

        if (name === 'user_email') {
            isValid = validateEmail(value)
        } else{
            isValid = value.trim() !== ''
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    };
    const isValid = ()=>{
        const requireInputs = formData.user_first_name.trim() !== '' &&
            formData.user_last_name.trim() !== '' &&
            formData.name.trim()!==''&&
            validateEmail(formData.user_email)
        return requireInputs
    }
    return (
        <div className='checkService'>
    <WhiteBox headerText={`Сервисная организация ID:${id}`}>
        <EditableField
            name='username'
            isEditing={false}
            label="username"
            value={formData.username}
        />
        <EditableField
            name='name'
            isEditing={isEditing}
            label="Название"
            value={formData.name}
            error={formErrors.name}
            helperText='Заполните название'
            onChange={handleChange}
            disabled={formLoading}
            isReq={true}
        />
        <EditableField
            name='description'
            isEditing={isEditing}
            label="Описание"
            value={formData.description}
            onChange={handleChange}
            disabled={formLoading}
            isReq={false}
        />
        <EditableField
            name='user_first_name'
            isEditing={isEditing}
            label="Имя директора"
            value={formData.user_first_name}
            error={formErrors.user_first_name}
            helperText='Заполните имя директора'
            onChange={handleChange}
            disabled={formLoading}
            isReq={true}
        />
        <EditableField
            name='user_last_name'
            isEditing={isEditing}
            label="Фамилия директора"
            value={formData.user_last_name}
            error={formErrors.user_last_name}
            helperText='Заполните фамилию директора'
            onChange={handleChange}
            disabled={formLoading}
            isReq={true}
        />
        <EditableField
            name='user_email'
            isEditing={isEditing}
            label="Почта"
            value={formData.user_email}
            error={formErrors.user_email}
            helperText='Введите корректную почту'
            onChange={handleChange}
            disabled={formLoading}
            isReq={true}
        />
    </WhiteBox>
    </div>)
}

export default CheckService