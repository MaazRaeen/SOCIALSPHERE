package com.example.demo.repository;

import com.example.demo.entity.EchoRoom;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EchoRoomRepository extends JpaRepository<EchoRoom, Long> {
    List<EchoRoom> findByParticipantsContaining(User user);
}