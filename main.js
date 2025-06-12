const { app, BrowserWindow, ipcMain, shell } = require("electron");
const os = require("os");
const modeDev = true;
const path = require("path");
const fs = require("fs");
const saveDirectory = modeDev
  ? path.join(__dirname, "save")
  : path.join(os.homedir(), "Documents", "sauvegardeGestionDpdAgent");
const filePath = path.join(saveDirectory, "sauvegarde.json");
const validateNewSave = require("./functionElectron/ProtectSave").validateNewSave;
const runAllTests = require("./functionElectron/ProtectSave").runAllTests;


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

runAllTests();

ipcMain.handle("save", async (event, data) => {
  try {
    // S'assurer que le dossier et le fichier existeent, sinon le créer
    await fs.promises.mkdir(saveDirectory, { recursive: true });
    let precData;
    try {
      precData = await fs.promises.readFile(filePath, "utf-8");
    } catch (error) {
      // Si le fichier n'existe pas, on le crée avec un tableau vide
      await fs.promises.writeFile(filePath, JSON.stringify([]));
      precData = await fs.promises.readFile(filePath, "utf-8");
      console.log("Fichier de sauvegarde créé :", filePath);
    }


    if (Array.isArray(data)) {
    
    // verifie la difference les differences entre les données a enregistrer et les précédente, s'assure donc que la modifification est donc bien initié par l'utilisateur
    if (
        validateNewSave(JSON.parse(precData), data)
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
