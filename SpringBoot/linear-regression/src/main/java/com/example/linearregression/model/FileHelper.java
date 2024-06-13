package com.example.linearregression.model;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileHelper {

    private String id; 
    private MultipartFile csvFile;
    private List<MultipartFile> photo;
    
}
