package com.example.demo.service;

import com.example.demo.dto.FollowCountResponse;
import com.example.demo.dto.UserResponse;
import com.example.demo.entity.Follow;
import com.example.demo.entity.User;
import com.example.demo.repository.FollowRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public String toggleFollow(String followerUsername, String targetUsername) {
        if (followerUsername.equals(targetUsername)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return followRepository.findByFollowerAndFollowing(follower, target)
                .map(existing -> {
                    followRepository.delete(existing);
                    return "unfollowed";
                })
                .orElseGet(() -> {
                    Follow follow = new Follow();
                    follow.setFollower(follower);
                    follow.setFollowing(target);
                    followRepository.save(follow);
                    notificationService.createNotification(target, follower, "FOLLOW", null);
                    return "followed";
                });
    }

    public boolean isFollowing(String followerUsername, String targetUsername) {
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return followRepository.existsByFollowerAndFollowing(follower, target);
    }

    public FollowCountResponse getCounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new FollowCountResponse(
                followRepository.countByFollowing(user),
                followRepository.countByFollower(user)
        );
    }

    public List<UserResponse> getFollowers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return followRepository.findByFollowing(user)
                .stream().map(f -> toResponse(f.getFollower())).collect(Collectors.toList());
    }

    public List<UserResponse> getFollowing(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return followRepository.findByFollower(user)
                .stream().map(f -> toResponse(f.getFollowing())).collect(Collectors.toList());
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(),
                user.getBio(), user.getProfilePictureUrl(), user.getCreatedAt()
        );
    }
}