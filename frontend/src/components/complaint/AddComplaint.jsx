import React, {useState, useEffect} from "react";
import '../../styles/complaints.scss'
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
    const getData = async()=>{
        try{
            await refreshTokenIfNeeded(dispatch)
            const response=await axios.get(`${mainAddress}/api/complaint/${id}`,{withCredentials:true})
            setFetchedData({...response.data, date_refuse: new Date(response.data.date_refuse), recovery_date:new Date(response.data.recovery_date)})
            setFormData({...response.data, date_refuse: new Date(response.data.date_refuse), recovery_date:new Date(response.data.recovery_date) })
            setFormLoading(false)
        }catch(error){
            if (error.response && error.response.status === 404) {
                navigate('/404')
            }
            console.log(error)
        }
    }
    useEffect(()=>{
        if (isChecking){
            getData()
        }
    }, [])
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
            const date = new Date(value)
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
            } else if (date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900){
                setFormErrors({
                    ...formErrors,
                    [name]:true
                })
            } else{
                const date = new Date(formData.recovery_date)
                setFormErrors({
                    ...formErrors, 
                    [name]: false,
                    recovery_date: (date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900)? true:false
                })
                setFormData(prevState => ({
                    ...prevState,
                    downtime: (formData.recovery_date-value )/ (60 * 60 * 24 * 1000)
                }))
            }
        }else if (name==='recovery_date'){
            const date = new Date(value)
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
            } else if(date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900){
                setFormErrors({
                    ...formErrors,
                    [name]:true
                })
            }else {
                const date = new Date(formData.date_refuse)
                setFormErrors({
                    ...formErrors, 
                    [name]: false,
                    date_refuse:(date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900)? true:false
                })
                setFormData(prevState => ({
                    ...prevState,
                    downtime: (value- formData.date_refuse)/ (60 * 60 * 24 * 1000)
                }))
            }
        } else{
            const allFields = Object.keys(formData);
            const requiredFields = allFields.filter(field => field !== 'parts_used'&&field!=='failure_description');
            if (requiredFields.includes(name)===false) return false
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
        const requiredFields = allFields.filter(field => field !== 'parts_used'&&field!=='failure_description');
        for (const field of requiredFields){
            const value = formData[field];
            if(!value||(typeof value==='string' && value.trim()==='')) return false
        }
        if (Object.values(formErrors).some(error=> error===true)){
            return false
        }
        return true;
    }
    const handleAdd = async (e) => {
        await refreshTokenIfNeeded(dispatch)
        if (!props.check){
            setFormLoading(true)
            try{
                await axios.post(`${mainAddress}/api/complaints`, { ...transformIdsFormData(formData), 
                    date_refuse:formData.date_refuse.toLocaleDateString('en-CA'),
                    recovery_date: formData.recovery_date.toLocaleDateString('en-CA')}, { withCredentials: true });
                const response = await axios.get(`${mainAddress}/api/complaints`, {withCredentials:true})
                if (response.data.last_page){
                    navigate(`/complaint?page=${response.data.last_page}`)
                }else{
                    navigate(`/complaint?page=1`)
                }
                setFormLoading(false)
            }catch(error){
                alert(error.response.data);
                setFormLoading(false)
            }
        }else{
            if (isEditing){
                setFormLoading(true)
                try {
                    await axios.put(`${mainAddress}/api/complaints`, { ...transformIdsFormData(formData), 
                        date_refuse:formData.date_refuse.toLocaleDateString('en-CA'),
                        recovery_date: formData.recovery_date.toLocaleDateString('en-CA')}, { withCredentials: true });
                    setFetchedData(formData)
                    setFormLoading(false)
                    setIsEditing(false)
                } catch(error){
                    alert(error.response.data);
                    setFormLoading(false)
                }
            }else{
                setIsEditing(true)
            }
        }
    }
    const cancelEdit = async(e)=>{
        setFormData(fetchedData)
        setIsEditing(false)
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
                helperText={formData.recovery_date && formData.date_refuse && formData.recovery_date < formData.date_refuse?'Дата отказа не может быть позже даты восстановления':'Выберите корректную дату'}
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
                helperText={formData.recovery_date && formData.date_refuse && formData.recovery_date < formData.date_refuse?'Дата восстановления не может быть раньше даты отказа':'Выберите корректную дату'}
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
                loading={isEditing?true:isChecking?false:true}
                isReq={false}
                multiline={true}
            />
            {!props.check?
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!isValid()||formLoading} >
                        {formLoading?<CircularProgress/>:<>Добавить</>}
                    </Button>
                :<><Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!isValid()||formLoading}>
                            {formLoading?<CircularProgress/>:isEditing?'Сохранить':'Изменить'}
                            
                    </Button>
                    {isEditing?(
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={cancelEdit}
                            disabled={formLoading}>
                                {formLoading?<CircularProgress/>:'Отменить'}
                        </Button>):<></>}</>}
        </WhiteBox>
    </div>)
}

export default AddComplaint