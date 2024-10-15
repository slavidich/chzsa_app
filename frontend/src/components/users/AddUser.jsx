import React, {useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import {  Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import {EditableField, validateEmail} from "../muiUtil.jsx";

function AddUser(){
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const [formLoading, setFormLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name:'', 
        last_name:'',
        email:''
    })
    const [formErrors, setFormErrors] = useState({
        first_name:false, 
        last_name:false,
        email:false
    })
    const handleChange= (e)=>{
        const {name, value} = e.target
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
    const handleAdd= async(e)=>{
        e.preventDefault()
        console.log(formData)
        try{
            setFormLoading(true)
            await refreshTokenIfNeeded(dispatch)
            await axios.post(`${mainAddress}/api/users`, {...formData}, {withCredentials:true})
            const response = await axios.get(`${mainAddress}/api/users`, {withCredentials:true})
            if (response.data.last_page){
                navigate(`/users?page=${response.data.last_page}`)
            }else{
                navigate(`/users`)
            }
            setFormLoading(false)
            
        }catch(error){
            alert(error)
            setFormLoading(false)
        }
    }
    const isValid = ()=>{
        const requireInputs = formData.first_name.trim() !== '' &&
            formData.last_name.trim() !== '' &&
            validateEmail(formData.email)
        return requireInputs
    }
    return(
        <div className="addUser">
            <WhiteBox headerText='Добавление клиента'>
                <form onSubmit={handleAdd}>
                    <EditableField
                        isEditing={true}
                        label='Имя'
                        name='first_name'
                        value={formData.first_name}
                        error={formErrors.first_name}
                        helperText='Имя не может быть пустым'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={true}
                        label='Фамилия'
                        name='last_name'
                        value={formData.last_name}
                        error={formErrors.last_name}
                        helperText='Фамилия не может быть пустым'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={true}
                        label='Почта'
                        name='email'
                        value={formData.email}
                        error={formErrors.email}
                        helperText='Введите корректную почту'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <div className="formButtons">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isValid()||formLoading} >
                            {formLoading?<CircularProgress/>:<>Добавить</>}
                        </Button>
                    </div>
                </form>
            </WhiteBox>
        </div>
    )
}

export default AddUser


/*
<ModalWindow showModal={showModal} headerText={isEditing?'Изменение пользователя':'Добавление пользователя'} closeModal={closeModal}>
                    <form onSubmit={handleSubmit}>
                        {isEditing&&<FormControl fullWidth margin="normal">
                            <TextField
                                id="username"
                                label='username'
                                variant="outlined"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                                helperText={errors.username && "Имя не может быть пустым"}
                                required
                                disabled
                            />
                        </FormControl>}
                        
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="first_name"
                                label='Имя клиента'
                                variant="outlined"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                error={errors.first_name}
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.first_name && "Имя не может быть пустым"}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="last_name"
                                label="Фамилия клиента"
                                variant="outlined"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                error={errors.last_name}
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.last_name && "Фамилия не может быть пустой"}
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
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.email && "Введите корректный email"}
                                required
                            />
                        </FormControl>
                        <div className='formButtons'>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isFormValid()||formLoading|| refreshPasswordLoading} 
                            >{formLoading?<CircularProgress  />:<>{isEditing?"Сохранить":"Добавить"}</>}
                            </Button>
                                {isEditing&&<Button
                                variant="contained"
                                color="primary"
                                onClick={handleResetPassword}
                                disabled={editingItem.email!=formData.email||refreshPasswordLoading} 
                                >
                                {refreshPasswordLoading?<CircularProgress  />:'Сбросить пароль'}
                            </Button>}
                        </div>
                    </form>
                </ModalWindow>*/