import React, { useState, useEffect, useContext } from "react";
import DatesPersoButton from "../boutonType/DatesPersoButton";
import agentContext from "../../context/contextAgent";
import { dateEntreDeux } from "../../function/logique";

const ListeDates = (props) => {
  const { agentListing, agentSelectionné } = useContext(agentContext);
  const [index, setIndex] = useState(
    props.fiche ? agentSelectionné.index : props.indexAgent
  );
  const [agent, setAgent] = useState(
    props.fiche ? agentSelectionné.agent : agentListing[index]
  );
  const [dateFormat, setDateFormat] = useState(
    props.fiche ? ["debut", "fin"] : ["startDate", "dateFin"]
  );

  const [dateListe, setDateListe] = useState(agent[props.typeDate]);
  const [anneeCourante, setAnneeCourante] = useState(
    props.fiche ? props.annéeCouranteFiche : agent.anneeCourante
  );
  const [delais, setDelais] = useState(anneeCourante[dateFormat[1]].delais());

  /// initialisation code couleur
  let dateListeValidée = 0;
  let dateListeAttente = 0;
  const [dateListeValidéeH, setDateListeValidéeH] = useState(0);
  const [dateListeAttenteH, setDateListeAttenteH] = useState(0);
  /// initialisation code couleur

  useEffect(() => {
    setIndex(props.fiche ? agentSelectionné.index : props.indexAgent);
  }, [agentListing, agentSelectionné]);

  useEffect(() => {
    setAgent(props.fiche ? agentSelectionné.agent : agentListing[index]);
    setDateListeValidéeH(dateListeValidée);
    setDateListeAttenteH(dateListeAttente);
  }, [agentListing, agentSelectionné, index, dateListe]);

  useEffect(() => {
    setDateListe(agent[props.typeDate]);
    setAnneeCourante(
      props.fiche ? props.annéeCouranteFiche : agent.anneeCourante
    );
  }, [agent]);

  /// créer la liste de dates et ajoute date pour code couleur
  const addDate = () => {
    let dateListeReturn = [];
    if (dateListe && agent) {
      dateListeReturn = dateListe.map((date, indexDate) => {
        if (
          dateEntreDeux(
            anneeCourante[dateFormat[0]],
            date,
            anneeCourante[dateFormat[1]]
          )
        ) {
          if (date.stat === "validé") {
            dateListeValidée++;
          } else if (date.stat === "en attente") {
            dateListeAttente++;
          }

          return (
            <DatesPersoButton
              date={date}
              key={date.afficherDate() + Math.random() + indexDate}
              indexAgent={index}
              typeDate={props.typeDate}
              indexDate={indexDate}
              newDate={false}
            />
          );
        }
      });
    }
    if (dateListeReturn) {
      dateListeReturn.push(
        <DatesPersoButton
          key={"newDate" + Math.random()}
          className="dateListe"
          indexAgent={index}
          typeDate={props.typeDate}
          indexDate={dateListeReturn.length}
          newDate={true}
        />
      );
    }

    return dateListeReturn;
  };
  /// créer la liste de dates et ajoute date pour code couleur

  return (
    <div
      className="listeDates"
      id={props.id}
      /// gestion code couleur
      style={{
        backgroundColor: (() => {
          if (dateListeValidéeH >= 2) {
            return "rgb(7, 194, 1)";
          } else if (
            dateListeAttenteH + dateListeValidéeH >= 2 &&
            delais < 180
          ) {
            return "rgb(48, 73, 43)";
          } else if (
            (dateListeAttenteH + dateListeValidéeH === 2 &&
              delais < 120 &&
              delais > 90) ||
            (dateListeAttenteH + dateListeValidéeH === 1 &&
              delais < 180 &&
              delais > 90)
          ) {
            return "rgb(214, 157, 0)";
          } else if (
            (dateListeAttenteH + dateListeValidéeH <= 0 && delais <= 180) ||
            (dateListeAttenteH + dateListeValidéeH <= 1 && delais <= 90)
          ) {
            return "rgb(255, 0, 0)";
          }
        })(),
      }}
      /// gestion code couleur
    >
      {addDate()}
    </div>
  );
};

export default ListeDates;
