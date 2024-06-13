package com.example.linearregression.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.MessagesDTO;


public interface MessageRepository extends MongoRepository<MessagesDTO, String>{

    List<MessagesDTO> findByReceiverName(String receiverName);
    List<MessagesDTO> findByChatRoomId(String chatRoomId);
    
} 
