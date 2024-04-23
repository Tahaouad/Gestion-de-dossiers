const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const xl = require('excel4node');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
    connection.query('SELECT * FROM Dossiers', function(error, results, fields) {
        if (error) throw error;
        res.json(results);
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
            const doc = new PDFDocument();
            const pdfFilePath = `dossier_${id}.pdf`;

            doc.pipe(res);
            doc.fontSize(12)
                .text(`N° Dossier: ${dossier.numero_dossier}`, 50, 50)
                .text(`Date de réception: ${dossier.date_reception}`, 50, 70)
                .text(`Heure de réception: ${dossier.heure_reception}`, 50, 90)
                .text(`Cadre d'analyse: ${dossier.cadre_analyse}`, 50, 110)
                .text(`Service demandeur / Client: ${dossier.service_demandeur}`, 50, 130)
                .text(`Pays d'origine: ${dossier.pays_origine}`, 50, 150)
                .text(`Nombre d'échantillons: ${dossier.nombre_echantillons}`, 50, 170)
                .text(`Code interne échantillon: ${dossier.code_interne_echantillon}`, 50, 190)
                .text(`Agent recherché: ${dossier.agent_recherche}`, 50, 210)
                .text(`Culture: ${dossier.culture}`, 50, 230)
                .text(`Nature d'échantillon: ${dossier.nature_echantillon}`, 50, 250)
                .text(`N° de lot: ${dossier.numero_lot}`, 50, 270)
                .text(`Analyse demandée: ${dossier.analyse_demandee}`, 50, 290)
                .text(`Référence méthode: ${dossier.reference_methode}`, 50, 310)
                .text(`Début analyse: ${dossier.debut_analyse}`, 50, 330)
                .text(`Fin analyse: ${dossier.fin_analyse}`, 50, 350)
                .text(`Etape de l'analyse: ${dossier.etape_analyse}`, 50, 370)
                .text(`Résultat d'analyse: ${dossier.resultat_analyse}`, 50, 390)
                .text(`Date envoi résultat: ${dossier.date_envoi_resultat}`, 50, 410)
                .text(`Statut du dossier: ${dossier.statut_dossier}`, 50, 430)
                .text(`Commentaire: ${dossier.commentaire}`, 50, 450);

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

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
