package com.onlinebookstore.dto;

import com.onlinebookstore.enums.UserRole;

import lombok.Data;
@Data
public class UserDTO {
	private Long id;
	private String name;
	private String email;
	private String password;
	private UserRole userRole;
	
	
}
