import datesP from "../classPersonalisé/dateP";



const dateEnCour = {
  date : new Date(),

  day () {
    return this.date.getDate();
  },
  month () {
    return this.date.getMonth() + 1;
  },
  year () {
    return this.date.getFullYear();
  },
}

let todayDate = new datesP(dateEnCour.day(), dateEnCour.month(), dateEnCour.year());


/// convertir un mois en lettre
const monthInString = (month) => {
  switch (month) {
      case 1: return 'Janvier';
      case 2: return 'Février';
      case 3: return 'Mars';
      case 4: return 'Avril';
      case 5: return 'Mai';
      case 6: return 'Juin';
      case 7: return 'Juillet';
      case 8: return 'Août';
      case 9: return 'Septembre';
      case 10: return 'Octobre';
      case 11: return 'Novembre';
      case 12: return 'Décembre';
      default: return 'Mois invalide';
  }
}

// verifier si une date est contenu entre deux dates
const dateBetween = (dateMin, dateComparee, dateMax) => {
  let dateMinVal = dateMin.year * 1000 + dateMin.month * 40 + dateMin.day;
  let dateMaxVal = dateMax.year * 1000 + dateMax.month * 40 + dateMax.day;
  let dateCompareeVal = dateComparee.year * 1000 + dateComparee.month * 40 + dateComparee.day;
  if (dateMinVal <= dateCompareeVal && dateCompareeVal <= dateMaxVal) {
    return true;
  } else {
    return false;
  }
}

// retourne la liste des dates contenu entre deux dates, necessite la fonction dateBetween
const sortDate = (startDate, array, endDate) => {
  let sortedArray = [];
  if (startDate && endDate && array) {
  for (let i = 0; i < array.length; i++) {
    if (
      dateBetween(
        startDate,
        array[i],
        endDate,
      )
    ) {
      sortedArray.push(array[i]);
    }
  }
  return sortedArray;}

}

// calcule le delais avant une date (en int, pour exprimer le nombre de jours)
const timeBefore = (date1, date2) => {
  // Crée des class Date standard pour les deux dates pour effectuer le calcul
  const d1 = new Date(date1.year, date1.month - 1, date1.day); 
  const d2 = new Date(date2.year, date2.month - 1, date2.day);
  
  // Calcule la différence en millisecondes
  const diffTemps = d2 - d1;

  // convertit les mls en jours
  const remainingDays = Math.floor(diffTemps / (1000 * 60 * 60 * 24 ));
  return remainingDays;
};

/*
calcule le delais avant une date 
(renvoie un string, en format lisible pour l'utilisateur)
necessite la fonction 'timeBefore'
*/
const timeBeforeString = (date1, date2) => {

  // resultat en jours, a injecter dans une class datesP a l'aide de addDate pour obtenir un format lisible
  const remainingDays = timeBefore(date1, date2);
  let dateDelais = new datesP (0, 0, 0);
  addDate(dateDelais, remainingDays, 0, 0);
  let textes = '';
  switch (true) { 
      case dateDelais.year > 0:
          textes = `reste ${dateDelais.year} ans, ${dateDelais.month} mois et ${dateDelais.day} jours`;
          break;
      case dateDelais.month > 0:
          textes = `reste ${dateDelais.month} mois et ${dateDelais.day} jours`;
          break;
      case dateDelais.day > 0:
          textes = `reste ${dateDelais.day} jours`;
          break;
      default:
          textes = 'Aucun délai restant';
          break; 
  }
  
  return textes;
};


// addiion (soustraction) de date
const addDate = (date, day, month, year, copie = false) => {
  let newDate = (copie) ? [...date] : date; 
  newDate.day += day;
  newDate.month += month;
  newDate.year += year;

  const daysInMonth = (month, year) => {
    if (month === 2) {
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28; // Année bissextile
    }
    return [4, 6, 9, 11].includes(month) ? 30 : 31; // Mois avec 30 ou 31 jours
  };

  while (true) {
    const maxDays = daysInMonth(newDate.month, newDate.year);

    if (newDate.day > maxDays) {
      newDate.day -= maxDays;
      newDate.month += 1;
    } else if (newDate.day < 1 && newDate.month > 1) {
      newDate.month -= 1;
      newDate.day += daysInMonth(newDate.month, newDate.year);
    } else if (newDate.month > 12) {
      newDate.month -= 12;
      newDate.year += 1;
    } else if (newDate.month < 1 && newDate.year > 0) {
      newDate.month += 12;
      newDate.year -= 1;
    } else {
      break;
    }
  }

  date = newDate;
};

// ajoute une date a une date




export { dateBetween, todayDate, sortDate, timeBefore, addDate, monthInString, timeBeforeString};