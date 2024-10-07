import "../styles/users.scss";
import axios from "axios";
import React, {useEffect, useState} from "react";
import { mainAddress } from "./app.jsx";
import { useDispatch } from "react-redux";
import { refreshTokenIfNeeded } from "./authUtils.js";
import { TextField, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ModalWindow from "./ModalWindow";
import UniversalTable from "./dataTable.jsx";
import CircularProgress from '@mui/material/CircularProgress';

function Users(){
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingItem, setEditingItem] = useState({})
    const [refreshKey, setRefreshKey] = useState(false);
    const [formLoading, setFormLoading] = useState(false)
    const [refreshPasswordLoading, setRefreshPasswordLoading] = useState(false)
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
                    {field: "username", header: "username"},
                    {field: "first_name", header: "Имя"},
                    {field: "last_name", header: "Фамилия"},
                    {field: "email", header: "Email"},
                ]}
                path='/api/users'
                dispatch={dispatch}
                canAdd={true}
                actionOnAdd={ShowModalAdd}
                canSearch={true}
                canChange={true}
                actionOnChange={ShowModalChange}
                refreshKey={refreshKey}
            />
            
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
                </ModalWindow>
           
        </div>
        
    )
}

export default Users