import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
        <h1>Gestion des dossiers</h1>
      <ul>
        <li><Link to="/">Liste des dossiers</Link></li>
        <li><Link to="/AddDossierForm">Ajouter un dossier</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
