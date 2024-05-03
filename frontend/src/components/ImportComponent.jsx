import React, { useRef } from 'react';
import axios from 'axios';

const ImportComponent = () => {
    const fileInputRef = useRef(null);

    const handleImport = async () => {
        const selectedFile = fileInputRef.current.files[0];
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier à importer.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:3001/import-dossiers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            alert('Fichier importé avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'importation du fichier :', error);
            alert('Erreur lors de l\'importation du fichier. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef}
                onChange={handleImport}
            />
        </div>
    );
};

export default ImportComponent;
