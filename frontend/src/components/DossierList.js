import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DossierList() {
    const [dossiers, setDossiers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/dossiers')
            .then(response => {
                setDossiers(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des dossiers:', error);
            });
    }, []);

    return (
        <div>
            <h1>Liste des dossiers</h1>
            <table>
                <thead>
                    <tr>
                        <th>N° Dossier</th>
                        <th>Date de réception</th>
                        <th>Heure de réception</th>
                        <th>Cadre d'analyse</th>
                        <th>Service demandeur / Client</th>
                        <th>Pays d'origine</th>
                        <th>Nombre d'échantillons</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dossiers.map(dossier => (
                        <tr key={dossier.id}>
                            <td>{dossier.numero_dossier}</td>
                            <td>{dossier.date_reception}</td>
                            <td>{dossier.heure_reception}</td>
                            <td>{dossier.cadre_analyse}</td>
                            <td>{dossier.service_demandeur}</td>
                            <td>{dossier.pays_origine}</td>
                            <td>{dossier.nombre_echantillons}</td>
                            <td>
                                <button>Editer</button>
                                <button>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DossierList;
