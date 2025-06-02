import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";
import { dateAujourdhui } from "../function/logique";
import config from "../config/config";

const rdmNbr = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rdmDate = () => {
  let day = rdmNbr(1, 31);
  let month = rdmNbr(1, 12);
  let annee = rdmNbr(2023, dateAujourdhui.annee);

  let statut;
  let rand = Math.random();
  if (rand < 0.3) {
    statut = "en attente";
  } else if (rand < 0.6) {
    statut = "validé";
  } else {
    statut = "annulé";
  }

  return new datesP(day, month, annee, statut);
};


const blocDateP = () => {
    let blocDate = [];
    for (let i = 0; i < rdmNbr(3, 7 ); i++) {
        blocDate.push(rdmDate());
    }
    return blocDate;
}


const demoConfig = [
    new Agent(
      "Dupont",
      "Jean",
      new datesP(22, 7, 2020),
      blocDateP(),
      blocDateP()
    ),
    new Agent(
      "Martin",
      "Pierre",
      new datesP( 27, 6, 2022),
      blocDateP(),
      blocDateP(),

    ),
    new Agent(
      "Durand",
      "Marie",
      new datesP( 15, 8, 2024),
      blocDateP(),
      blocDateP()
    ),
    new Agent(
      "Leroy",
      "Sophie",
      new datesP( 10, 2, 2022),
      blocDateP(),
      blocDateP()
    ),
  ]

  export default demoConfig;
