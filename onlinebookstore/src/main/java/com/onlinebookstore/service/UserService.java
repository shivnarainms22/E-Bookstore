package com.onlinebookstore.service;

import com.onlinebookstore.dto.SignupDTO;
import com.onlinebookstore.dto.UserDTO;

public interface UserService {
	UserDTO createUser(SignupDTO signupDTO);
	boolean hasUserWithEmail(String email);
}
