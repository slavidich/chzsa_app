import React, {useEffect, useState} from "react";
import WhiteBox from '../WhiteBox.jsx'
import { useSearchParams } from "react-router-dom";
import { Button, CircularProgress  } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { refreshTokenIfNeeded } from "../authUtils.js";
import axios from "axios";
import { mainAddress } from "../app.jsx";
import { useParams } from 'react-router-dom';
import {EditableField, EditableSelectField} from "../muiUtil.jsx";

function CheckUser(){
    const { id } = useParams();
    const [formLoading, setFormLoading] = useState(true)
    const [formData, setFormData] = useState({
        username:'',
        first_name: '',
        last_name: '',
        email: ''
    })
    useEffect(()=>{

    })
    return(
    <div className="checkUser">
        user {id}
    </div>)
}

export default CheckUser