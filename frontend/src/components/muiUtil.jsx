import { createTheme } from '@mui/material/styles';
import React from 'react';
import { TextField, Typography, Box, FormControl, Select, MenuItem } from '@mui/material';

export const theme = createTheme({
    typography: {
        fontFamily: [
            'PT  Sans',
            'sans-serif',
        ].join(','),
    },
});

export const RequiredStar =()=> <span style={{ color: 'red' }}> *</span>

export const EditableField = ({isEditing,name, label, value, 
                                error, helperText, onChange, 
                                loading, isReq=false, multiline=false})=>{
  return(
    <FormControl fullWidth margin="normal">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{label}{isReq?<RequiredStar/>:<></>}</Typography>
        {isEditing?
          <TextField 
              name={name}
              value={value}
              onChange={onChange}
              error={error}
              helperText={error && helperText}
              disabled={loading}
              required
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
                    <MenuItem value={item[0]}>{item[1]}</MenuItem>
                ))}
            </Select>
        :
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {value}
            </Typography>
        }

    </FormControl>
  )                                  

}