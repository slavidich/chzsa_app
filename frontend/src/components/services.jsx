import React, {useState} from "react";
import UniversalTable from "./dataTable.jsx";
import { useDispatch } from "react-redux";


function Services(){
    const dispatch = useDispatch()
    const [refreshKey, setRefreshKey] = useState(false)

    return(<>
    <UniversalTable
        columns={[
            {field: "id", header: "ID"},
            {field:'username', header:'username'},
            {field: "name", header: "Название"},
            {field: "description", header: "Описание"},
            {field: "user_first_name", header: "Имя директора"},
            {field: "user_last_name", header: "Фамилия директора"},
            {field: "user_email", header: "email"},

        ]}
        path='/api/services'
        dispatch={dispatch}
        canAdd={true}
        
        canSearch={true}
        canChange={true}
        
        refreshKey={refreshKey}
    />
    </>)
}

export default Services