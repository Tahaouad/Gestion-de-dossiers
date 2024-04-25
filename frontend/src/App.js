import React, { useEffect, useState } from 'react';
import DossierList from './components/DossierList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddDossierForm from './components/AddDossierForm';
import Header from './components/Header';

const App = () => {
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    const getDossiers = async () => {
      try {
        const response = await fetch('http://localhost:3001/dossiers');
        const data = await response.json();
        setDossiers(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des dossiers:', error);
      }
    };

    getDossiers();
  }, []);

  const addDossier = async dossier => {
    try {
      const response = await fetch('http://localhost:3001/dossier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dossier)
      });
      const data = await response.json();
      setDossiers([...dossiers, data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du dossier:', error);
    }
  };
 

  return (
    <Router>
      <Header />
      <Routes>
          <Route path="/" element={<DossierList dossiers={dossiers} />} />
          <Route path="/AddDossierForm" element={<AddDossierForm addDossier={addDossier} />} />
      </Routes>
    </Router>
    
  );
}

export default App;
