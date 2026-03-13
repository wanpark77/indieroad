package com.indiroad;

import com.indiroad.config.DatabaseUrlConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IndiroadApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(IndiroadApplication.class);
        app.addInitializers(new DatabaseUrlConverter());
        app.run(args);
    }
}
