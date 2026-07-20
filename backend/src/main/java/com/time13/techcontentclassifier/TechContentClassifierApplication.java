package com.time13.techcontentclassifier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

//@SpringBootApplication
//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
public class TechContentClassifierApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechContentClassifierApplication.class, args);
	}

}
