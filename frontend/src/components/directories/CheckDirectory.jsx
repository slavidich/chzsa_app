import React, {useEffect, useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import { FormControl, TextField, Button, CircularProgress, InputLabel, Select,MenuItem, Typography   } from "@mui/material";
import { directorieslist } from "./directories.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import { useParams } from 'react-router-dom';
import {EditableField} from "../muiUtil.jsx";

function CheckDirectory(){
    const navigate = useNavigate()
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch()
    const [formLoading, setFormLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ // новая запись
        entity_name: '',
        name: '', 
        description: '' 
    }); 
    const [formErrors, setFormErrors] = useState({
        name: false,
    })
    const getData= async()=>{
        setFormLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response=await axios.get(`${mainAddress}/api/directories/${id}`,{withCredentials:true})
            setFormData({...response.data})
        }catch(error){
            if (error.response && error.response.status === 404) {
                navigate('/404')
            }
        }
    }
    useEffect(()=>{
        getData()
        
    },[])
    return (<WhiteBox headerText={`Справочник ID:${id}`}>
                <EditableField
                    isEditing={isEditing}
                    label="Тип справочника"
                    value={formData.entity_name}
                    onChange={console.log()}
                />
                <EditableField
                    isEditing={isEditing}
                    label="Название"
                    value={formData.name}
                    onChange={console.log()}
                />
                <EditableField
                    isEditing={isEditing}
                    label="Описание"
                    value={formData.description}
                    onChange={console.log()}
                    multiline={true}
                />
        
    </WhiteBox>)
}

export default CheckDirectory