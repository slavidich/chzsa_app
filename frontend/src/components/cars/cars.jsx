import React, {useState} from "react";
import '../../styles/cars.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function Cars(){
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)

    return (
        <div className="cars">
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "serial_number", header: "Зав. № машины", maxLength:10},
                    {field: "technique_model", header: "Модель техники", maxLength:20, hideWhenWidth:900},
                    {field: "username", header: "Клиент", maxLength:10},,
                ]}
                path='/api/cars'
                dispatch={dispatch}
                canAdd={role==='Менеджер'?true:false}
                canSearch={role==='Менеджер'?true:false}
            />
        </div>
    )
}

export default Cars