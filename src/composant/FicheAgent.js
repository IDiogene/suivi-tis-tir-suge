import React, { useEffect, useState, useContext } from "react";
import "./ficheAgent.css";
import { ButtonTypeBase } from "./buttonType";
import ListeDates from "./containerComposant/ListeDates";
import agentContext from "../context/contextAgent";
import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";

// fiche agent, conteneur principal
const AgentSheet = () => {
  const {
    agentListing,
    setAgentListing,
    selectedAgent,
    setSelectedAgent,
  } = useContext(agentContext);
  const [agent, setAgent] = useState(
    selectedAgent ? selectedAgent.agent : null
  );
  const [indexAgent, setIndexAgent] = useState(
    selectedAgent ? selectedAgent.index : null
  );
  const [modifier, setModifier] = useState(false);
  const [modifiedAgent, setModifiedAgent] = useState({
    name: agent ? { ...agent.name } : null,
    surname: agent ? { ...agent.surname } : null,
    weaponPermitDate: agent
      ? {
          day: agent.weaponPermitDate.startDate.day,
          month: agent.weaponPermitDate.startDate.month,
          year: agent.weaponPermitDate.startDate.year,
        }
      : null,
  });

  useEffect(() => {
    setSelectedAgent({
      agent: agentListing[indexAgent],
      index: indexAgent,
    });
  }, [agentListing]);

  useEffect(() => {
    setAgent(selectedAgent ? selectedAgent.agent : null);
  }, [selectedAgent]);

  useEffect(() => {
    setAgent(selectedAgent ? selectedAgent.agent : null);
    setIndexAgent(selectedAgent ? selectedAgent.index : null);
  }, [selectedAgent]);

  // enregistre des données temporaire modifier un agent, en lien avec 'boutonModif'
  useEffect(() => {
    setModifiedAgent({
      name: agent ? agent.name : null,
      surname: agent ? agent.surname : null,
      weaponPermitDate: agent
        ? {
            day: agent.weaponPermitDate.startDate.day,
            month: agent.weaponPermitDate.startDate.month,
            year: agent.weaponPermitDate.startDate.year,
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
        const newModifiedAgent = new Agent(
          modifiedAgent.name,
          modifiedAgent.surname,
          new datesP(
            modifiedAgent.weaponPermitDate.day,
            modifiedAgent.weaponPermitDate.month,
            modifiedAgent.weaponPermitDate.year
          ),
          agentListing[indexAgent].shootingTrainingDates,
          agentListing[indexAgent].shootingTrainingDates
        );

        newListing[indexAgent] = newModifiedAgent;
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
  const addAnniversaryDate = () => {
    let id = 0;
    const buttons = [];
    let lastDate =
      agent && [...agent.shootingTrainingDates, ...agent.tisTrainingDates].length > 0
        ? [...agent.shootingTrainingDates, ...agent.tisTrainingDates]
            .reduce((a, b) => {
              return a.delais() > b.delais() ? a : b;
            })
            .delais()
        : 0;

    if (agent) {
      for (const key in agent.permitAnniversaryDates) {
        const date = agent.permitAnniversaryDates[key];
        if (date.start.delais() < lastDate) {
          buttons.push(
            <ButtonTypeBase
              key={`${date.start.afficherDate()}-${id}`}
              className="année"
              content={
                date.start.delais() > 0 ? (
                  <>dates postérieurs</>
                ) : (
                  <>
                    {date.start.afficherDate()} <br /> {date.end.afficherDate()}
                  </>
                )
              }
              id={"n-" + id}
            />
          );
          buttons.push(
            <ListeDates
              fiche={true}
              typeDate="shootingTrainingDates"
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
              typeDate="tisTrainingDates"
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
      {selectedAgent ? (
        <>
          <EditButton click={click} modif={modifier} />
          <CloseSheetButton click={click} />
          <ModifierButton
            className="textes"
            value="name"
            type="text"
            id="nom"
            modif={modifier}
            setterAgent={setModifiedAgent}
          />
          <ModifierButton
            className="textes"
            value="surname"
            type="text"
            id="prenom"
            modif={modifier}
            setterAgent={setModifiedAgent}
          />

          <ModifierButton
            className="textes"
            type="date"
            value="weaponPermitDate"
            id="dpd"
            modif={modifier}
            setterAgent={setModifiedAgent}
          />

          {addAnniversaryDate()}

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
          <SupressButton />
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
const CloseSheetButton = ({ click }) => {
  const { selectedAgent, setSelectedAgent } = useContext(agentContext);
  const fermeFiche = () => {
    click(false, false);
    setSelectedAgent(null);
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
const EditButton = ({ click, modif }) => {
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
const ModifierButton = ({ modif, value, className, id, setterAgent, type }) => {
  const { selectedAgent } = useContext(agentContext);
  const [agent, setAgent] = useState(
    selectedAgent ? selectedAgent.agent : null
  );
  const [content, setContent] = useState(agent ? agent[value] : null);

  useEffect(() => {
    setAgent(selectedAgent ? selectedAgent.agent : null);
  }, [selectedAgent]);

  useEffect(() => {
    setContent(agent ? agent[value] : null);
  }, [agent]);

  useEffect(() => {
    setAgent(selectedAgent ? selectedAgent.agent : null);
    setContent(agent ? agent[value] : null);
  }, [selectedAgent]);

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
            defaultValue={`${content.startDate.year}-${
              content.startDate.month < 10
                ? "0" + content.startDate.month
                : content.startDate.month
            }-${
              content.startDate.day < 10
                ? "0" + content.startDate.day
                : content.startDate.day
            }`}
            className="inputTxtFiche"
            onBlur={(e) =>
              setterAgent((prev) => ({
                ...prev,
                [value]: {
                  day: Number(e.target.value.split("-")[2]),
                  month: Number(e.target.value.split("-")[1]),
                  year: Number(e.target.value.split("-")[0]),
                },
              }))
            }
          />
        ) : type === "date" ? (
          <a className={className} id={id}>
            {
              <>
                {" "}
                Port d'arme <br /> {content.startDate.afficherDateFormat1()}{" "}
                <br /> au <br /> {content.endDate.afficherDateFormat1()}{" "}
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
const SupressButton = (props) => {
  const { selectedAgent, setSelectedAgent } = useContext(agentContext);
  const { agentListing, setAgentListing } = useContext(agentContext);

  const supression = () => {
    setAgentListing((prev) => {
      const newListing = [...prev];
      newListing.splice(selectedAgent.index, 1);
      return newListing;
    });
    setSelectedAgent(agentListing[0]);
    let fiche = document.getElementById("fiche");
    fiche.style.left = "100%";
  };

  return (
    <p id="boutonSupression" onDoubleClick={supression}>
      Supprimer l'agent (double clic)
    </p>
  );
};


export default AgentSheet;
