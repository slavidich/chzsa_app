import "../styles/users.scss";
import axios from "axios";
import React, {useEffect, useState} from "react";
import { mainAddress } from "./app.jsx";
import { useDispatch } from "react-redux";
import { refreshTokenIfNeeded } from "./authUtils.js";
import { Navigate } from "react-router-dom";
import { TextField, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import MyPagination from './paginations.jsx'
import {pagination_page} from './app.jsx'
import { getData } from "./dataTable.jsx";
import UniversalTable from "./dataTable.jsx";

function Users(){
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)
    const [modalButtonLoading, setModalButtonLoading] = useState(false)
    const [formData, setFormData] = useState({
        userType: 'client',
        organization:'',
        description:'',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [errors, setErrors] = useState({
        firstName: false,
        description:false,
        lastName: false,
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
        if (name==='userType'){
            formData.organization='';
        }
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
        const requireInputs = formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        if (formData.userType==='client'){
            return requireInputs
        } else{
            return requireInputs && formData.organization.trim()!==''
        }
        
    };
    const handleSubmit = async (e)=>{
        e.preventDefault()
        if (!isFormValid()) return;
        try{
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.post(`${mainAddress}/api/createuser`,
            {
                ...formData
            },
            {
                withCredentials:true,
            })
            setShowModal(false)
            await fetchUsers()
        }catch(error){
            console.log(error)
        }
        

    }
    
    return(
        
        <div className="users">
            <div>
                <button onClick={()=>setShowModal(true)}>
                    Добавить пользователя
                </button>
            </div>
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "group", header: "Тип"},
                    {field: "username", header: "username"},
                    {field: "first_name", header: "Имя"},
                    {field: "last_name", header: "Фамилия"},
                    {field: "email", header: "Email"},
                ]}
                path='/api/users'
                dispatch={dispatch}
            />
            {showModal && 
                <div className="modal-overlay">
                    <form className="modelwindow" onSubmit={handleSubmit}>
                        <div className="headermodal"><h2>Добавление пользователя</h2><CloseIcon style={{ cursor: 'pointer' }}  onClick={()=>{setShowModal(false); clearFormData()}}/></div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Тип пользователя</FormLabel>
                            <RadioGroup
                                aria-label="userType"
                                name="userType"
                                defaultValue="client"
                                value={formData.userType}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="client" control={<Radio />} label="Клиент" />
                                <FormControlLabel value="service" control={<Radio />} label="Сервисная организация" />
                            </RadioGroup>
                        </FormControl>
                        {formData.userType==='service'&&(<>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id='organization'
                                    label='Название организации'
                                    variant='outlined'
                                    name='organization'
                                    value={formData.organization}
                                    onChange={handleChange}
                                    error={errors.organization}
                                    helperText={errors.organization && "Организация не может быть пустым"}
                                    required
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id='description'
                                    label='Описание'
                                    variant='outlined'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </FormControl></>
                        )}
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="first-name"
                                label={formData.userType==='client'?"Имя":"Имя директора"}
                                variant="outlined"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                helperText={errors.firstName && "Имя не может быть пустым"}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="last-name"
                                label={formData.userType==='client'?"Фамилия":"Фамилия директора"}
                                variant="outlined"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                helperText={errors.lastName && "Фамилия не может быть пустой"}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="email"
                                label="Почта"
                                variant="outlined"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                helperText={errors.email && "Введите корректный email"}
                                required
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isFormValid()} 
                        >Отправить
                        </Button>
                    </form>
                </div>
            }
        </div>
        
    )
}

export default Users