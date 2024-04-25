import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDossierForm = ({ addDossier }) => {
    const initialFormState = {
        numero_dossier: '',
        date_reception: '',
        heure_reception: '',
        cadre_analyse: '',
        service_demandeur: '',
        pays_origine: '',
        nombre_echantillons: '',
        code_interne_echantillon: '',
        agent_recherche: '',
        culture: '',
        nature_echantillon: '',
        numero_lot: '',
        analyse_demandee: '',
        reference_methode: '',
        debut_analyse: '',
        fin_analyse: '',
        etape_analyse: '',
        resultat_analyse: '',
        date_envoi_resultat: '',
        statut_dossier: '',
        commentaire: ''
    };

    const [dossier, setDossier] = useState(initialFormState);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            setCountries(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setDossier({ ...dossier, [name]: value });
    };

    const handleSubmit = event => {
        event.preventDefault();
        if (!dossier.numero_dossier || !dossier.date_reception || !dossier.heure_reception) return;
        addDossier(dossier);
        setDossier(initialFormState);
    };

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">N° Dossier :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="numero_dossier" value={dossier.numero_dossier} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Date de réception :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="date" name="date_reception" value={dossier.date_reception} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Heure de réception :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="time" name="heure_reception" value={dossier.heure_reception} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Cadre d'analyse :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="cadre_analyse" value={dossier.cadre_analyse} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Service demandeur / Client :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="service_demandeur" value={dossier.service_demandeur} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Pays d'origine :</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="pays_origine"
                        value={dossier.pays_origine}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionnez un pays...</option>
                        {countries.map(country => (
                            <option key={country.name.common} value={country.name.common}>{country.name.common}</option>
                        ))}
                    </select>
                </div>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre d'échantillons :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="nombre_echantillons" value={dossier.nombre_echantillons} onChange={handleInputChange} />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Code interne échantillon :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="code_interne_echantillon" value={dossier.code_interne_echantillon} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Agent recherché :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="agent_recherche" value={dossier.agent_recherche} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Culture :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="culture" value={dossier.culture} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Nature d'échantillon :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="nature_echantillon" value={dossier.nature_echantillon} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">N° de lot :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="numero_lot" value={dossier.numero_lot} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Analyse demandée :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="analyse_demandee" value={dossier.analyse_demandee} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Référence méthode :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="reference_methode" value={dossier.reference_methode} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Début analyse :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="debut_analyse" value={dossier.debut_analyse} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Fin analyse :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="fin_analyse" value={dossier.fin_analyse} onChange={handleInputChange} />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Étape de l'analyse :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="etape_analyse" value={dossier.etape_analyse} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Résultat d'analyse :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="resultat_analyse" value={dossier.resultat_analyse} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Date envoi résultat :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="date" name="date_envoi_resultat" value={dossier.date_envoi_resultat} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Statut du dossier :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="statut_dossier" value={dossier.statut_dossier} onChange={handleInputChange} />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Commentaire :</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="commentaire" value={dossier.commentaire} onChange={handleInputChange} />
  </div>

  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Ajouter un Dossier</button>
</form>
    </div>
  );
};

export default AddDossierForm;
