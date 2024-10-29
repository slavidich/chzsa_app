import React, {useState} from "react";
import { FormControl, TextField } from "@mui/material";
import '../../styles/cars.scss'

import { mainAddress } from "../app";
import WhiteBox from "../WhiteBox.jsx";
import { EditableField, AutoCompleteSearch, EditableDateField } from "../muiUtil";
import {  Button, CircularProgress } from "@mui/material";
function AddCar(){
    const now = new Date()
    const [year, month, date] = [now.getFullYear(), now.getMonth(), now.getDate()]
    const [formLoading, setFormLoading] = useState(false)
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
        shipping_date: true,
        cargo_receiver: false,
        delivery_address: false,
        equipment: false,
        client: false,
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
        let isValid = true;
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            isValid = false;
        }
        setFormErrors({
            ...formErrors,
            [name]: !isValid
        });
    }
    const handleAdd = (e) => {
        e.preventDefault();
    };
    const isValid = ()=>{
        return Object.values(formData).every((value) => value !== null && value !== '');
    }
    return (
    <div className="cars">
        <WhiteBox headerText='Добавление клиента'>
            <form onSubmit={handleAdd}>
                <EditableField
                    isEditing={true}
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
                    isEditing={true}
                    label="Модель техники"
                    name="technique_model"
                    value={formData.technique_model}
                    error={formErrors.technique_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=TECHNIQUE_MODEL`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                {/* Модель двигателя  ENGINE_MODEL */}
                <AutoCompleteSearch
                    isEditing={true}
                    label="Модель двигателя"
                    name="engine_model"
                    value={formData.engine_model}
                    error={formErrors.engine_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=ENGINE_MODEL`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={true}
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
                    isEditing={true}
                    label="Модель трансмиссии"
                    name="transmission_model"
                    value={formData.transmission_model}
                    error={formErrors.transmission_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=TRANSMISSION_MODEL`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={true}
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
                    isEditing={true}
                    label="Модель ведущего моста"
                    name="driven_axle_model"
                    value={formData.driven_axle_model}
                    error={formErrors.driven_axle_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=DRIVEN_AXLE_MODEL`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={true}
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
                    isEditing={true}
                    label="Модель управляемого моста"
                    name="steered_axle_model"
                    value={formData.steered_axle_model}
                    error={formErrors.steered_axle_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=STEERED_AXLE_MODEL`}
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <EditableField
                    isEditing={true}
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
                    isEditing={true}
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
                    isEditing={true}
                    label='Дата отгрузки с завода'
                    name='shipping_date'
                    value={formData.shipping_date}
                    error={formErrors.shipping_date}
                    helperText='Заполните поле'
                    onChange={handleChange}
                    loading={formLoading}
                    isReq={true}
                />
                <div className="formButtons">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid()||formLoading} >
                        {formLoading?<CircularProgress/>:<>Добавить</>}
                    </Button>
                    <button onClick={()=>console.log(formData)}>тест</button>
                </div>
            </form>
        </WhiteBox>
        
    </div>)
}

export default AddCar