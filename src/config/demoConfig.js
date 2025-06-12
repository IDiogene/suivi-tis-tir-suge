import { Agent } from "../classPersonalisé/agent";
import datesP from "../classPersonalisé/dateP";
import { todayDate } from "../function/logique";
import config from "../config/config";

const rdmNbr = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rdmDate = () => {
  let day = rdmNbr(1, 31);
  let month = rdmNbr(1, 12);
  let year = rdmNbr(2023, todayDate.year);

  let statut;
  let rand = Math.random();
  if (rand < 0.3) {
    statut = "en attente";
  } else if (rand < 0.6) {
    statut = "validé";
  } else {
    statut = "annulé";
  }

  return new datesP(day, month, year, statut);
};


const blocDateP = () => {
    let blocDate = [];
    for (let i = 0; i < rdmNbr(3, 7 ); i++) {
        blocDate.push(rdmDate());
    }
    return blocDate;
}


const demoConfig = [
    new Agent({
      name: "Dupont",
      surname: "Jean",
      weaponPermitDate: new datesP(22, 7, 2020),
      shootingTrainingDates: blocDateP(),
      tisTrainingDates: blocDateP(),
      id: 1
    }),
    new Agent({
      name: "Martin",
      surname: "Sophie",
      weaponPermitDate: new datesP(15, 9, 2024),
      shootingTrainingDates: blocDateP(),
      tisTrainingDates: blocDateP(),
      id: 2
    }),
    new Agent({
      name: "Durand",
      surname: "Pierre",
      weaponPermitDate: new datesP(10, 1, 2022),
      shootingTrainingDates: blocDateP(),
      tisTrainingDates: blocDateP(),
      id: 3
    }),
    new Agent({
      name: "Lefebvre",
      surname: "Claire",
      weaponPermitDate: new datesP(5, 6, 2023),
      shootingTrainingDates: blocDateP(),
      tisTrainingDates: blocDateP(),
      id: 4
    }),
  ]

  export default demoConfig;
