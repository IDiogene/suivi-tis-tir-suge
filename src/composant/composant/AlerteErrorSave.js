import { useContext } from "react";
import React from 'react';
import agentContext from "../../context/contextAgent";


const AlerteErrorSave = () => {
    const { saveStatus } = useContext(agentContext);


    return (
        <>
            {!saveStatus ? 
                    <p
                    style={{
                            color: "red",
                            fontSize: "1.2em",
                            textAlign: "center",
                            margin: "10px 0",
                            padding: "10px",
                            backgroundColor: "black",
                            zIndex: 100000,
                            border: "1px solid black",
                            position: "fixed",
                            top: "30%",
                            left: "5%",
                            right: "5%",
                    }}
                    >
                        Erreur lors de la sauvegarde des données.
                    </p>
                    :
                    null
            }
        </>
    );
}
    


export default AlerteErrorSave;