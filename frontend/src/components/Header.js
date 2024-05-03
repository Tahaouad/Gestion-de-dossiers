import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-white text-3xl text-center">Gestion des dossiers</h1>
        <ul className="flex justify-center mt-4">
          <li className="mr-6">
            <Link to="/" className="text-white hover:text-gray-300">Liste des dossiers</Link>
          </li>
          <li className="mr-6">
            <Link to="/AddDossierForm" className="text-white hover:text-gray-300">Ajouter un dossier</Link>
          </li>
          <li>
            <Link to="/ImportComponent" className="text-white hover:text-gray-300">Import des dossierS</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
