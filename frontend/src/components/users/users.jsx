import "../../styles/users.scss";
import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import UniversalTable from "../dataTable.jsx";


function Users(){
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
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
        <div className="users">
            {windowWidth<collapseWidth&&<h1 style={{textAlign:'center'}}>Клиенты</h1>}
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