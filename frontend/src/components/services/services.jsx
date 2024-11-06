import React, {useEffect, useState} from "react";
import UniversalTable from "../dataTable.jsx";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import '../../styles/services.scss'


function Services(){
    const dispatch = useDispatch();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const collapseWidth = 740
    useEffect(() => {
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return(<div className="services">
    <UniversalTable
        columns={[
            {field: "id", header: "ID"},
            {field:'username', header:'username', maxLength:15,},
            {field: "name", header: "Название", maxLength:15,},
            windowWidth>1200?{field: "description", header: "Описание", maxLength:15}:null,
            windowWidth>800?{field: "user_first_name", header: "Имя директора", maxLength:15}:null,
            windowWidth>800||windowWidth<collapseWidth?{field: "user_last_name", header: "Фамилия директора", maxLength:15}:null,
            windowWidth>1200||windowWidth<collapseWidth?{field: "user_email", header: "email", maxLength:15}:null,
        ]}
        path='/api/services'
        dispatch={dispatch}
        canAdd={true}
        canSearch={true}
        canChange={true}
        rowname="Сервисная организация"
    />
    
    </div>)
}

export default Services