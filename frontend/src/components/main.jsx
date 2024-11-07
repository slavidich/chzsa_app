import React, {useState, useEffect} from "react";
import '../styles/mainPage.scss'
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import WhiteBox from './WhiteBox.jsx'
import { EditableField, AutoCompleteSearch } from "./muiUtil.jsx";
import { mainAddress } from "./app";
import {TextField, Button} from "@mui/material";
import { SearchIcon } from "lucide-react";
import { Height } from "@mui/icons-material";
import axios from "axios";


function MainPage(){
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)
    const isAuthInProgress = useSelector(state => state.auth.isAuthInProgress)
    const [formLoading, setFormLoading] = useState(false)

    const navigate = useNavigate()
    const [serialNumber, setSerialNumber] = useState('')
    const [fetched, setFetched] = useState(false)
    const [error, setError] = useState(false)
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
    });
    if (isAuth) navigate('cars?sortField=shipping_date')
    const getData = async()=>{
        try{
            const response=await axios.get(`${mainAddress}/api/cars?serial_number=${serialNumber}`,{withCredentials:true})
            setFormData({...response.data, shipping_date: new Date(response.data.shipping_date)})
            setFormLoading(false)
            setFetched(true)
        }catch(error){
            if (error.response && error.response.status === 404) {
                setError(404)
            } 
            console.error(error)
            setFetched(false)
            setFormLoading(false)
        }
    }
    useEffect(()=>{
        if (isAuth){
            navigate('cars?sortField=shipping_date')
        }
    }, [isAuth])
    const onChange= (e)=>{
        setSerialNumber(e.target.value)
    }
    const handleSearch = async()=>{
        setError(false)
        setFormLoading(true)
        await getData()
    }
    return(
    <div className='mainpage'>
        {/* Загрузка самого пользователя  */}
        {isAuthInProgress&&<div className='center'><CircularProgress/></div>}
        
        
        {!isAuthInProgress&&!isAuth&&
            <WhiteBox headerText={'Проверьте комплектацию и технические характеристики техники Силант'}>
                <div className='search'>
                    <p>Введите зав. № машины</p>
                    <TextField 
                        fullWidth
                        name={'serialNumber'}
                        value={serialNumber}
                        placeholder='Зав. № машины'
                        disabled={formLoading}
                        onChange={onChange}
                    />
                    <Button disabled={formLoading||serialNumber.trim()===''} variant="contained" onClick={handleSearch}><SearchIcon/></Button>
                </div>
                {error===404?<div className='error'>Ничего не найдено!</div>:undefined}
                {formLoading&&<div style={{height:'500px'}} className='center'><CircularProgress/></div>}
                {fetched&&<>
                    <EditableField
                        isEditing={false}
                        label='Машина ID:'
                        name='formData.id'
                        value={formData.id}
                        helperText='Заполните поле'
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={false}
                        label='Зав. № машины:'
                        name='serial_number'
                        value={formData.serial_number}
                        helperText='Заполните поле'
                        loading={formLoading}
                        isReq={true}
                    />
                        {/* Модель техники TECHNIQUE_MODEL*/}
                    <AutoCompleteSearch
                        isEditing={false}
                        label="Модель техники"
                        name="technique_model"
                        value={formData.technique_model}
                        
                        
                        endpoint={`${mainAddress}/api/search?model=directory&entity_name=TECHNIQUE_MODEL`}
                        checkEndPoint={`directories`}
                        
                        loading={formLoading}
                        isReq={true}
                        canCheck={true}
                    />
                    {/* Модель двигателя  ENGINE_MODEL */}
                    <AutoCompleteSearch
                        isEditing={false}
                        label="Модель двигателя"
                        name="engine_model"
                        value={formData.engine_model}
                        
                        endpoint={`${mainAddress}/api/search?model=directory&entity_name=ENGINE_MODEL`}
                        checkEndPoint={`directories`}
                        canCheck={true}
                        
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={false}
                        label='Зав. № двигателя:'
                        name='engine_serial_number'
                        value={formData.engine_serial_number}
                        
                       
                        
                        loading={formLoading}
                        isReq={true}
                    />
                    {/* Модель трансмиссии  TRANSMISSION_MODEL */}
                    <AutoCompleteSearch
                        isEditing={false}
                        label="Модель трансмиссии"
                        name="transmission_model"
                        value={formData.transmission_model}
                        
                        endpoint={`${mainAddress}/api/search?model=directory&entity_name=TRANSMISSION_MODEL`}
                        checkEndPoint={`directories`}
                        canCheck={true}
                        
                        loading={formLoading}
                        isReq={true}
                    />
                    <EditableField
                        isEditing={false}
                        label='Зав. № трансмиссии:'
                        name='transmission_serial_number'
                        value={formData.transmission_serial_number}
                        
                        
                        loading={formLoading}
                        isReq={true}
                    />
                    {/* Модель ведущего моста  DRIVEN_AXLE_MODEL */}
                    <AutoCompleteSearch
                        isEditing={false}
                        label="Модель ведущего моста"
                        name="driven_axle_model"
                        value={formData.driven_axle_model}
                       
                        endpoint={`${mainAddress}/api/search?model=directory&entity_name=DRIVEN_AXLE_MODEL`}
                        checkEndPoint={`directories`}
                        canCheck={true}
                        
                        loading={formLoading}
                        
                    />
                    <EditableField
                        isEditing={false}
                        label='Зав. № ведущего моста:'
                        name='driven_axle_serial_number'
                        value={formData.driven_axle_serial_number}
                        
                        
                        loading={formLoading}
                        
                    />
                    {/* Модель управляемого моста   STEERED_AXLE_MODEL */}
                    <AutoCompleteSearch
                        isEditing={false}
                        label="Модель управляемого моста"
                        name="steered_axle_model"
                        value={formData.steered_axle_model}
                        
                        endpoint={`${mainAddress}/api/search?model=directory&entity_name=STEERED_AXLE_MODEL`}
                        checkEndPoint={`directories`}
                        canCheck={true}
                        
                        loading={formLoading}
                        
                    />
                    <EditableField
                        isEditing={false}
                        label='Зав. № управляемого моста:'
                        name='steered_axle_serial_number'
                        value={formData.steered_axle_serial_number}
                        
                        
                        loading={formLoading}
                        
                    />
                </>}
            </WhiteBox>}
    </div>)
}

export default MainPage