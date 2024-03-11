package com.example.PagePal.service;

import org.apache.commons.io.IOUtils;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
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

    }

