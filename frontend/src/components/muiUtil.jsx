import { createTheme } from '@mui/material/styles';
import React, {useState, useRef, useEffect} from 'react';
import { TextField, Typography, Box, FormControl, Select, MenuItem, Autocomplete, Paper } from '@mui/material';
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from 'axios';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import ruLocale from 'date-fns/locale/ru';


export const theme = createTheme({
    typography: {
        fontFamily: [
            'PT  Sans',
            'sans-serif',
        ].join(','),
    },
});

export const RequiredStar =()=> <span style={{ color: 'red' }}> *</span>

export const validateEmail= (email) =>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}

export const catchErrors = (error, navigate)=>{
    if (error.response) {
        switch (error.response.status) {
            case 404:
                navigate('/404');
                break;
            case 403:
                navigate('/403')
            case 401:
                navigate('/login');
                break;
            case 500:
                navigate('/500');
                break;
            default:
                console.error('Unexpected error:', error.response);
        }
    } else {
        alert('Error:', error.message || error);
    }
}

export const EditableField = ({isEditing,name, label, value, 
                                error, helperText, onChange, 
                                loading, isReq=false, multiline=false})=>{
  return(
    <FormControl fullWidth margin="normal">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{label}{isReq&&isEditing?<RequiredStar/>:<></>}</Typography>
        {isEditing?
          <TextField 
              name={name}
              value={value}
              onChange={onChange}
              error={error}
              helperText={error && helperText}
              disabled={loading}
              required={isReq}
              multiline={multiline}
          />
        :
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {value}
          </Typography>
        }
    </FormControl>
    )
}

export const EditableSelectField = ({isEditing,name, label, value, 
                                  error, helperText, onChange, 
                                  loading, list, isReq=false,})=>{
  return(
    <FormControl fullWidth margin="normal">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{label}{isReq?<RequiredStar/>:<></>}</Typography>
        {isEditing?
            <Select
                name={name}
                value={value}
                onChange={onChange}
                required={isReq}
                disabled={loading}
            >
                {list.map((item)=>(
                    <MenuItem key={item[0]} value={item[0]}>{item[1]}</MenuItem>
                ))}
            </Select>
        :
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {list.find(item=>item[0]===value)?list.find(item=>item[0]===value)[1]:<></>}
            </Typography>
        }

    </FormControl>
  )                                  
}

export const EditableDateField  =React.memo(({isEditing, label, name, value, error, helperText, onChange, loading, isReq=false}) =>{
    const handleChange = (event, newValue) => {
        const e = {
            target: {
                value: event,
                name: name || null,
            },
        };
        onChange(e)
    };
    return (
        <FormControl fullWidth margin="normal">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{label}{isReq&&isEditing?<RequiredStar/>:<></>}</Typography>
                {isEditing?
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DatePicker
                            name={name}
                            value={value}
                            onChange={handleChange}
                            disabled={loading}
                            required={isReq}
                            format="dd.MM.yyyy"
                            slotProps={{
                                textField: {
                                    error: error,
                                    helperText: error&&helperText
                                }
                            }}
                        />
                  </LocalizationProvider>
            :
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {new Date(value).toLocaleDateString()}
            </Typography>
            }
        </FormControl>
    )
})

export const AutoCompleteSearch = ({endpoint, isEditing, label, name, value, error, helperText, onChange, loading, isReq=false, canCheck=false})=>{
    const [options, setOptions] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [inputError, setInputError] = useState(false);
    const searchTimeout = useRef(null);

    const getOptions = async (searchValue) => {
        setLoadingState(true);
        try {
            const response = await axios.get(`${endpoint}&search=${searchValue}`, { withCredentials: true });
                setOptions(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoadingState(false);
        }
    };

    useEffect(() => {
        if (isEditing) {
            getOptions('');
        }
    }, [isEditing]);

    const handleSearch = (event, value) => {
        value===''?setInputError(true):setInputError(false)
        setOptions([]);
        setLoadingState(true);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            if (value.length >= 1 || value === '') {
                getOptions(value);
            }
        }, 500);
    };
    const handleChange = (event, newValue) => {
        const e = {
            target: {
                value: newValue ? newValue.id : undefined,
                name: name || null,
            },
        };
        onChange(e)
    };
    return(
        <FormControl fullWidth margin="normal">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{label}{isReq&&isEditing?<RequiredStar/>:<></>}</Typography>
            {isEditing?
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.name || ''}
                    loading={loadingState}
                    noOptionsText="Нет вариантов"
                    loadingText="Загрузка..."
                    onInputChange={handleSearch}
                    onChange={handleChange}
                    
                    disabled={loading}
                    PaperComponent={(params) => (
                        <Paper 
                            {...params} 
                            sx={{ width: 'auto' }}  // Автоматическая ширина выпадающего списка
                        />
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={inputError || error}
                            helperText={(error||inputError) && helperText}
                            sx={{ 
                                whiteSpace: 'normal', // Позволяет тексту переноситься на новую строку
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Ограничение по числу строк
                            }}
                        />
                    )}
                />
            :
            <Typography 
                variant="body1" 
                sx={{ 
                    color: 'text.secondary',
                    whiteSpace: 'normal', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2, // Две строки текста максимум
                }}>
                    {canCheck ? (
                        <Link to={`${endpoint}/${value}`}>
                            {value}
                        </Link>
                    ) : (
                        value
                    )}
            </Typography>
            }
    </FormControl>
    )
}