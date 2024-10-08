import React, {useState} from "react";

function AddCar(){
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
    const [errors, setErrors] = useState({
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
    <div>
        <button onClick={()=>setAddCar(false)}>Вернуться</button>
        <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
                <TextField 
                    name="serial_number"
                    label="Зав. № машины:" 
                    variant="outlined" 
                    value={formData.serial_number} 
                    onChange={handleInputChange} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <AutoCompleteSearch
                    label="Модель двигателя"
                    name="technique_model"
                    endpoint={`${mainAddress}/api/searchdirectories?entity_name=TECHNIQUE_MODEL`}
                    setData={setFormData}
                    setFormError={setErrors}
                />
            </FormControl>
            <button type="submit" onClick={handleSubmit}>Добавить</button>
        </form>
    </div>)
}

export default AddCar