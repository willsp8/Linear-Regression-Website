package com.example.linearregression.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="project")
public class ProjectDTO {

    @Id
    private String id;

    private UserDTO user; 

    // p stands for public for some reason public does not work 
    private Boolean P;

    private byte[] file;

    // this is the csv file 
    private List<PhotoDTO> photo;




    
}
