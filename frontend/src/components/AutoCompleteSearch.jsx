import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@emotion/react';
import { theme } from './muiUtil';

function AutoCompleteSearch({endpoint, label, name, setData, setFormError}){
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const searchTimeout = useRef(null);
    useEffect(()=>{
        getOptions('')
    },[])

    const getOptions = async(value)=>{
        setLoading(true)
        axios.get(`${endpoint}&search=${value}`, {withCredentials:true})
        .then(response=>{
            setOptions(response.data);  // Устанавливаем полученные значения в state options
            setLoading(false);
        })
        .catch(error=>{
            console.error('Ошибка при загрузке данных:', error);
            setLoading(false);
        })
    }
    const handleSearch = (event, value) => {
        setOptions([])
        setLoading(true)
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            if (value.length >= 1 || value === '') {  // Поиск работает и при удалении текста
                getOptions(value);
            }
        }, 500);
    };
    const handleChange = (event, value)=>{
        setData(prevData =>({
            ...prevData,
            [name]: value
        }))
        if (!value) {
            setError(true);
            setFormError(prev => ({ ...prev, [name]: true }));
        } else{
            setError(false);
            setFormError(prev => ({ ...prev, [name]: false }));
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <Autocomplete 
                options={options}
                getOptionLabel = {(option)=>option.name}
                loading={loading}
                noOptionsText={'Нет вариантов'}
                loadingText={'Загрузка...'}
                onInputChange={handleSearch}
                onChange={handleChange}
                renderInput={(params)=>(
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        fullWidth
                        error={error}
                    />
                )}
            />
        </ThemeProvider>
    )
}

export default AutoCompleteSearch