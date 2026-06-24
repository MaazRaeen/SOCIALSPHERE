package com.example.demo.controller;

import com.example.demo.dto.PostRequest;
import com.example.demo.entity.Post;
import com.example.demo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/{username}")
    public ResponseEntity<Post> createPost(@PathVariable String username, @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.createPost(username, request));
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}/{username}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @PathVariable String username, @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, username, request.getContent(), request.getImageUrl()));
    }

    @DeleteMapping("/{id}/{username}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @PathVariable String username) {
        postService.deletePost(id, username);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/user/{username}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String username) {
        return ResponseEntity.ok(postService.getPostsByUsername(username));
    }
}