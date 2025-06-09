const { app, BrowserWindow, ipcMain, shell } = require("electron");
const os = require("os");
const modeDev = true;
const path = require("path");
const fs = require("fs");
const saveDirectory = modeDev
  ? path.join(__dirname, "save")
  : path.join(os.homedir(), "Documents", "sauvegardeGestionDpdAgent");
const filePath = path.join(saveDirectory, "sauvegarde.json");

const dataCalculation = (data) => {
  let count = 0;
  data.forEach(element => {
     count += (element.shootingTrainingDates || element.datesTir || []).length
     count += (element.tisTrainingDates || element.datesTis || []).length 
  });
  return count;
}

const validateNewSave = (oldData, newData) => {
  let diffCountAgent = 0;
  let diffCountDates = 0;
  let isValide = false;
  if (Array.isArray(newData) && Array.isArray(oldData)) {
    let biggestArray = (newData.length >= oldData.length ) ? newData : oldData;
    let smallestArray = (newData.length < oldData.length ) ? newData : oldData;

    for (let i = 0; i < biggestArray.length; i++) {
      const agentBigArr = newData[i];
      const agentSmallArr = smallestArray.find(agent => agent.id === agentBigArr.id);
      if (agentSmallArr) {
        for (let i = 0; i < biggestArray.length; i++) {
          let verifiedDate = agentBigArr.shootingTrainingDates[i];
          if (!agentSmallArr.shootingTrainingDates.some(verifiedDate) || !verifiedDate) {
            diffCountDates++;
          };
        }
        
        for (let i = 0; i < biggestArray.length; i++) {
          let verifiedDate = agentBigArr.tisTrainingDates[i];
          if (!agentSmallArr.tisTrainingDates.some(verifiedDate) || !verifiedDate) {
            diffCountDates++;
          };
        }

      } else {
        diffCountAgent++;
      }
    }
  }
  if ((diffCountAgent <= 1 && diffCountDates === 0) || diffCountDates <= 1 && diffCountAgent === 0) {
    isValide = true;
  } else {
    isValide = false;
  }
  console.log("Validation de la sauvegarde : ", isValide);
  console.log("Nombre d'agents différents :", diffCountAgent);
  console.log("Nombre de dates différents :", diffCountDates);
  
  return isValide;

}



//// bloc de code pour la creation de la fenetre et les mechanismes de bases
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (modeDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(path.join(__dirname, "build", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//// bloc de code pour la creation de la fenetre et les mechanismes de bases

ipcMain.handle("save", async (event, data) => {
  try {
    // S'assurer que le dossier existe, sinon le créer
    await fs.promises.mkdir(saveDirectory, { recursive: true });
    const precData = await fs.promises.readFile(filePath, "utf-8");
    if (Array.isArray(data)) {

    // compte le nombre d'agent et de données dans les deux fichiers
    const oldAgentCount = Object.keys(JSON.parse(precData)).length;
    const newAgentCount = Array.isArray(data) ? data.length : 0;
    const oldDataCount = dataCalculation(JSON.parse(precData));
    const newDataCount = dataCalculation(Array.isArray(data) ? data : []);

   
    // si les données ne dépassent pas une différence de 1, la sauvegarde est autorisée
    const agentCountValide = Math.abs(oldAgentCount - newAgentCount ) <= 1 ? true : false;
    const dateCountValide = (Math.abs(oldDataCount - newDataCount) <= 1 || Math.abs(oldAgentCount - newAgentCount) === 1 ) ? true : false;

    console.log ( "nombre d'agent precedent :", oldAgentCount,
      "nombre d'agent actuel :", newAgentCount,)
    console.log ( "nombre de données precedent :", oldDataCount,
      "nombre de données actuel :", newDataCount,)
    

    // verifie la difference de nombre de données, s'assure donc que la modifification est donc bien initié par l'utilisateur
    if (
        (agentCountValide && dateCountValide) || oldAgentCount === 0
    ) {

      // Sauvegarder le fichier
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log("Sauvegarde réussie :", filePath);
      return { success: true };

    } else {
      console.log("Le nombre de données a changé de manière significative, sauvegarde annulée." );
      return {
        success: false,
        error: { agentCountValide, dateCountValide }
      };
    }} else {
      console.log("Les données fournies ne sont pas un tableau valide.");
      return {
        success: false,
        error: "Les données fournies ne sont pas un tableau valide.",
      };
    }
  } catch (error) {
    console.log("Erreur de sauvegarde :", error);
    return { success: false, error };
  }
});



ipcMain.handle("load", async () => {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error("Erreur de chargement :", error);
    return { success: false, error };
  }
});

ipcMain.handle("openSave", async () => {
  try {
    await fs.promises.mkdir(saveDirectory, { recursive: true });
    shell.openPath(saveDirectory);
    return { success: true };
  } catch (error) {
    console.error("Erreur d'ouverture :", error);
    return { success: false, error };
  }
});
