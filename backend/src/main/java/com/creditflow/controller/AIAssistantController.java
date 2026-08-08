package com.creditflow.controller;

import com.creditflow.service.RAGAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIAssistantController {

    private final RAGAssistantService ragAssistantService;

    public AIAssistantController(RAGAssistantService ragAssistantService) {
        this.ragAssistantService = ragAssistantService;
    }

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> queryAssistant(@RequestBody AiQueryRequest request) {
        if (request.getQuery() == null || request.getQuery().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query parameter cannot be empty"));
        }
        return ResponseEntity.ok(ragAssistantService.queryAiAssistant(request.getQuery()));
    }

    public static class AiQueryRequest {
        private String query;

        public AiQueryRequest() {}

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }
}
