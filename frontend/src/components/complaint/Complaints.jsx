import React, {useState, useEffect} from "react";
import '../../styles/complaints.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function Complaints(){
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className="complaints">
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "machine", header: "Зав. № машины", maxLength:15},
                    {field: "date_refuse", header: "Дата отказа", maxLength:20},
                    windowWidth>900?(role!='Сервисная организация'?{field: "service_company", header: "Сервисная организация", maxLength:20}
                    :null):null,
                    windowWidth>900?{field: "failure_node", header: "Узел отказа", maxLength:20}:null,
                    windowWidth>900?{field: "recovery_method", header: "Метод восстановления", maxLength:20}:null,
                    windowWidth>900?{field: "recovery_date", header: "Дата восстановления", maxLength:20}:null,
                ]}
                path='/api/complaints'
                dispatch={dispatch}
                canAdd={['Менеджер', 'Сервисная организация'].includes(role)?true:false}
                canSearch={true}
            />
        </div>
    )
}

export default Complaints