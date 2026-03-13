package com.indiroad.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DatabaseUrlConverter implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment env = applicationContext.getEnvironment();

        String dbUrl = env.getProperty("SPRING_DATASOURCE_URL");
        if (dbUrl == null) {
            dbUrl = env.getProperty("DATABASE_URL");
        }

        if (dbUrl != null && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
            // postgresql://user:password@host:port/dbname → jdbc:postgresql://host:port/dbname
            String jdbcUrl = dbUrl.replaceFirst("^postgres(ql)?://([^:]+):([^@]+)@(.+)$", "jdbc:postgresql://$4");

            String userInfo = dbUrl.replaceFirst("^postgres(ql)?://([^:]+):([^@]+)@.+$", "$2");
            String password = dbUrl.replaceFirst("^postgres(ql)?://([^:]+):([^@]+)@.+$", "$3");

            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", jdbcUrl);
            props.put("spring.datasource.username", userInfo);
            props.put("spring.datasource.password", password);

            env.getPropertySources().addFirst(new MapPropertySource("railwayDbOverride", props));
        }
    }
}
