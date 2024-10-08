import React, {useState} from "react";
import UniversalTable from "../dataTable.jsx";
import { useDispatch } from "react-redux";

import { mainAddress } from "../app.jsx";
import axios from "axios";
import {CircularProgress} from "@mui/material";
import '../../styles/services.scss'
import {FormControl, TextField, Button} from "@mui/material";
import { refreshTokenIfNeeded } from "../authUtils.js";

function Services(){
    const dispatch = useDispatch()
    const [refreshKey, setRefreshKey] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingItem, setEditingItem] = useState({})
    const [formLoading, setFormLoading] = useState(false)
    const [refreshPasswordLoading, setRefreshPasswordLoading] = useState(false)
    const [formData, setFormData] = useState({
        username:'',
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:''
    })
    const [formErrors, setFormErrors] = useState({
        username:false,
        name:false,
        description:false,
        user_first_name:false,
        user_last_name:false,
        user_email:false
    })
    const clearFormData=()=>setFormData({
        username:'',
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:''
    })
    const handleAddButton =()=>{
        setShowModal(true)
    }
    const handleChangeButton =(item)=>{
        console.log(item)
        setShowModal(true)
        setIsEditing(true)
        setEditingItem(item)
        setFormData({
            ...item
        })
    }
    const closeModalButton=()=>{
        setShowModal(false)
        setIsEditing(false)
        clearFormData()
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        validateField(name, value);
    }
    const validateField=(name, value)=>{
        let isValid = true;

        if (name === 'user_email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else {
            isValid = value.trim() !== '';
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const isFormValid = () => {
        const requireInputs = formData.name.trim() !== '' &&
            formData.user_first_name.trim() !== '' &&
            formData.user_last_name.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)
        return requireInputs
    };
    const handleResetPassword = async ()=>{
        try{
            setRefreshPasswordLoading(true)
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.post(`${mainAddress}/api/refreshpasswordusername`,{
                username:editingItem.username,
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
    const handleSubmit= async (e)=>{
        e.preventDefault()
        if (!isFormValid()) return;
        try{
            setFormLoading(true)
            await refreshTokenIfNeeded(dispatch)
            if (isEditing){
                const response = await axios.put(`${mainAddress}/api/services`,
                {
                    ...formData
                },
                {
                    withCredentials:true,
                })
            }
            else{
                const response = await axios.post(`${mainAddress}/api/services`,
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
    return(<div className="services">
    <UniversalTable
        columns={[
            {field: "id", header: "ID"},
            {field:'username', header:'username', maxLength:15,},
            {field: "name", header: "Название", maxLength:15,},
            {field: "description", header: "Описание", maxLength:15, hideWhenWidth:1200},
            {field: "user_first_name", header: "Имя директора", maxLength:15, hideWhenWidth:800},
            {field: "user_last_name", header: "Фамилия директора", maxLength:15, hideWhenWidth:800},
            {field: "user_email", header: "email", maxLength:15, hideWhenWidth:1200},
        ]}
        path='/api/services'
        dispatch={dispatch}
        canAdd={true}
        actionOnAdd={handleAddButton}
        canSearch={true}
        canChange={true}
        actionOnChange={handleChangeButton}
        refreshKey={refreshKey}
    />
    
    </div>)
}

export default Services