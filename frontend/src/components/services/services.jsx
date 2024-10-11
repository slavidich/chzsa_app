import React, {useEffect} from "react";
import UniversalTable from "../dataTable.jsx";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import '../../styles/services.scss'


function Services(){
    const dispatch = useDispatch();

    return(<div className="services">
    <UniversalTable
        columns={[
            {field: "id", header: "ID"},
            {field:'username', header:'username', maxLength:15,},
            {field: "name", header: "Название", maxLength:15,},
            {field: "description", header: "Описание", maxLength:15, hideWhenWidth:1200},
            {field: "user_first_name", header: "Имя директора", maxLength:15, hideWhenWidth:800},
            {field: "user_last_name", header: "Фамилия директора", maxLength:15, hideWhenWidth:800},
            {field: "user_email", header: "email", maxLength:15, hideWhenWidth:1200},
        ]}
        path='/api/services'
        dispatch={dispatch}
        canAdd={true}
        canSearch={true}
        canChange={true}
    />
    
    </div>)
}

export default Services