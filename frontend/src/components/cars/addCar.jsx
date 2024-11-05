import React, {useState, useEffect} from "react";
import '../../styles/cars.scss'
import { refreshTokenIfNeeded, updateAccessToken } from "../authUtils";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { mainAddress } from "../app.jsx";
import WhiteBox from "../WhiteBox.jsx";
import { EditableField, AutoCompleteSearch, EditableDateField, transformIdsFormData } from "../muiUtil";
import {  Button, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';
import axios from "axios";

function AddCar(props){
    const now = new Date()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation();
    const [year, month, date] = [now.getFullYear(), now.getMonth(), now.getDate()]
    const [isChecking, setIsChecking] = useState(props.check)
    const [isEditing, setIsEditing] = useState(props.check?false:true)
    const [formLoading, setFormLoading] = useState(props.check?true:false)
    const [fetchedData, setFetchedData] = useState({
        serial_number: '',
        technique_model: null,
        engine_model: null,
        engine_serial_number: '',
        transmission_model: null,
        transmission_serial_number: '',
        driven_axle_model: null,
        driven_axle_serial_number: '',
        steered_axle_model: null,
        steered_axle_serial_number: '',
        delivery_contract_number: '',
        shipping_date: new Date(year, month, date),
        cargo_receiver: '',
        delivery_address: '',
        equipment: '',
        client: null,
    })
    const [formData, setFormData] = useState({
        serial_number: '',
        technique_model: null,
        engine_model: null,
        engine_serial_number: '',
        transmission_model: null,
        transmission_serial_number: '',
        driven_axle_model: null,
        driven_axle_serial_number: '',
        steered_axle_model: null,
        steered_axle_serial_number: '',
        delivery_contract_number: '',
        shipping_date: new Date(year, month, date),
        cargo_receiver: '',
        delivery_address: '',
        equipment: '',
        client: null,
    });
    const [formErrors, setFormErrors] = useState({
        serial_number: false,
        technique_model: false,
        engine_model: false,
        engine_serial_number: false,
        transmission_model: false,
        transmission_serial_number: false,
        driven_axle_model: false,
        driven_axle_serial_number: false,
        steered_axle_model: false,
        steered_axle_serial_number: false,
        delivery_contract_number: false,
        shipping_date: false,
        cargo_receiver: false,
        delivery_address: false,
        equipment: false,
        client: false,
    })

    const getData = async()=>{
        try{
            await refreshTokenIfNeeded(dispatch)
            console.log('use')
            const response=await axios.get(`${mainAddress}/api/cars/${id}`,{withCredentials:true})
            setFetchedData({...response.data, shipping_date: new Date(response.data.shipping_date)})
            setFormData({...response.data, shipping_date: new Date(response.data.shipping_date)})
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
        let isValid = true;
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            isValid = false;
        }
        if (name==='shipping_date'){
            const date = new Date(value)
            if (date.toString()==='Invalid Date'|| date>Date.now() || date.getFullYear()<1900){
                isValid = false
            }
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const handleAdd = async (e) => {
        await refreshTokenIfNeeded(dispatch)
        if (!props.check){
            e.preventDefault()
            setFormLoading(true)
            try {
                await axios.post(`${mainAddress}/api/cars`, { ...transformIdsFormData(formData), shipping_date:formData.shipping_date.toLocaleDateString('en-CA') }, { withCredentials: true });
                const response = await axios.get(`${mainAddress}/api/cars`, {withCredentials:true})
                if (response.data.last_page){
                    navigate(`/cars?page=${response.data.last_page}`)
                }else{
                    navigate(`/cars?page=1`)
                }
                setFormLoading(false)
            } catch (error) {
                alert(error.response.data);
                setFormLoading(false)
            }
        } else{
            e.preventDefault()
            if (isEditing){
                setFormLoading(true)
                try {
                    await axios.put(`${mainAddress}/api/cars`, { ...transformIdsFormData(formData), shipping_date:formData.shipping_date.toLocaleDateString('en-CA') }, { withCredentials: true });
                    setFetchedData(formData)
                    setFormLoading(false)
                    setIsEditing(false)
                } catch (error) {
                    alert(error.response.data);
                    setFormLoading(false)
                }
            } else{
                setIsEditing(true)
            }
            
        }
        
    };
    const cancelEdit = async(e)=>{
        setFormData(fetchedData)
        setIsEditing(false)
    }
    const isValid = () => {
        const allFields = Object.keys(formData);
        const requiredFields = allFields.filter(field => field !== 'equipment');

        for (const field of requiredFields) {
            const value = formData[field];
            if(!value||(typeof value==='string' && value.trim()==='')) return false
        }
        if (Object.values(formErrors).some(error=> error===true)){
            return false
        }
        
        return true;
    };

    return (
    <div className="car">
        <WhiteBox headerText={isChecking?`Машина ID:${id}`:'Добавление машины'}>
            
                <EditableField
                    isEditing={isEditing}
                    label='Зав. № машины:'
                    name='serial_number'
                    value={formData.serial_number}
                    error={formErrors.serial_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Модель техники TECHNIQUE_MODEL*/}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Модель техники"
                    name="technique_model"
                    value={formData.technique_model}
                    error={formErrors.technique_model}
                    helperText='Выберите модель техники'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=TECHNIQUE_MODEL`}
                    checkEndPoint={`directories`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                    canCheck={true}
                />
                {/* Модель двигателя  ENGINE_MODEL */}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Модель двигателя"
                    name="engine_model"
                    value={formData.engine_model}
                    error={formErrors.engine_model}
                    helperText='Выберите модель двигателя'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=ENGINE_MODEL`}
                    checkEndPoint={`directories`}
                    canCheck={true}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={isEditing}
                    label='Зав. № двигателя:'
                    name='engine_serial_number'
                    value={formData.engine_serial_number}
                    error={formErrors.engine_serial_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Модель трансмиссии  TRANSMISSION_MODEL */}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Модель трансмиссии"
                    name="transmission_model"
                    value={formData.transmission_model}
                    error={formErrors.transmission_model}
                    helperText='Выберите модель трансмиссии'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=TRANSMISSION_MODEL`}
                    checkEndPoint={`directories`}
                    canCheck={true}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={isEditing}
                    label='Зав. № трансмиссии:'
                    name='transmission_serial_number'
                    value={formData.transmission_serial_number}
                    error={formErrors.transmission_serial_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                 {/* Модель ведущего моста  DRIVEN_AXLE_MODEL */}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Модель ведущего моста"
                    name="driven_axle_model"
                    value={formData.driven_axle_model}
                    error={formErrors.driven_axle_model}
                    helperText='Выберите модель ведущего моста'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=DRIVEN_AXLE_MODEL`}
                    checkEndPoint={`directories`}
                    canCheck={true}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={isEditing}
                    label='Зав. № ведущего моста:'
                    name='driven_axle_serial_number'
                    value={formData.driven_axle_serial_number}
                    error={formErrors.driven_axle_serial_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Модель управляемого моста   STEERED_AXLE_MODEL */}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Модель управляемого моста"
                    name="steered_axle_model"
                    value={formData.steered_axle_model}
                    error={formErrors.steered_axle_model}
                    helperText='Выберите модель управляемого моста'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=STEERED_AXLE_MODEL`}
                    checkEndPoint={`directories`}
                    canCheck={true}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={isEditing}
                    label='Зав. № управляемого моста:'
                    name='steered_axle_serial_number'
                    value={formData.steered_axle_serial_number}
                    error={formErrors.steered_axle_serial_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Договор поставки №, дата */}
                <EditableField
                    isEditing={isEditing}
                    label='Договор поставки №, дата'
                    name='delivery_contract_number'
                    value={formData.delivery_contract_number}
                    error={formErrors.delivery_contract_number}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Дата отгрузки с завода */}
                <EditableDateField
                    isEditing={isEditing}
                    label='Дата отгрузки с завода'
                    name='shipping_date'
                    value={formData.shipping_date}
                    error={formErrors.shipping_date}
                    helperText='Введите корректную дату'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* грузополучатель */}
                <EditableField
                    isEditing={isEditing}
                    label='Грузополучатель (конечный потреб.)'
                    name='cargo_receiver'
                    value={formData.cargo_receiver}
                    error={formErrors.cargo_receiver}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Адрес поставки */}
                <EditableField
                    isEditing={isEditing}
                    label='Адрес поставки'
                    name='delivery_address'
                    value={formData.delivery_address}
                    error={formErrors.delivery_address}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Комплектация */}
                <EditableField
                    isEditing={isEditing}
                    label='Комплектация'
                    name='equipment'
                    value={formData.equipment}
                    onChange={handleChange}
                    loading={formLoading}
                    multiline={true}
                />
                {/* КЛИЕНТ */}
                <AutoCompleteSearch
                    isEditing={isEditing}
                    label="Клиент"
                    name="client"
                    value={formData.client}
                    error={formErrors.client}
                    helperText='Выберите клиента (username)'
                    endpoint={`${mainAddress}/api/search?model=client`}
                    checkEndPoint={`users`}
                    canCheck={true}
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
                        <><Button
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
                </div>

        </WhiteBox>
        
    </div>)
}

export default AddCar