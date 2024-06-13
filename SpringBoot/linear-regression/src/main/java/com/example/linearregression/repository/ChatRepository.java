package com.example.linearregression.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.Chat;

import java.util.List;


public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByRoom(String room);
    
    
} 
