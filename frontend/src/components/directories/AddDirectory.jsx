import React, {useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import { FormControl, TextField, Button, CircularProgress, InputLabel, Select,MenuItem,Typography   } from "@mui/material";
import { directorieslist } from "./directories.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import {RequiredStar} from '../muiUtil.jsx'
import {EditableField, EditableSelectField} from "../muiUtil.jsx";

function AddDirectory(){    
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const entity = searchParams.get('entity_name')
    const dispatch = useDispatch()
    const [formLoading, setFormLoading] = useState(false)
    const [formData, setFormData] = useState({ // новая запись
        entity_name: entity,
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
            navigate(`/directories?entity_name=${formData.entity_name}`)
        } catch (error) {
            alert(error);
            setFormLoading(true)
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
                disabled={formLoading}
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
                    {formLoading?<CircularProgress/>:<>Сохранить</>}
                </Button>
            </div>
        </form>
    </WhiteBox>)
}

export default AddDirectory

/*
<ModalWindow headerText={isEditing ? 'Редактировать элемент' : 'Добавить новый элемент'} showModal={showModal} closeModal={closeModal}>
                
            </ModalWindow>
            
            const handleEdit = (item) => {
        console.log(item)
        setShowModal(true)
        setSelectedItem(item);
        setNewDirectory({ name: item.name, description: item.description });
        setIsEditing(true);
    };
    const handleAdd = ()=>{
        setShowModal(true)
        setIsEditing(false);
    }
    const closeModal = ()=>{
        setShowModal(false)
        setNewDirectory({ name: '', description: '' })
    }
    const handleChange = (e)=>{
        const {name, value} = e.target
        setNewDirectory({
            ...newDirectory,
            [name]: value
        })
        validateField(name, value)
    }
    const validateField = (name, value)=>{
        if (value===''){
            setFormErrors({
                ...formError,
                [name]:true
            })
        }else{
            setFormErrors({
                ...formError,
                [name]:false
            })
        }
    }
    const handleAddOrEdit = async (e) => {
        e.preventDefault()
        await refreshTokenIfNeeded(dispatch)
        setFormLoading(true)
        try {
            if (isEditing){
                await axios.put(`${mainAddress}/api/directories`,{id:selectedItem.id, name:newDirectory.name, description: newDirectory.description }, {withCredentials:true})
            } else{
                await axios.post(`${mainAddress}/api/directories`, { entity_name: activeType, name: newDirectory.name, description: newDirectory.description }, { withCredentials: true });
            }
            setShowModal(false); 
            setNewDirectory({ name: '', description: '' })
            setIsEditing(false);
            setRefreshKey(prevstate=>!prevstate)
        } catch (error) {
            console.error(error);
        }
        setFormLoading(false)
    };
    const isValid = ()=>{
        for (let key in newDirectory){
            if (newDirectory[key]===''){
                return false
            }
        }
        return true
    }
    
    */