import React from "react";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./muiUtil";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalWindow.scss'

function ModalWindow({headerText, showModal, closeModal, children}){
    return (<ThemeProvider theme={theme}>
    {showModal&&(
            <div className='modal-overlay'>
                <div className="modelwindow">
                    <div className="headermodal"><h2>{headerText}</h2><CloseIcon style={{ cursor: 'pointer' }}  onClick={()=>{closeModal()}}/></div>
                    {children}
                </div>
            </div>
        )}
    </ThemeProvider>)
}

export default ModalWindow