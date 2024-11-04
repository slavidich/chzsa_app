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


function AddTo(props){
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
        maintenance_type: null,
        maintenance_date: today,
        operating_hours:'',
        order_number: '',
        order_date: today,
    })
    const [formData, setFormData] = useState({
        machine: null, 
        service_company: null,
        maintenance_type: null,
        maintenance_date: !isChecking? today: '',
        operating_hours:'',
        order_number: '',
        order_date: !isChecking? today: '',
    });
    const [formErrors, setFormErrors] = useState({
        machine: false, 
        service_company: false,
        maintenance_type: false,
        maintenance_date: false,
        operating_hours:false,
        order_number: false,
        order_date: false,
    })
    const getData = async()=>{
        try{
            await refreshTokenIfNeeded(dispatch)
            console.log('use')
            const response=await axios.get(`${mainAddress}/api/to/${id}`,{withCredentials:true})
            setFetchedData({...response.data, maintenance_date: new Date(response.data.maintenance_date), order_date: new Date(response.data.order_date)})
            setFormData({...response.data, maintenance_date: new Date(response.data.maintenance_date), order_date: new Date(response.data.order_date)})
            setFormLoading(false)
        }catch(error){
            if (error.response && error.response.status === 404) {
                navigate('/404')
            }
            if (error.response && error.response.status === 403){
                navigate('/403')
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
        let isValid = true;
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            isValid = false;
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const isValid=()=>{
        const allFields = Object.keys(formData);
        for (const field of allFields){
            const value = formData[field];
            if(!value||(typeof value==='string' && value.trim()==='')) return false
        }
        return true;
    }
    const handleAdd = async(e)=>{
        refreshTokenIfNeeded(dispatch)
        if (!props.check){
            e.preventDefault()
            setFormLoading(true)
            try{
                await axios.post(`${mainAddress}/api/to`, {
                    ...transformIdsFormData(formData), 
                    maintenance_date: formData.maintenance_date.toLocaleDateString('en-CA'),
                    order_date: formData.order_date.toLocaleDateString('en-CA')
                }, {withCredentials:true})
                const response = await axios.get(`${mainAddress}/api/to`, {withCredentials:true})
                if (response.data.last_page){
                    navigate(`/to?page=${response.data.last_page}`)
                }else{
                    navigate(`/to?page=1`)
                }
            }catch(error){

            }
        }else{
            e.preventDefault()
            if (isEditing){
                setFormLoading(true)
                try {
                    await axios.put(`${mainAddress}/api/to`, {
                        ...transformIdsFormData(formData), 
                        maintenance_date: formData.maintenance_date.toLocaleDateString('en-CA'),
                        order_date: formData.order_date.toLocaleDateString('en-CA')
                    }, { withCredentials: true });
                    setFetchedData(formData)
                    setFormLoading(false)
                    setIsEditing(false)
                } catch (error) {
                    setFormData({
                        ...fetchedData, 
                    })
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
    return(
    <div className="addto">
        <WhiteBox headerText={isChecking?`ТО ID:${id}`:'Добавление ТО'}>
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
            {/* ВИД ТО*/}
            <AutoCompleteSearch
                isEditing={isEditing}
                label="Вид ТО"
                name="maintenance_type"
                value={formData.maintenance_type}
                error={formErrors.maintenance_type}
                helperText='Выберите вид ТО'
                placeholder="Введите названия сервиса"
                endpoint={`${mainAddress}/api/search?model=directory&entity_name=MAINTENANCE_TYPE`}
                checkEndPoint={`directories`}
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
            {/* Дата проведения ТО */}
            <EditableDateField
                    isEditing={isEditing}
                    label='Дата проведения ТО'
                    name='maintenance_date'
                    value={formData.maintenance_date}
                    error={formErrors.maintenance_date}
                    helperText='Выберите дату'
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
            {/* № заказ-наряда */}
            <EditableField
                    isEditing={isEditing}
                    label='№ заказ-наряда'
                    name='order_number'
                    value={formData.order_number}
                    error={formErrors.order_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
            />
            {/* Дата заказ-наряда */}
            <EditableDateField
                    isEditing={isEditing}
                    label='Дата заказ-наряда'
                    name='order_date'
                    value={formData.order_date}
                    error={formErrors.order_date}
                    helperText='Выберите дату'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
            />
            <div className="formButtons">
                {!props.check?
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!isValid()||formLoading} >
                        {formLoading?<CircularProgress/>:<>Добавить</>}
                    </Button>
                :
                    <>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleAdd}
                            disabled={!isValid()||formLoading}>
                                {formLoading?<CircularProgress/>:isEditing?'Сохранить':'Изменить'}
                        </Button>
                        {isEditing?
                            <Button 
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={cancelEdit}
                                disabled={formLoading}>
                                    {formLoading?<CircularProgress/>:'Отменить'}
                            </Button>
                        :<></>}
                    </>
                }   
            </div>
        </WhiteBox>
        
    </div>)
}

export default AddTo