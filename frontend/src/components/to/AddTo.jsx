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
        maintenance_date: today,
        operating_hours:'',
        order_number: '',
        order_date: today,
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
        </WhiteBox>
    </div>)
}

export default AddTo