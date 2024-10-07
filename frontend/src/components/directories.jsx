import React, {useState, useMemo} from "react";
import '../styles/directories.scss'
import axios from 'axios';
import { useDispatch } from "react-redux";
import ModalWindow from './ModalWindow.jsx'
import {mainAddress} from './app.jsx'
import {refreshTokenIfNeeded} from './authUtils'
import UniversalTable from "./dataTable.jsx";
import { FormControl, TextField, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

const directorieslist = [
    ['TECHNIQUE_MODEL', 'Модель техники'],
    ['ENGINE_MODEL', 'Модель двигателя'],
    ['TRANSMISSION_MODEL', 'Модель трансмиссии'],
    ['DRIVEN_AXLE_MODEL', 'Модель ведущего моста'],
    ['STEERED_AXLE_MODEL', 'Модель управляемого моста'],
    ['MAINTENANCE_TYPE', 'Вид ТО'],
    ['FAILURE_NODE', 'Узел отказа'],
    ['RECOVERY_METHOD', 'Способ восстановления'],
]

function Directories(){
    const dispatch = useDispatch();

    const [activeType, setActiveType] = useState(directorieslist[0][0]); // первый тип активный
    const [showModal, setShowModal] = useState(false); // модальное окно
    const [refreshKey, setRefreshKey] = useState(false);
    const [newDirectory, setNewDirectory] = useState({ name: '', description: '' }); // новая запись
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormErrors] = useState({
        name: false,
        description: false,
    })
    const [isEditing, setIsEditing] = useState(false); // если редактируем какой то элемент 
    const [selectedItem, setSelectedItem] = useState(null); // Для хранения элемента, который редактируется

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
    const memoizedParams = useMemo(() => ({
        entity_name: activeType
    }), [activeType]);
    
    return(
        <div className='directories'>
            <div className='types'>
                {directorieslist.map(([key, label]) => (
                <p key={key} onClick={() => { setActiveType(key); }} className={activeType === key ? 'active' : ''}>
                    {label}
                </p>
                ))}
            </div>
        
        <div className='list'>
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "name", header: "Название"},
                    {field: "description", header: "Описание"},
                ]}
                params={memoizedParams}
                path='/api/directories'
                dispatch={dispatch}
                canAdd={true}
                actionOnAdd={handleAdd}
                canSearch={true}
                canChange={true}
                actionOnChange={handleEdit}
                refreshKey={refreshKey}
            />
        </div>
        <ModalWindow headerText={isEditing ? 'Редактировать элемент' : 'Добавить новый элемент'} showModal={showModal} closeModal={closeModal}>
            <form onSubmit={handleAddOrEdit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        id='name'
                        label='Название'
                        variant='outlined'
                        name='name'
                        value={newDirectory.name}
                        onChange={handleChange}
                        error={formError.name}
                        helperText={formError.name && "Поле не может быть пустым"}
                        disabled={formLoading}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        multiline
                        rows={4}
                        id='description'
                        label='Описание'
                        variant='outlined'
                        name='description'
                        value={newDirectory.description}
                        onChange={handleChange}
                        disabled={formLoading}
                        error={formError.description}
                        helperText={formError.description && "Поле не может быть пустым"}
                        required
                    />
                </FormControl>
                <div className="formButtons">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid()||formLoading} >
                        {formLoading?<CircularProgress  />:<>{isEditing?"Сохранить":"Добавить"}</>}
                    </Button>
                    
                </div>
            </form>
        </ModalWindow>
    </div>
    )
}
export default Directories