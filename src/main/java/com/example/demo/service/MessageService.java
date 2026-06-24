package com.example.demo.service;

import com.example.demo.entity.EchoRoom;
import java.util.List;
import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.repository.EchoRoomRepository;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private EchoRoomRepository echoRoomRepository;

    @Autowired
    private UserRepository userRepository;
    public List<Message> getMessagesForRoom(Long roomId) {
        EchoRoom room = echoRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        return messageRepository.findByEchoRoomOrderBySentAtAsc(room);
    }

    public Message saveMessage(Long roomId, String senderUsername, String content) {
        EchoRoom room = echoRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Message message = new Message();
        message.setContent(content);
        message.setEchoRoom(room);
        message.setSender(sender);

        return messageRepository.save(message);
    }
    
}