import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPrint, FaFileExcel } from 'react-icons/fa';

function DossierList() {
    const [dossiers, setDossiers] = useState([]);

    useEffect(() => {
        fetchDossiers();
    }, []);

    const fetchDossiers = () => {
        axios.get('http://localhost:3001/dossiers')
            .then(response => {
                setDossiers(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des dossiers:', error);
            });
    };

    const deleteDossier = (id) => {
        axios.delete(`http://localhost:3001/dossier/${id}`)
            .then(response => {
                console.log(response.data.message);
                fetchDossiers();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du dossier:', error);
            });
    };
    const editDossier = (id) => {
        //
    }
    // export method 
    const printDossierPDF = (id) => {
        window.open(`http://localhost:3001/dossier/${id}/pdf`, '_blank');
    };
    const exportToExcel = (id) => {
        window.open(`http://localhost:3001/dossier/${id}/excel`, '_blank');
    };
    const exportDossiersToExcel = () => {
        axios.get('http://localhost:3001/dossiers/excel', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'dossiers.xlsx');
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Erreur lors de l\'exportation des dossiers vers Excel:', error);
            });
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold p-5 mx-auto">Liste des dossiers</h1>
            <button
                onClick={exportDossiersToExcel}
                className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
                <FaFileExcel className="mr-2" />
                Exporter dossiers
            </button>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">N° Dossier</th>
                        <th className="border border-gray-300 px-4 py-2">Date de réception</th>
                        <th className="border border-gray-300 px-4 py-2">Heure de réception</th>
                        <th className="border border-gray-300 px-4 py-2">Cadre d'analyse</th>
                        <th className="border border-gray-300 px-4 py-2">Service demandeur / Client</th>
                        <th className="border border-gray-300 px-4 py-2">Pays d'origine</th>
                        <th className="border border-gray-300 px-4 py-2">Nombre d'échantillons</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dossiers.map(dossier => (
                        <tr key={dossier.id}>
                            <td className="border border-gray-300 px-4 py-2">{dossier.numero_dossier}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.date_reception}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.heure_reception}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.cadre_analyse}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.service_demandeur}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.pays_origine}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.nombre_echantillons}</td>
                            <td className=" border-gray-300 px-5 py-3 flex">
                                <div className="mr-2">
                                    <FaEdit className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => editDossier(dossier.id)} />
                                </div>
                                <div className="mr-2">
                                    <FaTrashAlt className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => deleteDossier(dossier.id)} />
                                </div>
                                <div>
                                    <FaPrint className="text-green-500 cursor-pointer hover:text-green-700" onClick={() => printDossierPDF(dossier.id)} />
                                </div>
                                <div>
                                    <FaFileExcel onClick={() => exportToExcel(dossier.id)} className="text-indigo-500 cursor-pointer hover:text-indigo-700" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DossierList;
