import './App.css';
import { PdfButton, LocalStorageButton } from './composant/buttonType';
import CaseAlerte from './composant/caseAlerte';
import AlerteErrorSave from './composant/composant/AlerteErrorSave';
import AgentSheet from './composant/FicheAgent';
import {Grid} from './composant/grille';
import { AgentProvider } from './context/contextAgent'; 
import Credit from './piedDePage/credit';



function App() {


  return (
    <AgentProvider>
    <div className="App">
      <header className="App-header">
        <Grid/>
        <AgentSheet/>
        <CaseAlerte/>
        <PdfButton/>
        <LocalStorageButton/>
        <Credit/>
        <AlerteErrorSave/>
      </header>
    </div>
    
  </AgentProvider>
  );
}

export default App;
