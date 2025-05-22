import React from 'react';
import config from '../config/config.js';

const Credit = () => {
    return (
      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        Solution développée par Hugo Canadas —{" "}
        <a href="mailto:canadashcb@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>
          canadashcb@gmail.com
        </a>
        <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
          © {new Date().getFullYear()} Hugo Canadas. Tous droits réservés.
        </div>

        <br />


        {config.demo ? (
          <div 
          style={{ 
            background: '#ffcc00', 
            padding: '5px', 
            textAlign: 'center', 
            border: '2px solid #ff9900',
            borderRadius: '5px',
            }}>
            ⚠️ Mode Démonstration 
            <br />
            – 
            <br /> 
            Ajout de 4 agents avec dates aléatoires si tableau vide 
            <br />
            –
            <br />
            Données fictives
            <br />
            – 
            <br />
            Vous ne pouvez ajouter que dix agents
          </div>
        ) : null}

      </footer>
    );
  };
  

export default Credit;