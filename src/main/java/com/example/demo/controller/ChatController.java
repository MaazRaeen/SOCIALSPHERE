package com.example.demo.controller;

import com.example.demo.dto.MessageRequest;
import com.example.demo.entity.Message;
import com.example.demo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(MessageRequest request) {
        Message saved = messageService.saveMessage(request.getRoomId(), request.getSender(), request.getContent());
        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId(), saved);
    }
}