package com.example.linearregression.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityConfig {

    @Autowired 
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Value("frontend.url")
    private String frontendUrl;

    // we need object of security of filter chain 
    // we also need our HttpSecurity we'll call it http
    // we need to return the http.build note this might throw an exception so we need to throw the Exception at the start of the method 

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        // this is to find out a way to log off 
        // https://www.youtube.com/watch?v=ouE3NuTzf20&t=3604s 

        // basically we want all of our endpoint secured 
        // with .oauth2Login() we are telling spring to use the .oauth2Login method 
        http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf().
        disable()
        .authorizeHttpRequests()
        .anyRequest()
        .authenticated()
        .and()
        .oauth2Login(oath2 -> {
            oath2.successHandler(oAuth2LoginSuccessHandler);
        })
        .logout().logoutUrl("/logout")
        .logoutSuccessUrl("/");
        

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173/"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        
        return urlBasedCorsConfigurationSource;
    }
    
}
