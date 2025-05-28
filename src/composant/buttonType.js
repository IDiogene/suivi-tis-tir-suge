import React, { useState, useContext } from "react";
import "./button.css";
import contextAgent from "../context/contextAgent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const { ipcRenderer } = window.require("electron");


// affichage d'une valeur de base (pas de logique)
const ButtonTypeBase = ({ className, id, content, click }) => {
  return (
    <a className={className} id={id} onClick={click}>
      {content}
    </a>
  );
};


// bouton qui change de contenu au survol (depend des props)
const ButtonTypeAlternative = (props) => {
  const [content, setContent] = useState(props.content);
  const mouseEnter = () => {
    setContent(props.content2);
  };
  const mouseLeave = () => {
    setContent(props.content);
  };

  return (
    <a
      className={props.className}
      id={props.id}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      {content}
    </a>
  );
};


// bouton pour télécharger le pdf (contien toute la logique)
const PdfButton = (props) => {
  const { agentListing } = useContext(contextAgent);

  const dowloadPdf = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pdfTitle = "Liste des agents";
    const pdfSubTitle = "Liste des agents avec leurs dates de port d'arme";

    doc.setFontSize(20);
    doc.text(pdfTitle, 40, 40);
    doc.setFontSize(12);
    doc.text(pdfSubTitle, 40, 60);

    autoTable(doc, {
      startY: 80,
      head: [["Nom", "date Tirs", "Dates Tis"]],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      body: agentListing.map((agent) => {
        return [
          agent.nom + " " + agent.surname,
          agent.shootingTrainingDates
            .filter((date) =>
              ["validé", "annulé", "absence agent"].includes(date.stat)
            )
            .map(
              (date) =>
                date.afficherDate() + " : " + date.stat + "  || " + date.comment
            )
            .join("\n"),

          agent.datesTis
            .filter((date) =>
              ["validé", "annulé", "absence agent"].includes(date.stat)
            )
            .map(
              (date) =>
                date.afficherDate() + " : " + date.stat + "  || " + date.comment
            )
            .join("\n"),
        ];
      }),
      didParseCell: function (data) {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240]; // Gris clair sur les lignes paires
        }
      },
    });

    doc.save("Liste Dates des Agent.pdf");
  };

  return (
    <p id="pdfButton" onClick={dowloadPdf}>
      PDF
    </p>
  );
};


// bouton pour ouvrir le dossier de sauvegarde local (se reporter a main.js pour la logique)
const LocalStorageButton = (props) => {


  const openSave = () => {
    ipcRenderer
      .invoke("openSave")
      .then((result) => {})
      .catch((error) => {
        console.error("Erreur lors de l'appel Electron :", error);
      });
  };

  return (
    <p id="localSave" onClick={openSave}>
      open local save
    </p>
  );
};


export {
  ButtonTypeBase,
  ButtonTypeAlternative,
  PdfButton,
  LocalStorageButton,
};
