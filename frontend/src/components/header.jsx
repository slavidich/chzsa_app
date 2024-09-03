import React from "react";
import '../styles/header.scss'
import logored from '../img/logored.webp' 


function Header(){
    return (
    <div className="header">
        <div className="main">
            <img className="logo" src={logored}></img>
        </div>
    </div>
    )
}

export default Header