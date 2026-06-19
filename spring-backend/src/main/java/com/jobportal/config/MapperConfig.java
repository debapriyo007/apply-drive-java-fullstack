package com.jobportal.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Configure standard mapping preferences here if needed.
        // By default, ModelMapper handles matching properties well.
        return modelMapper;
    }
}
