import React, {useState} from "react";
import '../../styles/to.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function AllTo(){
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)

    return(
    <div className="to">
        <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "serial_number", header: "Зав. № машины", maxLength:15},
                    {field: "technique_model", header: "Модель техники", maxLength:20, hideWhenWidth:900},
                    {field: "engine_model", header: "Модель двигателя", maxLength:20, hideWhenWidth:900},
                    {field: "transmission_model", header: "Модель трансмиссии", maxLength:20, hideWhenWidth:900},
                    {field: "driven_axle_model", header: "Модель ведущего моста", maxLength:20, hideWhenWidth:900},
                    {field: "steered_axle_model", header: "Модель управляемого моста", maxLength:20, hideWhenWidth:900},

                    {field: "username", header: "Клиент", maxLength:10},,
                ]}
                path='/api/to'
                dispatch={dispatch}
                canAdd={role==='Менеджер'?true:false}
                canSearch={role==='Менеджер'?true:false}
            />
    </div>)
}

export default AllTo
