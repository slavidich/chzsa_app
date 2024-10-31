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
import {EditableField, validateEmail} from "../muiUtil.jsx";

function CheckUser(){
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const role = useSelector(state=>state.auth.role)
    const [formLoading, setFormLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [fetchedData, setFetchedData] = useState({})
    const [formData, setFormData] = useState({
        id:'',
        username:'',
        first_name: '',
        last_name: '',
        email: ''
    })
    const [formErrors, setFormErrors] = useState({
        first_name: false,
        last_name: false,
        email: false
    })
    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
        validateField(name, value)
    }
    const validateField = (name, value)=>{
        let isValid = true;

        if (name === 'email') {
            isValid = validateEmail(value)
        } else{
            isValid = value.trim() !== ''
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const isValid = ()=>{
        const requireInputs = formData.first_name.trim() !== '' &&
            formData.last_name.trim() !== '' &&
            validateEmail(formData.email)
        return requireInputs
    }
    const getData= async()=>{
        setFormLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response=await axios.get(`${mainAddress}/api/users/${id}`,{withCredentials:true})
            setFormData({...response.data})
            setFetchedData({...response.data})
            setFormLoading(false)
            setIsEditing(false)
        }catch(error){
            if (error.response && error.response.status === 404) {
                navigate('/404')
            }
        }
    }
    useEffect(()=>{
        getData()
    }, [])
    const handleButton =async (e)=>{
        e.preventDefault()
        if (isEditing){
            try{
                await refreshTokenIfNeeded(dispatch)
                setFormLoading(true)
                const response = await axios.put(`${mainAddress}/api/users`, {...formData}, {withCredentials:true})
                setFormLoading(false)
                setIsEditing(false)
            }catch(error){
                alert(error);
                setFormLoading(false)
            }
        } else{
            setIsEditing(true)
        }
    }
    const resetPassword=async()=>{

        try{
            await refreshTokenIfNeeded(dispatch)
            setFormLoading(true)
            const response = await axios.post(`${mainAddress}/api/refreshpassword`, {id:fetchedData.id}, {withCredentials:true})
            alert('Пароль успешно сброшен и отправлен на почту клиента!')
            setFormLoading(false)
        } catch(error){
            alert(error);
            setFormLoading(false)
        }
    }
    return(
    <div className="checkUser">
        <WhiteBox headerText={`Пользователь ID:${id}`}>
            <EditableField
                name='username'
                isEditing={false}
                label="username"
                value={formData.username}
            />
            <EditableField
                name='first_name'
                isEditing={isEditing}
                label="Имя"
                value={formData.first_name}
                error={formErrors.first_name}
                helperText='Заполните имя'
                onChange={handleChange}
                disabled={formLoading}
                isReq={true}
            />
            <EditableField
                name='last_name'
                isEditing={isEditing}
                label="Фамилия"
                value={formData.last_name}
                error={formErrors.last_name}
                helperText='Заполните фамилию'
                onChange={handleChange}
                disabled={formLoading}
                isReq={true}
            />
            <EditableField
                name='email'
                isEditing={isEditing}
                label="Почта"
                value={formData.email}
                error={formErrors.email}
                helperText='Введите корректное значение'
                onChange={handleChange}
                disabled={formLoading}
                isReq={true}
            />
            {role==='Менеджер'&&
                    <div className="formButtons">
                        <Button onClick={handleButton}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isEditing?!isValid():formLoading} >
                            {formLoading?<CircularProgress/>:isEditing?<>Сохранить</>:<>Изменить</>}
                        </Button>
                        {isEditing?
                            <Button onClick={()=>{setIsEditing(false); setFormData(fetchedData)}}
                                variant="contained"
                                color="primary">
                                Отменить
                            </Button>
                        :
                            <Button onClick={resetPassword}
                                variant="contained"
                                color="primary"
                                disabled={formLoading} >
                                {formLoading?<CircularProgress/>:'Сбросить пароль'}
                            </Button>
                        }
                        
                        
                    </div>}
        </WhiteBox>
    </div>)
}

export default CheckUser