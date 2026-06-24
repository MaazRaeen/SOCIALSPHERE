package com.example.demo.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String type;
    private String actorUsername;
    private String actorProfilePictureUrl;
    private Long postId;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(Long id, String type, String actorUsername, String actorProfilePictureUrl,
                                 Long postId, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.actorUsername = actorUsername;
        this.actorProfilePictureUrl = actorProfilePictureUrl;
        this.postId = postId;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getType() { return type; }
    public String getActorUsername() { return actorUsername; }
    public String getActorProfilePictureUrl() { return actorProfilePictureUrl; }
    public Long getPostId() { return postId; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}