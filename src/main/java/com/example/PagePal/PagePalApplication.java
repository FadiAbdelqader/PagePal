package com.example.PagePal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class PagePalApplication {

	public static void main(String[] args) {
		SpringApplication.run(PagePalApplication.class, args);
	}

}
