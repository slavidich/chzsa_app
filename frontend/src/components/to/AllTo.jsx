import React, {useState, useEffect} from "react";
import '../../styles/to.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function AllTo(){
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const collapseWidth = 740
    useEffect(() => {
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return(
    <div className="to">
        {windowWidth<collapseWidth&&<h1 style={{textAlign:'center'}}>ТО</h1>}
        <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "machine", header: "Зав. № машины", maxLength:15},
                    {field: "maintenance_date", header: "Дата ТО", maxLength:20},
                    windowWidth>900||windowWidth<collapseWidth?(role==='Сервисная организация'?null:{field: "service_company", header: "Сервисная организация", maxLength:20}):null,
                    windowWidth>900||windowWidth<collapseWidth?{field: "maintenance_type", header: "Тип ТО", maxLength:20}:null,
                    
                    windowWidth>900||windowWidth<collapseWidth?{field: "operating_hours", header: "Наработка м/час", maxLength:20}:null,
                    windowWidth>1200||windowWidth<collapseWidth?{field: "order_number", header: "№ заказ-наряда", maxLength:20}:null,
                    windowWidth>1200||windowWidth<collapseWidth?{field: "order_date", header: "Дата заказ-наряда", maxLength:10}:null,,
                ]}
                path='/api/to'
                dispatch={dispatch}
                canAdd={role==='Менеджер'||role==='Сервисная организация'||role==='Клиент'?true:false}
                canSearch={true}
            />
    </div>)
}

export default AllTo
