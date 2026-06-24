package com.example.demo.controller;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{username}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@PathVariable String username) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(username));
    }

    @GetMapping("/{username}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String username) {
        return ResponseEntity.ok(notificationService.getUnreadCount(username));
    }

    @PutMapping("/{username}/read-all")
    public ResponseEntity<Void> markAllRead(@PathVariable String username) {
        notificationService.markAllAsRead(username);
        return ResponseEntity.noContent().build();
    }
}