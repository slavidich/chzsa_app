import React, {useState, useMemo, useEffect} from "react";
import '../../styles/directories.scss'
import { useDispatch } from "react-redux";
import UniversalTable from "../dataTable.jsx";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export const directorieslist = [
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
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [activeType, setActiveType] = useState(searchParams.get('entity_name')||directorieslist[0][0]); // первый тип активный
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const collapseWidth = 740
    useEffect(()=>{
        const entityName = searchParams.get('entity_name');
        if (entityName && entityName !== activeType) {
            setActiveType(entityName);
        }
    }, [searchParams])
    

    useEffect(() => {
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const memoizedParams = useMemo(() => ({
        entity_name: activeType
    }), [activeType]);
    
    const handleChangeType = (type)=>{
        setActiveType(type)
        if (searchParams.get('rowsPerPage')===null){
            setSearchParams({ entity_name: type, page:1}); 
        }else{
            setSearchParams({ entity_name: type, page:1, rowsPerPage:searchParams.get('rowsPerPage')}); 
        }
    }
    return(
        <div className='directories'>
            <div className='types'>
                {directorieslist.map(([key, label]) => (
                <p key={key} onClick={() => handleChangeType(key)} className={activeType === key ? 'active' : ''}>
                    {label}
                </p>
                ))}
            </div>
        
            <div className='list'>
                <UniversalTable
                    columns={[
                        {field: "id", header: "ID"},
                        {field: "name", header: "Название", maxLength:20},
                        windowWidth>900||windowWidth<collapseWidth?{field: "description", header: "Описание", maxLength:20}:null,
                    ]}
                    params={memoizedParams}
                    path='/api/directories'
                    dispatch={dispatch}
                    canAdd={true}
                    canSearch={true}
                    canChange={true}
                    actionOnAdd={()=>{navigate(`new?entity_name=${activeType}`, {state:{from: location.pathname+location.search}})}}
                    rowname="Справочник"
                />
            </div>
            
    </div>
    )
}
export default Directories