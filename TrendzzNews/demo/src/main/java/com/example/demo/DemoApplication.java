package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMalformed()
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry ->{
			if(System.getenv(entry.getKey())==null){
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});
		SpringApplication.run(DemoApplication.class, args);
	}

}
