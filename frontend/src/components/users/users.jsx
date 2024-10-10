import "../../styles/users.scss";
import axios from "axios";
import React, {useEffect, useState} from "react";
import { mainAddress } from "../app.jsx";
import { useDispatch } from "react-redux";
import { refreshTokenIfNeeded } from "../authUtils.js";
import { useSearchParams } from "react-router-dom";
import { TextField, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import UniversalTable from "../dataTable.jsx";
import CircularProgress from '@mui/material/CircularProgress';

function Users(){
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{
        if (searchParams.get('page')===null){
            setSearchParams({  page:1}); 
        }
    }, [])

    const [formData, setFormData] = useState({
        username:'',
        first_name: '',
        last_name: '',
        email: ''
    });
    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false
    });

    const clearFormData = ()=>{
        for (let key in formData){
            formData[key]=''
        }
        formData['userType']='client'
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        validateField(name, value);
    };
    const validateField = (name, value) => {
        let isValid = true;

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else {
            isValid = value.trim() !== '';
        }
        setErrors({
            ...errors,
            [name]: !isValid
        });
    };
    const isFormValid = () => {
        const requireInputs = formData.first_name.trim() !== '' &&
            formData.last_name.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        return requireInputs
    };
    const handleSubmit = async (e)=>{
        e.preventDefault()
        if (!isFormValid()) return;
        try{
            setFormLoading(true)
            await refreshTokenIfNeeded(dispatch)
            if (isEditing){
                const response = await axios.put(`${mainAddress}/api/users`,
                {
                    ...formData
                },
                {
                    withCredentials:true,
                })
            }
            else{
                const response = await axios.post(`${mainAddress}/api/users`,
                {
                    ...formData
                },
                {
                    withCredentials:true,
                })
            }
            setShowModal(false)
            setRefreshKey(prevstate=>!prevstate)
            clearFormData()
            
        }catch(error){
            console.log(error)
        }
        setFormLoading(false)
    }
    const ShowModalAdd = (item)=>{
        console.log(item)
        setShowModal(true)
        
    }
    const ShowModalChange = (item)=>{
        setEditingItem(item)
        setFormData({
            username: item.username,
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email
        })
        setIsEditing(true)
        setShowModal(true)
    }
    const closeModal = ()=>{
        setIsEditing(false)
        setShowModal(false)
        clearFormData()
    }
    const handleResetPassword = async ()=>{
        try{
            setRefreshPasswordLoading(true)
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.post(`${mainAddress}/api/refreshpassword`,{
                id:editingItem.id,
            },
            {
                withCredentials:true,
            })

        } catch (error){
            console.error(error)
        }
        setRefreshPasswordLoading(false)
        alert('Отправление сообщение на почту пользователя')
    }
    return(
        
        <div className="users">
            <div>
                
            </div>
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "username", header: "username", maxLength:10},
                    {field: "first_name", header: "Имя", maxLength:10},
                    {field: "last_name", header: "Фамилия", maxLength:10, hideWhenWidth:900},
                    {field: "email", header: "Email", maxLength:10, hideWhenWidth:1200},
                ]}
                path='/api/users'
                dispatch={dispatch}
                canAdd={true}
                canSearch={true}
            />
        </div>
        
    )
}

export default Users