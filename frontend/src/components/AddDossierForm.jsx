
import React, { useState } from 'react';
import './styles.css';

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
    <>
    
    <form onSubmit={handleSubmit} >
      <label>N° Dossier :</label>
      <input type="text" name="numero_dossier" value={dossier.numero_dossier} onChange={handleInputChange} />
      <label>Date de réception :</label>
      <input type="date" name="date_reception" value={dossier.date_reception} onChange={handleInputChange} />
      <label>Heure de réception :</label>
      <input type="time" name="heure_reception" value={dossier.heure_reception} onChange={handleInputChange} />
      <label>Cadre d'analyse :</label>
      <input type="text" name="cadre_analyse" value={dossier.cadre_analyse} onChange={handleInputChange} />
      <label>Service demandeur / Client :</label>
      <input type="text" name="service_demandeur" value={dossier.service_demandeur} onChange={handleInputChange} />
      <label>Pays d'origine :</label>
      <input type="text" name="pays_origine" value={dossier.pays_origine} onChange={handleInputChange} />
      <label>Nombre d'échantillons :</label>
      <input type="text" name="nombre_echantillons" value={dossier.nombre_echantillons} onChange={handleInputChange} />
      <label>Code interne échantillon :</label>
      <input type="text" name="code_interne_echantillon" value={dossier.code_interne_echantillon} onChange={handleInputChange} />
      <label>Agent recherché :</label>
      <input type="text" name="agent_recherche" value={dossier.agent_recherche} onChange={handleInputChange} />
      <label>Culture :</label>
      <input type="text" name="culture" value={dossier.culture} onChange={handleInputChange} />
      <label>Nature d'échantillon :</label>
      <input type="text" name="nature_echantillon" value={dossier.nature_echantillon} onChange={handleInputChange} />
      <label>N° de lot :</label>
      <input type="text" name="numero_lot" value={dossier.numero_lot} onChange={handleInputChange} />
      <label>Analyse demandée :</label>
      <input type="text" name="analyse_demandee" value={dossier.analyse_demandee} onChange={handleInputChange} />
      <label>Référence méthode :</label>
      <input type="text" name="reference_methode" value={dossier.reference_methode} onChange={handleInputChange} />
      <label>Début analyse :</label>
      <input type="text" name="debut_analyse" value={dossier.debut_analyse} onChange={handleInputChange} />
      <label>Fin analyse :</label>
      <input type="text" name="fin_analyse" value={dossier.fin_analyse} onChange={handleInputChange} />
      <label>Étape de l'analyse :</label>
      <input type="text" name="etape_analyse" value={dossier.etape_analyse} onChange={handleInputChange} />
      <label>Résultat d'analyse :</label>
      <input type="text" name="resultat_analyse" value={dossier.resultat_analyse} onChange={handleInputChange} />
      <label>Date envoi résultat :</label>
      <input type="date" name="date_envoi_resultat" value={dossier.date_envoi_resultat} onChange={handleInputChange} />
      <label>Statut du dossier :</label>
      <input type="text" name="statut_dossier" value={dossier.statut_dossier} onChange={handleInputChange} />
      <label>Commentaire :</label>
      <input type="text" name="commentaire" value={dossier.commentaire} onChange={handleInputChange} />

      <button>Ajouter un Dossier</button>
    </form>
    </>
  );
};

export default AddDossierForm;
