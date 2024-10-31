import React, {useState} from "react";
import '../../styles/cars.scss'
import { refreshTokenIfNeeded } from "../authUtils";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { mainAddress } from "../app";
import WhiteBox from "../WhiteBox.jsx";
import { EditableField, AutoCompleteSearch, EditableDateField } from "../muiUtil";
import {  Button, CircularProgress } from "@mui/material";
import axios from "axios";

function CheckCar() {
    return(
        <div className="cars">
            Машинка
        </div>
    )
}

export default CheckCar