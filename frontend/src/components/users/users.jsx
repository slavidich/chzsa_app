import "../../styles/users.scss";
import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import UniversalTable from "../dataTable.jsx";


function Users(){
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    
    return(
        <div className="users">
            <UniversalTable
                columns={[
                    {field: "id", header: "ID"},
                    {field: "username", header: "username", maxLength:10},
                    {field: "first_name", header: "Имя", maxLength:10},
                    {field: "last_name", header: "Фамилия", maxLength:10, hideWhenWidth:900},
                    {field: "email", header: "Email", maxLength:10, hideWhenWidth:1200},
                ]}
                path='/api/users'
                dispatch={dispatch}
                canAdd={true}
                canSearch={true}
            />
        </div>
        
    )
}

export default Users