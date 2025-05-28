import {
  dateAujourdhui,
  tempsAvant,
  moisEnLettre,
  tempsAvantString,
} from "../function/logique";

class datesP {
  constructor(jour, mois, annee, stat = "en attente", comment = "") {
    this.jour = jour;
    this.mois = mois;
    this.annee = annee;
    this.stat = stat;
    this.comment = comment;
  }
  afficherDate() {
    return `${this.jour < 10 ? "0" + this.jour : this.jour} / ${
      this.mois < 10 ? "0" + this.mois : this.mois
    } / ${this.annee}`;
  }
  afficherDateFormat1() {
    return `${this.jour} ${moisEnLettre(this.mois)} ${this.annee}`;
  }
  delais() {
    let delais = tempsAvant(dateAujourdhui, this);
    return delais;
  }
  delaisFormat1() {
    let delais = tempsAvantString(dateAujourdhui, this);
    if (delais === "Aucun délai restant") {
      delais = "Port d'arme hors délai";
    }
    return delais;
  }
}


export default datesP;