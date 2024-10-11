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
import '../../styles/addservice.scss'

function AddService(){
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const [formLoading, setFormLoading] = useState(false)
    const [formData, setFormData] = useState({
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:''
    })
    const [formErrors, setFormErrors] = useState({
        name:false,
        user_first_name:false,
        user_last_name:false,
        user_email:false
    })
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
        console.log(name, value)
        if (name === 'user_email') {
            isValid=validateEmail(value)
        } else {
            isValid = value.trim() !== '';
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const isValid = ()=>{
        const requireInputs = formData.name.trim() !== '' &&
            formData.user_first_name.trim() !== '' &&
            formData.user_last_name.trim() !== '' &&
            validateEmail(formData.user_email)
        return requireInputs
    }
    const handleAdd=async(e)=>{
        e.preventDefault()
        console.log(formData)
    }
    return(
        <div className="addService">
            <WhiteBox headerText={'Добавление сервисной организации'}>
                <form onSubmit={handleAdd}>
                    <EditableField
                        isEditing={true}
                        label='Название организации'
                        name='name'
                        value={formData.name}
                        error={formErrors.name}
                        helperText='Заполните название организации'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={true}
                        label='Описание'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={false}
                    />
                    <EditableField
                        isEditing={true}
                        label='Имя директора'
                        name='user_first_name'
                        value={formData.user_first_name}
                        error={formErrors.user_first_name}
                        helperText='Заполните имя директора'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={true}
                        label='Фамилия директора'
                        name='user_last_name'
                        value={formData.user_last_name}
                        error={formErrors.user_last_name}
                        helperText='Заполните фамилию директора'
                        onChange={handleChange}
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={true}
                        label='Почта'
                        name='user_email'
                        value={formData.user_email}
                        error={formErrors.user_email}
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

export default AddService
/*const dispatch = useDispatch()
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
<ModalWindow showModal={showModal} headerText={isEditing?'Изменение сервисной организации':'Добавление сервисной организации'} closeModal={closeModalButton}>
        <form onSubmit={handleSubmit}>
            {isEditing&&
            <FormControl fullWidth margin="normal">
                <TextField
                    id='username'
                    label='username'
                    variant='outlined'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    error={formErrors.username}
                    required
                    disabled={true} 
                />
            </FormControl>}
            <FormControl fullWidth margin="normal">
                <TextField
                    id='name'
                    label='Название организации'
                    variant='outlined'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    error={formErrors.name}
                    helperText={formErrors.name && "Организация не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    multiline
                    rows={4}
                    id='description'
                    label='Описание'
                    variant='outlined'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_first_name'
                    label='Имя директора'
                    variant='outlined'
                    name='user_first_name'
                    value={formData.user_first_name}
                    onChange={handleChange}
                    error={formErrors.user_first_name}
                    helperText={formErrors.user_first_name && "Имя директора не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_last_name'
                    label='Фамилия директора'
                    variant='outlined'
                    name='user_last_name'
                    value={formData.user_last_name}
                    onChange={handleChange}
                    error={formErrors.user_last_name}
                    helperText={formErrors.user_last_name && "Фамилия директора не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_email'
                    label='email'
                    variant='outlined'
                    name='user_email'
                    value={formData.user_email}
                    onChange={handleChange}
                    error={formErrors.user_email}
                    helperText={formErrors.user_email && "Введите корректный email"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
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
                    disabled={editingItem.user_email!=formData.user_email||refreshPasswordLoading||formLoading} 
                    >
                    {refreshPasswordLoading?<CircularProgress  />:'Сбросить пароль'}
                </Button>}
            </div>
        </form>
    </ModalWindow>*/