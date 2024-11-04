import React, {useState, useEffect} from "react";
import '../../styles/to.scss'
import { refreshTokenIfNeeded } from "../authUtils";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { mainAddress } from "../app.jsx";
import WhiteBox from "../WhiteBox.jsx";
import { EditableField, AutoCompleteSearch, EditableDateField, transformIdsFormData } from "../muiUtil";
import {  Button, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';
import axios from "axios";

function AddComplaint(props){
    const now = new Date()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation();
    const [year, month, date] = [now.getFullYear(), now.getMonth(), now.getDate()]
    const today = new Date(year, month, date)
    const [isChecking, setIsChecking] = useState(props.check)
    const [isEditing, setIsEditing] = useState(props.check?false:true)
    const [formLoading, setFormLoading] = useState(props.check?true:false)
    const [fetchedData, setFetchedData] = useState({
        machine: null, 
        service_company: null,
        date_refuse: today,
        operating_hours: '',
        failure_node:null,
        failure_description: '',
        recovery_method: null,
        parts_used:'',
        recovery_date: today,
        downtime:''
    })
    const [formData, setFormData] = useState({
        machine: null, 
        service_company: null,
        date_refuse: today,
        operating_hours: '',
        failure_node:null,
        failure_description: '',
        recovery_method: null,
        parts_used:'',
        recovery_date: today,
        downtime:'0'
    });
    const [formErrors, setFormErrors] = useState({
        machine: false, 
        service_company: false,
        date_refuse: false,
        operating_hours: false,
        failure_node:false,
        failure_description: false,
        recovery_method: false,
        parts_used:false,
        recovery_date: false,
        downtime:false
    })
    const handleChange = (e) => {
        
        const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
        }));
        validateField(name, value)
    };
    const validateField=(name, value)=>{
        if (name==='date_refuse'){
            if (!value){
                setFormErrors({
                    ...formErrors, 
                    [name]: true
                })
            } else if (value>formData.recovery_date){
                setFormErrors({
                    ...formErrors,
                    [name]:true,
                    recovery_date: true
                })
            } else{
                setFormErrors({
                    ...formErrors, 
                    [name]: false
                })
                setFormData(prevState => ({
                    ...prevState,
                    downtime: (formData.recovery_date-value )/ (60 * 60 * 24 * 1000)
                }))
            }
        }else if (name==='recovery_date'){
            if (!value){
                setFormErrors({
                    ...formErrors, 
                    [name]: true
                })
            }else if(value<formData.date_refuse){
                setFormErrors({
                    ...formErrors,
                    [name]:true,
                    date_refuse: true
                })
            } else{
                setFormErrors({
                    ...formErrors, 
                    [name]: false
                })
                setFormData(prevState => ({
                    ...prevState,
                    downtime: (value- formData.date_refuse)/ (60 * 60 * 24 * 1000)
                }))
            }
            
        } else{
            let isValid = true;
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                isValid = false;
            }
            setFormErrors({
                ...formErrors,
                [name]: !isValid
            });
        }
        
        
    }
    const isValid=()=>{
        const allFields = Object.keys(formData);
        for (const field of allFields){
            const value = formData[field];
            if(!value||(typeof value==='string' && value.trim()==='')) return false
        }
        return true;
    }

    return (
    <div className="addcomplaint">
        <WhiteBox headerText={isChecking?`Релкамация ID:${id}`:'Добавление рекламации'}>
            {/* machine*/}
            <AutoCompleteSearch
                isEditing={isEditing}
                label="Машина"
                name="machine"
                value={formData.machine}
                error={formErrors.machine}
                helperText='Выберите машину'
                placeholder="Введите зав № машины"
                endpoint={`${mainAddress}/api/search?model=machine`}
                checkEndPoint={`cars`}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
                canCheck={true}
            />
            {/* service*/}
            <AutoCompleteSearch
                isEditing={isEditing}
                label="Сервисная организация"
                name="service_company"
                value={formData.service_company}
                error={formErrors.service_company}
                helperText='Выберите сервисную организаци'
                placeholder="Введите названия сервиса"
                endpoint={`${mainAddress}/api/search?model=service`}
                checkEndPoint={`services`}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
                canCheck={true}
            />
            {/* Дата отказа */}
            <EditableDateField
                isEditing={isEditing}
                label='Дата отказа'
                name='date_refuse'
                value={formData.date_refuse}
                error={formErrors.date_refuse}
                helperText={formData.recovery_date && formData.date_refuse && formData.recovery_date < formData.date_refuse?'Дата отказа не может быть позже даты восстановления':'Выберите дату'}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
            />
            {/* Наработка */}
            <EditableField
                isEditing={isEditing}
                label='Наработка, м/час'
                name='operating_hours'
                value={formData.operating_hours}
                error={formErrors.operating_hours}
                helperText='Заполните поле'
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
            />
            {/* Узел отказа*/}
            <AutoCompleteSearch
                isEditing={isEditing}
                label="Узел отказа"
                name="failure_node"
                value={formData.failure_node}
                error={formErrors.failure_node}
                helperText='Выберите узел отказа'
                placeholder="Введите узел отказа"
                endpoint={`${mainAddress}/api/search?model=directory&entity_name=FAILURE_NODE`}
                checkEndPoint={`directories`}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
                canCheck={true}
            />
            {/* Описание отказа */}
            <EditableField
                isEditing={isEditing}
                label='Описание отказа'
                name='failure_description'
                value={formData.failure_description}
                onChange={handleChange}
                loading={formLoading}
                isReq={false}
                multiline={true}
            />
            {/* Способ восстановления*/}
            <AutoCompleteSearch
                isEditing={isEditing}
                label="Способ восстановления"
                name="recovery_method"
                value={formData.recovery_method}
                error={formErrors.recovery_method}
                helperText='Выберите способ восстановления'
                placeholder="Введите способ восстановления"
                endpoint={`${mainAddress}/api/search?model=directory&entity_name=RECOVERY_METHOD`}
                checkEndPoint={`directories`}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
                canCheck={true}
            />
            {/* Используемые запасные части */}
            <EditableField
                isEditing={isEditing}
                label='Используемые запасные части'
                name='parts_used'
                value={formData.parts_used}
                onChange={handleChange}
                loading={formLoading}
                isReq={false}
                multiline={true}
            />
            {/* Дата восстановления */}
            <EditableDateField
                isEditing={isEditing}
                label='Дата восстановления'
                name='recovery_date'
                value={formData.recovery_date}
                error={formErrors.recovery_date}
                helperText={formData.recovery_date && formData.date_refuse && formData.recovery_date < formData.date_refuse?'Дата восстановления не может быть раньше даты отказа':'Выберите дату'}
                onChange={handleChange}
                loading={formLoading}
                isReq={true}
            />
            {/* Время простоя техники */}
            <EditableField
                isEditing={isEditing}
                label='Время простоя техники'
                name='downtime'
                value={formData.downtime.toString()+' дней'}
                onChange={handleChange}
                loading={true}
                isReq={false}
                multiline={true}
            />
            {!props.check?
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={()=>console.log(formData)}
                        disabled={formLoading} >
                        {formLoading?<CircularProgress/>:<>Добавить</>}
                    </Button>
                :<></>}
        </WhiteBox>
    </div>)
}

export default AddComplaint