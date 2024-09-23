import React from "react";
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

function Directories(){
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [directories, setDirectories] = React.useState([])
    const [activeType, setActiveType] = React.useState(directorieslist[0][0]); // первый тип активный
    const [showModal, setShowModal] = React.useState(false); // модальное окно
    const [newDirectory, setNewDirectory] = React.useState({ name: '', description: '' }); // новая запись
    const [currentPage, setCurrentPage] = React.useState(1); // Текущая страница
    const [totalPages, setTotalPages] = React.useState(1); // Общее количество страниц

    const getDirectroies = async(type, page=1)=>{
        setLoading(true);
        try{
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.get(`${mainAddress}/api/directories?entity_name=${type}&page=${page}`, {withCredentials: true})
            setDirectories(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
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
    const handleAdd = async () => {
        try {
            await axios.post(`${mainAddress}/api/directories`, { entity_name: activeType, name: newDirectory.name, description: newDirectory.description }, { withCredentials: true });
            console.log('добавилось!')
            getDirectroies(activeType, currentPage); // Обновляем список после добавления
            setShowModal(false); // Закрыть модальное окно
            setNewDirectory({ name: '', description: '' })
        } catch (error) {
            console.error(error);
        }
    };
    if (loading){
        return (<div className='e404'>Загрузка</div>)
    }
    
    return(
    <div className='directories'>
        <div className='types'>
            {directorieslist.map(([key, label]) => (
                <p key={key} onClick={() => {setActiveType(key); setCurrentPage(1) }} className={activeType === key ? 'active' : ''}>
                    {label}
                </p>
            ))}
        </div>    
        <div className='list'>
            {directories.length ? (
            <ul>
                {directories.map((directory) => (
                <li key={directory.id}>
                    {directory.name}
                    <button onClick={() => handleEdit(directory.id)}>Редактировать</button>
                    <button onClick={() => handleDelete(directory.id)}>Удалить</button>
                </li>
                ))}
            </ul>
            ) : (
                <p>Данных нет</p>
            )}
            <button onClick={() => setShowModal(true)}>Добавить новый элемент</button>  
        </div>       
        
        {/* мод окно */ }
        {showModal&&(
            <div className='modal-overlay'>
                <div className="modal-content">
                    <form onSubmit={e => { e.preventDefault();  handleAdd();}}>
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
    </div>)
}
export default Directories