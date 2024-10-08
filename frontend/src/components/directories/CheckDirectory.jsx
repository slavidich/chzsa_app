import React from "react";
import { useParams } from "react-router-dom";

function CheckDirectory(){
    const { id } = useParams();

    return (<div>
        Справочник-{id}
    </div>)
}

export default CheckDirectory