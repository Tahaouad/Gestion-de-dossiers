const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const xl = require('excel4node');
const app = express();
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');
const moment = require('moment'); 





// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Dossier où les fichiers seront stockés temporairement
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Utilisation du nom d'origine du fichier
    }
});
const upload = multer({ storage: storage });
app.use(upload.single('file')); // 'file' est le nom du champ dans le formulaire HTML dans votre composant React

// Configuration de la base de données MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_dossiers'
});

// Connexion à la base de données MySQL
connection.connect(function(err) {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL!');
});

// Définition des routes

// Créer un dossier
app.post('/dossier', function(req, res) {
    const dossier = req.body;
    connection.query('INSERT INTO Dossiers SET ?', dossier, function(error, results, fields) {
        if (error) throw error;
        res.json({ message: 'Dossier créé avec succès!', id: results.insertId });
    });
});

// Lire tous les dossiers
app.get('/dossiers', function(req, res) {
    const { offset = 0, limit = 5 } = req.query;
    const query = `SELECT * FROM Dossiers LIMIT ${limit} OFFSET ${offset}`;
    connection.query(query, function(error, results, fields) {
        if (error) {
            console.error('Erreur lors de la récupération des dossiers:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des dossiers' });
            return;
        }
        connection.query('SELECT COUNT(*) AS totalCount FROM Dossiers', function(error, countResult, fields) {
            if (error) {
                console.error('Erreur lors de la récupération du nombre total de dossiers:', error);
                res.status(500).json({ error: 'Erreur lors de la récupération du nombre total de dossiers' });
                return;
            }
            const totalCount = countResult[0].totalCount;
            res.json({ dossiers: results, totalCount });
        });
    });
});


// Lire  un dossier

app.get('/dossiers/:id', function(req, res) {
    const id = req.params.id;
    connection.query('SELECT * FROM Dossiers WHERE id = ?', id, function(error, results, fields) {
        if (error) {
            console.error('Erreur lors de la récupération du dossier:', error);
            return res.status(500).json({ message: 'Erreur lors de la récupération du dossier' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Dossier non trouvé' });
        }

        res.json(results[0]);
    });
});

// Lire un dossier par son ID
app.get('/dossier/:id', function(req, res) {
    const id = req.params.id;
    connection.query('SELECT * FROM Dossiers WHERE id = ?', id, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Dossier non trouvé' });
        }
    });
});

// Mettre à jour un dossier
app.put('/dossier/:id', function(req, res) {
    const id = req.params.id;
    const dossier = req.body;
    connection.query('UPDATE Dossiers SET ? WHERE id = ?', [dossier, id], function(error, results, fields) {
        if (error) throw error;
        res.json({ message: 'Dossier mis à jour avec succès!' });
    });
});

// Supprimer un dossier
app.delete('/dossier/:id', function(req, res) {
    const id = req.params.id;
    connection.query('DELETE FROM Dossiers WHERE id = ?', id, function(error, results, fields) {
        if (error) throw error;
        res.json({ message: 'Dossier supprimé avec succès!' });
    });
});

// Imprimer un dossier en PDF
 

app.get('/dossier/:id/pdf', function(req, res) {
    const id = req.params.id;
    connection.query('SELECT * FROM Dossiers WHERE id = ?', id, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            const dossier = results[0];
            const doc = new PDFDocument({ margin: 50 });

            doc.pipe(res);

            doc
                .fontSize(20)
                .text('Détails du dossier', { align: 'center' })
                .moveDown(); 

            Object.entries(dossier).forEach(([key, value], index) => {
                if (value !== null && value !== '') {
                    let formattedValue = value;
                    // Si la clé représente une date, nous la formaterons
                    if (key.toLowerCase().includes('date')) {
                        formattedValue = moment(value).format('ddd MMM DD YYYY');
                    }
                    doc
                        .fontSize(12)
                        .text(`${key.replace(/_/g, ' ')}:`, { continued: true, width: 200 }) 
                        .text(`${formattedValue}`, { width: 300 }) 
                        .moveDown(); 
                }
            });

            doc.end();
        } else {
            res.status(404).json({ message: 'Dossier non trouvé' });
        }
    });
});

app.get('/dossier/:id/excel', function(req, res) {
    const id = req.params.id;
    connection.query('SELECT * FROM Dossiers WHERE id = ?', id, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            const dossier = results[0];
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Dossier');

            // Titres
            const titles = [
                'N° Dossier',
                'Date de réception',
                'Heure de réception',
                'Cadre d\'analyse',
                'Service demandeur / Client',
                'Pays d\'origine',
                'Nombre d\'échantillons',
                'Code interne échantillon',
                'Agent recherché',
                'Culture',
                'Nature d\'échantillon',
                'N° de lot',
                'Analyse demandée',
                'Référence méthode',
                'Début analyse',
                'Fin analyse',
                'Etape de l\'analyse',
                'Résultat d\'analyse',
                'Date envoi résultat',
                'Statut du dossier',
                'Commentaire'
            ];

            // Ajout des titres à la première ligne
            titles.forEach((title, index) => {
                ws.cell(1, index + 1).string(title);
            });

            // Données
            const data = [
                dossier.numero_dossier,
                dossier.date_reception,
                dossier.heure_reception,
                dossier.cadre_analyse,
                dossier.service_demandeur,
                dossier.pays_origine,
                dossier.nombre_echantillons,
                dossier.code_interne_echantillon,
                dossier.agent_recherche,
                dossier.culture,
                dossier.nature_echantillon,
                dossier.numero_lot,
                dossier.analyse_demandee,
                dossier.reference_methode,
                dossier.debut_analyse,
                dossier.fin_analyse,
                dossier.etape_analyse,
                dossier.resultat_analyse,
                dossier.date_envoi_resultat,
                dossier.statut_dossier,
                dossier.commentaire
            ];

            // Ajout des données à partir de la deuxième ligne
            data.forEach((value, index) => {
                ws.cell(2, index + 1).string(value.toString());
            });

            wb.write(`dossier_${id}.xlsx`, res);
        } else {
            res.status(404).json({ message: 'Dossier non trouvé' });
        }
    });
});
app.get('/dossiers_ex/excel', function(req, res) {
    connection.query('SELECT * FROM Dossiers', function(error, results, fields) {
        if (error) {
            console.error('Erreur lors de la récupération des dossiers:', error);
            return res.status(500).json({ message: 'Erreur lors de la récupération des dossiers' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun dossier trouvé' });
        }

        const xl = require('excel4node'); 
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Dossiers');

        const titles = Object.keys(results[0]);
        titles.forEach((title, index) => {
            ws.cell(1, index + 1).string(title);
        });

        results.forEach((dossier, rowIndex) => {
            Object.values(dossier).forEach((value, colIndex) => {
                if (value !== null) {
                    ws.cell(rowIndex + 2, colIndex + 1).string(value.toString());
                } else {
                    ws.cell(rowIndex + 2, colIndex + 1).string('');
                }
            });
        });

        const fileName = 'dossiers.xlsx';
        wb.write(fileName, res);
    });
});

app.post('/import-dossiers', function(req, res) {
    const selectedFile = req.file; // Utilisez req.file pour accéder au fichier téléchargé
    if (!selectedFile) {
        return res.status(400).json({ message: 'Aucun fichier sélectionné.' });
    }

    try {
        const workbook = xlsx.readFile(selectedFile.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Utiliser header: 1 pour sauter la première ligne (en-tête)
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(data);
        
        const sql = 'INSERT INTO Dossiers (numero_dossier, date_reception, heure_reception, cadre_analyse, service_demandeur, pays_origine, nombre_echantillons, code_interne_echantillon, agent_recherche, culture, nature_echantillon, numero_lot, analyse_demandee, reference_methode, debut_analyse, fin_analyse, etape_analyse, resultat_analyse, date_envoi_resultat, statut_dossier, commentaire) VALUES ?';

        connection.query(sql, [data.slice(1).map(Object.values)], function(error, results, fields) {
            if (error) {
                console.error('Erreur lors de l\'importation des dossiers depuis le fichier Excel :', error);
                res.status(500).json({ message: 'Erreur lors de l\'importation des dossiers depuis le fichier Excel' });
                return;
            }
            console.log('Dossiers importés avec succès depuis le fichier Excel');
            res.json({ message: 'Dossiers importés avec succès depuis le fichier Excel' });
        });
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier Excel :', error);
        res.status(500).json({ message: 'Erreur lors de la lecture du fichier Excel' });
    }
});





// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
