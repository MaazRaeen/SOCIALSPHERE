package com.example.demo.dto;

public class FollowCountResponse {
    private long followerCount;
    private long followingCount;

    public FollowCountResponse(long followerCount, long followingCount) {
        this.followerCount = followerCount;
        this.followingCount = followingCount;
    }

    public long getFollowerCount() { return followerCount; }
    public long getFollowingCount() { return followingCount; }
}