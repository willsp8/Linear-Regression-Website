package com.example.linearregression.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linearregression.model.FilesDTO;


public interface FilesRepository extends MongoRepository<FilesDTO, String>{

    
}
