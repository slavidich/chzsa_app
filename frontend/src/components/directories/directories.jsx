import React, {useState, useMemo} from "react";
import '../../styles/directories.scss'
import { useDispatch } from "react-redux";
import UniversalTable from "../dataTable.jsx";

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
    const [refreshKey, setRefreshKey] = useState(false);

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
                        {field: "name", header: "Название", maxLength:20},
                        {field: "description", header: "Описание", maxLength:20, hideWhenWidth:900},
                    ]}
                    params={memoizedParams}
                    path='/api/directories'
                    dispatch={dispatch}
                    canAdd={true}
                    canSearch={true}
                    canChange={true}
                    refreshKey={refreshKey}
                />
            </div>
            
    </div>
    )
}
export default Directories