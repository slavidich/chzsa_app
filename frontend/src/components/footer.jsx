import React from "react";
import '../styles/footer.scss'
import Telegram from '../img/tg.svg' 

function Footer(){
    return (
    <div className="footer">
        <div className='main'>
            <div className=''>
                <p>+7(8352)20-12-09</p>
                <Telegram></Telegram>
            </div>
            
            <div className=''>
                <p>Мой Силант 2024</p>
            </div>
        </div>
    </div>
    )
}
export default Footer