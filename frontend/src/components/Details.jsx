import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaPrint, FaTrashAlt } from 'react-icons/fa';

function Details() {
    const { id } = useParams();
    const [dossier, setDossier] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchDossier();
    }, []);

    const fetchDossier = () => {
        axios.get(`http://localhost:3001/dossier/${id}`)
            .then(response => {
                setDossier(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du dossier:', error);
            });
    };

    const deleteDossier = () => {
        axios.delete(`http://localhost:3001/dossier/${id}`)
            .then(response => {
                console.log(response.data.message);
                navigate('/');
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du dossier:', error);
            });
    };

    const printDossierPDF = () => {
        window.open(`http://localhost:3001/dossier/${id}/pdf`, '_blank');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mx-auto mt-7">
            <h1 className="text-2xl font-bold mb-5 text-center">Détails du dossier</h1>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <h2 className="text-lg font-semibold mb-2">Informations d'analyse</h2>
                        <div className="mb-4">
                            <span className="font-semibold">Cadre d'analyse:</span> {dossier.cadre_analyse}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Service demandeur / Client:</span> {dossier.service_demandeur}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Culture:</span> {dossier.culture}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Nature d'échantillon:</span> {dossier.nature_echantillon}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">N° de lot:</span> {dossier.numero_lot}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Analyse demandée:</span> {dossier.analyse_demandee}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Référence méthode:</span> {dossier.reference_methode}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Début analyse:</span> {formatDate(dossier.debut_analyse)}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Fin analyse:</span> {formatDate(dossier.fin_analyse)}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Etape de l'analyse:</span> {dossier.etape_analyse}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Résultat d'analyse:</span> {dossier.resultat_analyse}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Date envoi résultat:</span> {dossier.date_envoi_resultat ? formatDate(dossier.date_envoi_resultat) : 'Non envoyé'}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Statut du dossier:</span> {dossier.statut_dossier}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Commentaire:</span> {dossier.commentaire}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h2 className="text-lg font-semibold mb-2">Informations générales</h2>
                        <div className="mb-4">
                            <span className="font-semibold">N° Dossier:</span> {dossier.numero_dossier}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Date de réception:</span> {formatDate(dossier.date_reception)}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Heure de réception:</span> {dossier.heure_reception}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Pays d'origine:</span> {dossier.pays_origine}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Nombre d'échantillons:</span> {dossier.nombre_echantillons}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Code interne échantillon:</span> {dossier.code_interne_echantillon}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Agent recherché:</span> {dossier.agent_recherche}
                        </div>
                        <div className="flex mt-6">
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline flex items-center"
        onClick={printDossierPDF}
    >
        <FaPrint className="mr-1" />
        PDF
    </button>
    <div className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
        <Link to={`/editDossier/${dossier.id}`}>
            <FaEdit />
        </Link>
    </div>
    <button
        className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
        onClick={deleteDossier}
    >
        <FaTrashAlt className="mr-1" />
        
    </button>
    
</div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Details;
