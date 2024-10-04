import React, {useState, useMemo} from "react";
import '../styles/directories.scss'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {mainAddress, pagination_page} from './app.jsx'
import {refreshTokenIfNeeded} from './authUtils'
import MyPagination from './paginations.jsx'
import UniversalTable from "./dataTable.jsx";


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
    const [newDirectory, setNewDirectory] = useState({ name: '', description: '' }); // новая запись
    const [isEditing, setIsEditing] = useState(false); // если редактируем какой то элемент 
    const [selectedItem, setSelectedItem] = useState(null); // Для хранения элемента, который редактируется

    const handleEdit = (item) => {
        console.log(item)
        setSelectedItem(item);
        setNewDirectory({ name: item.name, description: item.description });
        setIsEditing(true);
        setShowModal(true);
    };
    const handleAddorEdit = async () => {
        await refreshTokenIfNeeded(dispatch)
        try {
            if (isEditing){
                await axios.put(`${mainAddress}/api/directories`,{id:selectedItem.id, name:newDirectory.name, description: newDirectory.description }, {withCredentials:true})
            } else{
                await axios.post(`${mainAddress}/api/directories`, { entity_name: activeType, name: newDirectory.name, description: newDirectory.description }, { withCredentials: true });
            }
            getDirectroies(activeType, currentPage); // Обновляем список после добавления
            setShowModal(false); // Закрыть модальное окно
            setNewDirectory({ name: '', description: '' })
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };
    
    return(
        <div className='directories'>
            <div className='types'>
                {directorieslist.map(([key, label]) => (
                <p key={key} onClick={() => { setActiveType(key);}} className={activeType === key ? 'active' : ''}>
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
                params={{
                    entity_name: activeType
                }}
                path='/api/directories'
                dispatch={dispatch}
            />
        </div>       
        
        {/* мод окно */ }
        {showModal&&(
            <div className='modal-overlay'>
                <div className="modal-content">
                    <h2>{isEditing ? 'Редактировать элемент' : 'Добавить новый элемент'}</h2>
                    <form onSubmit={e => { e.preventDefault();  handleAddorEdit();}}>
                        <div>
                            <label>Название:</label>
                            <input type="text" value={newDirectory.name} onChange={e => setNewDirectory({ ...newDirectory, name: e.target.value })} required />
                        </div>
                        <div>
                            <label>Описание:</label>
                            <textarea value={newDirectory.description} onChange={e => setNewDirectory({ ...newDirectory, description: e.target.value })} />
                        </div>
                        <button type="submit">Добавить</button>
                        <button type="button" onClick={() => setShowModal(false)}>Отмена</button>
                    </form>
                </div>
            </div>
        )}

        
        
    </div>
    )
}
export default Directories