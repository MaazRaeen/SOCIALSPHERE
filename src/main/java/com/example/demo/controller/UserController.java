package com.example.demo.controller;

import com.example.demo.dto.UpdateProfileRequest;
import java.util.List;
import com.example.demo.dto.UserResponse;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.getByUsername(username));
    }
    @PutMapping("/{username}")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable String username, @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(username, request.getBio(), request.getProfilePictureUrl()));
    }
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
}