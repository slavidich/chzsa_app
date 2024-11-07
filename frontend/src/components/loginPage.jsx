import React from "react";
import '../styles/loginPage2.scss'
import Logored from '../img/logored.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {mainAddress, accessLifeTime} from './app.jsx'
import WhiteBox from "./WhiteBox.jsx";
import { TextField, Button } from "@mui/material";

function LoginPage (){
    const dispatch = useDispatch();
    const [formData, setFormData] = React.useState({
        username: '',
        password: ''
    })
    const [formErrors, setFormErrors] = React.useState({
        username: false,
        password: false
    })
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const navigate = useNavigate(); 

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(`${mainAddress}/api/login`,{
                username: formData.username,
                password: formData.password,
            },{
                withCredentials: true,
            })
            const data = response.data
            dispatch(loginSuccess({username: data.username, role:data.role}))
            localStorage.setItem('accessTokenExpiration', Date.now() + accessLifeTime);
            navigate('/')
        }
        catch(respError){
            if(respError.code==='ERR_NETWORK'){
                setError('Нет соединения с сервером')
                return
            }
            if (respError.response.status===401){
                setError('Неправильный логин или пароль')
            }
            else{
                setError('Ошибка: '+respError.response.statusText)
            }
        }
        setLoading(false)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
        }));
        validateField(name, value)
    };
    const validateField=(name, value)=>{
        let isValid = true;
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            isValid = false;
        }
        if (name==='shipping_date'){
            const date = new Date(value)
            if (date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900){
                isValid = false
            }
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }   
    const isValid = () => {
        const allFields = Object.keys(formData);

        for (const field of allFields) {
            const value = formData[field];
            if(!value||(typeof value==='string' && value.trim()==='')) return false
        }
        if (Object.values(formErrors).some(error=> error===true)){
            return false
        }
        
        return true;
    };

    return(
    <>
        <div className='loginpage'>
            <WhiteBox headerText={'Вход'}>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        fullWidth
                        name={'username'}
                        value={formData.username}
                        error={formErrors.username}
                        placeholder='Логин'
                        helperText={formErrors.username&&'Введите Логин'}
                        disabled={loading}
                        onChange={handleChange}
                    />
                    <TextField 
                        type="password"
                        fullWidth
                        name={'password'}
                        value={formData.password}
                        error={formErrors.password}
                        helperText={formErrors.password&&'Введите пароль'}
                        placeholder='Пароль'
                        disabled={loading}
                        onChange={handleChange}
                    />
                    <Button onClick={handleSubmit} disabled={!isValid()||loading}variant="contained">Войти</Button>
                    {error&&
                        <div className="error">
                            <p>{error}</p>
                        </div>}
                </form>
            </WhiteBox>
        </div>
        
        
    </>)
}

export default LoginPage