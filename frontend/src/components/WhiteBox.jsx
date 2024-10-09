import React from "react";
import '../styles/whitebox.scss'
import { ThemeProvider } from "@emotion/react";
import {theme} from './muiUtil'

function WhiteBox({children, headerText}){
    return(
    <ThemeProvider theme={theme}>
        <div className="whitebox">
            <h2 className="box-header">{headerText}</h2>
            {children}
        </div>
    </ThemeProvider>)
}

export default WhiteBox