package com.example.demo.controller;

import com.example.demo.dto.FollowCountResponse;
import com.example.demo.dto.UserResponse;
import com.example.demo.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{targetUsername}/{username}")
    public ResponseEntity<String> toggleFollow(@PathVariable String targetUsername, @PathVariable String username) {
        return ResponseEntity.ok(followService.toggleFollow(username, targetUsername));
    }

    @GetMapping("/{targetUsername}/status/{username}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable String targetUsername, @PathVariable String username) {
        return ResponseEntity.ok(followService.isFollowing(username, targetUsername));
    }

    @GetMapping("/{username}/counts")
    public ResponseEntity<FollowCountResponse> getCounts(@PathVariable String username) {
        return ResponseEntity.ok(followService.getCounts(username));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable String username) {
        return ResponseEntity.ok(followService.getFollowers(username));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable String username) {
        return ResponseEntity.ok(followService.getFollowing(username));
    }
}