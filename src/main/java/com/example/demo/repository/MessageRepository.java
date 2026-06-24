package com.example.demo.repository;

import com.example.demo.entity.Message;
import com.example.demo.entity.EchoRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByEchoRoomOrderBySentAtAsc(EchoRoom echoRoom);
}