import React, { useEffect, useState, useContext, useRef, use } from "react";
import "./grille.css";
import ListeDates from "./containerComposant/ListeDates";
import { ButtonTypeBase, ButtonTypeAlternative } from "./buttonType";
import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";
import agentContext from "../context/contextAgent";
import { motion } from "framer-motion"; // perumutation fluides des agents
import config from "../config/config";


///// grille
const Grille = () => {
  const { agentListing } = useContext(agentContext);

  return (
    <div className="grille">
      <LigneTitre key="titre" />
      <motion.div layout>
        {agentListing.length > 0 ? (
          agentListing.map((element, index) => {
            return (
              <LigneAgent key={element.nom + element.prenom} index={index} />
            );
          })
        ) : (
          <p>Aucun agent trouvé</p>
        )}
      </motion.div>
      <br />
      <BoutonAddAgent id="addAgent" />
    </div>
  );
};

/* 
tous les composants ci-dessous sont des composants 
de la "grille" et ne sont utilisés que par elle
la grille comprend la liste des agents, mais aussi les titres et le bouton d'ajout
*/

// ligne titre
const LigneTitre = () => {
  const { agentListing, setAgentListing } = useContext(agentContext);
  const [valChange, setValChange] = useState(false);
  const [trie, setTrie] = useState({
    type: "Nom",
    ordre: "asc",
  });

  const triePrécedent = useRef({
    type: "Nom",
    ordre: "asc",
  });

  useEffect(() => {
    setTrie({
      type: triePrécedent.type,
      ordre: triePrécedent.ordre,
    });
  }, [agentListing]);

  const contentTrie = (contentBase) => {
    if (trie.type === contentBase) {
      if (trie.ordre === "asc") {
        return contentBase + " \u25B2";
      } else {
        return contentBase + " \u25BC";
      }
    } else {
      return contentBase;
    }
  };

  const trieAgent = (type) => {
    if (triePrécedent.type === type) {
      triePrécedent.ordre === "desc"
        ? (triePrécedent.ordre = "asc")
        : (triePrécedent.ordre = "desc");
    } else {
      triePrécedent.ordre = "asc";
      triePrécedent.type = type;
    }

    let newListing = [...agentListing];
    switch (type) {
      case "Nom":
        newListing.sort((a, b) =>
          triePrécedent.ordre === "asc"
            ? a.nom.localeCompare(b.nom)
            : b.nom.localeCompare(a.nom)
        );
        break;
      case "Date de port d'arme":
        newListing.sort((a, b) =>
          triePrécedent.ordre === "asc"
            ? a.dateDePortArme.dateFin.delais() -
              b.dateDePortArme.dateFin.delais()
            : b.dateDePortArme.dateFin.delais() -
              a.dateDePortArme.dateFin.delais()
        );
        break;
      case "Année en courrante":
        newListing.sort((a, b) =>
          triePrécedent.ordre === "asc"
            ? a.anneeCourante.dateFin.delais() -
              b.anneeCourante.dateFin.delais()
            : b.anneeCourante.dateFin.delais() -
              a.anneeCourante.dateFin.delais()
        );
        break;
      case "Date des tirs":
        newListing.sort((a, b) =>
          triePrécedent.ordre === "desc"
            ? a.urgenceTir - b.urgenceTir
            : b.urgenceTir - a.urgenceTir
        );
        break;
      case "Date des tis":
        newListing.sort((a, b) =>
          triePrécedent.ordre === "desc"
            ? a.urgenceTis - b.urgenceTis
            : b.urgenceTis - a.urgenceTis
        );
        break;
    }

    setAgentListing(newListing);
  };

  return (
    <div className="ligneTitle">
      <ButtonTypeBase
        className="textesListeTitre"
        content={contentTrie("Nom")}
        click={() => trieAgent("Nom")}
      />
      <ButtonTypeBase
        className="textesListeTitre"
        content={contentTrie("Date de port d'arme")}
        click={() => trieAgent("Date de port d'arme")}
      />
      <ButtonTypeBase
        className="textesListeTitre"
        content={contentTrie("Année en courrante")}
        click={() => trieAgent("Année en courrante")}
      />
      <ButtonTypeBase
        className="textesListeTitre"
        content={contentTrie("Date des tirs")}
        click={() => trieAgent("Date des tirs")}
      />
      <ButtonTypeBase
        className="textesListeTitre"
        content={contentTrie("Date des tis")}
        click={() => trieAgent("Date des tis")}
      />
    </div>
  );
};

// ligne agent
const LigneAgent = (props) => {
  const { agentListing, agentSelectionné, setAgentSelectionné } =
    useContext(agentContext);
  const [index, setIndex] = useState(props.index);
  const [agent, setAgent] = useState(agentListing[index]);

  useEffect(() => {
    setIndex(props.index);
  }, [agentListing, props.index]);

  useEffect(() => {
    setAgent(agentListing[index]);
  }, [agentListing, index]);

  /// recupérer l'agent selectionné dans la fiche
  const getFiche = () => {
    let fiche = document.getElementById("fiche");
    setAgentSelectionné({
      agent: agentListing[index],
      index: index,
    });
    fiche.style.left = "0";
  };
  /// recupérer l'agent selectionné dans la fiche

  return agent ? (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="ligne"
      onDoubleClick={getFiche}
      agent={agent}
      style={{
        backgroundColor: (() => {
          if (agent.dateDePortArme.dateFin.delais() <= 365) {
            return "rgb(71, 0, 0)";
          }
        })(),
      }}
    >
      <ButtonTypeBase
        className="textesListe"
        content={agent.nom + " " + agent.prenom}
        id="nomLi"
      />
      <ButtonTypeAlternative
        className="textesListe"
        content={agent.dateDePortArme.dateFin.delaisFormat1()}
        content2={
          `${agent.dateDePortArme.dateDebut.afficherDateFormat1()}` +
          " au " +
          `${agent.dateDePortArme.dateFin.afficherDateFormat1()}`
        }
        id="dateDePortArmeLi"
      />
      <ButtonTypeAlternative
        className="textesListe"
        content={agent.anneeCourante.dateFin.delaisFormat1()}
        content2={agent.anneeCourante.dateFin.afficherDateFormat1()}
        id="dateDePortArmeLi"
      />
      <ListeDates indexAgent={index} typeDate="datesTir" />
      <ListeDates indexAgent={index} typeDate="datesTis" />
    </motion.div>
  ) : (
    <div>vide</div>
  );
};

// bouton d'ajout d'agent
const BoutonAddAgent = (props) => {
  const { agentListing, setAgentListing } = useContext(agentContext);
  const [addMode, setAddMod] = useState(false);

  const [newAgent, setNewAgent] = useState({
    nom: null,
    prenom: null,
    dpd: null,
  });

  // verifie si tout les champs sont remplis et si la date est valide
  const [newAgentValide, setNewAgentValide] = useState(false);
  const [dateValide, setDateValide] = useState(true);

  // fonction pour verifier si les champs sont remplis et si la date est valide
  useEffect(() => {
    if (newAgent.dpd && newAgent.nom && newAgent.prenom) {
      if ( newAgent.dpd.jour && newAgent.dpd.mois && newAgent.dpd.annee ) {
        setNewAgentValide(true);
        setDateValide(true);
      } else {
        setDateValide(false);
        setNewAgentValide(true);
      }} else {
    setNewAgentValide(false); }

    const valideDay = () => {
    if (newAgent.dpd.mois === 2) {
      return (newAgent.dpd.annee % 4 === 0 && (newAgent.dpd.annee % 100 !== 0 || newAgent.dpd.annee % 400 === 0)) ? 29 : 28; // Année bissextile
    }
    return [4, 6, 9, 11].includes(newAgent.dpd.mois) ? 30 : 31; // Mois avec 30 ou 31 jours
  }
    setDateValide(newAgent.dpd ? newAgent.dpd.jour <= valideDay() ? true : false : false);

    
  }, [newAgent]);

  // remise a zéro des champs de l'agent
  useEffect(() => {
    setNewAgent({
      nom: "",
      prenom: "",
      dpd: null,
    })}, [addMode]);

   // fonction de modification de l'agent temporaire
  const modifAgent = (value, type) => {
    let setterNewAgent = { ...newAgent };
    if (type === "dpd") {
      setterNewAgent[type] = new datesP(
        Number(value.split("-")[2]),
        Number(value.split("-")[1]),
        Number(value.split("-")[0]),
        false,
        false
      );
    } else {
      setterNewAgent[type] = value;
    }
    setNewAgent(setterNewAgent);
  };

  // fonction d'ajout de l'agent en fonction de l'agent temporaire
  const addAgent = () => {
    if (
      newAgent.nom !== "" ||
      newAgent.prenom !== "" ||
      newAgent.dpd !== null
    ) {
      setAgentListing((prev) => {
        let newAgentListing = [...prev];
        newAgentListing.push(
          new Agent(
            newAgent.nom,
            newAgent.prenom,
            new datesP(
              newAgent.dpd.jour,
              newAgent.dpd.mois,
              newAgent.dpd.annee,
              false,
              false
            )
          )
        );
        return newAgentListing;
      });
      setAddMod(false);
    }
  };

  return (
    <>
      {config.demo && agentListing.length >= 10 ? 

         /* 
        Si le mode démo est activé et que le nombre d'agents dépasse 10, 
        affiche un message d'alerte 
        */ 
      <div 
        style={{
        backgroundColor: '#ff4d4f',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
        margin: '10px 0',
        boxShadow: '0 5px 8px rgba(0, 0, 0, 0.15)',
       }}>
         ⚠️ Limite atteinte : nombre maximal d'agents autorisés en mode démo
      </div>


      :
      
      
      (
      addMode ? (
        <div id="addAgentWindos">
          <input
            type="text"
            placeholder="nom"
            className="inputAddAgent"
            id="AddAgentImputNom"
            onBlur={(e) => modifAgent(e.target.value, "nom")}
            onChange={(e) => modifAgent(e.target.value, "nom")}
          />
          <input
            type="text"
            placeholder="prenom"
            className="inputAddAgent"
            id="AddAgentImputPrenom"
            onBlur={(e) => modifAgent(e.target.value, "prenom")}
            onChange={(e) => modifAgent(e.target.value, "prenom")}
          />
          <p id="txtAddAgent">date port d'arme : </p>
          <input
            type="date"
            className="inputAddAgent"
            id="AddAgentImputDpd"
            onBlur={(e) => modifAgent(e.target.value, "dpd")}
            onChange={(e) => modifAgent(e.target.value, "dpd")}
          />
          <p 
          id="btnAddAgentValider" 
          className="btnAddAgent" 
          style={{
            backgroundColor: newAgentValide
              ? dateValide
                ? "green"
                : "gray"
              : "red",
          }}
          onClick={ 
            newAgentValide ? dateValide ? addAgent : null : null
            }
          >
            {newAgentValide ? 
              dateValide ? "valider" : "date invalide"
              : "remplir tous les champs"}
          </p>
          <p
            id="btnAddAgentAnnuler"
            className="btnAddAgent"
            onClick={() => setAddMod((prev) => !prev)}
          >
            annuler
          </p>
        </div>
      ) : (
        <div
          className="buttonAddAgent"
          id={props.id}
          onClick={() => setAddMod((prev) => !prev)}
        >
          +
        </div>
      )

    ) }
    </>
  );
};

export { Grille };
