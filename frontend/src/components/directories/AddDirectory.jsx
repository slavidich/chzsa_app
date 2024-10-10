import React, {useState, useEffect} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import {  Button, CircularProgress } from "@mui/material";
import { directorieslist } from "./directories.jsx";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import {EditableField, EditableSelectField} from "../muiUtil.jsx";

function AddDirectory(){    
    const navigate = useNavigate()
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch()
    const [formLoading, setFormLoading] = useState(false)
    const [formData, setFormData] = useState({
        entity_name: searchParams.get('entity_name'),
        name: '', 
        description: '' 
    });
    const [formErrors, setFormErrors] = useState({
        name: false,
    })
    const handleAdd = async(e)=>{
        e.preventDefault()
        setFormLoading(true)
        await refreshTokenIfNeeded(dispatch)
        try {
            await axios.post(`${mainAddress}/api/directories`, { ...formData }, { withCredentials: true });
            setFormLoading(false)
            if (location.state&&location.state.from){
                console.log(location.state)
                navigate(location.state.from)
            }else{
                navigate(`/directories?entity_name=${formData.entity_name}`)
            }
        } catch (error) {
            alert(error);
            setFormLoading(false)
        }
    }
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name==='entity_name'){
            setSearchParams({entity_name:value})
        }
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
    return(
    <WhiteBox headerText='Новый справочник' >
        <form onSubmit={handleAdd}>
            <EditableSelectField
                label='Тип справочника'
                isEditing={true}
                name="entity_name"
                value={formData.entity_name}
                onChange={handleChange}
                loading={formLoading}
                list={directorieslist}
            />
            <EditableField
                isEditing={true}
                label='Название'
                name='name'
                value={formData.name}
                error={formErrors.name}
                helperText='Название не может быть пустым'
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
            />
            <EditableField
                isEditing={true}
                label='Описание'
                name='description'
                value={formData.description}
                onChange={handleChange}
                loading={formLoading}
                isReq={false}
            />
            <div className="formButtons">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isValid()||formLoading} >
                    {formLoading?<CircularProgress/>:<>Добавить</>}
                </Button>
            </div>
        </form>
    </WhiteBox>)
}

export default AddDirectory