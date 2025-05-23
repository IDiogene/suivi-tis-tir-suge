import React, { useEffect } from 'react';
import { trieDates } from '../function/logique';
import "./caseAlerte.css";
import { useContext, useState } from "react";
import contextAgent from "../context/contextAgent";


// composant principal de la case alerte, divisée en deux sous catégories, tis et tir
const CaseAlerte = () => {
    const { agentListing } = useContext(contextAgent);
    
    // filtrer et trier les urgence tir et tis, on ne garde que les 5 premiers
    const urgence = (type) => {
        return agentListing.filter((agent) => {
        return agent[`urgence${type}`] >= 0;
    }).sort((a, b) => {
        return b[`urgence${type}`] - a[`urgence${type}`];
    }).slice(0, 5);}



    return (
        <div id='caseAlerte'>
            <CaseAlerteType type="Tir" array={urgence('Tir')}/>
            <CaseAlerteType type="Tis" array={urgence('Tis')}/>
        </div>
    );
};

// sous catégorie, soit tis soit tir
const CaseAlerteType = ({ type, array }) => {
    const [survol, setSurvol] = useState(false);
    const [agentSurvolé, setAgentSurvolé] = useState(null);
    


    const hover = (mouse, e) => {
        mouse === "enter" ? setSurvol(true) : setSurvol(false);
        setAgentSurvolé(e);
    }

    // affiche les agents considerés comme urgents
    const arrayAffiche = array.map((agent, index) => {
        return (
                <p 
                className='nomAlerte' 
                key={agent.nom + index}
                onMouseEnter={(e) => hover("enter", agent)}
                onMouseLeave={(e) => hover("leave", agent)}
                >
                    {agent.nom}
                </p>
        );
    });

    // crée la div de survol
    const survolAffichage = () => {
        return (
                <div id='survol'> 
                {
                    agentSurvolé !== null ? 
                    <div>
                        <p>{agentSurvolé.nom + ' ' + agentSurvolé.prenom}</p>

                        <p>{
                        agentSurvolé.anneeCourante.dateFin.delaisFormat1()
                         +
                        ' pour placer '
                         + 
                        (2 - trieDates(
                            agentSurvolé.anneeCourante.dateDebut, 
                            agentSurvolé[`dates${type}`].filter((date) => {return date.stat !== "annulé" && date.stat !== "absence agent"}), 
                            agentSurvolé.anneeCourante.dateFin).length) 
                            + 
                            ' ' 
                            + 
                            type + (type === 'Tir' ? 's' : '')
                            
                            }</p>

                    </div> : null
                }       
             </div> 

        )
    }


    return (
        <div className={`AlerteType`}>
            <p className='titreAlerte'>Prochain {type} a prevoir : </p>
            {arrayAffiche} 
            {survol === true ? survolAffichage() : null}

        </div>
    );
};



export default CaseAlerte;