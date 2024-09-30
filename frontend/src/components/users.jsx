import axios from "axios";
import React, {useEffect, useState} from "react";
import { mainAddress } from "./app.jsx";
import { useDispatch } from "react-redux";
import { refreshTokenIfNeeded } from "./authUtils.js";
import { Navigate } from "react-router-dom";

function Users(){
    const dispatch = useDispatch();
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading]=useState(true)

    const fetchUsers = async()=>{
        setIsLoading(true)
        try{
            await refreshTokenIfNeeded(dispatch)
            const response = await axios.get(`${mainAddress}/api/users`, {withCredentials:true})
            setUsers(response.data)
        } catch(error){
            if (error.response && error.response.status===403){
                return <Navigate to="/forbidden" replace />;
            }    
        } finally{
            setIsLoading(false)
        }   
    }

    useEffect(()=>{
        fetchUsers()
    },[])
    return(
        <div>
            {isLoading?
                <>Загрузка</>
            :
                <div>
                    {users.map((item, index)=>{
                        return  <div key={index}>
                                    {item.username} {item.first_name} {item.last_name} {item.email}
                                </div>
                    })}
                </div>}
        </div>
    )
}

export default Users