package com.example.demo.service;

import com.example.demo.entity.EchoRoom;
import com.example.demo.entity.User;
import com.example.demo.repository.EchoRoomRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EchoRoomService {

    @Autowired
    private EchoRoomRepository echoRoomRepository;

    @Autowired
    private UserRepository userRepository;

    public EchoRoom createRoom(String creatorUsername, String name, String description) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EchoRoom room = new EchoRoom();
        room.setName(name);
        room.setDescription(description);
        room.setCreator(creator);
        room.getParticipants().add(creator);

        return echoRoomRepository.save(room);
    }

    public EchoRoom joinRoom(Long roomId, String username) {
        EchoRoom room = echoRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        room.getParticipants().add(user);
        return echoRoomRepository.save(room);
    }

    public List<EchoRoom> getRoomsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return echoRoomRepository.findByParticipantsContaining(user);
    }

    public List<EchoRoom> getAllRooms() {
        return echoRoomRepository.findAll();
    }
}