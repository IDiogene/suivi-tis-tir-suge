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
const save = (liste) => {
    ipcRenderer.invoke('save', liste)
        .then((result) => {
            //console.log("sauvegarde effectué");
        })
        .catch((error) => {
            console.error("Erreur lors de l'appel Electron :", error);
        });
}
// chargement
const loadData = async () => {
  const result = await ipcRenderer.invoke('load')
  if (result.success) {
    return result.data;
  } else {
    console.error("Erreur lors du chargement des données :", result.error);
    return null;
  }
}

const fetchData = async () => {

      const data = await loadData();
      let agents = [];

      if (data && data.length > 0) {
        console.log("Données chargées :", data);
        agents = data.map((agentData) => {
          return new Agent(
            agentData.name || agentData.nom,
            agentData.surname || agentData.prenom,
            new datesP(
              agentData.weaponPermitDate?.startDate?.day || agentData.dateDePortArme?.dateDebut?.jour,
              agentData.weaponPermitDate?.startDate?.month || agentData.dateDePortArme?.dateDebut?.mois,
              agentData.weaponPermitDate?.startDate?.year || agentData.dateDePortArme?.dateDebut?.annee
            ),
            agentData.shootingTrainingDates?.map((date) => new datesP(date.day , date.month , date.year , date.stat, date.comment)) || agentData.datesTir?.map((date) => new datesP(date.jour , date.mois , date.annee , date.stat, date.comment)), 
            agentData.tisTrainingDates?.map((date) => new datesP(date.day , date.month , date.year , date.stat, date.comment)) || agentData.datesTis?.map((date) => new datesP(date.jour ,  date.mois , date.annee , date.stat, date.comment))
          );
        });
        

      } else if (config.demo) {
        console.log("Données de démonstration utilisées");
        agents = demoConfig.map((agentData) => {
          return new Agent(
            agentData.name,
            agentData.surname,
            new datesP(
              agentData.weaponPermitDate.startDate.day,
              agentData.weaponPermitDate.startDate.month,
              agentData.weaponPermitDate.startDate.year,
            ),
            agentData.shootingTrainingDates.map((date) => new datesP(date.day, date.month, date.year, date.stat, date.comment)),
            agentData.tisTrainingDates.map((date) => new datesP(date.day, date.month, date.year, date.stat, date.comment))
          );
        });
        
      }
      return agents;
    };






// provider

export const AgentProvider = ({ children }) => {
    const [agentListing, setAgentListing] = useState([]); // la liste des agents
    const [selectedAgent, setSelectedAgent] = useState(null); // agent sélectionné, nécassaire pour la fiche agent
    const [dataCharged, setDataCharged] = useState(false); // assure le chargement initial des données dans de permettre la sauvegarde
    const [saveStatus, setSaveStatus] = useState(true); // statut de la sauvegarde, nécassaire pour le rafraichissement de la liste des agents

 

    useEffect(() => {
       if ( dataCharged ) {
            ipcRenderer.invoke('save', save(JSON.parse(JSON.stringify(agentListing))))
        .then((result) => {
            setSaveStatus(true); 
            // met à jour le statut de la sauvegarde
            //console.log("sauvegarde effectué");
        })
        .catch((error) => {
            setSaveStatus(false); // met à jour le statut de la sauvegarde en cas d'erreur
            console.error("Erreur lors de l'appel Electron :", error);
        });}
      }, [agentListing]);

  // chargement des données à l'initialisation du provider, double lecture pour refactoring anglais, compatible avec sauvegarde de la version française
useEffect(() => {
  const fetchAndSetData = async () => {
    const agents = await fetchData();
    setAgentListing(agents);
    setDataCharged(true);
  };

  fetchAndSetData();
}, []);

  
    
return (
    <agentContext.Provider value={{ agentListing, setAgentListing, selectedAgent, setSelectedAgent, saveStatus, setSaveStatus, dataCharged, setDataCharged }}>
      {children}
    </agentContext.Provider>
  );
}


export default agentContext;


