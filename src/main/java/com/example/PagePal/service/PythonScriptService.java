package com.example.PagePal.service;

import org.apache.commons.io.IOUtils;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PythonScriptService {
    public ResponseEntity<byte[]> executeScript() {
        try {
            // Exécutez le script Python comme avant
            ProcessBuilder processBuilder = new ProcessBuilder("python3", "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/Static.py");
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                // Chemins vers les images générées
                String[] imagePaths = {
                        "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topReviewers.png",
                        "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topCategoriesPerYear.png",
                        "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/publicationEvolution.png",
                        "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/static/topCountries.png"
                };

                // Créer une archive ZIP temporaire
                File tempZip = File.createTempFile("images", ".zip");
                try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(tempZip))) {
                    for (String imagePath : imagePaths) {
                        File imageFile = new File(imagePath);
                        ZipEntry zipEntry = new ZipEntry(imageFile.getName());
                        zipOut.putNextEntry(zipEntry);
                        byte[] bytes = Files.readAllBytes(Paths.get(imagePath));
                        zipOut.write(bytes, 0, bytes.length);
                        zipOut.closeEntry();
                    }
                }

                // Lire et retourner le contenu de l'archive ZIP
                byte[] zipBytes = Files.readAllBytes(Paths.get(tempZip.getAbsolutePath()));
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDisposition(ContentDisposition.attachment().filename("images.zip").build());

                return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
            } else {
                System.out.println("Erreur d'exécution du script Python: " + IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8));
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<byte[]> getStatisticsByUser(Integer userId) {
        try {
            String pythonScriptPath = "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/TopCategoriesPerUser.py";
            String imagesPath = "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/images/dynamic/";

            // Exécutez le script Python
            ProcessBuilder processBuilder = new ProcessBuilder("python3", pythonScriptPath, userId.toString());
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                // Créer un fichier ZIP en mémoire
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(baos);

                // Ajouter chaque image au ZIP
                for (String fileName : new String[]{"topCategories.png", "userRating.png"}) {
                    Path filePath = Paths.get(imagesPath + fileName);
                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zos.putNextEntry(zipEntry);
                    zos.write(Files.readAllBytes(filePath));
                    zos.closeEntry();
                }

                zos.close();

                byte[] zipBytes = baos.toByteArray();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("filename", "statistics.zip");

                return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
            } else {
                String errorMessage = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
                System.out.println("Error executing the python script: " + errorMessage);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String getBookInfos(String bookTitle) {
        try {
            // Chemin vers votre script Python
            String pythonScriptPath = "/Users/ethan.riahi/Documents/Github/PagePal/pagepalPython/Dataviz/BookInfos.py";

            // Construire la commande à exécuter
            ProcessBuilder processBuilder = new ProcessBuilder("python3", pythonScriptPath, bookTitle);

            // Démarrer le processus
            Process process = processBuilder.start();

            // Lire la sortie du script
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            // Attendre que le script soit terminé
            int exitVal = process.waitFor();
            if (exitVal == 0) {
                // Le script s'est exécuté avec succès, retourner la sortie du script
                return output.toString().trim();
            } else {
                // Il y a eu une erreur lors de l'exécution du script
                return "Une erreur est survenue lors de l'exécution du script Python.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Une erreur est survenue lors de l'exécution du script Python.";
        }
    }
}

