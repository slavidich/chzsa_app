import React, {useState, useEffect} from "react";
import '../../styles/to.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function AllTo(){
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
    return(
    <div className="to">
        <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "machine", header: "Зав. № машины", maxLength:15},
                    {field: "maintenance_date", header: "Дата ТО", maxLength:20},
                    windowWidth>900?(role==='Сервисная организация'?null:{field: "service_company", header: "Сервисная организация", maxLength:20}):null,
                    windowWidth>900?{field: "maintenance_type", header: "Тип ТО", maxLength:20}:null,
                    
                    windowWidth>900?{field: "operating_hours", header: "Наработка м/час", maxLength:20}:null,
                    windowWidth>900?{field: "order_number", header: "№ заказ-наряда", maxLength:20}:null,
                    windowWidth>900?{field: "order_date", header: "Дата заказ-наряда", maxLength:10}:null,,
                ]}
                path='/api/to'
                dispatch={dispatch}
                canAdd={role==='Менеджер'||role==='Сервисная организация'||role==='Клиент'?true:false}
                canSearch={true}
            />
    </div>)
}

export default AllTo
