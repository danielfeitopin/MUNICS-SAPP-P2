package com.tasks.config;

import java.util.TreeMap;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Controller
public class WebMvcConfig implements WebMvcConfigurer {
    
    @GetMapping(value = { "/dashboard/**"})
    public ModelAndView home() throws Exception {
        TreeMap<String, Object> model = new TreeMap<>();
        return new ModelAndView("home", model);
    }
    
}
