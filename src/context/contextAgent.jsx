import { createContext, useState, useEffect } from "react";
import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";
const { ipcRenderer } = window.require('electron');
const agentContext = createContext()


/* 
  fonction de sauvegarde et de chargement des données
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





export const AgentProvider = ({ children }) => {
    const [agentListing, setAgentListing] = useState([]); // la liste des agents
    const [agentSelectionné, setAgentSelectionné] = useState(null); // agent sélectionné, nécassaire pour la fiche agent

    useEffect(() => {
       if (agentListing.length > 0  ) {
        appelElectron(JSON.parse(JSON.stringify(agentListing)));}
  }, [agentListing]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await charger();
      if (data) {
        //console.log("Données chargées :", data);
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

      }
    };
  
    fetchData();
  }, []);
  
    
return (
    <agentContext.Provider value={{ agentListing, setAgentListing, agentSelectionné, setAgentSelectionné }}>
      {children}
    </agentContext.Provider>
  );
}


export default agentContext;


