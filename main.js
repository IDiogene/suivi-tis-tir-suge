const { app, BrowserWindow, ipcMain, shell } = require('electron');
const os = require('os');
const modeDev = false; 
const path = require('path');
const fs = require('fs');
const saveDirectory = modeDev ? path.join(__dirname, 'save') : path.join(os.homedir(), 'Documents', 'sauvegardeGestionDpdAgent');
const filePath = path.join(saveDirectory, 'sauvegarde.json');


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
      win.loadURL('http://localhost:3000');
    } else {
      win.loadFile(path.join(__dirname, 'build', 'index.html'));
}}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



ipcMain.handle('save', async (event, data) => {
  try {
    // S'assurer que le dossier existe, sinon le créer
    await fs.promises.mkdir(saveDirectory, { recursive: true });
  
    // Sauvegarder le fichier
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Erreur de sauvegarde :', error);
    return { success: false, error };
  }
});


ipcMain.handle('load', async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error('Erreur de chargement :', error);
    return { success: false, error };
  }
});

ipcMain.handle('openSave', async () => {
  try{
  await fs.promises.mkdir(saveDirectory, { recursive: true });
  shell.openPath(saveDirectory);
  return { success: true };
  }
  catch (error) {
    console.error('Erreur d\'ouverture :', error);
    return { success: false, error };
  }
})