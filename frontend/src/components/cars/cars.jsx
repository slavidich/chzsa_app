import React, {useState} from "react";
import '../../styles/cars.scss'
import { ThemeProvider } from '@emotion/react';
import { theme } from '../muiUtil';

function Cars(){
    
    return (
        <ThemeProvider theme={theme}>
            <div className='cars'>
                <div>
                    <button onClick={()=>setAddCar(true)}>Добавить машину</button>
                    Страница просмотра машин
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Cars