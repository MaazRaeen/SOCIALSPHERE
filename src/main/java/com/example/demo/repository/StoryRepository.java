package com.example.demo.repository;

import com.example.demo.entity.Story;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByExpiresAtAfterOrderByCreatedAtAsc(LocalDateTime now);
    List<Story> findByAuthorAndExpiresAtAfterOrderByCreatedAtAsc(User author, LocalDateTime now);
    void deleteByExpiresAtBefore(LocalDateTime now);
}