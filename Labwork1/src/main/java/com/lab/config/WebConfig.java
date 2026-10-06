package com.lab.config;

import tools.jackson.databind.json.JsonMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan("com.lab")
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public JsonMapper jsonMapper() {
        return JsonMapper.builder().build();
    }
}