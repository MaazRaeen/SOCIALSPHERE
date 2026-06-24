package com.example.demo.controller;

import com.example.demo.dto.CreateRoomRequest;
import com.example.demo.entity.Message;
import com.example.demo.service.MessageService;
import com.example.demo.entity.EchoRoom;
import com.example.demo.service.EchoRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class EchoRoomController {

    @Autowired
    private EchoRoomService echoRoomService;
    

    @PostMapping("/{username}")
    public ResponseEntity<EchoRoom> createRoom(@PathVariable String username, @RequestBody CreateRoomRequest request) {
        EchoRoom room = echoRoomService.createRoom(username, request.getName(), request.getDescription());
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{roomId}/join/{username}")
    public ResponseEntity<EchoRoom> joinRoom(@PathVariable Long roomId, @PathVariable String username) {
        EchoRoom room = echoRoomService.joinRoom(roomId, username);
        return ResponseEntity.ok(room);
    }

    @GetMapping
    public ResponseEntity<List<EchoRoom>> getAllRooms() {
        return ResponseEntity.ok(echoRoomService.getAllRooms());
    }
    @Autowired
    private MessageService messageService;

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getRoomMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(messageService.getMessagesForRoom(roomId));
    }
}