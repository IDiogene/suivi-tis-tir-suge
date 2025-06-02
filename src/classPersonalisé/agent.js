import {
  dateEntreDeux,
  dateAujourdhui,
  tempsAvant,
  addDate,
  trieDates,
} from "../function/logique";
import datesP from "./dateP";


class Agent {
  constructor(name, surname, weaponPermitDate, shootingDates = [], tisDates = []) {
    this.name = name;
    this.surname = surname;
    this.weaponPermitDate = {
      startDate: weaponPermitDate,
      endDate: this.getEndPermitDate(weaponPermitDate),
    };
    this.permitAnniversaryDates = this.createWeaponPermitAnniversaryDate
();
    this.currentYear = this.getCurrentYear();
    this.shootingTrainingDates = shootingDates;
    this.tisTrainingDates = tisDates;
    this.shootingUrgency  = this.getUrgencyLevel(this.shootingTrainingDates);
    this.tisUrgency = this.getUrgencyLevel(this.tisTrainingDates);
  }

  getEndPermitDate(weaponPermitDate) {
    let endDate = new datesP(
      weaponPermitDate.jour,
      weaponPermitDate.mois,
      weaponPermitDate.annee
    );
    addDate(endDate, -1, 0, 5);
    return endDate;
  }

  calculDateAnniversaire(jour, mois, année) {
    let date = new datesP(
      this.weaponPermitDate.startDate.jour,
      this.weaponPermitDate.startDate.mois,
      this.weaponPermitDate.startDate.annee
    );
    addDate(date, jour, mois, année);
    return date;
  }

  createWeaponPermitAnniversaryDate() {
    return {
      n6: {
        start: this.calculDateAnniversaire(0, 0, 5),
        end: new datesP(1, 1, 999999),
      },
      n5: {
        start: this.calculDateAnniversaire(0, 0, 4),
        end: this.calculDateAnniversaire(-1, 0, 5),
      },
      n4: {
        start: this.calculDateAnniversaire(0, 0, 3),
        end: this.calculDateAnniversaire(-1, 0, 4),
      },
      n3: {
        start: this.calculDateAnniversaire(0, 0, 2),
        end: this.calculDateAnniversaire(-1, 0, 3),
      },
      n2: {
        start: this.calculDateAnniversaire(0, 0, 1),
        end: this.calculDateAnniversaire(-1, 0, 2),
      },
      n1: {
        start: this.calculDateAnniversaire(0, 0, 0),
        end: this.calculDateAnniversaire(-1, 0, 1),
      },
    };
  }

  getCurrentYear() {
    const dates = this.permitAnniversaryDates;
    let endDate = null;

    {
      for (let testDate in dates) {
        if (
          dateEntreDeux(
            dates[testDate].start,
            dateAujourdhui,
            dates[testDate].end
          )
        ) {
          endDate = new datesP(
            dates[testDate].end.jour,
            dates[testDate].end.mois,
            dates[testDate].end.annee
          );
          return {
            startDate: dates[testDate].start,
            endDate: endDate,
            string: (
              <div>
                {dates[testDate].start.afficherDate()} <br /> II <br />{" "}
                {endDate.afficherDate()}
              </div>
            ),
            finDans: tempsAvant(dateAujourdhui, endDate),
          };
        }
      }

      if (endDate === null) {
        {
          endDate = new datesP(
            dates.n5.end.jour,
            dates.n5.end.mois,
            dates.n5.end.annee
          );

          return {
            startDate: dates.n5.start,
            endDate: endDate,
            string: (
              <div>
                {dates.n5.start.afficherDate()} <br /> II <br />{" "}
                {endDate.afficherDate()}
              </div>
            ),
            finDans: tempsAvant(dateAujourdhui, endDate),
          };
        }
      }
    }
  }

  getUrgencyLevel(dates) {
    let consideringDates = dates.filter(
      (date) => date.stat !== "annulé" && date.stat !== "absence agent"
    );
    let facteurDate = 0;
    if (this.currentYear) {
      // Calculer le nombre de dates dans la plage spécifiée
      const numberOfDate = trieDates(
        this.currentYear.startDate,
        consideringDates,
        this.currentYear.endDate
      ).length;

      // Définir la valeur de "facteurDate" en fonction du nombre de dates
      if (numberOfDate === 0) {
        facteurDate = 0;
      } else if (numberOfDate === 1 && this.currentYear.finDans > 60) {
        facteurDate = 90;
      } else if (numberOfDate >= 2) {
        facteurDate = 1000;
      } else {
        facteurDate = 0;
      }

      // Retourner le calcul final

      return 365 - (this.currentYear.finDans + facteurDate);
    } else {
      return 0;
    }
  }
}

export { Agent };
