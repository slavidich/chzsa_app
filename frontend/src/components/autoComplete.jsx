import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mainAddress } from './app.jsx';

function AutoCompleteInput({ label, name, endpoint, value, setValue }) {
    const [options, setOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getOptions = async()=>{
        try{
            const response = await axios.get(`${endpoint}&search=${searchTerm}`, {withCredentials:true})
            console.log(response.data.results)
            setOptions(response.data.results)
        }
        catch (error){
            console.error(error)
        }
    }
    useEffect(()=>{
        if (searchTerm){
            getOptions()
        }
    }, [searchTerm, endpoint])

    const handleSelect = (option) => {
        setValue(name, option.id);
    };

    return (
        <div>
            <label>{label}</label>
            <input
                type="text"
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <ul>
                {options.map(option=>(
                    <li key={option.id} onClick={()=>handleSelect(option)}>
                        {option.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AutoCompleteInput