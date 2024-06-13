package com.example.linearregression.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.ProjectDTO;
import com.example.linearregression.model.UserDTO;
import java.util.List;


public interface ProjectsRepository extends MongoRepository<ProjectDTO, String> {
    Optional<ProjectDTO> findByUser(UserDTO user);

    
} 
