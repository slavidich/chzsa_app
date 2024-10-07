import React, {useState} from "react";
import UniversalTable from "./dataTable.jsx";
import { useDispatch } from "react-redux";
import ModalWindow from "./ModalWindow.jsx";
import { mainAddress } from "./app.jsx";
import { Modal } from "@mui/material";
import '../styles/services.scss'

function Services(){
    const dispatch = useDispatch()
    const [refreshKey, setRefreshKey] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingItem, setEditingItem] = useState({})
    const [formData, setFormData] = useState({
        username:'',
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:''
    })
    const clearFormData=()=>setFormData({
        username:'',
        name:'',
        description:'',
        user_first_name:'',
        user_last_name:'',
        user_email:''
    })
    const handleAddButton =()=>{
        setShowModal(true)
    }
    const handleChangeButton =(item)=>{
        console.log(item)
        setShowModal(true)
        setEditingItem(item)
    }
    const closeModalButton=()=>{
        setShowModal(false)
        clearFormData()
    }
    return(<div className="services">
    <UniversalTable
        columns={[
            {field: "id", header: "ID"},
            {field:'username', header:'username'},
            {field: "name", header: "Название"},
            {field: "description", header: "Описание", hideWhenWidth:1200},
            {field: "user_first_name", header: "Имя директора", hideWhenWidth:800},
            {field: "user_last_name", header: "Фамилия директора", hideWhenWidth:800},
            {field: "user_email", header: "email", hideWhenWidth:1200},
        ]}
        path='/api/services'
        dispatch={dispatch}
        canAdd={true}
        actionOnAdd={handleAddButton}
        canSearch={true}
        canChange={true}
        actionOnChange={handleChangeButton}
        refreshKey={refreshKey}
    />
    <ModalWindow showModal={showModal} headerText={isEditing?'Изменение сервисной организации':'Добавление сервисной организации'} closeModal={closeModalButton}>

    </ModalWindow>
    </div>)
}

export default Services