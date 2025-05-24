import {
  dateEntreDeux,
  dateAujourdhui,
  tempsAvant,
  addDate,
  trieDates,
} from "../function/logique";
import datesP from "./dateP";


class Agent {
  constructor(name, surname, dateDePortArme, datesTir = [], datesTis = []) {
    this.name = name;
    this.surname = surname;
    this.dateDePortArme = {
      dateDebut: dateDePortArme,
      dateFin: this.recupDateFinPDA(dateDePortArme),
    };
    this.datesAnniversairePDA = this.creerPlageAnniversaire();
    this.anneeCourante = this.recupAnneeCourante();
    this.datesTir = datesTir;
    this.datesTis = datesTis;
    this.urgenceTir = this.calculUrgence(this.datesTir);
    this.urgenceTis = this.calculUrgence(this.datesTis);
  }

  recupDateFinPDA(dateDePortArme) {
    let dateFin = new datesP(
      dateDePortArme.jour,
      dateDePortArme.mois,
      dateDePortArme.annee
    );
    addDate(dateFin, -1, 0, 5);
    return dateFin;
  }

  calculDateAnniversaire(jour, mois, année) {
    let date = new datesP(
      this.dateDePortArme.dateDebut.jour,
      this.dateDePortArme.dateDebut.mois,
      this.dateDePortArme.dateDebut.annee
    );
    addDate(date, jour, mois, année);
    return date;
  }

  creerPlageAnniversaire() {
    return {
      n6: {
        debut: this.calculDateAnniversaire(0, 0, 5),
        fin: new datesP(1, 1, 999999),
      },
      n5: {
        debut: this.calculDateAnniversaire(0, 0, 4),
        fin: this.calculDateAnniversaire(-1, 0, 5),
      },
      n4: {
        debut: this.calculDateAnniversaire(0, 0, 3),
        fin: this.calculDateAnniversaire(-1, 0, 4),
      },
      n3: {
        debut: this.calculDateAnniversaire(0, 0, 2),
        fin: this.calculDateAnniversaire(-1, 0, 3),
      },
      n2: {
        debut: this.calculDateAnniversaire(0, 0, 1),
        fin: this.calculDateAnniversaire(-1, 0, 2),
      },
      n1: {
        debut: this.calculDateAnniversaire(0, 0, 0),
        fin: this.calculDateAnniversaire(-1, 0, 1),
      },
    };
  }

  recupAnneeCourante() {
    const dates = this.datesAnniversairePDA;
    let dFin = null;

    {
      for (let testDate in dates) {
        if (
          dateEntreDeux(
            dates[testDate].debut,
            dateAujourdhui,
            dates[testDate].fin
          )
        ) {
          dFin = new datesP(
            dates[testDate].fin.jour,
            dates[testDate].fin.mois,
            dates[testDate].fin.annee
          );
          return {
            dateDebut: dates[testDate].debut,
            dateFin: dFin,
            string: (
              <div>
                {dates[testDate].debut.afficherDate()} <br /> II <br />{" "}
                {dFin.afficherDate()}
              </div>
            ),
            finDans: tempsAvant(dateAujourdhui, dFin),
          };
        }
      }

      if (dFin === null) {
        {
          dFin = new datesP(
            dates.n5.fin.jour,
            dates.n5.fin.mois,
            dates.n5.fin.annee
          );

          return {
            dateDebut: dates.n5.debut,
            dateFin: dFin,
            string: (
              <div>
                {dates.n5.debut.afficherDate()} <br /> II <br />{" "}
                {dFin.afficherDate()}
              </div>
            ),
            finDans: tempsAvant(dateAujourdhui, dFin),
          };
        }
      }
    }
  }

  calculUrgence(dates) {
    let consideringDates = dates.filter(
      (date) => date.stat !== "annulé" && date.stat !== "absence agent"
    );
    let facteurDate = 0;
    if (this.anneeCourante) {
      // Calculer le nombre de dates dans la plage spécifiée
      const nombreDates = trieDates(
        this.anneeCourante.dateDebut,
        consideringDates,
        this.anneeCourante.dateFin
      ).length;

      // Définir la valeur de "facteurDate" en fonction du nombre de dates
      if (nombreDates === 0) {
        facteurDate = 0;
      } else if (nombreDates === 1 && this.anneeCourante.finDans > 60) {
        facteurDate = 90;
      } else if (nombreDates >= 2) {
        facteurDate = 1000;
      } else {
        facteurDate = 0;
      }

      // Retourner le calcul final

      return 365 - (this.anneeCourante.finDans + facteurDate);
    } else {
      return 0;
    }
  }
}

export { Agent };
