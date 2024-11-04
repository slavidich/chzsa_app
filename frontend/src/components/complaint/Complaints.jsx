import React, {useState} from "react";
import '../../styles/to.scss'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UniversalTable from "../dataTable";

function Complaints(){
    const dispatch = useDispatch();
    const role = useSelector(state=>state.auth.role)
    return (
        <div className="complaints">
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "machine", header: "Зав. № машины", maxLength:15},
                    {field: "service_company", header: "Сервисная организация", maxLength:20, hideWhenWidth:900},
                    {field: "date_refuse", header: "Дата отказа", maxLength:20, hideWhenWidth:900},
                    {field: "failure_node", header: "Узел отказа", maxLength:20, hideWhenWidth:900},
                    {field: "recovery_method", header: "Метод восстановления", maxLength:20, hideWhenWidth:900},
                    {field: "recovery_date", header: "Дата восстановления", maxLength:20, hideWhenWidth:900},
                ]}
                path='/api/complaints'
                dispatch={dispatch}
                canAdd={role==='Менеджер'?true:false}
                canSearch={role==='Менеджер'?true:false}
            />
        </div>
    )
}

export default Complaints