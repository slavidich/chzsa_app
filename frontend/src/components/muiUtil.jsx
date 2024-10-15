import { createTheme } from '@mui/material/styles';
import React from 'react';
import { TextField, Typography, Box, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";

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