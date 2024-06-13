package com.example.linearregression;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

@SpringBootApplication
// note get rid of this once you add all of the mongodb configuration
@EnableAutoConfiguration()
public class LinearRegressionApplication {

	public static void main(String[] args) {
		SpringApplication.run(LinearRegressionApplication.class, args);
	}

}


