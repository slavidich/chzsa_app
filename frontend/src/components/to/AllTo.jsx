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
                    {field: "machine", header: "Зав. № машины", maxLength:15},
                    {field: "service_company", header: "Сервисная организация", maxLength:20, hideWhenWidth:900},
                    {field: "maintenance_type", header: "Тип ТО", maxLength:20, hideWhenWidth:900},
                    {field: "maintenance_date", header: "Дата ТО", maxLength:20, hideWhenWidth:900},
                    {field: "operating_hours", header: "Наработка м/час", maxLength:20, hideWhenWidth:900},
                    {field: "order_number", header: "№ заказ-наряда", maxLength:20, hideWhenWidth:900},
                    {field: "order_date", header: "Дата заказ-наряда", maxLength:10},,
                ]}
                path='/api/to'
                dispatch={dispatch}
                canAdd={role==='Менеджер'?true:false}
                canSearch={role==='Менеджер'?true:false}
            />
    </div>)
}

export default AllTo
