
package com.emmzy.security;

import com.emmzy.model.Admin;
import com.emmzy.repository.AdminRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsServiceImpl
        implements CustomUserDetailsService {

    private final AdminRepository adminRepository;

    public CustomUserDetailsServiceImpl(
            AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Invalid username or password"
                        )
                );

        return User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword())
                .authorities(admin.getRole())
                .build();
    }
}
