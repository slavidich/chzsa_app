import axios from 'axios';
import { loginSuccess, logoutSuccess } from '../features/auth/authSlice'; 
import {mainAddress, accessLifeTime} from './app.jsx'


export const checkAuthStatus = async (dispatch, setIsAuthChecking) => {
    setIsAuthChecking(true);
    if (localStorage.getItem('accessTokenExpiration') == null) {
        dispatch(logoutSuccess());
        setIsAuthChecking(false);
        return false;
    }
    try {
        const response = await axios.post(`${mainAddress}/api/token/whoami`, {}, { withCredentials: true });
        const data = response.data;
        dispatch(loginSuccess({ username: data.username, role: data.role }));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await updateAccessToken(dispatch);
        } else {
            dispatch(logoutSuccess());
        }
    } finally {
        setIsAuthChecking(false);
    }
    return true;
};

export const updateAccessToken = async (dispatch) => {
    try {
        const response = await axios.post(`${mainAddress}/api/token/refresh`, {}, { withCredentials: true });
        const data = response.data;
        dispatch(loginSuccess({ username: data.username, role: data.role }));
        localStorage.setItem('accessTokenExpiration', Date.now() + accessLifeTime);
        return true;
    } catch (error) {
        dispatch(logoutSuccess());
        return false;
    }
};

export const refreshTokenIfNeeded = async (dispatch) => {
    //console.log('Текущее время '+ new Date(Date.now()))
    //console.log('Время когда токен должен истечь'+new Date(Number(localStorage.getItem('accessTokenExpiration'))))
    const expiration = Number(localStorage.getItem('accessTokenExpiration'));
    if (expiration && Date.now() >= expiration) {
        //console.log('Пошло обновление токена')
        await updateAccessToken(dispatch);
    }
};
