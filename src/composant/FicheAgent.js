import React, { useEffect, useState, useContext } from "react";
import "./ficheAgent.css";
import { ButtonTypeBase } from "./buttonType";
import ListeDates from "./containerComposant/ListeDates";
import agentContext from "../context/contextAgent";
import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";

// fiche agent, conteneur principal
const FicheAgent = () => {
  const {
    agentListing,
    setAgentListing,
    agentSelectionné,
    setAgentSelectionné,
  } = useContext(agentContext);
  const [agent, setAgent] = useState(
    agentSelectionné ? agentSelectionné.agent : null
  );
  const [indexAgent, setIndexAgent] = useState(
    agentSelectionné ? agentSelectionné.index : null
  );
  const [modifier, setModifier] = useState(false);
  const [agentModifié, setAgentModifié] = useState({
    nom: agent ? { ...agent.nom } : null,
    prenom: agent ? { ...agent.prenom } : null,
    dateDePortArme: agent
      ? {
          jour: agent.dateDePortArme.dateDebut.jour,
          mois: agent.dateDePortArme.dateDebut.mois,
          annee: agent.dateDePortArme.dateDebut.annee,
        }
      : null,
  });

  useEffect(() => {
    setAgentSelectionné({
      agent: agentListing[indexAgent],
      index: indexAgent,
    });
  }, [agentListing]);

  useEffect(() => {
    setAgent(agentSelectionné ? agentSelectionné.agent : null);
  }, [agentSelectionné]);

  useEffect(() => {
    setAgent(agentSelectionné ? agentSelectionné.agent : null);
    setIndexAgent(agentSelectionné ? agentSelectionné.index : null);
  }, [agentSelectionné]);

  // enregistre des données temporaire modifier un agent, en lien avec 'boutonModif'
  useEffect(() => {
    setAgentModifié({
      nom: agent ? agent.nom : null,
      prenom: agent ? agent.prenom : null,
      dateDePortArme: agent
        ? {
            jour: agent.dateDePortArme.dateDebut.jour,
            mois: agent.dateDePortArme.dateDebut.mois,
            annee: agent.dateDePortArme.dateDebut.annee,
          }
        : null,
    });
  }, [agent]);
  // enregistre des données temporaire modifier un agent, en lien avec 'boutonModif'

  /* 
permet d'ouvrir, d'annuler, ou de valider la modification de l'agent : 
valeur entrante = 2 boolean, (doit être true, true pour valider la modif)
mode permet de lancer ou d'annuler la modification, selon sa valeur
*/

  const click = (mode, valChange) => {
    setModifier(mode);
    if (modifier && valChange) {
      setAgentListing((prev) => {
        const newListing = [...prev];
        const newAgentModifié = new Agent(
          agentModifié.nom,
          agentModifié.prenom,
          new datesP(
            agentModifié.dateDePortArme.jour,
            agentModifié.dateDePortArme.mois,
            agentModifié.dateDePortArme.annee
          ),
          agentListing[indexAgent].datesTir,
          agentListing[indexAgent].datesTis
        );

        newListing[indexAgent] = newAgentModifié;
        return newListing;
      });
    }
  };
  /* 
 permet d'ouvrir, d'annuler, ou de valider la modification de l'agent : 
 valeur entrante = 2 boolean, (doit être true, true pour valider la modif)
 mode permet de lancer ou d'annuler la modification, selon sa valeur
*/

  // affiche les date anniversaire, ainsi que les date de formation, et les places sous les bonnes dates anniversaires
  const addDateAnniversaire = () => {
    let id = 0;
    const buttons = [];
    let lastDate =
      agent && [...agent.datesTir, ...agent.datesTis].length > 0
        ? [...agent.datesTir, ...agent.datesTis]
            .reduce((a, b) => {
              return a.delais() > b.delais() ? a : b;
            })
            .delais()
        : 0;

    if (agent) {
      for (const key in agent.datesAnniversairePDA) {
        const date = agent.datesAnniversairePDA[key];
        if (date.debut.delais() < lastDate) {
          buttons.push(
            <ButtonTypeBase
              key={`${date.debut.afficherDate()}-${id}`}
              className="année"
              content={
                date.debut.delais() > 0 ? (
                  <>dates postérieurs</>
                ) : (
                  <>
                    {date.debut.afficherDate()} <br /> {date.fin.afficherDate()}
                  </>
                )
              }
              id={"n-" + id}
            />
          );
          buttons.push(
            <ListeDates
              fiche={true}
              typeDate="datesTir"
              date={date}
              annéeCouranteFiche={date}
              indexAgent={indexAgent}
              id={"tr" + id}
              key={"tr" + id}
            />
          );
          buttons.push(
            <ListeDates
              fiche={true}
              typeDate="datesTis"
              date={date}
              annéeCouranteFiche={date}
              indexAgent={indexAgent}
              id={"ts" + id}
              key={"ts" + id}
            />
          );

          id++;
        }
      }

      return buttons;
    }
  };
  // affiche les date anniversaire, ainsi que les date de formation, et les places sous les bonnes dates anniversaires

  return (
    <div className="fiche" id="fiche">
      {" "}
      {agentSelectionné ? (
        <>
          <BoutonModifier click={click} modif={modifier} />
          <BoutonFermeFiche click={click} />
          <BoutonModif
            className="textes"
            value="nom"
            type="text"
            id="nom"
            modif={modifier}
            setterAgent={setAgentModifié}
          />
          <BoutonModif
            className="textes"
            value="prenom"
            type="text"
            id="prenom"
            modif={modifier}
            setterAgent={setAgentModifié}
          />

          <BoutonModif
            className="textes"
            type="date"
            value="dateDePortArme"
            id="dpd"
            modif={modifier}
            setterAgent={setAgentModifié}
          />

          {addDateAnniversaire()}

          <ButtonTypeBase
            className="textes"
            content="dates Tis"
            id="datesTis"
          />
          <ButtonTypeBase
            className="textes"
            content="dates Tir"
            id="datesTir"
          />
          <BoutonSupression />
        </>
      ) : (
        <div>no</div>
      )}
    </div>
  );
};


/* 
les boutons ci-dessous sont des composants de la fiche 
agents qui ne sont utilisés que par cette dernière
*/

// bouton pour fermer la fiche agent
const BoutonFermeFiche = ({ click }) => {
  const { agentSelectionné, setAgentSelectionné } = useContext(agentContext);
  const fermeFiche = () => {
    click(false, false);
    setAgentSelectionné(null);
    let fiche = document.getElementById("fiche");
    fiche.style.left = "100%";
  };

  return (
    <a id="buttonFermeFiche" onClick={fermeFiche}>
      fermer la fiche
    </a>
  );
};


// bouton pour activer la modification de l'agent (la logique est contenue dans la fiche)
const BoutonModifier = ({ click, modif }) => {
  return (
    <>
      {modif ? (
        <div id="conteneurModificationFiche">
          <p id="BoutonValidationModifFiche" onClick={() => click(false, true)}>
            ok
          </p>
          <p
            id="BoutonAnnulationModifFiche"
            onClick={() => click(false, false)}
          >
            annuler
          </p>
        </div>
      ) : (
        <p id="buttonModifAgent" onClick={() => click(true, false)}>
          modif
        </p>
      )}
    </>
  );
};


// bouton pour modifier nom et prenom (le gros de la logique est contenu dans la fiche)
const BoutonModif = ({ modif, value, className, id, setterAgent, type }) => {
  const { agentSelectionné } = useContext(agentContext);
  const [agent, setAgent] = useState(
    agentSelectionné ? agentSelectionné.agent : null
  );
  const [content, setContent] = useState(agent ? agent[value] : null);

  useEffect(() => {
    setAgent(agentSelectionné ? agentSelectionné.agent : null);
  }, [agentSelectionné]);

  useEffect(() => {
    setContent(agent ? agent[value] : null);
  }, [agent]);

  useEffect(() => {
    setAgent(agentSelectionné ? agentSelectionné.agent : null);
    setContent(agent ? agent[value] : null);
  }, [agentSelectionné]);

  return (
    <>
      {content ? (
        modif && type === "text" ? (
          <input
            type="text"
            defaultValue={content}
            className="inputTxtFiche"
            onBlur={(e) =>
              setterAgent((prev) => ({ ...prev, [value]: e.target.value }))
            }
          />
        ) : modif && type === "date" ? (
          <input
            type="date"
            defaultValue={`${content.dateDebut.annee}-${
              content.dateDebut.mois < 10
                ? "0" + content.dateDebut.mois
                : content.dateDebut.mois
            }-${
              content.dateDebut.jour < 10
                ? "0" + content.dateDebut.jour
                : content.dateDebut.jour
            }`}
            className="inputTxtFiche"
            onBlur={(e) =>
              setterAgent((prev) => ({
                ...prev,
                [value]: {
                  jour: Number(e.target.value.split("-")[2]),
                  mois: Number(e.target.value.split("-")[1]),
                  annee: Number(e.target.value.split("-")[0]),
                },
              }))
            }
          />
        ) : type === "date" ? (
          <a className={className} id={id}>
            {
              <>
                {" "}
                Port d'arme <br /> {content.dateDebut.afficherDateFormat1()}{" "}
                <br /> au <br /> {content.dateFin.afficherDateFormat1()}{" "}
              </>
            }
          </a>
        ) : (
          <a className={className} id={id}>
            {content}
          </a>
        )
      ) : (
        "null"
      )}
    </>
  );
};


// bouton pour supprimer un agent (contient la logique)
const BoutonSupression = (props) => {
  const { agentSelectionné, setAgentSelectionné } = useContext(agentContext);
  const { agentListing, setAgentListing } = useContext(agentContext);

  const supression = () => {
    setAgentListing((prev) => {
      const newListing = [...prev];
      newListing.splice(agentSelectionné.index, 1);
      return newListing;
    });
    setAgentSelectionné(agentListing[0]);
    let fiche = document.getElementById("fiche");
    fiche.style.left = "100%";
  };

  return (
    <p id="boutonSupression" onDoubleClick={supression}>
      Supprimer l'agent (double clic)
    </p>
  );
};


export default FicheAgent;
