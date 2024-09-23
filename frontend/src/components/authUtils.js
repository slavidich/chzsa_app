import axios from 'axios';
import { loginSuccess, logoutSuccess } from '../features/auth/authSlice'; 

export const mainAddress = 'http://127.0.0.1:8000'
export const accessLifeTime = 10*1000 // 10 минут условно

export const checkAuthStatus = async (dispatch, setIsAuthChecking) => {
    setIsAuthChecking(true);
    if (localStorage.getItem('IWasHere') == null) {
        dispatch(logoutSuccess());
        setIsAuthChecking(false);
        return false;
    }
    try {
        const response = await axios.post(`${mainAddress}/api/token/whoami`, {}, { withCredentials: true });
        const data = response.data;
        dispatch(loginSuccess({ username: data.username, role: data.role }));
        localStorage.setItem('accessTokenExpiration', Date.now() + accessLifeTime);
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
    const expiration = localStorage.getItem('accessTokenExpiration');
    if (expiration && Date.now() >= expiration) {
        await updateAccessToken(dispatch);
    }
};
