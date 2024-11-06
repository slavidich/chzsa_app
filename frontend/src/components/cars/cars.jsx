import React, {useState, useEffect} from "react";
import '../../styles/cars.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function Cars(){
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
    return (
        <div className="cars">
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "serial_number", header: "Зав. № машины", maxLength:15},
                    {field: "shipping_date", header: "Дата отгрузки с завода", maxLength:20},
                    windowWidth>900||windowWidth<collapseWidth?{field: "technique_model", header: "Модель техники", maxLength:20}:null,
                    windowWidth>900||windowWidth<collapseWidth?{field: "engine_model", header: "Модель двигателя", maxLength:20}:null,
                    windowWidth>1200||windowWidth<collapseWidth?{field: "transmission_model", header: "Модель трансмиссии", maxLength:20}:null,
                    windowWidth>1200||windowWidth<collapseWidth?{field: "driven_axle_model", header: "Модель ведущего моста", maxLength:20}:null,
                    windowWidth>1200||windowWidth<collapseWidth?{field: "steered_axle_model", header: "Модель управляемого моста", maxLength:20}:null,
                    role==='Клиент'?null:{field: "username", header: "Клиент", maxLength:20},
                ]}
                path='/api/cars'
                dispatch={dispatch}
                canAdd={role==='Менеджер'?true:false}
                canSearch={true}
                rowname="Машина"
            />
        </div>
    )
}

export default Cars