package com.emmzy.payload;

public record AuthResponse(
        String message,
        String username,
        boolean authenticated
) {
}