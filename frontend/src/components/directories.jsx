import React, {useState, useMemo} from "react";
import '../styles/directories.scss'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {mainAddress} from './app.jsx'
import {refreshTokenIfNeeded} from './authUtils'

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
const pagination = 2

function Directories(){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [directories, setDirectories] = useState([])
    const [activeType, setActiveType] = useState(directorieslist[0][0]); // первый тип активный
    const [showModal, setShowModal] = useState(false); // модальное окно
    const [newDirectory, setNewDirectory] = useState({ name: '', description: '' }); // новая запись
    const [isEditing, setIsEditing] = useState(false); // если редактируем какой то элемент 
    const [selectedItem, setSelectedItem] = useState(null); // Для хранения элемента, который редактируется
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

    const getDirectroies = async(type, page=1)=>{
        setLoading(true);
        try{
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.get(`${mainAddress}/api/directories?entity_name=${type}&page=${page}`, {withCredentials: true})
            setDirectories(response.data.results);
            setTotalPages(Math.ceil(response.data.count / pagination));
        }
        catch (error){
            if (error.response && error.response.status===403){
                return <Navigate to="/forbidden" replace />;
            }
        }
        setLoading(false)
    }
    React.useEffect(()=>{
        getDirectroies(activeType, currentPage)
    }, [activeType, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
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
    const handleDelete = async(directory)=>{
        let reply = window.confirm(`Вы действительно хотите удалить "${directory.name}?"`)
        if (reply){
            try{
                await refreshTokenIfNeeded(dispatch)
                await axios.delete(`${mainAddress}/api/directories?id=${directory.id}`, {withCredentials:true}) 
                getDirectroies()
            } catch(error){
                console.error(error)
            }
        }
    }

    
    return(
        <div className='directories'>
            <div className='types'>
                {directorieslist.map(([key, label]) => (
                <p key={key} onClick={() => { setActiveType(key); setCurrentPage(1); }} className={activeType === key ? 'active' : ''}>
                    {label}
                </p>
                ))}
            </div>
        <div className='list'>
            {loading?<div className='e404'>Загрузка</div>:
                <>
                    {directories.length ? (
                    <ul>
                        {directories.map((directory) => (
                        <li key={directory.id}>
                            {directory.name}
                            <button onClick={() => handleEdit(directory)}>Редактировать</button>
                            <button onClick={() => handleDelete(directory)}>Удалить</button>
                        </li>
                        ))}
                    </ul>
                    ) : (
                        <p>Данных нет</p>
                    )}
                </>}
            
            <button onClick={() => { setNewDirectory({ name: '', description: 'Вышла из строя ' }); setShowModal(true);}}>Добавить новый элемент</button>  
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

        {/* Кнопки пагинации */}
        <div className="pagination">
            
        </div>
        
    </div>)
}
export default Directories