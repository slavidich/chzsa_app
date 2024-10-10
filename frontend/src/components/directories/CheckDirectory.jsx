import React, {useEffect, useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import { Button, CircularProgress  } from "@mui/material";
import { directorieslist } from "./directories.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import { useParams } from 'react-router-dom';
import {EditableField, EditableSelectField} from "../muiUtil.jsx";

function CheckDirectory(){
    const navigate = useNavigate()
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch()
    const role = useSelector(state=>state.auth.role)
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
    const [fetchedData, setFetchedData] = useState({})
    const getData= async()=>{
        setFormLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response=await axios.get(`${mainAddress}/api/directories/${id}`,{withCredentials:true})
            setFormData({...response.data})
            setFetchedData({...response.data})
            setFormLoading(false)
            navigateBack(location, `directories/${fetchedData.entity_name}`)
        }catch(error){
            if (error.response && error.response.status === 404) {
                navigate('/404')
            }
        }
    }
    useEffect(()=>{
        getData()
        
    },[])
    const handleChange=(e)=>{
        const {name, value} = e.target
        setFormData({
            ...formData, 
            [name]:value
        })
        validateField(name, value)
    }
    const validateField = (name, value) => {
        let isValid = true;

        if (name != 'entity_name') {
            isValid = value.trim() !== '';
        } 
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    };
    const isValid =()=>{
        const requireInputs = formData.name.trim() !== '' 
        return requireInputs
    }
    const handleButton =async (e)=>{
        e.preventDefault()
        if (isEditing){
            try{
                await refreshTokenIfNeeded(dispatch)
                setFormLoading(true)
                const response = await axios.put(`${mainAddress}/api/directories`,{...formData}, {withCredentials:true})
                setIsEditing(false)
                setFormLoading(false)
                if (fetchedData.entity_name===formData.entity_name){
                    if(location.state){
                        navigate(location.state.from)
                    }
                }else{
                    navigate(`/directories?entity_name=${formData.entity_name}`)
                }
            }catch(error){
                alert(error);
            }
        } else{
            setIsEditing(true)
        }
    }
    return (<WhiteBox headerText={`Справочник ID:${id}`}>
                <EditableSelectField
                    name='entity_name'
                    isEditing={isEditing}
                    label="Тип справочника"
                    value={formData.entity_name}
                    onChange={handleChange}
                    list={directorieslist}
                    disabled={formLoading}
                />
                <EditableField
                    name='name'
                    isEditing={isEditing}
                    label="Название"
                    value={formData.name}
                    error={formErrors.name}
                    helperText='Заполните название'
                    onChange={handleChange}
                    disabled={formLoading}
                    isReq={true}
                />
                <EditableField
                    name='description'
                    isEditing={isEditing}
                    label="Описание"
                    value={formData.description}
                    onChange={handleChange}
                    multiline={true}
                    disabled={formLoading}
                />

                {role==='Менеджер'&&
                    <div className="formButtons">
                        <Button onClick={handleButton}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formLoading||!isValid()} >
                            {formLoading?<CircularProgress/>:isEditing?<>Сохранить</>:<>Изменить</>}
                        </Button>
                        {isEditing&&
                            <Button onClick={()=>{setIsEditing(false); setFormData(fetchedData)}}
                                variant="contained"
                                color="primary">
                                Отменить
                            </Button>}
                    </div>}
            </WhiteBox>
        )
}

export default CheckDirectory