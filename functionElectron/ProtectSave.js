import { waitFor } from "@testing-library/dom";

export const validateNewSave = (oldData, newData) => {
  let diffCountAgent = 0;
  let diffCountDates = 0;
  let isValide = false;

  const dateSerialization = (date) => {
    return `${date.day}.${date.month}.${date.year} ${date.stat}:${date.comment}`;
}

  const dateComparator = (x, y) => {
    const dateA = x.map(dateSerialization);
    const dateB = y.map(dateSerialization);

    const setA = new Set(dateA);
    const setB = new Set(dateB);

    let diffCount = 0;

    for (const date of setA) {
      if (!setB.has(date)) diffCount++;
    }

    for (const date of setB) {
      if (!setA.has(date)) diffCount++;
    }

    return diffCount;
  };
  if (oldData.length !== 0) {

  const oldById = new Map(oldData.map(agent => [agent.id, agent]));
  const newById = new Map(newData.map(agent => [agent.id, agent]));

  const allIds = new Set([...oldById.keys(), ...newById.keys()]);


  for (const id of allIds) {
    const oldAgent = oldById.get(id);
    const newAgent = newById.get(id);

    if (oldAgent && newAgent) {
      diffCountDates += dateComparator(
        oldAgent.shootingTrainingDates || oldAgent.datesTir || [],
        newAgent.shootingTrainingDates || newAgent.datesTir || []
      );

      diffCountDates += dateComparator(
        oldAgent.tisTrainingDates || oldAgent.datesTis || [],
        newAgent.tisTrainingDates || newAgent.datesTis || []
      );

    } else {
      diffCountAgent++;
    }
  }


  isValide = diffCountAgent <= 1 && diffCountDates <= 1;
  } else {
    isValide = true; // Si oldData est vide, on considère la sauvegarde valide (cas de l'initialisation de la démo)
  }

  return isValide;
};






// configuration des tests automatisés
const agent = (id, tirDates = [], tisDates = []) => ({
  id,
  shootingTrainingDates: tirDates,
  tisTrainingDates: tisDates
});

const date = (day, month, year, stat, comment = "") => ({
  day, month, year, stat, comment
});

const runTest = (desc, expected, result) => {
  console.log("🧪 Test :", desc, "📥 Résultat brut :", result, ((result === expected) ? "✅ Test PASS\n" : "❌ Test FAIL\n"));
};




//  tests automatisées regroupés 
export const runAllTests = () => {
  const baseAgent = agent(1, [
    date(1, 1, 2025, "en attente")
  ], [
    date(5, 2, 2025, "fait", "RAS")
  ]);
  
  const modif1date = agent(1, [
    date(1, 1, 2025, "en attente"),
    date(2, 2, 2025, "en attente")
  ], [
    date(5, 2, 2025, "fait", "RAS")
  ]);

  const modif2dates = agent(1, [
    date(1, 1, 2025, "en attente"),
    date(2, 2, 2025, "en attente")
  ], [
    date(5, 2, 2025, "fait", "RAS"),
    date(10, 3, 2025, "en attente")
  ]);

  const newAgent = agent(2);
  const newAgent2 = agent(3);

  runTest("Aucun changement", true,
    validateNewSave([baseAgent], [baseAgent])
  );

  runTest("Une seule date différente (ajout)", true,
    validateNewSave([baseAgent], [modif1date])
  );

  runTest("Deux dates différentes", false,
    validateNewSave([baseAgent], [modif2dates])
  );

  runTest("Un agent en plus", true,
    validateNewSave([baseAgent], [baseAgent, newAgent])
  );

  runTest("Deux agents différents", false,
    validateNewSave([baseAgent], [baseAgent, newAgent, newAgent2])
  );

  runTest("Cas démo : oldData vide", true,
    validateNewSave([], [baseAgent])
  );
};

