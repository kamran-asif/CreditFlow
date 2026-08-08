package com.creditflow.controller;

import com.creditflow.service.LoadSimulatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulator")
@CrossOrigin(origins = "*")
public class SimulatorController {

    private final LoadSimulatorService loadSimulatorService;

    public SimulatorController(LoadSimulatorService loadSimulatorService) {
        this.loadSimulatorService = loadSimulatorService;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startSimulation(@RequestParam(defaultValue = "10000") int count) {
        loadSimulatorService.runSimulation(count);
        return ResponseEntity.ok(Map.of("message", "Simulation triggered for " + count + " events in background"));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSimulationStatus() {
        return ResponseEntity.ok(loadSimulatorService.getSimulationStatus());
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stopSimulation() {
        loadSimulatorService.stopSimulation();
        return ResponseEntity.ok(Map.of("message", "Simulation stop requested"));
    }
}
