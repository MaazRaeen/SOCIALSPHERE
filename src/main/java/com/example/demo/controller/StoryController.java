package com.example.demo.controller;

import com.example.demo.entity.Story;
import com.example.demo.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @PostMapping("/{username}")
    public ResponseEntity<Story> createStory(@PathVariable String username, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(storyService.createStory(username, body.get("imageUrl")));
    }

    @GetMapping
    public ResponseEntity<List<Story>> getActiveStories() {
        return ResponseEntity.ok(storyService.getActiveStories());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Story>> getStoriesByUser(@PathVariable String username) {
        return ResponseEntity.ok(storyService.getActiveStoriesForUser(username));
    }

    @DeleteMapping("/{id}/{username}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id, @PathVariable String username) {
        storyService.deleteStory(id, username);
        return ResponseEntity.noContent().build();
    }
}