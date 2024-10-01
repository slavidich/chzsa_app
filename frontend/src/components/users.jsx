import "../styles/users.scss";
import axios from "axios";
import React, {useEffect, useState} from "react";
import { mainAddress } from "./app.jsx";
import { useDispatch } from "react-redux";
import { refreshTokenIfNeeded } from "./authUtils.js";
import { Navigate } from "react-router-dom";
import { TextField, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Users(){
    const dispatch = useDispatch();
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading]=useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        userType: 'client',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false
    });

    const fetchUsers = async()=>{
        setIsLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.get(`${mainAddress}/api/users`, {withCredentials:true})
            setUsers(response.data)
        } catch(error){
            if (error.response && error.response.status===403){
                return <Navigate to="/forbidden" replace />;
            }    
        } finally{
            setIsLoading(false)
        }   
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
        return (
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
    };
    const handleSubmit = (e)=>{
        e.preventDefault()
        if (!isFormValid()) return;
        console.log(formData)
    }
    useEffect(()=>{
        fetchUsers()
    },[])
    return(
        <div className="users">
            <div>
                <button onClick={()=>setShowModal(true)}>
                    Добавить пользователя
                </button>
            </div>
            {isLoading?
                <>Загрузка</>
            :
                <div>
                    {users.map((item, index)=>{
                        return  <div key={index}>
                                    {item.group} {item.username} {item.first_name} {item.last_name} {item.email}
                                </div>
                    })}
                </div>
            }
            {showModal && 
                <div className="modal-overlay">
                    <form className="modelwindow" onSubmit={handleSubmit}>
                        <div className="headermodal"><h2>Добавление пользователя</h2><CloseIcon style={{ cursor: 'pointer' }}  onClick={()=>setShowModal(false)}/></div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Тип пользователя</FormLabel>
                            <RadioGroup
                                aria-label="userType"
                                name="userType"
                                defaultValue="client"
                            >
                                <FormControlLabel value="client" control={<Radio />} label="Клиент" />
                                <FormControlLabel value="service" control={<Radio />} label="Сервисная организация" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="first-name"
                                label="Имя"
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
                                label="Фамилия"
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