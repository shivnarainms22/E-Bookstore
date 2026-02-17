package com.onlinebookstore.repository;

import com.onlinebookstore.entity.User;
import com.onlinebookstore.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findFirstByEmail(String email);
    User findByUserRole(UserRole admin);

    //User findFirstByUserRole(UserRole userRole);
}