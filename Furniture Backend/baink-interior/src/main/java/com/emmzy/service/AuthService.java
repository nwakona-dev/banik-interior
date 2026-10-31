
package com.emmzy.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    void registerFirstAdmin(
            String username,
            String email,
            String password
    );

    void login(
            String username,
            String password,
            HttpServletRequest request,
            HttpServletResponse response
    );

    void logout(HttpServletRequest request);
}
