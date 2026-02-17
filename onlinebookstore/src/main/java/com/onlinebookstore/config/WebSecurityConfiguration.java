package com.onlinebookstore.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.onlinebookstore.enums.UserRole;
import com.onlinebookstore.filters.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {
	@Autowired
	private JwtRequestFilter authFilter;

	@Value("${cors.allowed-origins:http://localhost:3000}")
	private String allowedOrigins;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

		return http.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/authenticate", "/sign-up").permitAll()
                        .requestMatchers("/api/payment/config").permitAll()
                        .requestMatchers("/api/admin/**").hasRole(UserRole.ADMIN.name())
                        .requestMatchers("/api/customer/**").hasRole(UserRole.USER.name())
                        .requestMatchers("/api/payment/**").hasRole(UserRole.USER.name())
                        .anyRequest().authenticated())
                .sessionManagement(management -> management
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();

	    // Parse allowed origins from environment variable (comma-separated)
	    List<String> origins = Arrays.asList(allowedOrigins.split(","));
	    configuration.setAllowedOrigins(origins);

	    // Specify allowed methods explicitly
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

	    // Be more specific with allowed headers instead of wildcard
	    configuration.setAllowedHeaders(List.of(
	        "Authorization",
	        "Content-Type",
	        "Accept",
	        "X-Requested-With"
	    ));

	    // Allow credentials (needed for cookies/auth headers)
	    configuration.setAllowCredentials(true);

	    // Set max age for preflight requests (1 hour)
	    configuration.setMaxAge(3600L);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}

	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
		return config.getAuthenticationManager();
	}

}
