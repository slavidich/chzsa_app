import React from "react";
import '../styles/loginPage.scss'
import Logored from '../img/logored.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";
import axios from 'axios';

function LoginPage (){
    const dispatch = useDispatch();
    const [username, setUsername] = React.useState('manager1');
    const [password, setPassword] = React.useState('123ewqytr');
    const [loading, setLoading] = React.useState('')
    const [error, setError] = React.useState(false)

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(' http://127.0.0.1:8000/api/login',{
                username: username,
                password: password,
            })
            const data = response.data
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            dispatch(loginSuccess(data.username))
        }
        catch(respError){
            console.log(respError)
            if (respError.response){
                setError('Ошибка: ', respError.response.data.error)
            }
            else{
                setError('Ошибка: ', respError.message)
            }
        }
        setLoading(false)
    }
    const handleChange = (e) =>{
        const {id, value} = e.target
        switch(id){
            case 'username':{
                setUsername(value)
                break;
            }
            case 'password':{
                setPassword(value)
                break;
            }
        }
    }

    return(
    <>
        <div className="loginpage">
            <form  onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="username"
                        placeholder='Логин'
                        value={username}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        placeholder='Пароль'
                        value={password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                {error?<div><p>Ошибка</p></div>:<></>}
                <button  type="submit" disabled={loading}>Войти</button>
            </form>
        </div>
    </>)
}

export default LoginPage