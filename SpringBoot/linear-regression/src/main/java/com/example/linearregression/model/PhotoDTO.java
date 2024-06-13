package com.example.linearregression.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collation = "photos")
public class PhotoDTO {

    @Id
    private String id; 

    private byte[] photo; 

    private String colName;
    
    private String rowName; 
    
}
