import {
  todayDate,
  timeBefore,
  monthInString,
  timeBeforeString,
} from "../function/logique";

class datesP {
  constructor(day, month, year, stat = "en attente", comment = "") {
    this.day = day;
    this.month = month;
    this.year = year;
    this.stat = stat;
    this.comment = comment;
  }
  afficherDate() {
    return `${this.day < 10 ? "0" + this.day : this.day} / ${
      this.month < 10 ? "0" + this.month : this.month
    } / ${this.year}`;
  }
  afficherDateFormat1() {
    return `${this.day} ${monthInString(this.month)} ${this.year}`;
  }
  delais() {
    let delais = timeBefore(todayDate, this);
    return delais;
  }
  delaisFormat1() {
    let delais = timeBeforeString(todayDate, this);
    if (delais === "Aucun délai restant") {
      delais = "Port d'arme hors délai";
    }
    return delais;
  }
}


export default datesP;