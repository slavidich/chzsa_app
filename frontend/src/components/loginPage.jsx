import React from "react";
import '../styles/loginPage.scss'
import Logored from '../img/logored.svg' 
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from "../features/auth/authSlice";

function LoginPage (){
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(false)

    const handleSubmit = (event) =>{
        event.preventDefault();
        console.log(username, password)
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
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        placeholder='Пароль'
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                {error?<div className='error'><p></p></div>:<></>}
                <button className={error?'error':undefined} type="submit">Войти</button>
            </form>
        </div>
    </>)
}

export default LoginPage