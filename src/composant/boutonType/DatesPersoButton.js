import React, { useState, useEffect, useContext, use } from "react";
import contextAgent from "../../context/contextAgent";
import { Agent } from "../../classPersonalisé/agent";
import datesP from "../../classPersonalisé/dateP";
import { dateAujourdhui, tempsAvant } from "../../function/logique";


/* logique et affichage d'une date 
(tout est continu dans le bouton, modification, ajout, suppression)
bouton affiché sous 3 forme possible : 

*/

const DatesPersoButton = (props) => {
  const { agentListing, setAgentListing } = useContext(contextAgent);
  const [newDate, setnewDate] = useState(props.newDate);
  const [indexAgent, setIndexAgent] = useState(props.indexAgent);
  const [indexDate, setIndexDate] = useState(props.indexDate);
  const [typeDate, setTypeDate] = useState(props.typeDate);
  const [date, setDate] = useState(
    agentListing[indexAgent]
      ? !newDate
        ? agentListing[indexAgent][typeDate][indexDate]
        : new datesP(
            dateAujourdhui.jour,
            dateAujourdhui.mois,
            dateAujourdhui.annee,
            "en attente",
            "date attribuée"
          )
      : console.log("indexAgent null")
  );
  const [dateIsValid, setDateIsValid] = useState(true); // valide si la date est valide
  const [btnModify, setBtnModify] = useState(false); /// ouvre la fenetre de modif si true


  /* 
  date temporaire, est modifiée au fur et à mesure par l'utilisateur puis 
  est transmis à la date définitive lors de la validation 
  */
  const [dateAttribution, setDateAttribution] = useState(
    !newDate && date
      ? new datesP(date.jour, date.mois, date.annee, date.stat, date.comment)
      : new datesP(
          dateAujourdhui.jour,
          dateAujourdhui.mois,
          dateAujourdhui.annee
        )
  );
  

  useEffect(() => {
    setIndexAgent(props.indexAgent);
    setIndexDate(props.indexDate);
    setTypeDate(props.typeDate);

  }, [agentListing, props.indexAgent]);


  useEffect(() => {
    setDate(
      agentListing[indexAgent]
        ? !newDate
          ? agentListing[indexAgent][typeDate][indexDate]
          : new datesP(
              dateAujourdhui.jour,
              dateAujourdhui.mois,
              dateAujourdhui.annee,
              "en attente",
              "date attribuée"
            )
        : console.log("indexAgent null")
    );
  }, [agentListing, indexAgent, indexDate, typeDate, newDate]);


  // ouvre ou ferme la fenetre de modif
  const click = () => {
    setBtnModify((prev) => !prev);
  };


  /*
  fonctions de mofitication de la date temporaire.
  */
  const editDateTempo = {
    date: (e) => {
      setDateAttribution((prev) => ({
        ...prev,
        jour: Number(e.target.value.split("-")[2]),
        mois: Number(e.target.value.split("-")[1]),
        annee: Number(e.target.value.split("-")[0]),
      }));
    },
    statut: (e) => {
      setDateAttribution((prev) => ({ ...prev, stat: e.target.value }));
    },
    commentaire: (e) => {
      setDateAttribution((prev) => ({ ...prev, comment: e.target.value }));
    },
  }

  // vérifie si la date est valide
  useEffect(() => {
    const valideDay = () => {
    if (dateAttribution.mois === 2) {
      return (dateAttribution.annee % 4 === 0 && (dateAttribution.annee % 100 !== 0 || dateAttribution.annee % 400 === 0)) ? 29 : 28; // Année bissextile
    }
    return [4, 6, 9, 11].includes(dateAttribution.mois) ? 30 : 31; // Mois avec 30 ou 31 jours
  }
    setDateIsValid(dateAttribution.jour <= valideDay())
       
  }, [dateAttribution])


  /*
  fonction de validation de la date temporaire,
  transmet les informations de la date temporaire à la date définitive
  */
  const validation = () => {
    const newDateListe = (type, typeModifié) => {
      let newDateListe = agentListing[indexAgent][typeModifié]

        .map((date, index) => {
          if (index === indexDate && typeModifié === type) {
            return new datesP(
              dateAttribution.jour,
              dateAttribution.mois,
              dateAttribution.annee,
              dateAttribution.stat,
              dateAttribution.comment
            );
          } else {
            return new datesP(
              date.jour,
              date.mois,
              date.annee,
              date.stat,
              date.comment
            );
          }
        })
        .filter((_, index) => {
          if (
            index === indexDate &&
            dateAttribution.stat === "supression" &&
            typeModifié === type
          ) {
            return false;
          } else {
            return true;
          }
        });
      if (newDate && typeModifié === type) {
        newDateListe.push(
          new datesP(
            dateAttribution.jour,
            dateAttribution.mois,
            dateAttribution.annee,
            dateAttribution.stat,
            dateAttribution.comment
          )
        );
      }

      newDateListe.sort((a, b) => {
        if (a.annee !== b.annee) {
          return a.annee - b.annee;
        } else if (a.mois !== b.mois) {
          return a.mois - b.mois;
        } else {
          return a.jour - b.jour;
        }
      });

      return newDateListe;
    };

    setAgentListing((prev) => {
      let newAgentListing = [...prev];
      const agent = new Agent(
        newAgentListing[indexAgent].nom,
        newAgentListing[indexAgent].prenom,
        new datesP(
          newAgentListing[indexAgent].dateDePortArme.dateDebut.jour,
          newAgentListing[indexAgent].dateDePortArme.dateDebut.mois,
          newAgentListing[indexAgent].dateDePortArme.dateDebut.annee
        ),
        newDateListe(typeDate, "datesTir"),
        newDateListe(typeDate, "datesTis")
      );
      newAgentListing[indexAgent] = agent;
      return newAgentListing;
    });
  };



  /* affichage du bouton, 3 version possible :
  1) bouton d'ajout d'une nouvelle date
  2) bouton d'affichage d'une date existante
  3) bouton de modification d'une date existante 
  */

  return newDate && !btnModify ? (

    ///////////  1) bouton d'ajout d'une nouvelle date
    <div className="newDate" onClick={click}>
      +
    </div>
  ) 
  : !btnModify ? (

    //////////// 2) bouton d'affichage d'une date existante
    <div
      className="dateListe"
      id={props.id}
      onClick={click}
      style={
        date
          ? {
              backgroundColor: (() => {
                switch (date.stat) {
                  case "validé":
                    return "green";
                  case "en attente":
                    return tempsAvant(dateAujourdhui, date) < 0
                      ? "blue"
                      : "orange";
                  case "annulé":
                    return "red";
                  case "absence agent":
                    return "red";
                  default:
                    return "";
                }
              })(),
              textDecoration: (() => {
                switch (date.stat) {
                  case "validé":
                    return "none";
                  case "en attente":
                    return "none";
                  case "annulé":
                    return "line-through";
                  case "absence agent":
                    return "line-through";
                  default:
                    return "";
                }
              })(),
            }
          : null
      }
    >
      {date ? date.afficherDate() : "bug date"}
    </div>
  ) : (

    ////////////  3) bouton de modification d'une date existante
    <div className="definiDate" onDoubleClick={(e) => e.stopPropagation()}>
      <input
        type="date"
        className="dateInput"
        onInput={editDateTempo.date}
        onBlur={editDateTempo.date}
        defaultValue={`${date.annee}-${
          date.mois < 10 ? "0" + date.mois : date.mois
        }-${date.jour < 10 ? "0" + date.jour : date.jour}`}
      />


      {
        // bouton de selection de statut de la date
      }
      <select
        name="validation"
        className="statusDate"
        onChange={editDateTempo.statut}
        defaultValue={dateAttribution.stat}
      >
        <option value="en attente">en attente</option>

        { /* 
          verifie si la date est bien passée, 
          sans quoi elle ne peut être validée, 
          et l'agent ne peut être absent
          */ }
        {tempsAvant(dateAujourdhui, dateAttribution) <= 0 ? (
          <option value="validé">validé</option>
        ) : null}
        {tempsAvant(dateAujourdhui, dateAttribution) <= 0 ? (
          <option value="absence agent">absence agent</option>
        ) : null}

        <option value="annulé">annulé</option>
        <option value="supression">supprimer la date definivement</option>
      </select>

      {
        // case pour les commentaires
      }
      <textarea
        name="commentaires"
        className="commentaires"
        placeholder="commentaire"
        cols={50}
        rows={5}
        onBlur={editDateTempo.commentaire}
        onChange={editDateTempo.commentaire}
        defaultValue={dateAttribution.comment}
      ></textarea>

        {
        ////// bouton de validation de la date
        }

      <p
        className="btnValidation"
        onClick={dateIsValid ? validation : null}
        style={{
          backgroundColor: (() => {
            if (dateIsValid) {
            switch (dateAttribution.stat) {
              case "supression":
                return "red";
              default:
                return "green";
            }} else {
              return "gray";
            }
          })(),
        }}
      >
        { dateIsValid ?  
            dateAttribution.stat === "supression"
              ? "supprimer la date"
              : "valider"
          : "invalide"
        }
      </p>

        {
          // bouton d'annulation de la modification
        }
      <p className="btnAnnuler" onClick={click}>
        annuler
      </p>


    </div>
  );
};

export default DatesPersoButton;
