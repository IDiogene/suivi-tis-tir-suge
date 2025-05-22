import { createContext, useState, useEffect } from "react";
import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";
import config from "../config/config";
import demoConfig from "../config/demoConfig";
const { ipcRenderer } = window.require('electron');
const agentContext = createContext()



/* 
  fonctions de sauvegardes et de chargement des données
  fonctionne avec Electron
*/
// sauvegarde
const appelElectron = (liste) => {
    ipcRenderer.invoke('save', liste)
        .then((result) => {
            //console.log("sauvegarde effectué");
        })
        .catch((error) => {
            console.error("Erreur lors de l'appel Electron :", error);
        });
}
// chargement
const charger = async () => {
  const result = await ipcRenderer.invoke('load')
  if (result.success) {
    return result.data;
  } else {
    console.error("Erreur lors du chargement des données :", result.error);
    return null;
  }
}





// provider

export const AgentProvider = ({ children }) => {
    const [agentListing, setAgentListing] = useState([]); // la liste des agents
    const [agentSelectionné, setAgentSelectionné] = useState(null); // agent sélectionné, nécassaire pour la fiche agent
    const [dataCharged, setDataCharged] = useState(false); // assure le chargement initial des données dans de permettre la sauvegarde

 

    useEffect(() => {
       if ( dataCharged ) {
        appelElectron(JSON.parse(JSON.stringify(agentListing)));}
  }, [agentListing]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await charger();
      if (data.length > 0) {
        console.log("Données chargées :", data);
        const agents = data.map((agentData) => {
          return new Agent(
            agentData.nom,
            agentData.prenom,
            new datesP(
              agentData.dateDePortArme.dateDebut.jour,
              agentData.dateDePortArme.dateDebut.mois,
              agentData.dateDePortArme.dateDebut.annee
            ),
            agentData.datesTir.map((date) => new datesP(date.jour, date.mois, date.annee, date.stat, date.comment)),
            agentData.datesTis.map((date) => new datesP(date.jour, date.mois, date.annee, date.stat, date.comment))
          );
        });
        setAgentListing(agents);

      } else if (config.demo) {
        console.log("Données de démonstration utilisées");
        const agents = demoConfig.map((agentData) => {
          return new Agent(
            agentData.nom,
            agentData.prenom,
            new datesP(
              agentData.dateDePortArme.dateDebut.jour,
              agentData.dateDePortArme.dateDebut.mois,
              agentData.dateDePortArme.dateDebut.annee
            ),
            agentData.datesTir.map((date) => new datesP(date.jour, date.mois, date.annee, date.stat, date.comment)),
            agentData.datesTis.map((date) => new datesP(date.jour, date.mois, date.annee, date.stat, date.comment))
          );
        });
        setAgentListing(agents);
      }
    };
  
    fetchData();
    setDataCharged(true); // valide le chargement des données
  }, []);
  
    
return (
    <agentContext.Provider value={{ agentListing, setAgentListing, agentSelectionné, setAgentSelectionné }}>
      {children}
    </agentContext.Provider>
  );
}


export default agentContext;


