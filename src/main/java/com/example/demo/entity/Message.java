package com.example.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "echo_room_id", nullable = false)
    private EchoRoom echoRoom;

    @CreationTimestamp
    private LocalDateTime sentAt;

    public Message() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public EchoRoom getEchoRoom() { return echoRoom; }
    public void setEchoRoom(EchoRoom echoRoom) { this.echoRoom = echoRoom; }
    public LocalDateTime getSentAt() { return sentAt; }
}