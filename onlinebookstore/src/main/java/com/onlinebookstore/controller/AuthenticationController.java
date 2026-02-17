package com.onlinebookstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.onlinebookstore.dto.AuthenticationRequest;
import com.onlinebookstore.dto.AuthenticationResponse;
import com.onlinebookstore.entity.User;
import com.onlinebookstore.repository.UserRepository;
import com.onlinebookstore.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@Validated
public class AuthenticationController {

		@Autowired
		private AuthenticationManager authenticationManager;
		@Autowired
		private UserDetailsService userDetailsService;
		@Autowired
		private UserRepository userRepository;
		@Autowired
		private JwtUtil jwtUtil;
		
		
		@PostMapping("/authenticate")
		public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequest authRequest) {
		    try {
		        // Authenticate the user
		        authenticationManager.authenticate(
		            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
		        );

		        // Load user details
		        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
		        User user = userRepository.findFirstByEmail(authRequest.getUsername());
		               // .orElseThrow(() -> new ResourceNotFoundException("User not found"));

		        // Generate JWT token
		        String jwtToken = jwtUtil.generateToken(user.getId(), userDetails.getUsername(), user.getUserRole().name());

		        // Return the token
		        return ResponseEntity.ok(new AuthenticationResponse(jwtToken));
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		    }
		}
		

		}


