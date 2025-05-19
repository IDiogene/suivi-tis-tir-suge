import React from 'react';

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
      </footer>
    );
  };
  

export default Credit;