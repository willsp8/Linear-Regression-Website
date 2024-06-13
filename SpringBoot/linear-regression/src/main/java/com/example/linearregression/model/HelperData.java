package com.example.linearregression.model;

import java.net.http.HttpResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelperData {

    private byte[] pic;
    private String data;
}
