package com.tasks.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
        
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);

        return daoAuthenticationProvider;

    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {

        AuthenticationManagerBuilder authenticationManagerBuilder =
            http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder.authenticationProvider(authenticationProvider());

        return authenticationManagerBuilder.build();

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable())
            .sessionManagement((sessionManagement) -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(new JwtAuthorizationFilter(tokenProvider, authenticationManager(http)), UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests((authorize) -> authorize
                .requestMatchers(HttpMethod.GET,  "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET,  "/swagger-ui/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/v3/api-docs/**").permitAll()
                /* Views */
                .requestMatchers(HttpMethod.GET,  "/dashboard").permitAll()
                .requestMatchers(HttpMethod.GET,  "/dashboard/").permitAll()
                /* Static Files */
                .requestMatchers(HttpMethod.GET,  "/css/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/react-libs/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/javascript-libs/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/webjars/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/application/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/application/common/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/application/backend/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/application/frontend/**").permitAll()
                /* REST API without roles */
                .requestMatchers(HttpMethod.GET,  "/api/projects").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/projects/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/projects/*/tasks").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/tasks").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/tasks/*").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/comments/*").permitAll()
                .requestMatchers(HttpMethod.POST,  "/api/login").permitAll()
                /* REST API for projects */
                .requestMatchers(HttpMethod.POST,  "/api/projects").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/projects/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,  "/api/projects/*").hasRole("ADMIN")
                /* REST API for tasks */
                .requestMatchers(HttpMethod.POST,  "/api/tasks").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/tasks/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,  "/api/tasks/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,  "/api/tasks/*/changeState").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,  "/api/tasks/*/changeResolution").hasRole("USER")
                .requestMatchers(HttpMethod.POST,  "/api/tasks/*/changeProgress").hasRole("USER")
                .requestMatchers(HttpMethod.POST,  "/api/comments").hasAnyRole("USER", "ADMIN")
                /* REST API for users */
                .requestMatchers(HttpMethod.GET,  "/api/users").hasRole("ADMIN")
                /* Deny by default */
                .anyRequest().denyAll());

        return http.build();

    }

}
