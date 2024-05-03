import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPrint, FaFileExcel } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const fetchDossiers = (currentPage, perPage, setDossiers, setTotalCount) => {
    const offset = currentPage * perPage;
    axios.get(`http://localhost:3001/dossiers?offset=${offset}&limit=${perPage}`)
        .then(response => {
            setDossiers(response.data.dossiers);
            setTotalCount(response.data.totalCount);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des dossiers:', error);
        });
};

const DossierList = () => {
    const [dossiers, setDossiers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(9);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    
    const nav = useNavigate();

    useEffect(() => {
        fetchDossiers(currentPage, perPage, setDossiers, setTotalCount);
    }, [currentPage, perPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
    };

    const deleteDossier = (id) => {
        axios.delete(`http://localhost:3001/dossier/${id}`)
            .then(response => {
                console.log(response.data.message);
                fetchDossiers(currentPage, perPage, setDossiers, setTotalCount);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du dossier:', error);
            });
    };

    const printDossierPDF = (id) => {
        window.open(`http://localhost:3001/dossier/${id}/pdf`, '_blank');
    };

    const exportToExcel = (id) => {
        window.open(`http://localhost:3001/dossier/${id}/excel`, '_blank');
    };

    const exportDossiersToExcel = () => {
        axios.get('http://localhost:3001/dossiers_ex/excel', { responseType: 'blob' })
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

    const redirectToDetails = (id) => {
        nav(`/details/${id}`);
    };

    // Filter dossiers based on search query
    const filteredDossiers = dossiers.filter(dossier =>
        dossier.numero_dossier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold p-5">Liste des dossiers</h1>
            <input
                type="text"
                placeholder="Rechercher par numéro de dossier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 px-4 py-2 mb-4"
            />
            <button
                onClick={exportDossiersToExcel}
                className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
                <FaFileExcel className="mr-2" />
                Exporter dossiers
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
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
                        {filteredDossiers.map(dossier => (
                            <tr key={dossier.id} className="hover:bg-gray-100">
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.numero_dossier}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{formatDate(dossier.date_reception)}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.heure_reception}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.cadre_analyse}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.service_demandeur}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.pays_origine}</td>
                                <td onClick={() => redirectToDetails(dossier.id)} className="border border-gray-300 px-4 py-2 cursor-pointer">{dossier.nombre_echantillons}</td>
                                <td className="border border-gray-300 px-4 py-2 flex">
                                    <Link to={`/editDossier/${dossier.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </Link>
                                    <FaTrashAlt className="text-red-500 cursor-pointer hover:text-red-700 mr-2" onClick={() => deleteDossier(dossier.id)} />
                                    <FaPrint className="text-green-500 cursor-pointer hover:text-green-700 mr-2" onClick={() => printDossierPDF(dossier.id)} />
                                    <FaFileExcel className="text-indigo-500 cursor-pointer hover:text-indigo-700" onClick={() => exportToExcel(dossier.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <ReactPaginate
                    previousLabel={'Précédent'}
                    nextLabel={'Suivant'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(totalCount / perPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination flex justify-center mt-8'}
                    pageClassName={'inline-block mx-2 rounded-full px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}
                    activeClassName={'bg-blue-500 text-white'}
                    previousClassName={'inline-block mx-2 rounded-full px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}
                    nextClassName={'inline-block mx-2 rounded-full px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}
                    breakClassName={'inline-block mx-2 px-3 py-2 text-gray-700'}
                    disabledClassName={'inline-block mx-2 px-3 py-2 text-gray-400 cursor-not-allowed'}
                />
            </div>
        </div>
    );
}

export default DossierList;
