package com.example.linearregression.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.UserDTO;
import java.util.Optional;


public interface UserRepository extends MongoRepository<UserDTO, String>  {
    Optional<UserDTO> findByEmail(String email);
}
