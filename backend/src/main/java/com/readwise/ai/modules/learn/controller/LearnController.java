package com.readwise.ai.modules.learn.controller;

import com.readwise.ai.modules.learn.service.LifeSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/learn")
@RequiredArgsConstructor
public class LearnController {

    private final LifeSkillService lifeSkillService;

    @GetMapping("/skill/{topic}")
    public ResponseEntity<Map<String, Object>> getLifeSkill(@PathVariable String topic) {
        Map<String, Object> response = lifeSkillService.generateLifeSkill(topic);
        return ResponseEntity.ok(response);
    }
}
