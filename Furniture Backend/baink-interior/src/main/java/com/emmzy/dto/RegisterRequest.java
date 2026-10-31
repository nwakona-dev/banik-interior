package com.emmzy.dto;

public record RegisterRequest(
        String username,
        String email,
        String password
) {
}