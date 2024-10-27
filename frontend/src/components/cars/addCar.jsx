import React, {useState} from "react";
import { FormControl, TextField } from "@mui/material";

import { mainAddress } from "../app";
import WhiteBox from "../WhiteBox.jsx";
import { EditableField, AutoCompleteSearch } from "../muiUtil";
import {  Button, CircularProgress } from "@mui/material";
function AddCar(){
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
        shipping_date: '',
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
    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
        }));
        validateField(name, value)
    };
    const validateField=(name, value)=>{
        console.log(name, value)
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
    <div>
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
                <AutoCompleteSearch
                    isEditing={true}
                    label="Модель двигателя"
                    name="technique_model"
                    value={formData.technique_model}
                    error={formErrors.technique_model}
                    helperText='Заполните поле'
                    endpoint={`${mainAddress}/api/search?model=directory&entity_name=TECHNIQUE_MODEL`}
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