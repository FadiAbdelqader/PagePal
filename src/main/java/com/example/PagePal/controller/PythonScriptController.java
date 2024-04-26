package com.example.PagePal.controller;

import com.example.PagePal.service.PythonScriptService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Controller
public class PythonScriptController {

    @Autowired
    private PythonScriptService pythonScriptService;

    @GetMapping("/executescript")
    public ResponseEntity<byte[]> executeScript() {
        return pythonScriptService.executeScript();
    }

    @GetMapping("/getstatisticsbyuser")
    public ResponseEntity<byte[]> getStatisticsByUser(@RequestParam Integer userId) {
        return pythonScriptService.getStatisticsByUser(userId);
    }

    @GetMapping("/getBookInfos/{bookTitle}")
    public ResponseEntity<String> getBookInfos(@PathVariable String bookTitle) {
        return ResponseEntity.ok(pythonScriptService.getBookInfos(bookTitle));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<String> getBookRecommendations(@RequestParam String bookTitle) {
        return ResponseEntity.ok(pythonScriptService.getRecommendation(bookTitle));
    }

}