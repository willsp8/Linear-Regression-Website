package com.example.linearregression.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.FileNamesDTO;



public interface FileNamesRepository extends MongoRepository<FileNamesDTO, String> {
    List<FileNamesDTO> findByUserId(String userId);
}
