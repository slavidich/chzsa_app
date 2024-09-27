import React, {useState, useMemo} from "react";
import { mainAddress } from "./app.jsx";
import '../styles/cars.scss'
import axios from 'axios';
import AutoCompleteInput from "./autoComplete.jsx";

function Cars(){
    const [addCar, setAddCar] = useState(false)
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleAutocompleteChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
    };
    return (
        <div className='cars'>
            
            {addCar?
                <div>
                    <button onClick={()=>setAddCar(false)}>Вернуться</button>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Зав. № машины:</label>
                            <input 
                                type="text" 
                                name="serial_number" 
                                value={formData.serial_number} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <AutoCompleteInput 
                            label="Модель техники" 
                            name="technique_model" 
                            endpoint={`${mainAddress}/api/searchdirectories?entity_name=TECHNIQUE_MODEL`}
                            value={formData.technique_model} 
                            setValue={handleAutocompleteChange} 
                        />

                        <button type="submit">Добавить</button>
                    </form>
                </div>
                :
                <div>
                    <button onClick={()=>setAddCar(true)}>Добавить машину</button>
                    Страница просмотра машин
                </div>}
        </div>
    )
}

export default Cars