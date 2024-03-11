package com.example.PagePal.controller;

import com.example.PagePal.service.PythonScriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PythonScriptController {

    @Autowired
    private PythonScriptService pythonScriptService;

    @GetMapping("/executescript")
    public ResponseEntity<byte[]> executeScript() {
        return pythonScriptService.executeScript();
    }
}