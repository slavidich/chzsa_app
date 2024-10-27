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
                    {field: "username", header: "username", maxLength:10},
                    {field: "first_name", header: "Имя", maxLength:10},
                    {field: "last_name", header: "Фамилия", maxLength:10, hideWhenWidth:900},
                    {field: "email", header: "Email", maxLength:10, hideWhenWidth:1200},
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